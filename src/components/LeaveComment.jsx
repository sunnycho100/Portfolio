// src/components/LeaveComment.jsx
import { useState } from "react";

export default function LeaveComment() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit =
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    message.trim().length <= 500;

  function saveToLocal(entry) {
    try {
      const key = "portfolioComments";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([entry, ...existing]));
      // notify listeners
      window.dispatchEvent(new Event("comments-updated"));
    } catch {}
  }

  function onSubmitLocal(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const entry = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    saveToLocal(entry);
    setName("");
    setMessage("");
    setOpen(false);
  }

  return (
    <div className="leave-comment">
      <button className="btn" onClick={() => setOpen(true)}>
        Leave a comment
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave a comment</h3>

            <form onSubmit={onSubmitLocal} className="form">
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