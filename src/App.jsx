import { useState, useRef, useEffect } from "react";

const ME = {
  photo: "/profile.png",
  name: "David Abraham",
  tagline: "Father. IT Engineer. AI Tester.",
  about: "Twenty plus years in IT. Two kids who keep me on my toes. And a front-row seat to the AI revolution. Building things, breaking things (frequently), and teaching everyone I can along the way.",
  email: "davidmabraham@icloud.com",
  location: "Rochester, MI",
  skills: [
    "Troubleshooting / Problem Solving", "Networking", "All things Windows",
    "Automation", "Artificial Intelligence", "Technical Writing", "Running", "Piloting small aircraft"
  ],
  projects: [
    {
      title: "Date David Abraham",
      tags: ["Comedy", "Dating"],
      desc: "A fun take on a dating profile, check it out, but don't take it too seriously.",
      color: "#7c3aed",
    },
    {
      title: "Dave Teaches Tech",
      tags: ["IT", "Teaching"],
      desc: "My attempt to learn by teaching. Random topics, whatever comes up IRL.",
      color: "#db2777",
    },
    {
      title: "Dave's AI Experiments",
      tags: ["AI", "Projects"],
      desc: "A collection of AI projects and experiments I'm working on.",
      color: "#0891b2",
    },
  ],
  chat_context: `You are an AI assistant embedded in David Abraham's portfolio site.
Here is everything you know about David:
- 41 year old single Dad to two kids, one 12 year old boy and a 5 year old princess. 20+ years experience in IT engineering. Expert on Windows Servers, TCP/IP Networking, Troubleshooting and Artificial Intelligence. 
- 6 x Marathon Runner.
- Private pilot (single engine).
- Based in Rochester, MI.
- Notable projects: Date David Abraham (fun dating profile), Dave Teaches Tech (Teaching others while he learns and experiments), Dave's AI Experiments (Compilation of Dave's AI projects and experiments).
- Email: davidmabraham@icloud.com
- Loves working with bleeding-edge technology and teaching others as he learns.
- Available for freelance and consulting projects.
Answer visitors' questions about David warmly and concisely. If you don't know something, say so honestly.`,
};

const NAV = ["About", "Skills", "Work", "Chat"];

function useScroll() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Tag({ label, color = "#7c3aed" }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "3px 10px",
      borderRadius: 99, border: `1.5px solid ${color}`,
      color, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12 }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#db2777)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, marginRight: 8, marginTop: 2,
        }}>AI</div>
      )}
      <div style={{
        maxWidth: "78%", padding: "10px 14px", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "linear-gradient(135deg,#7c3aed,#db2777)" : "#1e1b4b",
        color: "#fff", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
      }}>{msg.content}</div>
    </div>
  );
}

