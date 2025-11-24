const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// change this if your GitHub username changes
const GITHUB_USERNAME = "sunnycho100";

/**
 * GET /api/github/overview
 *
 * Returns:
 * - list of repos with key info
 * - language usage summary (count of repos per language)
 */
app.get("/api/github/overview", async (req, res) => {
  try {
    const ghRes = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        params: { per_page: 100, sort: "updated" },
        headers: {
          "User-Agent": "portfolio-backend",
          // if you later add a token, you can add:
          // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        },
      }
    );

    const repos = ghRes.data;

    // pick out fields we care about
    const simplified = await Promise.all(
  repos.map(async (r) => {
    let langs = [];

    try {
      // GitHub gives you r.languages_url, use it
      const langRes = await axios.get(r.languages_url, {
        headers: {
          "User-Agent": "portfolio-backend",
        },
      });

      const entries = Object.entries(langRes.data); // { JS: bytes, CSS: bytes, ... }
      entries.sort((a, b) => b[1] - a[1]);         // sort by bytes desc
      langs = entries.map(([name]) => name);       // keep only language names
    } catch (err) {
      console.error("Languages error for", r.name, err.message);
    }

    return {
      id: r.id,
      name: r.name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,      // primary language from GitHub
      langs,                     // all languages for this repo, sorted by usage
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      updated_at: r.updated_at,
    };
  })
);
    const languages = {};
    for (const r of simplified) {
        const lang = r.language || "Other";
        languages[lang] = (languages[lang] || 0) + 1;
    }

    res.json({
      username: GITHUB_USERNAME,
      repos: simplified,
      languages,
    });
  } catch (err) {
    console.error("GitHub API error:", err.response?.status, err.message);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});