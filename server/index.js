// server/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// security and robustness: CORS + tight body size limits
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// quick health check
app.get("/health", (req, res) => res.send("ok"));

// Your GitHub username
const GITHUB_USERNAME = "sunnycho100";

// Optional token to reduce rate limiting
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// consistent headers for GitHub API calls
function githubHeaders() {
  const headers = {
    "User-Agent": "portfolio-backend",
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

// GET /api/github/overview
app.get("/api/github/overview", async (req, res) => {
  try {
    // 1) repos
    const ghRes = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      { params: { per_page: 100, sort: "updated" }, headers: githubHeaders() }
    );
    const repos = ghRes.data;

    // 2) language breakdown per repo
    const simplified = await Promise.all(
      repos.map(async (r) => {
        let langs = [];
        let langBytes = [];

        try {
          if (r.languages_url) {
            const langRes = await axios.get(r.languages_url, {
              headers: githubHeaders(),
            });
            const entries = Object.entries(langRes.data);
            entries.sort((a, b) => b[1] - a[1]);
            langBytes = entries.map(([name, bytes]) => ({ name, bytes }));
            langs = langBytes.map((lb) => lb.name);
          }
        } catch (err) {
          console.error("Languages error for", r.name, err.message);
        }

        return {
          id: r.id,
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language || "Other",
          langs,
          langBytes,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at,
        };
      })
    );

    // 3) aggregate summaries
    const languages = {};
    const languageBytes = {};
    for (const r of simplified) {
      const primary = r.language || "Other";
      languages[primary] = (languages[primary] || 0) + 1;
      if (Array.isArray(r.langBytes)) {
        for (const lb of r.langBytes) {
          if (!lb.bytes) continue;
          languageBytes[lb.name] = (languageBytes[lb.name] || 0) + lb.bytes;
        }
      }
    }

    // 4) response
    res.json({
      username: GITHUB_USERNAME,
      repos: simplified,
      languages,
      languageBytes,
    });
  } catch (err) {
    console.error("GitHub API error:", err.response?.status, err.message);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});