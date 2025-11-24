// src/components/Github.jsx
import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  HTML: "#e34c26",
  SystemVerilog: "#178600",
  Verilog: "#b2b7f8",
  "C++": "#f34b7d",
  Python: "#3572A5",
  Other: "#9ca3af",
};

const FALLBACK_COLORS = ["#8b5cf6", "#22c55e", "#0ea5e9", "#f97316", "#ec4899"];

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
          <div
            className="github-layout stagger"
            style={{ padding: "0 24px 24px" }}
          >
            {/* Languages summary with GitHub-style bar (top 5 + Other) */}
            <section className="lang-summary">
              <h3 className="github-subheading">Languages used</h3>

              {(() => {
                // Prefer byte-based aggregation, fall back to repo counts
                const raw =
                  data.languageBytes &&
                  Object.keys(data.languageBytes).length > 0
                    ? data.languageBytes
                    : data.languages || {};

                const entries = Object.entries(raw || {});
                if (entries.length === 0) {
                  return (
                    <p className="lang-empty">No language data available.</p>
                  );
                }

                const total = entries.reduce(
                  (sum, [, value]) => sum + value,
                  0
                );

                // Sort by usage descending
                const sorted = entries.sort((a, b) => b[1] - a[1]);

                // Keep top 5, aggregate the rest into "Other"
                const top = sorted.slice(0, 5);
                if (sorted.length > 5) {
                  const rest = sorted.slice(5);
                  const otherValue = rest.reduce(
                    (sum, [, value]) => sum + value,
                    0
                  );
                  if (otherValue > 0) {
                    top.push(["Other", otherValue]);
                  }
                }

                return (
                  <>
                    {/* Bar */}
                    <div className="lang-bar">
                      {top.map(([lang, value], idx) => {
                        const pct = total ? (value / total) * 100 : 0;
                        const color =
                          LANGUAGE_COLORS[lang] ||
                          FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

                        return (
                          <div
                            key={lang}
                            className="lang-bar-segment"
                            style={{
                              flex: value,
                              backgroundColor: color,
                            }}
                            title={`${lang} ${pct.toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <ul className="lang-legend">
                      {top.map(([lang, value], idx) => {
                        const pct = total ? (value / total) * 100 : 0;
                        const color =
                          LANGUAGE_COLORS[lang] ||
                          FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

                        return (
                          <li key={lang} className="lang-legend-item">
                            <span
                              className="lang-dot"
                              style={{ backgroundColor: color }}
                            />
                            <span className="lang-label">{lang}</span>
                            <span className="lang-percent">
                              {pct.toFixed(1)}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              })()}
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
                        ? r.langs.slice(0, 3)
                        : r.language
                        ? [r.language]
                        : [];

                    const primaryLang = displayLangs[0] || null;
                    const extraLangs = displayLangs.slice(1);

                    return (
                      <article key={r.id} className="repo-card">
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

                        {r.description && (
                          <p className="repo-desc">{r.description}</p>
                        )}

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

                        <div className="repo-meta">
                          {r.forks_count > 0 && (
                            <span>Forks {r.forks_count} · </span>
                          )}
                          <span>Updated {formatDate(r.updated_at)}</span>
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