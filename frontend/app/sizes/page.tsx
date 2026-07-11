import Link from "next/link";

/*
  /sizes — صفحة فهرس دليل المقاسات (كانت رابطًا ميتًا: الموجود /sizes/[group] فقط).
  يختار الزائر فئته وينتقل لدليل مقاساتها.
*/

export const metadata = { title: "دليل المقاسات" };

const GROUPS = [
  { slug: "men",   icon: "🤿", label: "مقاسات الشباب",  desc: "بدلات، زعانف، أحزمة — سجّل مقاساتك وشاركها مع مركز الغوص" },
  { slug: "women", icon: "🧕", label: "مقاسات الشابات", desc: "مقاسات معدات السيدات بخصوصية تامة — لا تظهر لأحد إلا بإذنك" },
];

export default function SizesIndexPage() {
  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      <section style={{ background: "linear-gradient(135deg, var(--hero), var(--mid))", color: "white", padding: "56px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(26px,6vw,40px)", fontWeight: 900, marginBottom: "10px" }}>📏 دليل المقاسات</h1>
        <p style={{ opacity: 0.9, maxWidth: "560px", margin: "0 auto", lineHeight: 1.8, fontSize: "clamp(14px,3vw,17px)" }}>
          اعرف مقاسك الصحيح لكل معدات الغوص واحفظه في ملفك — وشاركه مع المركز قبل وصولك فتجد معداتك جاهزة.
        </p>
      </section>

      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 18px 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
        {GROUPS.map((g) => (
          <Link key={g.slug} href={`/sizes/${g.slug}`}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "28px 22px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: "44px", marginBottom: "10px" }}>{g.icon}</div>
            <div style={{ color: "var(--ink, var(--navy))", fontWeight: 900, fontSize: "19px", marginBottom: "8px" }}>{g.label}</div>
            <div style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: 1.8 }}>{g.desc}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
