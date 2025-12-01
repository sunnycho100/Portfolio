// src/components/BookCarousel.jsx
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function BookModal({ book, anchor, onClose }) {
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

  // Initial position: always center the modal on screen
  useLayoutEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const centeredLeft = (vw - rect.width) / 2;
    const centeredTop = (vh - rect.height) / 2;

    const left = clamp(centeredLeft, 8, vw - rect.width - 8);
    const top = clamp(centeredTop, 8, vh - rect.height - 8);

    setPos({ left, top });
  }, [book]); // recenter if a different book is opened

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNotes = (val) => {
    setDesc(val);
    try {
      localStorage.setItem(notesKey, val);
    } catch {
      /* ignore */
    }
  };

  const addComment = () => {
    if (!text.trim()) return;
    const entry = {
      name: name.trim() || "Anonymous",
      text: text.trim(),
      ts: Date.now(),
    };
    const next = [...comments, entry];
    setComments(next);
    try {
      localStorage.setItem(commentsKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setText("");
  };

  // Drag handlers
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

    const left = clamp(
      dragRef.current.origLeft + dx,
      8,
      vw - rect.width - 8
    );
    const top = clamp(
      dragRef.current.origTop + dy,
      8,
      vh - rect.height - 8
    );
    setPos({ left, top });
  };

  const onPointerUp = () => {
    dragRef.current.dragging = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  const modal = (
    <div
      className="book-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="book-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={
          pos.left != null
            ? { left: pos.left, top: pos.top, position: "absolute" }
            : undefined
        }
      >
        <div
          className="modal-header"
          onPointerDown={onPointerDown}
          role="button"
          aria-label="Move dialog"
          tabIndex={0}
        >
          {/* Apple style red close button */}
          <button
            className="modal-close-apple"
            aria-label="Close"
            type="button"
            onClick={onClose}
          >
            <span className="apple-close-dot" aria-hidden="true">
              ●
            </span>
          </button>
          <div className="modal-header-title">{book.title}</div>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <img src={book.src} alt={book.title} />
          </div>

          <div className="modal-right">
            <h3 style={{ margin: "4px 0 6px" }}>{book.title}</h3>
            {book.author && (
              <p className="meta-author" style={{ margin: 0 }}>
                {book.author}
              </p>
            )}
            {book.review && (
              <p style={{ marginTop: 8, fontWeight: 600 }}>{book.review}</p>
            )}

            <label className="desc-label">
              Your one-line takeaway (saved locally)
            </label>
            <textarea
              className="quick-desc"
              value={desc}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder="Write your one-line takeaway…"
              rows={3}
            />

            <div className="comments">
              <h4 style={{ margin: "0 0 6px" }}>Comments</h4>
              {comments.length === 0 && (
                <p style={{ color: "#666", margin: "4px 0 10px" }}>
                  Be the first to comment.
                </p>
              )}

              {comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-name">{c.name}</div>
                  <div className="comment-time">
                    {new Date(c.ts).toLocaleString()}
                  </div>
                  <div
                    style={{ gridColumn: "1 / -1" }}
                    className="comment-text"
                  >
                    {c.text}
                  </div>
                </div>
              ))}

              <div className="comment-form">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  placeholder="Write a comment…"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  className="primary-button"
                  type="button"
                  onClick={addComment}
                >
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
  const [selected, setSelected] = useState(null); // { index, x, y } | null

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
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [books]);

  const scrollByViewport = (dir = 1) => {
    const track = trackRef.current;
    if (!track) return;
    const offset = Math.round(track.clientWidth * 0.9) * dir;
    track.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <>
      <div className="book-carousel">
        <button
          className="carousel-btn prev"
          onClick={() => scrollByViewport(-1)}
          aria-label="Previous books"
          disabled={!canPrev}
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div
            className="carousel-track"
            ref={trackRef}
            tabIndex={0}
            aria-live="polite"
          >
            {books.map((b, i) => (
              <div
                className="carousel-item"
                key={b.id || i}
                onClick={() =>
                  setSelected({
                    index: i,
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelected({
                      index: i,
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                    });
                  }
                }}
                aria-label={`Open ${b.title}`}
                title={b.title}
              >
                <img
                  src={b.src}
                  alt={`${b.title} — ${b.author || ""}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-btn next"
          onClick={() => scrollByViewport(1)}
          aria-label="Next books"
          disabled={!canNext}
        >
          ›
        </button>
      </div>

      {selected && (
        <BookModal
          book={books[selected.index]}
          anchor={{ x: selected.x, y: selected.y }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}