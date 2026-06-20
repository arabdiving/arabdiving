"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";

export default function MessagesPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null); // {_id,name,profileImage}
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [me, setMe] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};

  const loadConvos = () => fetch(`${API_BASE}/api/dm`, { headers }).then((r) => r.json()).then((d) => setConversations(d.conversations || [])).catch(() => {});
  const loadFriends = () => fetch(`${API_BASE}/api/friends`, { headers }).then((r) => r.json()).then((d) => setFriends(d.friends || [])).catch(() => {});

  const openChat = (partner: any) => {
    setActive(partner);
    fetch(`${API_BASE}/api/dm/${partner._id}`, { headers }).then((r) => r.json()).then((d) => setMessages(d.messages || [])).catch(() => {});
  };

  useEffect(() => {
    if (!token) { setAuthed(false); return; }
    setAuthed(true);
    try { const u = localStorage.getItem("user"); if (u) setMe(JSON.parse(u)._id); } catch {}
    loadConvos(); loadFriends();
    const uid = new URLSearchParams(window.location.search).get("u");
    if (uid) fetch(`${API_BASE}/api/users/${uid}`, { headers }).then((r) => r.json()).then((d) => { if (d.user) openChat({ _id: d.user._id, name: d.user.name, profileImage: d.user.profileImage }); }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !active) return;
    const res = await fetch(`${API_BASE}/api/dm/${active._id}`, { method: "POST", headers, body: JSON.stringify({ content: text.trim() }) });
    const d = await res.json();
    if (d.success) { setMessages((m) => [...m, d.message]); setText(""); loadConvos(); }
    else alert(d.message || "تعذّر الإرسال");
  };

  if (authed === false) {
    return (
      <main style={{ maxWidth: "520px", margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontSize: "50px" }}>💬</div>
        <h1 style={{ color: "var(--navy)", marginBottom: "10px" }}>الرسائل الخاصة</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>سجّل الدخول لمراسلة أصدقائك.</p>
        <Link href="/login" style={{ background: "var(--gold)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: 700 }}>تسجيل الدخول</Link>
      </main>
    );
  }

  const startable = friends.filter((f) => !conversations.some((c) => c.partner._id === f._id));

  return (
    <div style={{ maxWidth: "1000px", margin: "30px auto", padding: "0 16px", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "16px", alignItems: "start" }}>
      {/* Sidebar */}
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ background: "#0B2C59", color: "white", padding: "14px 16px", fontWeight: 700 }}>المحادثات</div>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {conversations.length === 0 && startable.length === 0 && <p style={{ color: "#888", padding: "16px", fontSize: "14px" }}>لا محادثات بعد. أضف أصدقاء من دليل الأعضاء.</p>}
          {conversations.map((c) => (
            <button key={c.partner._id} onClick={() => openChat(c.partner)} style={row(active?._id === c.partner._id)}>
              {avatar(c.partner)}
              <div style={{ textAlign: "start", overflow: "hidden" }}>
                <div style={{ fontWeight: 700, color: "var(--navy)" }}>{c.partner.name}{c.unread ? <span style={{ background: "#1e7e34", color: "white", borderRadius: "20px", fontSize: "11px", padding: "1px 7px", marginInlineStart: "6px" }}>{c.unread}</span> : null}</div>
                <div style={{ color: "#888", fontSize: "12px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{c.last}</div>
              </div>
            </button>
          ))}
          {startable.length > 0 && <div style={{ padding: "8px 14px", color: "#94a3b8", fontSize: "12px" }}>أصدقاء</div>}
          {startable.map((fr) => (
            <button key={fr._id} onClick={() => openChat(fr)} style={row(active?._id === fr._id)}>
              {avatar(fr)}
              <div style={{ fontWeight: 700, color: "var(--navy)", textAlign: "start" }}>{fr.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "65vh" }}>
        {!active ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>اختر محادثة للبدء 💬</div>
        ) : (
          <>
            <div style={{ background: "#f1f5f9", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              {avatar(active)}<strong style={{ color: "var(--navy)" }}>{active.name}</strong>
            </div>
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#f6f9fc", display: "flex", flexDirection: "column", gap: "8px" }}>
              {messages.map((m) => {
                const mine = m.from === me;
                return <div key={m._id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "75%", background: mine ? "var(--mid)" : "white", color: mine ? "white" : "#06324f", padding: "9px 13px", borderRadius: "14px", fontSize: "14px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>{m.content}</div>;
              })}
              {messages.length === 0 && <p style={{ color: "#999", textAlign: "center", marginTop: "20px" }}>ابدأ المحادثة 👋</p>}
            </div>
            <div style={{ display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid #eef2f6" }}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="اكتب رسالة..." style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit" }} />
              <button onClick={send} style={{ background: "var(--gold)", color: "white", border: "none", borderRadius: "10px", padding: "0 20px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>إرسال</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function row(activeRow: boolean): React.CSSProperties {
  return { display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 14px", border: "none", borderBottom: "1px solid #f0f3f7", background: activeRow ? "#eef4fa" : "white", cursor: "pointer", fontFamily: "inherit" };
}
function avatar(p: any) {
  const img = siteImageSrc(p.profileImage);
  return img ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img} alt={p.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  ) : (
    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#2e75b6,#0d2c54)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{(p.name || "؟").charAt(0)}</div>
  );
}
