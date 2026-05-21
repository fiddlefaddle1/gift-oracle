import { useState, useRef, useEffect } from "react";
import "./GiftOracle.css";

const StarField = () => {
  // Generate stars once, statically — no re-render churn
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: ((i * 137.508) % 100).toFixed(2), // golden ratio spread — deterministic, no Math.random
    y: ((i * 97.3) % 100).toFixed(2),
    size: (0.5 + (i % 4) * 0.5).toFixed(1),
    opacity: (0.1 + (i % 6) * 0.1).toFixed(1),
    duration: (3 + (i % 4)).toFixed(1),
    delay: (i % 5).toFixed(1),
  }));

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const OracleOrb = ({ isThinking }) => (
  <div className={`orb-wrapper${isThinking ? " orb-thinking" : ""}`}>
    <div className="orb-body" />
    <div className="orb-highlight" />
    {isThinking && <div className="orb-ring" />}
  </div>
);

const formatResponse = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      return (
        <div key={i} className="fmt-heading">
          {line.slice(2, -2)}
        </div>
      );
    }
    if (line.startsWith('**') && line.includes('**', 2)) {
      const boldEnd = line.indexOf('**', 2);
      const boldText = line.slice(2, boldEnd);
      const rest = line.slice(boldEnd + 2);
      return (
        <div key={i} className="fmt-bold-line">
          <span className="fmt-bold">{boldText}</span>
          <span className="fmt-rest">{rest}</span>
        </div>
      );
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} className="fmt-bullet">
          <span className="fmt-diamond">◆</span>
          <span>{line.slice(2)}</span>
        </div>
      );
    }
    if (line.startsWith('---')) {
      return <div key={i} className="fmt-divider" />;
    }
    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      return (
        <div key={i} className="fmt-italic">
          {line.slice(1, -1)}
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} className="fmt-spacer" />;
    return (
      <div key={i} className="fmt-text">
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
        body: JSON.stringify({ messages: conversationHistory }),
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

  const examples = [
    "Gift for my boss, loves hiking, budget $50",
    "Anniversary gift for my partner of 3 years, $100",
    "Friend's birthday, obsessed with true crime, $30",
    "Thank you gift for my therapist, $40",
  ];

  return (
    <div className="app">
      <StarField />

      <div className="header">
        <div className="orb-center">
          <OracleOrb isThinking={isLoading} />
        </div>
        <h1 className="title">The Gift Oracle</h1>
        <p className="subtitle">Context-Aware · Emotionally Safe · Relationship-Wise</p>
        <div className="header-divider" />
      </div>

      <div className="chat-container">

        <div className="input-area">
          <div className={`input-wrapper${isLoading ? " input-loading" : ""}`}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="✦ Who are you gifting for? Describe them — relationship, interests, budget..."
              className="textarea"
              rows={2}
            />
            <div className="input-footer">
              <span className="input-hint">Shift+Enter for new line</span>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className={`send-btn${isLoading ? " send-btn-loading" : ""}`}
              >
                ✦ Ask the Oracle
              </button>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="example-tags">
              {examples.map((ex, i) => (
                <div
                  key={i}
                  className="tag"
                  onClick={() => {
                    setInput(ex);
                    textareaRef.current?.focus();
                  }}
                >
                  ✦ {ex}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <p className="empty-tagline">
                Personalized gift ideas based on your relationship, their interests, and your budget — so you never give the wrong gift again.
              </p>

              <div className="how-it-works">
                <p className="how-title">HOW IT WORKS</p>
                <div className="how-steps">
                  {[
                    "✦ Describe the person — their relationship to you, their interests, their personality",
                    "✦ Set your budget — no judgment, any amount works",
                    "✦ Get thoughtful gift ideas instantly — curated, appropriate, and explained",
                  ].map((step, i) => (
                    <p key={i} className="how-step">{step}</p>
                  ))}
                </div>
                <p className="how-footer">
                  The Gift Oracle is an AI-powered tool for personalized gift recommendations — available worldwide 🌍
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="user-message">
                  <div className="user-bubble">{msg.content}</div>
                </div>
              ) : (
                <div className="assistant-message">
                  <OracleOrb isThinking={false} />
                  <div className="assistant-bubble">
                    {formatResponse(msg.content)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="assistant-message">
              <OracleOrb isThinking={true} />
              <div className="thinking-bubble">
                <span>The Oracle is consulting the etiquette...</span>
                {[0, 1, 2].map(i => (
                  <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {showEmailPrompt && !emailSubmitted && (
        <div className="email-prompt">
          <div className="email-title">✦ Enjoying the Oracle?</div>
          <p className="email-body">
            Join the list for updates, new features, and early access to premium tiers.
          </p>
          <div className="email-row">
            <input
              type="email"
              value={emailCapture}
              onChange={e => setEmailCapture(e.target.value)}
              placeholder="your@email.com"
              className="email-input"
              onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
            />
            <button onClick={handleEmailSubmit} className="email-submit">Join</button>
            <button onClick={() => setShowEmailPrompt(false)} className="email-dismiss">✕</button>
          </div>
        </div>
      )}

      {emailSubmitted && (
        <div className="email-confirmed">
          ✦ The Oracle remembers you.
        </div>
      )}
    </div>
  );
}
