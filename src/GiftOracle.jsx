import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are The Gift Oracle — a context-aware, emotionally safe gift concierge. You provide curated, culturally aware, relationship-appropriate gift recommendations using a multi-layer safety and etiquette system.

When a user describes who they're shopping for, you must:

1. Identify the RELATIONSHIP TYPE (e.g., boss/professional, romantic partner, friend, parent, sibling, acquaintance, colleague, etc.) and calibrate your recommendations to relationship-appropriate boundaries.

2. Identify the BUDGET RANGE from their message. If no budget is given, ask for one before proceeding.

3. Identify INTEREST SIGNALS — any hobbies, preferences, or personality details mentioned.

4. Apply your SAFETY AND ETIQUETTE SYSTEM:
   - Professional relationships: preference-aware but not emotionally expressive. No overly personal items.
   - Romantic relationships: warmth and personalization are appropriate, but avoid presumptuous intimacy early on.
   - Family: consider cultural context and family dynamics.
   - Never recommend anything that could embarrass, pressure, or overstep.

5. Structure your response EXACTLY like this:

**[Relationship type] | [Budget range] | [Key interest signals]**

---

**Recommendations**

**1. [Gift Name]**
[1-2 sentence description of the gift and why it works]

**2. [Gift Name]**
[1-2 sentence description]

**3. [Gift Name]**
[1-2 sentence description]

---

**Why This Works**
[2-3 bullet points explaining the social/emotional logic behind these choices]

---

**Risk Awareness**
[2-3 bullet points flagging what to avoid and why]

---

*Agency Reminder: You know this person best — use this as guidance, not a rule.*

