import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function BookModal({ book, onClose }) {
  const id = book.id || book.src;
  const notesKey = `book_quickdesc_${id}`;
  const commentsKey = `book_comments_${id}`;

  const [desc, setDesc] = useState(() => {
    try {
      return localStorage.getItem(notesKey) || "";
    } catch {
      return "";
    }
  });

  const [comments, setComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(commentsKey) || "[]");
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const modalRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
  });

  const [pos, setPos] = useState({ left: null, top: null });

  // Center popup on open
  useLayoutEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const left = (vw - rect.width) / 2;
    const top = (vh - rect.height) / 2;

    setPos({
      left: clamp(left, 8, vw - rect.width - 8),
      top: clamp(top, 8, vh - rect.height - 8),
    });
  }, [book]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNotes = (value) => {
    setDesc(value);
    try {
      localStorage.setItem(notesKey, value);
    } catch {}
  };

  const addComment = () => {
    if (!text.trim()) return;
    const item = {
      name: name.trim() || "Anonymous",
      text: text.trim(),
      ts: Date.now(),
    };
    const next = [...comments, item];
    setComments(next);
    try {
      localStorage.setItem(commentsKey, JSON.stringify(next));
    } catch {}
    setText("");
  };

  // Drag behavior for header
  const onPointerDown = (e) => {
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.origLeft = pos.left ?? 0;
    dragRef.current.origTop = pos.top ?? 0;

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const node = modalRef.current;
    const rect = node ? node.getBoundingClientRect() : { width: 0, height: 0 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setPos({
      left: clamp(dragRef.current.origLeft + dx, 8, vw - rect.width - 8),
      top: clamp(dragRef.current.origTop + dy, 8, vh - rect.height - 8),
    });
  };

  const onPointerUp = () => {
    dragRef.current.dragging = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  // Modal structure
  const modal = (
    <div
      className="book-modal-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="book-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{ left: pos.left, top: pos.top, position: "absolute" }}
      >
        <div className="modal-header" onPointerDown={onPointerDown}>
          {/* macOS style close button */}
          <button className="modal-close-apple" onClick={onClose}>
            <span className="apple-close-dot">
              <span className="apple-close-x">×</span>
            </span>
          </button>

          <div className="modal-header-title">{book.title}</div>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <img src={book.src} alt={book.title} loading="lazy" />
          </div>

          <div className="modal-right">
            <h3>{book.title}</h3>
            {book.author && <p className="meta-author">{book.author}</p>}
            {book.review && <p className="book-review">{book.review}</p>}

            <label>Your one-line takeaway</label>
            <textarea
              className="quick-desc"
              value={desc}
              onChange={(e) => saveNotes(e.target.value)}
              rows={3}
            />

            <div className="comments">
              <h4>Comments</h4>

              {comments.length === 0 && (
                <p style={{ color: "#666" }}>No comments yet.</p>
              )}

              {comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-name">{c.name}</div>
                  <div className="comment-time">
                    {new Date(c.ts).toLocaleString()}
                  </div>
                  <div className="comment-text">{c.text}</div>
                </div>
              ))}

              <div className="comment-form">
                <input
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  rows={3}
                  placeholder="Write a comment…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="primary-button" onClick={addComment}>
                  Post comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default function BookCarousel({ books = [] }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      setCanPrev(track.scrollLeft > 5);
      setCanNext(
        track.scrollLeft + track.clientWidth < track.scrollWidth - 5
      );
    };

    update();
    track.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByViewport = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const distance = Math.round(track.clientWidth * 0.9) * dir;
    track.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <>
      <div className="book-carousel">
        <button
          className="carousel-btn prev"
          disabled={!canPrev}
          onClick={() => scrollByViewport(-1)}
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div className="carousel-track" ref={trackRef}>
            {books.map((b, i) => (
              <div
                key={b.id || i}
                className="carousel-item"
                onClick={() => setSelected({ index: i })}
              >
                <img src={b.src} alt={b.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-btn next"
          disabled={!canNext}
          onClick={() => scrollByViewport(1)}
        >
          ›
        </button>
      </div>

      {selected && (
        <BookModal
          book={books[selected.index]}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}