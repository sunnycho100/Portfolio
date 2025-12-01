require("dotenv").config();

// server/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

console.log("Token loaded:", !!process.env.GITHUB_TOKEN);
// testing

const app = express();
app.use(cors());
app.use(express.json());

// Your GitHub username
const GITHUB_USERNAME = "sunnycho100";

// Optional: personal access token to avoid rate limits
// Put it in a .env and load with dotenv if you want
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Small helper so headers are consistent
function githubHeaders() {
  const headers = {
    "User-Agent": "portfolio-backend",
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

// GET /api/github/overview
// Returns:
// {
//   username,
//   repos: [...],
//   languages: { JavaScript: 2, SystemVerilog: 1, ... },   // primary language counts
//   languageBytes: { JavaScript: 12345, CSS: 7890, ... }   // summed bytes across all repos
// }
app.get("/api/github/overview", async (req, res) => {
  try {
    // 1. Fetch all public repos
    const ghRes = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        params: { per_page: 100, sort: "updated" },
        headers: githubHeaders(),
      }
    );

    const repos = ghRes.data;

    // 2. For each repo, fetch language breakdown
    const simplified = await Promise.all(
      repos.map(async (r) => {
        let langs = [];
        let langBytes = [];

        try {
          if (r.languages_url) {
            const langRes = await axios.get(r.languages_url, {
              headers: githubHeaders(),
            });

            const entries = Object.entries(langRes.data); // [ [lang, bytes], ... ]
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
          language: r.language || "Other", // primary language
          langs,                            // list of languages sorted by bytes
          langBytes,                        // [{ name, bytes }]
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at,
        };
      })
    );

    // 3. Aggregate summaries
    const languages = {};      // count of repos by primary language
    const languageBytes = {};  // total bytes per language across all repos

    for (const r of simplified) {
      const primary = r.language || "Other";
      languages[primary] = (languages[primary] || 0) + 1;

      if (Array.isArray(r.langBytes)) {
        for (const lb of r.langBytes) {
          if (!lb.bytes) continue;
          languageBytes[lb.name] =
            (languageBytes[lb.name] || 0) + lb.bytes;
        }
      }
    }

    // 4. Send response
    res.json({
      username: GITHUB_USERNAME,
      repos: simplified,
      languages,
      languageBytes,
    });
  } catch (err) {
    console.error(
      "GitHub API error:",
      err.response?.status,
      err.message
    );
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});