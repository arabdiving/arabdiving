/*
  BubbleBackground — فقاعات عائمة (Dark Ocean).
  من design_handoff/DARK_OCEAN_DESIGN_SYSTEM.md — قسم 8.
*/

const BUBBLES: Array<{ size: number; left?: string; right?: string; bottom: string; delay: number; duration: number }> = [
  { size: 7, left: "8%",  bottom: "20%", delay: 0,   duration: 6   },
  { size: 4, left: "18%", bottom: "12%", delay: 1.4, duration: 5.2 },
  { size: 9, left: "32%", bottom: "8%",  delay: 0.6, duration: 7.1 },
  { size: 5, left: "51%", bottom: "16%", delay: 2.1, duration: 5.8 },
  { size: 6, right: "12%", bottom: "22%", delay: 0.9, duration: 6.4 },
  { size: 4, right: "26%", bottom: "10%", delay: 1.8, duration: 5.5 },
  { size: 8, right: "41%", bottom: "7%",  delay: 0.3, duration: 6.8 },
];

export default function BubbleBackground({ color = "rgba(6,182,212,0.3)" }: { color?: string }) {
  return (
    <>
      {BUBBLES.map((b, i) => (
        <div key={i} className="bubble" style={{
          width: b.size, height: b.size,
          left: b.left, right: b.right, bottom: b.bottom,
          background: color,
          animationDuration: `${b.duration}s`,
          animationDelay: `${b.delay}s`,
        }} />
      ))}
    </>
  );
}
