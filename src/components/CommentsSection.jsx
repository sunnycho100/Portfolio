// src/components/CommentsSection.jsx
import { useEffect, useState } from "react";

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

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
  const [dbComments, setDbComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDbComments();
  }, []);

  async function loadDbComments() {
    try {
      const res = await fetch(`${API_BASE}/api/comments?take=50`);
      const data = await res.json();
      setDbComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

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
        {loading ? (
          <p>Loading comments…</p>
        ) : dbComments.length === 0 ? (
          <p className="lang-empty">No comments yet. Be the first to leave one!</p>
        ) : (
          <>
            <div className="comment-grid">
              {dbComments.map((c) => {
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
                        <div className="comment-name-line">
                          <div className="comment-name">{c.name}</div>
                          {c.relationship ? (
                            <span className="comment-rel">· {c.relationship}</span>
                          ) : null}
                        </div>
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

            <div className="comment-footer-hint">Showing newest first</div>
          </>
        )}
      </div>
    </details>
  );
}