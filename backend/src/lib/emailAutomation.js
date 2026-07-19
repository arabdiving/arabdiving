/**
 * محرّك الأتمتة لتسلسل الترحيب.
 * يعمل دورياً (كل دقيقة) ويرسل الخطوة التالية لكل مشترك مؤكَّد
 * حسب الوقت المنقضي منذ تأكيد اشتراكه.
 *
 * لا يحتاج مكتبات خارجية — يستخدم setInterval.
 */
const Subscriber = require("../models/Subscriber");
const EmailSequence = require("../models/EmailSequence");
const { sendMail } = require("./mailer");
const { build } = require("./emailTemplates");

const TICK_MS = 60 * 1000; // كل دقيقة
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// هل تنطبق خطوة على مشترك حسب الدور؟
function stepMatchesRole(step, sub) {
  return step.role === "all" || step.role === sub.role;
}

async function processWelcomeSequence() {
  const seq = await EmailSequence.findOne({ key: "welcome" });
  if (!seq || !seq.enabled || !seq.steps.length) return;

  const activeSteps = seq.steps.filter((s) => s.active).sort((a, b) => a.order - b.order);
  if (!activeSteps.length) return;

  const now = Date.now();

  // مشتركون مؤكَّدون لم يُكملوا التسلسل
  const subs = await Subscriber.find({ status: "confirmed", welcomeDone: { $ne: true } }).limit(200);

  for (const sub of subs) {
    const anchor = sub.confirmedAt ? new Date(sub.confirmedAt).getTime() : new Date(sub.createdAt).getTime();

    // الخطوات المتبقّية لهذا المشترك (بترتيبها) والمطابقة لدوره
    const remaining = activeSteps.filter(
      (s) => s.order > (sub.welcomeStep || 0) && stepMatchesRole(s, sub)
    );

    if (!remaining.length) {
      sub.welcomeDone = true;
      await sub.save();
      continue;
    }

    const next = remaining[0];
    const dueAt = anchor + (next.delayHours || 0) * 3600 * 1000;
    if (now < dueAt) continue; // لم يحن وقتها بعد

    const html = build({ subscriber: sub, html: next.html });
    const r = await sendMail({ to: sub.email, subject: next.subject, html });
    if (r.ok) {
      sub.welcomeStep = next.order;
      sub.lastSentAt = new Date();
      sub.sendCount = (sub.sendCount || 0) + 1;
      // هل كانت هذه آخر خطوة مطابقة؟
      const more = activeSteps.some((s) => s.order > next.order && stepMatchesRole(s, sub));
      if (!more) sub.welcomeDone = true;
      await sub.save();
      console.log(`🔁 خطوة ترحيب #${next.order} → ${sub.email}`);
    }
    await sleep(120);
  }
}

let timer = null;
function startAutomation() {
  if (timer) return;
  console.log("⏱️  محرّك أتمتة الترحيب يعمل (كل 60 ثانية).");
  // تشغيلة أولى بعد 10 ثوانٍ من الإقلاع
  setTimeout(() => processWelcomeSequence().catch((e) => console.error("automation:", e.message)), 10000);
  timer = setInterval(() => {
    processWelcomeSequence().catch((e) => console.error("automation:", e.message));
  }, TICK_MS);
}

module.exports = { startAutomation, processWelcomeSequence };
