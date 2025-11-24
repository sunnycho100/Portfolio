// src/components/Github.jsx
import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";

export default function Github() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error

  useEffect(() => {
    setStatus("loading");
    fetch("http://localhost:4000/api/github/overview")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load GitHub data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setStatus("idle");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  return (
    <section id="github" className="section">
      <Reveal delay="300ms" className="list-container">
        <h2>GitHub</h2>

        {status === "loading" && (
          <p style={{ padding: "0 24px 24px" }}>Loading GitHub data…</p>
        )}

        {status === "error" && (
          <p style={{ padding: "0 24px 24px", color: "red" }}>
            Could not load GitHub data. Try again later.
          </p>
        )}

        {status === "idle" && data && (
          <div className="stagger" style={{ padding: "0 24px 24px" }}>
            {/* Language summary */}
            <section style={{ marginBottom: "18px" }}>
              <h3 style={{ margin: "8px 0" }}>Languages used</h3>
              <ul className="chips-inline">
                {Object.entries(data.languages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([lang, count]) => (
                    <li key={lang}>
                      {lang} ({count})
                    </li>
                  ))}
              </ul>
            </section>

            {/* Repo list */}
            <section>
              <h3 style={{ margin: "8px 0" }}>Repositories</h3>
              <ul className="item-list">
  {data.repos
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .map((r) => {
      // Prefer the langs array from backend, fall back to primary language
      const displayLangs =
        r.langs && r.langs.length > 0
          ? r.langs.slice(0, 3) // show top 3 languages
          : r.language
          ? [r.language]
          : [];

      return (
        <li key={r.id} className="list-item">
            <div className="role-line">
                <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
                >
                <strong>{r.name}</strong>
                </a>

                {displayLangs.length > 0 && (
                <span className="meta">
                    {" "}
                    · {displayLangs.join(" · ")}
                </span>
                )}

                {r.stargazers_count > 0 && (
                <span className="meta">
                    {" "}
                    · ★ {r.stargazers_count}
                </span>
                )}
            </div>

            {r.description && (
                <p
                style={{
                    margin: "4px 0 0 0",
                    fontSize: "13px",
                    color: "#222",
                }}
                >
                {r.description}
                </p>
            )}
            </li>
        );
        })}
    </ul>
            </section>
          </div>
        )}
      </Reveal>
    </section>
  );
}