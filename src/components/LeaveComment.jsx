// src/components/LeaveComment.jsx
import { useEffect, useState } from "react";

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

export default function LeaveComment() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit =
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    message.trim().length <= 500;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const res = await fetch(`${API_BASE}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship: relationship.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        console.error("failed to post", await res.text());
        return;
      }
      const created = await res.json();
      setName("");
      setRelationship("");
      setMessage("");
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="leave-comment" style={{ maxWidth: 900, marginInline: "auto" }}>
      <button className="btn" onClick={() => setOpen(true)}>
        Leave a comment
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave a comment</h3>

            <form onSubmit={onSubmit} className="form">
              <label className="label">
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input"
                  required
                />
              </label>

              <label className="label">
                <span>Relationship</span>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g., Mentor, Classmate"
                  className="input"
                />
              </label>

              <label className="label">
                <span>Message</span>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message"
                  className="textarea"
                  maxLength={500}
                  required
                />
                <div className="hint">{message.length}/500</div>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={!canSubmit}>
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}