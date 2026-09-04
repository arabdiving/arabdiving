"use client";

import { useState } from "react";
import Link from "next/link";
import TestimonialBox from "@/app/components/TestimonialBox";

/*
  شهادة شخصية — تجربة كابتن إبراهيم المكاوي مع كمبيوتر الغوص Suunto D6.
  تُسرد الوقائع كما حدثت، ويُقتبس رد Suunto حرفيًا (بالإنجليزية) كما وصله،
  وتُترك الاستنتاجات كرأيه الشخصي كعميل ومدرب — بصياغة متّزنة ومحترمة.
  متاحة بخمس لغات: العربية، الإنجليزية، الألمانية، الإسبانية، الصينية.
*/

type Lang = "ar" | "en" | "de" | "es" | "zh";

const LANGS: { code: Lang; label: string; flag: string; rtl?: boolean }[] = [
  { code: "ar", label: "العربية", flag: "🇸🇦", rtl: true },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

// رد Suunto الحرفي — يُعرض بالإنجليزية في كل اللغات (دليل أصلي كما وصل)
const SUUNTO_REPLY = `Dear Ibrahim,
Thank you for your patience while we reviewed your case with our technical team. We have now received an update from the team regarding the fogging and screen concerns you reported.
Regarding the fogging, the team explained that fogging can sometimes occur after a battery replacement, although procedures should be followed to minimize the possibility. For example, battery replacements should ideally be carried out in a humidity-controlled environment. If this is not done, fogging may occur — especially in climates such as Egypt and the Red Sea region, where the watch can become heated by the sun and then be exposed to cold water, which can result in condensation inside the watch.
Regarding the screen issue, it is difficult to determine the exact cause without physically examining the unit. The technical team noted that, as this is a Suunto D6, the age of the device may be a contributing factor. The pixels appear to be bleeding, which can occur over time due to the age of the display. Another possible cause could be pressure from the internal battery against the screen and glass. However, based on the information currently available, the team considers the age of the device to be the more likely cause. As the unit is more than 24 years old, a full inspection would be required to determine the exact cause with certainty.
We hope this explanation helps clarify the findings from our technical team.
Best regards,
Zack — Suunto Support Team`;

const T: Record<Lang, {
  badge: string; title: string; sub: string;
  factsTitle: string; facts: { k: string; v: string }[];
  paras: string[];
  quoteLabel: string;
  conclusionTitle: string; conclusion: string[];
  disclaimer: string;
  topicsLabel: string; topics: string[];
}> = {
  ar: {
    badge: "🤿 شهادة شخصية",
    title: "قصتي مع كمبيوتر الغوص Suunto D6",
    sub: "تجربة صادقة لمدرب غوص — بالوقائع كما حدثت، وردّ Suunto كما وصلني.",
    factsTitle: "الوقائع باختصار",
    facts: [
      { k: "الجهاز", v: "Suunto D6" },
      { k: "ساعات الغوص المسجّلة", v: "373 ساعة فقط" },
      { k: "معدل الاستخدام مؤخرًا", v: "≈ 2.5 ساعة في السنة" },
      { k: "سبب الزيارة", v: "استبدال بطارية بمركز معتمد" },
      { k: "ردّ Suunto", v: "«عمر الجهاز أكثر من 24 سنة»" },
    ],
    paras: [
      "أنا إبراهيم المكاوي، مدرب غوص مقيم في القاهرة. امتلكت كمبيوتر الغوص Suunto D6 سنوات طويلة، وكنت أعامله بعناية شديدة — كنت أتخيل دائمًا أنني سأورّثه لأبنائي يومًا ما.",
      "لأنني مقيم في القاهرة، صرت في السنوات الأخيرة أغوص في إجازتي الصيفية فقط — نحو أسبوعين في العام. في الماضي كنت أسافر للغوص كل عطلة أسبوع تقريبًا، أما في العامين الأخيرين فمرة واحدة في السنة. وإجمالًا، لم يسجّل الكمبيوتر سوى 373 ساعة غوص.",
      "هذا العام احتاجت البطارية إلى استبدال. وحرصًا على سلامة الجهاز، ذهبت إلى المركز المعتمد من Suunto في دهب (TVR) — تحديدًا لأنه معتمد رسميًا — كي أطمئن ألا يحدث لكمبيوتري أي مكروه.",
      "بعد تغيير البطارية، لاحظت تضبيبًا (تكاثفًا للبخار) داخل الجهاز في الجو الحار. عدت إلى المركز، فقالوا لي إن هذا أمر طبيعي. أنا لم أقتنع بأنه طبيعي.",
      "بعد أيام قليلة، وعقب إحدى الغطسات، تلفت الشاشة وظهرت بها خطوط كثيرة. أعدته إليهم، فقالوا إنها مشكلة في الشاشة قد تكون ناتجة عن اصطدام بشيء، وإن استبدالها سيكون على نفقتي. رفضت قبول ذلك وطلبت منهم إعادة الفحص.",
      "عندها راسلت Suunto مباشرة، لأنني على قناعة بأن المشكلة نشأت أثناء الخدمة في المركز المعتمد. تأخّر رد Suunto كثيرًا، فاستعدت كمبيوتري من المركز — ولاحظت فجوة في الغطاء الخلفي، مع توقف الإضاءة الخلفية عن العمل. أبلغت Suunto بذلك أيضًا.",
      "وبعد أيام، وصلني هذا الرد من Suunto:",
    ],
    quoteLabel: "ردّ Suunto الرسمي (النص الأصلي بالإنجليزية):",
    conclusionTitle: "رأيي بصدق",
    conclusion: [
      "بحسب Suunto، عمر كمبيوتري «أكثر من 24 سنة». ومع ذلك لم يسجّل سوى 373 ساعة غوص — أي نحو 2.5 ساعة استخدام فعلي في السنة.",
      "يصعب عليّ أن أتقبّل أن كمبيوتر غوص — عاملته بكل هذه العناية — يُفترض أن يعمل 24 سنة فقط بغضّ النظر عن قِلّة استخدامه. وأنا على يقين أن كثيرًا من أجهزة الغوص الأخرى ما زالت تعمل لفترات أطول بكثير.",
      "وأمر آخر يستحق الذكر: على حدّ علمي، لا تملك Suunto في مصر كلها سوى ثلاثة مراكز صيانة معتمدة فقط — وكلها تتبع العائلة نفسها. هذا يعني أن خيارات الغوّاص المصري للصيانة المعتمدة محدودة للغاية، ولا مجال عمليًا للحصول على رأيٍ معتمدٍ ثانٍ.",
      "أشارك تجربتي كاملة هنا حتى يقرأها كل غوّاص ويحكم بنفسه. هذه شهادتي الشخصية الصادقة، كعميل ومدرب غوص.",
    ],
    disclaimer: "هذه رواية شخصية لتجربتي ورأيي كعميل. أوردت الوقائع كما مررت بها، ورد Suunto كما وصلني نصًّا. الأسماء التجارية مذكورة لأغراض التعريف فقط.",
    topicsLabel: "مواضيع ذات صلة",
    topics: ["كمبيوتر غوص سونتو D6", "صيانة سونتو في مصر", "استبدال بطارية كمبيوتر الغوص", "تضبيب كمبيوتر الغوص", "أفضل كمبيوتر غوص", "الغوص في البحر الأحمر", "الغوص في دهب", "دليل مدربي الغوص العرب"],
  },
  en: {
    badge: "🤿 A Personal Account",
    title: "My Suunto D6 Story",
    sub: "An honest experience from a diving instructor — the facts as they happened, and Suunto's reply as I received it.",
    factsTitle: "The facts, in brief",
    facts: [
      { k: "Device", v: "Suunto D6" },
      { k: "Logged dive hours", v: "Just 373 hours" },
      { k: "Recent usage rate", v: "≈ 2.5 hours per year" },
      { k: "Reason for service", v: "Battery replacement, authorized center" },
      { k: "Suunto's reply", v: "“The unit is more than 24 years old”" },
    ],
    paras: [
      "I'm Ibrahim El-Mekkawi, a scuba diving instructor based in Cairo. For many years I owned a Suunto D6 dive computer, and I treated it with great care — I always imagined that one day I would pass it on to my children.",
      "Because I'm based in Cairo, in recent years I only dive during my summer vacation — roughly two weeks a year. In the past I traveled to dive almost every weekend; over the last two years, only once a year. In total, the computer logged just 373 hours of diving.",
      "This year the battery needed replacing. To keep the device safe, I took it to the authorized Suunto service center in Dahab (TVR) — precisely because they are officially authorized — so I could be sure nothing bad would happen to my dive computer.",
      "After the battery was changed, I noticed fogging / condensation inside the unit in hot weather. I returned to the center, and they told me this was normal. I did not believe it was normal.",
      "A few days later, after a dive, the screen became damaged, showing many lines across the display. I brought it back; they said it was a screen issue possibly caused by hitting something, and that replacement would be at my own cost. I refused to accept this and asked them to check again.",
      "I then emailed Suunto directly, because I am convinced the problem originated during the service at the authorized center. Suunto took a long time to respond, so I collected my computer from the center — and noticed a gap in the back casing, along with the backlight no longer working. I reported this to Suunto as well.",
      "A few days later, I received this reply from Suunto:",
    ],
    quoteLabel: "Suunto's official reply (original text):",
    conclusionTitle: "My honest view",
    conclusion: [
      "According to Suunto, my dive computer is “more than 24 years old.” Yet it logged only 373 hours of diving — around 2.5 hours of actual use per year.",
      "I find it hard to accept that a dive computer — one I cared for so carefully — is expected to last only 24 years regardless of how lightly it was used. I'm certain that many other dive computers keep working far longer.",
      "There's another point worth mentioning: to my knowledge, Suunto has only three authorized service centers in all of Egypt — and they all belong to the same family. This means an Egyptian diver's options for authorized service are extremely limited, with virtually no way to obtain a second authorized opinion.",
      "I'm sharing my full experience here so that every diver can read it and judge for themselves. This is my personal, honest account, as a customer and a diving instructor.",
    ],
    disclaimer: "This is a personal account of my own experience and opinion as a customer. I've stated the facts as I lived them, and Suunto's reply verbatim as I received it. Brand names are mentioned for identification only.",
    topicsLabel: "Related topics",
    topics: ["Suunto D6 dive computer", "Suunto service center Egypt", "dive computer battery replacement", "dive computer fogging", "best dive computer", "Red Sea diving", "diving in Dahab", "Arab dive instructors directory"],
  },
  de: {
    badge: "🤿 Ein persönlicher Bericht",
    title: "Meine Geschichte mit dem Suunto D6",
    sub: "Eine ehrliche Erfahrung eines Tauchlehrers — die Fakten, wie sie geschahen, und Suuntos Antwort, wie ich sie erhielt.",
    factsTitle: "Die Fakten in Kürze",
    facts: [
      { k: "Gerät", v: "Suunto D6" },
      { k: "Protokollierte Tauchstunden", v: "Nur 373 Stunden" },
      { k: "Jüngste Nutzung", v: "≈ 2,5 Stunden pro Jahr" },
      { k: "Grund des Service", v: "Batteriewechsel, autorisiertes Zentrum" },
      { k: "Suuntos Antwort", v: "„Das Gerät ist über 24 Jahre alt“" },
    ],
    paras: [
      "Ich bin Ibrahim El-Mekkawi, ein Tauchlehrer mit Sitz in Kairo. Viele Jahre lang besaß ich einen Suunto D6 Tauchcomputer, und ich behandelte ihn mit größter Sorgfalt — ich stellte mir immer vor, ihn eines Tages an meine Kinder weiterzugeben.",
      "Da ich in Kairo wohne, tauche ich in den letzten Jahren nur in meinem Sommerurlaub — etwa zwei Wochen im Jahr. Früher reiste ich fast jedes Wochenende zum Tauchen; in den letzten zwei Jahren nur einmal jährlich. Insgesamt protokollierte der Computer nur 373 Tauchstunden.",
      "Dieses Jahr musste die Batterie gewechselt werden. Um das Gerät zu schützen, brachte ich es zum autorisierten Suunto-Servicecenter in Dahab (TVR) — gerade weil es offiziell autorisiert ist — damit meinem Tauchcomputer nichts Schlimmes passiert.",
      "Nach dem Batteriewechsel bemerkte ich bei heißem Wetter Beschlag / Kondenswasser im Inneren des Geräts. Ich kehrte zum Center zurück, und man sagte mir, das sei normal. Ich glaubte nicht, dass es normal war.",
      "Wenige Tage später, nach einem Tauchgang, wurde das Display beschädigt und zeigte viele Linien. Ich brachte es zurück; man sagte, es sei ein Displayproblem, möglicherweise durch einen Stoß verursacht, und ein Austausch ginge auf meine Kosten. Ich lehnte das ab und bat um erneute Prüfung.",
      "Daraufhin schrieb ich Suunto direkt an, denn ich bin überzeugt, dass das Problem während des Service im autorisierten Center entstand. Suunto brauchte lange für eine Antwort, also holte ich meinen Computer ab — und bemerkte einen Spalt im hinteren Gehäuse sowie eine nicht mehr funktionierende Hintergrundbeleuchtung. Auch das meldete ich Suunto.",
      "Einige Tage später erhielt ich diese Antwort von Suunto:",
    ],
    quoteLabel: "Suuntos offizielle Antwort (Originaltext, Englisch):",
    conclusionTitle: "Meine ehrliche Meinung",
    conclusion: [
      "Laut Suunto ist mein Tauchcomputer „über 24 Jahre alt“. Dennoch protokollierte er nur 373 Tauchstunden — etwa 2,5 Stunden tatsächliche Nutzung pro Jahr.",
      "Es fällt mir schwer zu akzeptieren, dass ein Tauchcomputer — den ich so sorgfältig pflegte — nur 24 Jahre halten soll, unabhängig davon, wie wenig er genutzt wurde. Ich bin sicher, dass viele andere Tauchcomputer weit länger funktionieren.",
      "Ein weiterer erwähnenswerter Punkt: Meines Wissens hat Suunto in ganz Ägypten nur drei autorisierte Servicezentren — und alle gehören derselben Familie. Das bedeutet, dass die Möglichkeiten eines ägyptischen Tauchers für einen autorisierten Service äußerst begrenzt sind, praktisch ohne Möglichkeit einer zweiten autorisierten Meinung.",
      "Ich teile meine gesamte Erfahrung hier, damit jeder Taucher sie lesen und selbst urteilen kann. Dies ist mein persönlicher, ehrlicher Bericht — als Kunde und Tauchlehrer.",
    ],
    disclaimer: "Dies ist ein persönlicher Bericht über meine eigene Erfahrung und Meinung als Kunde. Ich habe die Fakten so geschildert, wie ich sie erlebte, und Suuntos Antwort wörtlich, wie ich sie erhielt. Markennamen dienen nur der Identifikation.",
    topicsLabel: "Verwandte Themen",
    topics: ["Suunto D6 Tauchcomputer", "Suunto Service Ägypten", "Tauchcomputer Batteriewechsel", "Tauchcomputer Beschlag", "bester Tauchcomputer", "Tauchen im Roten Meer", "Tauchen in Dahab", "Arabisches Tauchlehrer-Verzeichnis"],
  },
  es: {
    badge: "🤿 Un relato personal",
    title: "Mi historia con el Suunto D6",
    sub: "Una experiencia sincera de un instructor de buceo — los hechos tal como ocurrieron, y la respuesta de Suunto tal como la recibí.",
    factsTitle: "Los hechos, en breve",
    facts: [
      { k: "Dispositivo", v: "Suunto D6" },
      { k: "Horas de buceo registradas", v: "Solo 373 horas" },
      { k: "Uso reciente", v: "≈ 2,5 horas al año" },
      { k: "Motivo del servicio", v: "Cambio de batería, centro autorizado" },
      { k: "Respuesta de Suunto", v: "“Tiene más de 24 años”" },
    ],
    paras: [
      "Soy Ibrahim El-Mekkawi, instructor de buceo residente en El Cairo. Durante muchos años tuve un ordenador de buceo Suunto D6, y lo cuidé con gran esmero — siempre imaginé que algún día se lo dejaría a mis hijos.",
      "Como vivo en El Cairo, en los últimos años solo buceo durante mis vacaciones de verano — unas dos semanas al año. Antes viajaba a bucear casi cada fin de semana; en los dos últimos años, solo una vez al año. En total, el ordenador registró apenas 373 horas de buceo.",
      "Este año la batería necesitaba cambio. Para proteger el equipo, lo llevé al centro de servicio autorizado de Suunto en Dahab (TVR) — precisamente por estar autorizado oficialmente — para asegurarme de que nada malo le ocurriera a mi ordenador.",
      "Tras el cambio de batería, noté empañamiento / condensación dentro del equipo con el calor. Volví al centro y me dijeron que era normal. Yo no creí que fuera normal.",
      "Pocos días después, tras una inmersión, la pantalla se dañó y mostró muchas líneas. Lo devolví; dijeron que era un problema de pantalla, quizá por un golpe, y que la sustitución correría por mi cuenta. Me negué a aceptarlo y pedí que lo revisaran de nuevo.",
      "Entonces escribí directamente a Suunto, porque estoy convencido de que el problema se originó durante el servicio en el centro autorizado. Suunto tardó mucho en responder, así que recogí mi ordenador — y noté una separación en la carcasa trasera, junto con la retroiluminación que ya no funcionaba. También se lo comuniqué a Suunto.",
      "Días después, recibí esta respuesta de Suunto:",
    ],
    quoteLabel: "Respuesta oficial de Suunto (texto original, en inglés):",
    conclusionTitle: "Mi opinión sincera",
    conclusion: [
      "Según Suunto, mi ordenador de buceo tiene “más de 24 años”. Sin embargo, solo registró 373 horas de buceo — unas 2,5 horas de uso real al año.",
      "Me cuesta aceptar que un ordenador de buceo — que cuidé con tanto esmero — deba durar solo 24 años sin importar lo poco que se use. Estoy seguro de que muchos otros ordenadores de buceo siguen funcionando mucho más tiempo.",
      "Otro punto que vale la pena mencionar: hasta donde sé, Suunto solo tiene tres centros de servicio autorizados en todo Egipto — y todos pertenecen a la misma familia. Esto significa que las opciones de un buceador egipcio para un servicio autorizado son muy limitadas, prácticamente sin forma de obtener una segunda opinión autorizada.",
      "Comparto aquí mi experiencia completa para que cada buceador la lea y juzgue por sí mismo. Este es mi relato personal y sincero, como cliente e instructor de buceo.",
    ],
    disclaimer: "Este es un relato personal de mi propia experiencia y opinión como cliente. He expuesto los hechos tal como los viví, y la respuesta de Suunto literalmente como la recibí. Las marcas se mencionan solo con fines de identificación.",
    topicsLabel: "Temas relacionados",
    topics: ["ordenador de buceo Suunto D6", "servicio Suunto Egipto", "cambio de batería ordenador de buceo", "empañamiento ordenador de buceo", "mejor ordenador de buceo", "buceo en el Mar Rojo", "buceo en Dahab", "directorio de instructores de buceo árabes"],
  },
  zh: {
    badge: "🤿 个人经历",
    title: "我与 Suunto D6 潜水电脑的故事",
    sub: "一位潜水教练的真实经历 —— 事实如实叙述，以及我收到的 Suunto 回复原文。",
    factsTitle: "事实概要",
    facts: [
      { k: "设备", v: "Suunto D6" },
      { k: "记录的潜水小时", v: "仅 373 小时" },
      { k: "近期使用频率", v: "≈ 每年 2.5 小时" },
      { k: "送修原因", v: "在授权中心更换电池" },
      { k: "Suunto 的回复", v: "“设备已超过 24 年”" },
    ],
    paras: [
      "我是 Ibrahim El-Mekkawi，一名常驻开罗的潜水教练。多年来我拥有一台 Suunto D6 潜水电脑，并且一直非常爱惜它 —— 我总是设想有一天把它传给我的孩子。",
      "由于我住在开罗，近年来我只在暑假潜水 —— 大约每年两周。过去我几乎每个周末都去潜水；而最近两年，每年只有一次。总计，这台电脑只记录了 373 小时的潜水。",
      "今年电池需要更换。为了保护设备，我把它送到迪哈布（Dahab）的 Suunto 授权服务中心（TVR）—— 正因为它是官方授权的 —— 以确保我的潜水电脑不会出任何问题。",
      "更换电池后，我注意到在炎热天气下设备内部出现雾气/冷凝。我返回中心，他们告诉我这是正常现象。我并不相信这是正常的。",
      "几天后，一次潜水之后，屏幕损坏，显示出许多条纹。我把它送回；他们说这是屏幕问题，可能是撞到了什么，更换需由我自费。我拒绝接受，并请他们再次检查。",
      "随后我直接给 Suunto 发了邮件，因为我确信问题源于授权中心的维修过程。Suunto 很久才回复，于是我从中心取回了我的电脑 —— 并发现后壳有一处缝隙，背光也不再工作。我也将此情况告知了 Suunto。",
      "几天后，我收到了 Suunto 的以下回复：",
    ],
    quoteLabel: "Suunto 官方回复（英文原文）：",
    conclusionTitle: "我的真实看法",
    conclusion: [
      "据 Suunto 所说，我的潜水电脑“已超过 24 年”。然而它只记录了 373 小时的潜水 —— 每年约 2.5 小时的实际使用。",
      "我很难接受：一台我如此精心保养的潜水电脑，无论使用多么少，都只被期望使用 24 年。我确信许多其他潜水电脑仍能使用更久。",
      "还有一点值得一提：据我所知，Suunto 在整个埃及只有三家授权服务中心 —— 而且它们都属于同一个家族。这意味着埃及潜水员获得授权维修的选择极为有限，几乎无法获得第二个授权意见。",
      "我在此分享我的完整经历，让每位潜水员都能阅读并自行判断。这是我作为客户和潜水教练的个人真实陈述。",
    ],
    disclaimer: "这是我作为客户的个人经历与意见陈述。我如实叙述了我所经历的事实，并原文引用了我收到的 Suunto 回复。品牌名称仅用于识别。",
    topicsLabel: "相关主题",
    topics: ["Suunto D6 潜水电脑", "埃及 Suunto 维修中心", "潜水电脑更换电池", "潜水电脑起雾", "最佳潜水电脑", "红海潜水", "达哈布潜水", "阿拉伯潜水教练目录"],
  },
};

// 📌 تحديث القصة — تسلسل المراسلات الإضافي مع Suunto وعرض الترقية ورفضه
const UPD: Record<Lang, { title: string; paras: string[] }> = {
  ar: {
    title: "📌 تحديث: كيف تطوّرت القصة",
    paras: [
      "بعد نشر تجربتي، تبادلت رسائل إضافية مع Suunto — وأصررت على نقطتين تجاهلتها ردودهم الأولى:",
      "1) الفجوة في الغطاء الخلفي بعد الصيانة: حين أُعيد إليّ الجهاز من المركز المعتمد في دهب، لم يكن الغطاء الخلفي مغلقًا بإحكام — كانت هناك فجوة واضحة، واحتاج نحو أربع لفّات مفتاح ليستقر صحيحًا. في كمبيوتر الغوص، الغطاء غير المُحكم ليس تفصيلًا شكليًا، بل مسار مباشر لدخول الرطوبة. وحين نبّهت الفني عرض «إغلاقه فقط ليُطمئنني» بدل معالجته كعيب.",
      "2) الإضاءة الخلفية توقفت تمامًا عن العمل — ولم يُشِر إليها أيٌّ من ردودهم.",
      "طلبت من Suunto أن تتواصل مع مركزها المعتمد في مصر وتتحقق مما فُعل أثناء تغيير البطارية، قبل أن تحسم الأمر بحجة العمر — وعرضت أن آخذ الجهاز لفحص مستقل في مركز آخر بالقاهرة.",
      "أوضحت Suunto أنها لم تقصد أن الجهاز يُفترض أن يعطب بعد 24 سنة، وأن العمر «عامل محتمل» لا سبب مؤكد، وأن الفحص المادي ضروري لتحديد السبب.",
      "ثم عرضت Suunto «برنامج ترقية» بخصم 30% على ساعة جديدة.",
      "شكرتهم على العرض لكني رفضته: الخصم لا يحل مشكلتي — بل يعيدني إلى نفس الخطر. أي ساعة جديدة ستحتاج أول تغيير بطارية لدى نفس المركز المعتمد في مصر (وهي ثلاثة مراكز فقط تتبع العائلة نفسها)، الذي أثبتت تجربتي أنه قد يخرّب الجهاز ثم لا يعترف — لا هو ولا Suunto الدولية. بعد ما تعلّمته من تجربتي، لا أستطيع أن أستثمر ثانيةً في Suunto.",
      "خلاصتي: لم أطلب اعترافًا بالخطأ دون فحص — طلبت التحقيق في الخدمة التي أُجريت، بدل تجاهل المشكلة بحجة العمر. والعرض المالي، رغم تقديري له، لم يعالج ذلك.",
    ],
  },
  en: {
    title: "📌 Update: how the story developed",
    paras: [
      "After publishing my experience, I exchanged further emails with Suunto — and insisted on two points their first replies had ignored:",
      "1) The gap in the case back after service: when the watch was returned to me by the authorized center in Dahab, the case back was not properly sealed — there was a visible gap, and it took about four full turns of a screwdriver to seat it correctly. On a dive computer, an improperly closed case back is not cosmetic; it is a direct path for moisture into the housing. When I raised it, the technician offered to \"just close it to make me feel better\" rather than treat it as the fault it was.",
      "2) The backlight stopped working entirely — and none of their replies acknowledged it.",
      "I asked Suunto to contact its authorized center in Egypt and verify what was done during the battery replacement, before concluding anything about age — and I offered to take the watch for an independent inspection at a different center in Cairo.",
      "Suunto clarified that they did not mean the device should be expected to fail after 24 years, that age was \"one possible factor\" rather than a confirmed cause, and that a physical inspection would be required.",
      "Suunto then offered an \"Upgrade Program\" with a 30% discount on a new watch.",
      "I thanked them but declined: the discount does not solve my problem — it puts me right back under the same risk. Any new watch would need its first battery replacement at the same authorized center in Egypt (only three centers, all belonging to the same family), which my experience showed can damage a computer and then decline to acknowledge it — neither the center nor Suunto International. After what I learned, I cannot invest in Suunto again.",
      "My conclusion: I never asked them to accept fault unseen — I asked them to investigate the service that was performed, instead of dismissing the problem as age. The financial offer, which I do appreciate, did not address that.",
    ],
  },
  de: {
    title: "📌 Update: wie sich die Geschichte entwickelte",
    paras: [
      "Nach der Veröffentlichung tauschte ich weitere E-Mails mit Suunto aus — und bestand auf zwei Punkten, die ihre ersten Antworten ignoriert hatten:",
      "1) Der Spalt im Gehäuseboden nach dem Service: Als die Uhr vom autorisierten Center in Dahab zurückkam, war der Boden nicht richtig verschlossen — ein sichtbarer Spalt, und es brauchte etwa vier volle Umdrehungen eines Schraubendrehers, um ihn korrekt zu setzen. Bei einem Tauchcomputer ist ein nicht dicht verschlossener Boden nicht kosmetisch, sondern ein direkter Weg für Feuchtigkeit ins Gehäuse. Der Techniker bot an, ihn \"nur zu schließen, damit ich mich besser fühle\", statt ihn als Fehler zu behandeln.",
      "2) Die Hintergrundbeleuchtung funktionierte gar nicht mehr — und keine ihrer Antworten erwähnte das.",
      "Ich bat Suunto, ihr autorisiertes Center in Ägypten zu kontaktieren und zu prüfen, was beim Batteriewechsel getan wurde, bevor über das Alter geurteilt wird — und bot an, die Uhr zu einer unabhängigen Prüfung in ein anderes Center in Kairo zu bringen.",
      "Suunto stellte klar, dass sie nicht meinten, das Gerät solle nach 24 Jahren ausfallen, dass das Alter „ein möglicher Faktor“ und keine gesicherte Ursache sei, und dass eine physische Prüfung nötig wäre.",
      "Dann bot Suunto ein „Upgrade-Programm“ mit 30% Rabatt auf eine neue Uhr an.",
      "Ich dankte, lehnte aber ab: Der Rabatt löst mein Problem nicht — er bringt mich zurück in dasselbe Risiko. Jede neue Uhr bräuchte ihren ersten Batteriewechsel beim selben autorisierten Center in Ägypten (nur drei Center, alle derselben Familie), das laut meiner Erfahrung einen Computer beschädigen und es dann nicht eingestehen kann — weder das Center noch Suunto International. Nach dem Gelernten kann ich nicht erneut in Suunto investieren.",
      "Mein Fazit: Ich bat nie um ein Schuldeingeständnis ohne Prüfung — ich bat um eine Untersuchung des durchgeführten Service, statt das Problem als Alter abzutun. Das finanzielle Angebot, das ich schätze, ging darauf nicht ein.",
    ],
  },
  es: {
    title: "📌 Actualización: cómo evolucionó la historia",
    paras: [
      "Tras publicar mi experiencia, intercambié más correos con Suunto — e insistí en dos puntos que sus primeras respuestas habían ignorado:",
      "1) La separación en la tapa trasera tras el servicio: cuando el centro autorizado de Dahab me devolvió el reloj, la tapa no estaba bien sellada — había una separación visible, y hicieron falta unas cuatro vueltas completas de destornillador para asentarla correctamente. En un ordenador de buceo, una tapa mal cerrada no es estética; es una vía directa para la humedad hacia la carcasa. Cuando lo señalé, el técnico ofreció \"solo cerrarla para que me sintiera mejor\" en vez de tratarlo como el fallo que era.",
      "2) La retroiluminación dejó de funcionar por completo — y ninguna de sus respuestas lo reconoció.",
      "Pedí a Suunto que contactara con su centro autorizado en Egipto y verificara qué se hizo durante el cambio de batería, antes de concluir nada sobre la edad — y ofrecí llevar el reloj a una inspección independiente en otro centro de El Cairo.",
      "Suunto aclaró que no quisieron decir que el dispositivo debiera fallar a los 24 años, que la edad era \"un factor posible\" y no una causa confirmada, y que se requeriría una inspección física.",
      "Luego Suunto ofreció un \"Programa de Actualización\" con un 30% de descuento en un reloj nuevo.",
      "Se lo agradecí pero lo rechacé: el descuento no resuelve mi problema — me devuelve al mismo riesgo. Cualquier reloj nuevo necesitaría su primer cambio de batería en el mismo centro autorizado de Egipto (solo tres centros, todos de la misma familia), que según mi experiencia puede dañar un ordenador y luego no reconocerlo — ni el centro ni Suunto Internacional. Tras lo aprendido, no puedo volver a invertir en Suunto.",
      "Mi conclusión: nunca pedí que aceptaran la culpa sin examinar — pedí que investigaran el servicio realizado, en vez de descartar el problema como edad. La oferta económica, que agradezco, no abordó eso.",
    ],
  },
  zh: {
    title: "📌 更新：事情的后续发展",
    paras: [
      "在公开我的经历后，我与 Suunto 又往来了几封邮件 —— 并坚持指出他们最初回复所忽略的两点：",
      "1) 维修后后盖的缝隙：当达哈布的授权中心把手表还给我时，后盖没有正确密封 —— 有一道明显的缝隙，用螺丝刀转了大约四整圈才装到位。对潜水电脑而言，后盖未密封不是外观问题，而是湿气进入外壳的直接通道。当我指出时，技师却提出\"只是把它盖上让我安心\"，而非把它当作应有的故障来处理。",
      "2) 背光完全不再工作 —— 而他们的任何回复都没有提及这一点。",
      "我请求 Suunto 联系其在埃及的授权中心，核实更换电池时做了什么，然后再对\"年龄\"下结论 —— 并提出把手表送到开罗另一家中心做独立检查。",
      "Suunto 澄清说，他们并非指设备应在 24 年后损坏，年龄只是\"一个可能的因素\"而非确定原因，且需要实物检查才能确定。",
      "随后 Suunto 提供了\"升级计划\"，购买新表可享 30% 折扣。",
      "我感谢他们，但予以谢绝：折扣并不能解决我的问题 —— 它只会让我重新置身同样的风险。任何新表首次更换电池仍要送到埃及同一家授权中心（仅三家，且都属于同一家族），而我的经历表明它可能损坏电脑却不予承认 —— 无论是该中心还是 Suunto 国际。在吸取教训之后，我无法再投资于 Suunto。",
      "我的结论：我从未要求他们在未检查的情况下承认过错 —— 我要求的是调查所做的维修，而不是以\"年龄\"来搪塞问题。那份我确实心存感激的经济提议，并没有解决这一点。",
    ],
  },
};

const glass: React.CSSProperties = {
  background: "var(--glass-bg,rgba(8,20,48,0.78))",
  border: "1px solid var(--glass-border,rgba(255,255,255,0.08))",
  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
};


export default function SuuntoStoryPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = T[lang];
  const rtl = lang === "ar";

  return (
    <main dir={rtl ? "rtl" : "ltr"} style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh", textAlign: rtl ? "right" : "left" }}>
      {/* الهيرو */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "48px 20px 34px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "820px", margin: "0 auto" }}>
          {/* مبدّل اللغة */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "22px" }}>
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                style={{ background: lang === l.code ? "linear-gradient(135deg,#0891b2,#06b6d4)" : "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "7px 15px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: lang === l.code ? 800 : 500 }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ ...glass, display: "inline-block", color: "#22d3ee", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "14px" }}>{t.badge}</span>
            <h1 style={{ fontSize: "clamp(24px,5.5vw,38px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "10px", lineHeight: 1.4 }}>{t.title}</h1>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(14px,3vw,17px)", lineHeight: 1.9, maxWidth: "640px", margin: "0 auto" }}>{t.sub}</p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "30px 18px 70px" }}>
        {/* الوقائع باختصار */}
        <div style={{ ...glass, borderRadius: "16px", padding: "20px", marginBottom: "26px" }}>
          <h2 style={{ color: "#22d3ee", fontSize: "15px", fontWeight: 800, marginBottom: "12px" }}>{t.factsTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px" }}>
            {t.facts.map((f) => (
              <div key={f.k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "11px 14px" }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{f.k}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginTop: "2px" }}>{f.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* السرد */}
        <article style={{ ...glass, borderRadius: "18px", padding: "26px" }}>
          {t.paras.map((p, i) => (
            <p key={i} style={{ color: "rgba(255,255,255,0.85)", fontSize: "15.5px", lineHeight: 2.05, margin: i === 0 ? "0 0 16px" : "0 0 16px" }}>{p}</p>
          ))}

          {/* اقتباس رد Suunto */}
          <div style={{ marginTop: "6px" }}>
            <div style={{ color: "#fbbf24", fontSize: "12.5px", fontWeight: 700, marginBottom: "8px" }}>{t.quoteLabel}</div>
            <blockquote dir="ltr" style={{ textAlign: "left", background: "rgba(251,191,36,0.06)", borderInlineStart: "4px solid #e8a830", borderRadius: "10px", padding: "16px 18px", margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "13.5px", lineHeight: 1.85, whiteSpace: "pre-wrap", fontStyle: "italic" }}>
              {SUUNTO_REPLY}
            </blockquote>
          </div>
        </article>

        {/* الخلاصة / الرأي */}
        <div style={{ ...glass, borderRadius: "18px", padding: "26px", marginTop: "22px", borderColor: "rgba(34,211,238,0.25)" }}>
          <h2 style={{ color: "#fff", fontSize: "19px", fontWeight: 900, marginBottom: "12px" }}>{t.conclusionTitle}</h2>
          {t.conclusion.map((c, i) => (
            <p key={i} style={{ color: "rgba(255,255,255,0.82)", fontSize: "15px", lineHeight: 2, margin: "0 0 14px" }}>{c}</p>
          ))}
        </div>

        {/* 📌 تحديث القصة — تطورات المراسلات وعرض الترقية */}
        <div style={{ ...glass, borderRadius: "18px", padding: "26px", marginTop: "22px", borderColor: "rgba(232,168,48,0.3)" }}>
          <h2 style={{ color: "#e8a830", fontSize: "19px", fontWeight: 900, marginBottom: "12px" }}>{UPD[lang].title}</h2>
          {UPD[lang].paras.map((p, i) => (
            <p key={i} style={{ color: "rgba(255,255,255,0.82)", fontSize: "14.5px", lineHeight: 2, margin: "0 0 14px" }}>{p}</p>
          ))}
        </div>

        {/* ✍️ صندوق شاركنا تجربتك + تجارب الآخرين */}
        <div style={{ marginTop: "26px" }}>
          <TestimonialBox brand="Suunto" lang={lang} />
        </div>

        {/* مواضيع ذات صلة — تعزيز طبيعي للكلمات المفتاحية */}
        <div style={{ marginTop: "26px" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", fontWeight: 700, marginBottom: "10px" }}>{t.topicsLabel}</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {t.topics.map((tp) => (
              <span key={tp} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: "20px", padding: "6px 13px", fontSize: "12.5px" }}>{tp}</span>
            ))}
          </div>
        </div>

        {/* تنويه */}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", lineHeight: 1.85, marginTop: "22px" }}>{t.disclaimer}</p>

        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <Link href="/" style={{ color: "#22d3ee", fontWeight: 700, fontSize: "14px" }}>← ArabDiving</Link>
        </div>
      </div>
    </main>
  );
}
