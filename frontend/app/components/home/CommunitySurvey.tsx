"use client";

import { useState, useEffect } from "react";

interface SurveyOption {
  id: string;
  text: string;
  emoji: string;
  votes: number;
}

interface Survey {
  id: string;
  question: string;
  options: SurveyOption[];
}

// Survey config — can later be fetched from API/admin
const SURVEYS: Survey[] = [
  {
    id: "fav_dive_spot_2025",
    question: "ما هو موقع الغوص المفضّل لديك في المنطقة العربية؟",
    options: [
      { id: "redSea",   text: "البحر الأحمر — مصر",   emoji: "🇪🇬", votes: 0 },
      { id: "aqaba",    text: "خليج العقبة — الأردن",  emoji: "🇯🇴", votes: 0 },
      { id: "maldives", text: "المالديف",               emoji: "🇲🇻", votes: 0 },
      { id: "oman",     text: "بحر العرب — عُمان",     emoji: "🇴🇲", votes: 0 },
    ],
  },
  {
    id: "dive_freq",
    question: "كم مرة تغوص في السنة؟",
    options: [
      { id: "rarely",   text: "1–5 مرات (مبتدئ)",     emoji: "🐟", votes: 0 },
      { id: "moderate", text: "6–20 مرة (منتظم)",      emoji: "🐠", votes: 0 },
      { id: "frequent", text: "21–50 مرة (متحمّس)",    emoji: "🦈", votes: 0 },
      { id: "pro",      text: "+50 مرة (محترف)",        emoji: "🤿", votes: 0 },
    ],
  },
];

function loadVotes(surveyId: string, options: SurveyOption[]): SurveyOption[] {
  try {
    const stored = localStorage.getItem(`survey_${surveyId}`);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, number>;
      return options.map((o) => ({ ...o, votes: parsed[o.id] ?? o.votes }));
    }
  } catch {}
  return options;
}

function saveVotes(surveyId: string, options: SurveyOption[]) {
  const data: Record<string, number> = {};
  options.forEach((o) => { data[o.id] = o.votes; });
  localStorage.setItem(`survey_${surveyId}`, JSON.stringify(data));
}

function getVoted(surveyId: string): string | null {
  try { return localStorage.getItem(`voted_${surveyId}`); } catch { return null; }
}
function setVoted(surveyId: string, optId: string) {
  try { localStorage.setItem(`voted_${surveyId}`, optId); } catch {}
}

export default function CommunitySurvey() {
  const [idx, setIdx] = useState(0);
  const survey = SURVEYS[idx];
  const [options, setOptions] = useState<SurveyOption[]>(survey.options);
  const [voted, setVotedState] = useState<string | null>(null);
  const [anim, setAnim] = useState<string | null>(null);

  // Load from localStorage on mount / survey change
  useEffect(() => {
    const loaded = loadVotes(survey.id, survey.options);
    setOptions(loaded);
    setVotedState(getVoted(survey.id));
  }, [idx, survey.id, survey.options]);

  const totalVotes = options.reduce((s, o) => s + o.votes, 0);

  const vote = (optId: string) => {
    if (voted) return;
    setAnim(optId);
    setTimeout(() => {
      setOptions((prev) => {
        const updated = prev.map((o) => o.id === optId ? { ...o, votes: o.votes + 1 } : o);
        saveVotes(survey.id, updated);
        return updated;
      });
      setVotedState(optId);
      setVoted(survey.id, optId);
      setAnim(null);
    }, 350);
  };

  const nextSurvey = () => {
    const next = (idx + 1) % SURVEYS.length;
    setIdx(next);
  };

  return (
    <section style={{ padding: "70px 20px", background: "var(--background)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ display: "inline-block", background: "rgba(46,117,182,0.12)", color: "var(--mid)", padding: "5px 18px", borderRadius: "30px", fontSize: "13px", marginBottom: "10px" }}>
            صوت الغوّاصين
          </span>
          <h2 style={{ color: "var(--navy)", fontSize: "clamp(22px,3.5vw,32px)", margin: 0 }}>
            📋 استطلاع المجتمع
          </h2>
        </div>

        {/* Survey card */}
        <div style={{
          background: "var(--surface)", borderRadius: "20px", padding: "32px",
          boxShadow: "0 8px 30px rgba(13,44,84,0.1)",
          border: "1px solid #dde8f4",
        }}>
          <p style={{ color: "var(--navy)", fontSize: "18px", fontWeight: 700, margin: "0 0 24px", lineHeight: 1.6 }}>
            {survey.question}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {options.map((opt) => {
              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              const isVoted = voted === opt.id;
              const isAnimating = anim === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => vote(opt.id)}
                  disabled={!!voted}
                  style={{
                    position: "relative", overflow: "hidden",
                    border: isVoted ? "2px solid var(--mid)" : "2px solid #e2eaf4",
                    borderRadius: "12px", padding: "14px 16px",
                    background: isVoted ? "rgba(46,117,182,0.06)" : "#fafcff",
                    cursor: voted ? "default" : "pointer",
                    textAlign: "right", width: "100%",
                    transform: isAnimating ? "scale(0.98)" : "scale(1)",
                    transition: "all 0.3s ease",
                    fontFamily: "inherit",
                  }}
                >
                  {/* Progress bar fill */}
                  {voted && (
                    <div style={{
                      position: "absolute", top: 0, right: 0, bottom: 0,
                      width: `${pct}%`, maxWidth: "100%",
                      background: isVoted
                        ? "linear-gradient(90deg,transparent,rgba(46,117,182,0.12))"
                        : "linear-gradient(90deg,transparent,rgba(0,0,0,0.03))",
                      transition: "width 0.8s ease",
                    }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                    <span style={{ color: "#888", fontSize: "13px", fontWeight: voted ? 700 : 400 }}>
                      {voted ? `${pct}% (${opt.votes})` : ""}
                    </span>
                    <span style={{ color: "var(--navy)", fontWeight: 600, fontSize: "15px" }}>
                      {opt.emoji} {opt.text}
                      {isVoted && " ✓"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <p style={{ margin: 0, color: "#aaa", fontSize: "13px" }}>
              {totalVotes > 0 ? `${totalVotes} صوت` : "كن أول من يصوت"}
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {voted && (
                <span style={{ color: "var(--mid)", fontSize: "13px", fontWeight: 600 }}>شكرًا لتصويتك! 🤿</span>
              )}
              {SURVEYS.length > 1 && (
                <button onClick={nextSurvey} style={{
                  background: "transparent", border: "1px solid #dde8f4",
                  borderRadius: "8px", padding: "6px 14px", cursor: "pointer",
                  color: "var(--navy)", fontSize: "13px", fontFamily: "inherit",
                }}>
                  استطلاع آخر ←
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