Keep your tone warm, intelligent, and concise. You are a trusted advisor, not a search engine. Always prioritize emotional safety and social appropriateness over novelty.`;

const StarField = () => {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            background: "#c9b97a",
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.05; transform: scale(0.8); }
          to { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201,185,122,0.3), 0 0 40px rgba(201,185,122,0.1); }
          50% { box-shadow: 0 0 30px rgba(201,185,122,0.5), 0 0 60px rgba(201,185,122,0.2); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes typing {
          0%, 60%, 100% { opacity: 1; }
          30% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const OracleOrb = ({ isThinking }) => (
  <div style={{
    width: "80px",
    height: "80px",
    position: "relative",
    animation: "float 4s ease-in-out infinite",
    flexShrink: 0,
  }}>
    <div style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%, #e8d9a0, #c9b97a 40%, #8a7340 70%, #3d2f0a)",
      animation: "orb-pulse 3s ease-in-out infinite",
      boxShadow: "0 0 30px rgba(201,185,122,0.4), 0 0 60px rgba(201,185,122,0.15), inset 0 0 20px rgba(0,0,0,0.3)",
    }} />
    <div style={{
      position: "absolute",
      top: "15%",
      left: "20%",
      width: "25%",
      height: "15%",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.4)",
      transform: "rotate(-30deg)",
      filter: "blur(2px)",
    }} />
    {isThinking && (
      <div style={{
        position: "absolute",
        inset: "-8px",
        borderRadius: "50%",
        border: "2px solid rgba(201,185,122,0.5)",
        animation: "orb-pulse 1s ease-in-out infinite",
      }} />
    )}
  </div>
);

const formatResponse = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      return (
        <div key={i} style={{
          color: "#c9b97a",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.85rem",
          letterSpacing: "0.05em",
          marginTop: i === 0 ? 0 : "1.2rem",
          marginBottom: "0.4rem",
        }}>
          {line.slice(2, -2)}
        </div>
      );
    }
    if (line.startsWith('**') && line.includes('**', 2)) {
      const boldEnd = line.indexOf('**', 2);
      const boldText = line.slice(2, boldEnd);
      const rest = line.slice(boldEnd + 2);
      return (
        <div key={i} style={{ marginBottom: "0.3rem", lineHeight: 1.6 }}>
          <span style={{ color: "#e8d9a0", fontWeight: 600 }}>{boldText}</span>
          <span style={{ color: "#b8a87a" }}>{rest}</span>
        </div>
      );
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.4rem",
          paddingLeft: "0.5rem",
          color: "#b8a87a",
          lineHeight: 1.6,
        }}>
          <span style={{ color: "#c9b97a", flexShrink: 0 }}>◆</span>
          <span>{line.slice(2)}</span>
        </div>
      );
    }
    if (line.startsWith('---')) {
      return <div key={i} style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(201,185,122,0.3), transparent)",
        margin: "1rem 0",
      }} />;
    }
    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      return (
        <div key={i} style={{
          color: "#8a7a5a",
          fontStyle: "italic",
          fontSize: "0.85rem",
          marginTop: "0.8rem",
        }}>
          {line.slice(1, -1)}
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} style={{ height: "0.3rem" }} />;
    return (
      <div key={i} style={{ color: "#b8a87a", lineHeight: 1.7, marginBottom: "0.2rem" }}>
        {line}
      </div>
    );
  });
};

export default function GiftOracle() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const newCount = queryCount + 1;
    setQueryCount(newCount);

    try {
      const conversationHistory = [
        ...messages,
        { role: "user", content: userMessage }
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
      const assistantMessage = data.content?.[0]?.text || "The Oracle is momentarily silent. Please try again.";

      setMessages(prev => [...prev, { role: "assistant", content: assistantMessage }]);

      if (newCount >= 2 && !emailSubmitted) {
        setTimeout(() => setShowEmailPrompt(true), 800);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "The Oracle's vision is clouded. Please try again in a moment.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmailSubmit = () => {
    if (emailCapture.includes("@")) {
      setEmailSubmitted(true);
      setShowEmailPrompt(false);
    }
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 20%, #1a1206 0%, #0d0a04 40%, #060402 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'EB Garamond', Georgia, serif",
      color: "#b8a87a",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      textAlign: "center",
      padding: "3rem 2rem 1.5rem",
      position: "relative",
      zIndex: 1,
      animation: "fadeInUp 0.8s ease forwards",
    },
    title: {
      fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
      fontSize: "clamp(1.8rem, 5vw, 3rem)",
      color: "#c9b97a",
      letterSpacing: "0.1em",
      margin: 0,
      background: "linear-gradient(135deg, #c9b97a, #e8d9a0, #8a7340, #c9b97a)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "shimmer 4s linear infinite",
    },
    subtitle: {
      fontFamily: "'EB Garamond', serif",
      fontSize: "0.9rem",
      color: "#6a5a3a",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginTop: "0.5rem",
      fontStyle: "italic",
    },
    divider: {
      width: "200px",
      height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(201,185,122,0.4), transparent)",
      margin: "1rem auto 0",
    },
    chatContainer: {
      width: "100%",
      maxWidth: "720px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "0 1.5rem",
      position: "relative",
      zIndex: 1,
    },
    messagesArea: {
      flex: 1,
      minHeight: "300px",
      padding: "1rem 0",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 2rem",
      animation: "fadeInUp 1s ease 0.3s both",
    },
    emptyPrompt: {
      fontSize: "1rem",
      color: "#6a5a3a",
      fontStyle: "italic",
      lineHeight: 1.8,
      maxWidth: "400px",
      margin: "0 auto",
    },
    exampleTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      justifyContent: "center",
      marginTop: "1.5rem",
    },
    tag: {
      padding: "0.4rem 0.9rem",
      border: "1px solid rgba(201,185,122,0.2)",
      borderRadius: "20px",
      fontSize: "0.78rem",
      color: "#8a7340",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontStyle: "italic",
    },
    messageWrapper: {
      marginBottom: "1.5rem",
      animation: "fadeInUp 0.4s ease forwards",
    },
    userMessage: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "1.5rem",
    },
    userBubble: {
      background: "linear-gradient(135deg, rgba(201,185,122,0.15), rgba(201,185,122,0.08))",
      border: "1px solid rgba(201,185,122,0.25)",
      borderRadius: "16px 16px 4px 16px",
      padding: "0.8rem 1.2rem",
      maxWidth: "75%",
      color: "#d4c48a",
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    assistantMessage: {
      display: "flex",
      gap: "1rem",
      alignItems: "flex-start",
      marginBottom: "1.5rem",
    },
    assistantBubble: {
      flex: 1,
      background: "rgba(10,8,3,0.6)",
      border: "1px solid rgba(201,185,122,0.15)",
      borderRadius: "4px 16px 16px 16px",
      padding: "1.2rem 1.4rem",
      fontSize: "0.92rem",
    },
    thinkingBubble: {
      flex: 1,
      background: "rgba(10,8,3,0.6)",
      border: "1px solid rgba(201,185,122,0.1)",
      borderRadius: "4px 16px 16px 16px",
      padding: "1.2rem 1.4rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#6a5a3a",
      fontStyle: "italic",
      fontSize: "0.88rem",
    },
    inputArea: {
      padding: "1rem 0 2rem",
      position: "sticky",
      bottom: 0,
      background: "linear-gradient(to top, #060402 60%, transparent)",
    },
    inputWrapper: {
      display: "flex",
      gap: "0.75rem",
      alignItems: "flex-end",
      background: "rgba(10,8,3,0.8)",
      border: "1px solid rgba(201,185,122,0.2)",
      borderRadius: "16px",
      padding: "0.75rem 1rem",
      backdropFilter: "blur(10px)",
      animation: "pulse-glow 4s ease-in-out infinite",
    },
    textarea: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "#d4c48a",
      fontSize: "0.95rem",
      fontFamily: "'EB Garamond', serif",
      resize: "none",
      minHeight: "24px",
      maxHeight: "120px",
      lineHeight: 1.6,
    },
    sendButton: {
      background: isLoading
        ? "rgba(201,185,122,0.1)"
        : "linear-gradient(135deg, #c9b97a, #8a7340)",
      border: "none",
      borderRadius: "10px",
      width: "40px",
      height: "40px",
      cursor: isLoading ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s ease",
      color: isLoading ? "#6a5a3a" : "#1a1206",
      fontSize: "1rem",
    },
    emailPrompt: {
      position: "fixed",
      bottom: "100px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 3rem)",
      maxWidth: "500px",
      background: "linear-gradient(135deg, #12100600, #1a1206)",
      border: "1px solid rgba(201,185,122,0.3)",
      borderRadius: "16px",
      padding: "1.5rem",
      zIndex: 10,
      backdropFilter: "blur(20px)",
      boxShadow: "0 0 40px rgba(0,0,0,0.8)",
      animation: "fadeInUp 0.4s ease forwards",
    },
  };

  const examples = [
    "Gift for my boss, loves hiking, budget $50",
    "Anniversary gift for my partner of 3 years, $100",
    "Friend's birthday, obsessed with true crime, $30",
    "Thank you gift for my therapist, $40",
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      <div style={styles.app}>
        <StarField />

        <div style={styles.header}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <OracleOrb isThinking={isLoading} />
          </div>
          <h1 style={styles.title}>The Gift Oracle</h1>
          <p style={styles.subtitle}>Context-Aware · Emotionally Safe · Relationship-Wise</p>
          <div style={styles.divider} />
        </div>

        <div style={styles.chatContainer}>
          <div style={styles.messagesArea}>
            {messages.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyPrompt}>
                  Get the right gift. Every time.
                </p>
                <p style={{
                  fontSize: "0.88rem",
                  color: "#6a5a3a",
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  maxWidth: "400px",
                  margin: "0.5rem auto 0",
                }}>
                  Personalized gift ideas based on your relationship, their interests, and your budget — so you never give the wrong gift again.
                </p>
                <div style={{ ...styles.exampleTags, marginTop: "1.8rem" }}>
                  {examples.map((ex, i) => (
                    <div
                      key={i}
                      style={styles.tag}
                      onClick={() => setInput(ex)}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(201,185,122,0.6)";
                        e.currentTarget.style.color = "#c9b97a";
                        e.currentTarget.style.boxShadow = "0 0 12px rgba(201,185,122,0.2), inset 0 0 8px rgba(201,185,122,0.05)";
                        e.currentTarget.style.background = "rgba(201,185,122,0.06)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(201,185,122,0.2)";
                        e.currentTarget.style.color = "#8a7340";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      ✦ {ex}
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: "2.5rem",
                  padding: "1.5rem",
                  border: "1px solid rgba(201,185,122,0.1)",
                  borderRadius: "16px",
                  background: "rgba(10,8,3,0.4)",
                  maxWidth: "500px",
                  margin: "2rem auto 0",
                }}>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.8rem",
                    color: "#c9b97a",
                    letterSpacing: "0.1em",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}>
                    HOW IT WORKS
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {[
                      "✦ Describe the person — their relationship to you, their interests, their personality",
                      "✦ Set your budget — no judgment, any amount works",
                      "✦ Get thoughtful gift ideas instantly — curated, appropriate, and explained",
                    ].map((step, i) => (
                      <p key={i} style={{
                        fontSize: "0.88rem",
                        color: "#8a7a5a",
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: "italic",
                      }}>{step}</p>
                    ))}
                  </div>
                  <p style={{
                    fontSize: "0.78rem",
                    color: "#5a4a2a",
                    textAlign: "center",
                    marginTop: "1rem",
                    fontStyle: "italic",
                  }}>
                    The Gift Oracle is an AI-powered tool for personalized gift recommendations — available worldwide 🌍
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div style={styles.userMessage}>
                    <div style={styles.userBubble}>{msg.content}</div>
                  </div>
                ) : (
                  <div style={styles.assistantMessage}>
                    <OracleOrb isThinking={false} />
                    <div style={styles.assistantBubble}>
                      {formatResponse(msg.content)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={styles.assistantMessage}>
                <OracleOrb isThinking={true} />
                <div style={styles.thinkingBubble}>
                  <span>The Oracle is consulting the etiquette...</span>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#c9b97a",
                      animation: `typing 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <div style={styles.inputWrapper}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="✦ Ask the Oracle — who are you gifting for?"
                style={styles.textarea}
                rows={1}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                style={styles.sendButton}
              >
                ✦
              </button>
            </div>
            <div style={{
              textAlign: "center",
              marginTop: "0.6rem",
              fontSize: "0.72rem",
              color: "#3d2f0a",
              fontStyle: "italic",
            }}>
              You'll receive thoughtful, appropriate gift suggestions in seconds · Shift+Enter for new line
            </div>
          </div>
        </div>

        {showEmailPrompt && !emailSubmitted && (
          <div style={styles.emailPrompt}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              color: "#c9b97a",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
              letterSpacing: "0.05em",
            }}>
              ✦ Enjoying the Oracle?
            </div>
            <p style={{
              fontSize: "0.85rem",
              color: "#8a7a5a",
              margin: "0 0 1rem",
              lineHeight: 1.6,
            }}>
              Join the list for updates, new features, and early access to premium tiers.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                value={emailCapture}
                onChange={e => setEmailCapture(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  background: "rgba(201,185,122,0.05)",
                  border: "1px solid rgba(201,185,122,0.2)",
                  borderRadius: "8px",
                  padding: "0.6rem 0.8rem",
                  color: "#d4c48a",
                  fontSize: "0.85rem",
                  fontFamily: "'EB Garamond', serif",
                  outline: "none",
                }}
                onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
              />
              <button
                onClick={handleEmailSubmit}
                style={{
                  background: "linear-gradient(135deg, #c9b97a, #8a7340)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  color: "#1a1206",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                Join
              </button>
              <button
                onClick={() => setShowEmailPrompt(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6a5a3a",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0.4rem",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {emailSubmitted && (
          <div style={{
            position: "fixed",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(201,185,122,0.1)",
            border: "1px solid rgba(201,185,122,0.3)",
            borderRadius: "12px",
            padding: "0.8rem 1.5rem",
            color: "#c9b97a",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
            zIndex: 10,
            animation: "fadeInUp 0.3s ease forwards",
          }}>
            ✦ The Oracle remembers you.
          </div>
        )}
      </div>
    </>
  );
}
