// src/components/Github.jsx
import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
          <div className="github-layout stagger" style={{ padding: "0 24px 24px" }}>
            {/* Languages summary */}
            <section style={{ marginBottom: "18px" }}>
              <h3 className="github-subheading">Languages used</h3>
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

            {/* Repo cards grid */}
            <section>
              <h3 className="github-subheading">Repositories</h3>

              <div className="repo-grid">
                {data.repos
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.updated_at).getTime() -
                      new Date(a.updated_at).getTime()
                  )
                  .map((r) => {
                    const displayLangs =
                      r.langs && r.langs.length > 0
                        ? r.langs.slice(0, 3) // top 3 languages
                        : r.language
                        ? [r.language]
                        : [];

                    const primaryLang = displayLangs[0] || null;
                    const extraLangs = displayLangs.slice(1);

                    return (
                      <article key={r.id} className="repo-card">
                        {/* Header: name + small external hint */}
                        <header className="repo-card-header">
                          <a
                            href={r.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="repo-name-link"
                          >
                            <span className="repo-name">{r.name}</span>
                            <span className="repo-link-icon" aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        </header>

                        {/* Description */}
                        {r.description && (
                          <p className="repo-desc">
                            {r.description}
                          </p>
                        )}

                        {/* Tags row (languages + stars) */}
                        <div className="repo-tags">
                          {primaryLang && (
                            <span className="repo-tag repo-tag-primary">
                              {primaryLang}
                            </span>
                          )}

                          {extraLangs.map((lang) => (
                            <span key={lang} className="repo-tag">
                              {lang}
                            </span>
                          ))}

                          {r.stargazers_count > 0 && (
                            <span className="repo-tag repo-tag-metric">
                              ★ {r.stargazers_count}
                            </span>
                          )}
                        </div>

                        {/* Meta line */}
                        <div className="repo-meta">
                          {r.forks_count > 0 && (
                            <span>Forks {r.forks_count} · </span>
                          )}
                          <span>
                            Updated {formatDate(r.updated_at)}
                          </span>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          </div>
        )}
      </Reveal>
    </section>
  );
}