export default function Portfolio() {
  const scrollY = useScroll();
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: `Hey! I'm David's AI. Ask me anything — projects, skills, availability, whatever's on your mind.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    const next = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          system: ME.chat_context,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't get a response.";
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Something went wrong. Try again?" }]);
    }
    setLoading(false);
  }

  const navBg = scrollY > 60;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#09090b", color: "#fafafa", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 5%", height: 64,
        background: navBg ? "rgba(9,9,11,0.85)" : "transparent",
        backdropFilter: navBg ? "blur(12px)" : "none",
        borderBottom: navBg ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "all 0.3s",
      }}>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.04em", cursor: "pointer" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {ME.name.split(" ")[0]}<span style={{ color: "#7c3aed" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {NAV.map(n => (
            <button key={n} onClick={() => scrollTo(n.toLowerCase())}
              style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontWeight: 500, padding: 0 }}>
              {n}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 5%", position: "relative", overflow: "hidden",
      }}>
        {[
          { top: "10%", left: "60%", bg: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)", size: 600 },
          { top: "50%", left: "20%", bg: "radial-gradient(circle, rgba(219,39,119,0.2) 0%, transparent 70%)", size: 400 },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: b.size, height: b.size,
            top: b.top, left: b.left, transform: "translate(-50%,-50%)",
            background: b.bg, pointerEvents: "none", borderRadius: "50%",
          }} />
        ))}
        <div style={{ position: "relative", maxWidth: 800 }}>
          <p style={{ color: "#7c3aed", fontWeight: 700, letterSpacing: "0.12em", fontSize: 13, textTransform: "uppercase", marginBottom: 20 }}>
            Portfolio · {new Date().getFullYear()}
          </p>
          <h1 style={{
            fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, lineHeight: 1.02,
            letterSpacing: "-0.04em", margin: "0 0 24px",
            background: "linear-gradient(135deg, #fafafa 30%, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{ME.name}</h1>
          <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "#a1a1aa", fontWeight: 400, marginBottom: 40, lineHeight: 1.4 }}>
            {ME.tagline}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("work")} style={{
              padding: "12px 28px", borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: "pointer",
              background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", border: "none",
            }}>See My Work</button>
            <button onClick={() => scrollTo("chat")} style={{
              padding: "12px 28px", borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: "pointer",
              background: "transparent", color: "#fafafa", border: "1.5px solid rgba(255,255,255,0.2)",
            }}>Ask Me Anything ✦</button>
          </div>
        </div>
      </section>

      {/* PROFILE PHOTO */}
      {ME.photo && (
        <div style={{ display: "flex", justifyContent: "center", padding: "5px 5% 0" }}>
          <img
            src={ME.photo}
            alt={ME.name}
            style={{
              width: 360, height: 360, objectFit: "cover",
              borderRadius: "50%", border: "4px solid rgba(124,58,237,0.6)",
            }}
          />
        </div>
      )}

      {/* ABOUT */}
      <section id="about" style={{ padding: "48px 5% 100px", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: "#7c3aed", fontWeight: 700, letterSpacing: "0.12em", fontSize: 12, textTransform: "uppercase", marginBottom: 16 }}>About</p>
        <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", lineHeight: 1.65, color: "#e4e4e7", fontWeight: 400 }}>
          {ME.about}
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[["📍", ME.location], ["✉️", ME.email]].map(([ico, val]) => (
            <span key={val} style={{ color: "#71717a", fontSize: 14 }}>{ico} {val}</span>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: "80px 5%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: "#7c3aed", fontWeight: 700, letterSpacing: "0.12em", fontSize: 12, textTransform: "uppercase", marginBottom: 32 }}>Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {ME.skills.map((s, i) => {
              const colors = ["#7c3aed", "#db2777", "#0891b2", "#059669", "#d97706"];
              return <Tag key={s} label={s} color={colors[i % colors.length]} />;
            })}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ padding: "80px 5%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: "#7c3aed", fontWeight: 700, letterSpacing: "0.12em", fontSize: 12, textTransform: "uppercase", marginBottom: 32 }}>Work</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {ME.projects.map(p => (
              <div key={p.title} style={{
                background: "#111113", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: 28, cursor: "default",
                transition: "transform 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = p.color + "55"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: p.color + "22",
                  border: `1.5px solid ${p.color}44`, marginBottom: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: p.color }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.tags.map(t => <Tag key={t} label={t} color={p.color} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section id="chat" style={{ padding: "80px 5% 120px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ color: "#7c3aed", fontWeight: 700, letterSpacing: "0.12em", fontSize: 12, textTransform: "uppercase", marginBottom: 8 }}>Ask Me Anything ✦ AI</p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Chat with my portfolio
          </h2>
          <p style={{ color: "#71717a", fontSize: 14, marginBottom: 28 }}>
            Powered by Claude — ask about skills, projects, availability, or anything else.
          </p>
          <div style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: 20, maxHeight: 380, overflowY: "auto" }}>
              {msgs.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a", fontSize: 13, paddingLeft: 36 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%", background: "#7c3aed",
                        animation: "bounce 1s infinite", animationDelay: `${i * 0.15}s`,
                      }} />
                    ))}
                  </div>
                  Thinking…
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {msgs.length === 1 && (
              <div style={{ padding: "0 20px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["What are your strongest skills?", "Are you available for hire?", "Tell me about your projects"].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    style={{
                      fontSize: 12, padding: "6px 14px", borderRadius: 99, cursor: "pointer",
                      background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#a1a1aa",
                    }}>{q}</button>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid rgba(255,255,255,0.07)", alignItems: "flex-end" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything about David…" rows={1}
                style={{
                  flex: 1, resize: "none", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  padding: "10px 14px", color: "#fafafa", fontSize: 14, fontFamily: "inherit",
                  outline: "none", lineHeight: 1.5,
                }} />
              <button onClick={send} disabled={loading || !input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: loading || !input.trim() ? "#27272a" : "linear-gradient(135deg,#7c3aed,#db2777)",
                  border: "none", cursor: loading || !input.trim() ? "default" : "pointer",
                  color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                }}>↑</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "40px 5%", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#52525b", fontSize: 13 }}>
        Built with ✦ by {ME.name} · {new Date().getFullYear()}
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 99px; }
      `}</style>
    </div>
  );
}