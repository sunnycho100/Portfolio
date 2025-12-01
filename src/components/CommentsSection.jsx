// src/components/CommentsSection.jsx
import { useEffect, useState } from "react";

function initials(name) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

function hueFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}

export default function CommentsSection() {
  const [comments, setComments] = useState([]);

  function load() {
    try {
      const key = "portfolioComments";
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    }
  }

  useEffect(() => {
    load();
    const onUpdate = () => load();
    window.addEventListener("comments-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("comments-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  return (
    <details className="accordion">
      <summary>
        <div className="summary-left">
          <i className="fa-solid fa-comments" aria-hidden="true"></i>
          <span>Open to see comments</span>
        </div>
        <i className="fa-solid fa-chevron-down chev" aria-hidden="true"></i>
      </summary>

      <div className="accordion-content">
        {comments.length === 0 ? (
          <p className="lang-empty">No comments yet.</p>
        ) : (
          <>
            <div className="comment-grid">
              {comments.map((c) => {
                const hue = hueFromString(c.name || "");
                return (
                  <article key={c.id} className="comment-card">
                    <header className="comment-card-header">
                      <div
                        className="comment-avatar"
                        style={{ background: `hsl(${hue} 70% 45%)` }}
                        aria-hidden="true"
                      >
                        {initials(c.name || "?")}
                      </div>
                      <div className="comment-header-text">
                        <div className="comment-name">{c.name}</div>
                        <div className="comment-date">
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </header>

                    <p className="comment-body" title={c.message}>
                      {c.message}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="comment-footer-hint">
              Showing newest first
            </div>
          </>
        )}
      </div>
    </details>
  );
}