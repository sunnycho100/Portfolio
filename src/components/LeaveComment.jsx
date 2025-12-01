// src/components/LeaveComment.jsx
import { useState } from "react";

export default function LeaveComment() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState([]);

  const canSubmit =
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    message.trim().length <= 500;

  function onSubmitLocal(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const entry = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setPreview([entry, ...preview]);
    setName("");
    setMessage("");
    setOpen(false);

    // later replace with API call
    // await createComment({ name, message })
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

      {preview.length > 0 && (
        <div className="comments-list">
          <h4>Recent comments</h4>
          <ul>
            {preview.map((c) => (
              <li key={c.id} className="comment">
                <div className="comment-head">
                  <strong>{c.name}</strong>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p>{c.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}