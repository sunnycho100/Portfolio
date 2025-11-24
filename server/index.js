const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_USERNAME = "sunnycho100";

app.get("/api/github/overview", async (req, res) => {
  try {
    const ghRes = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        params: { per_page: 100, sort: "updated" },
        headers: {
          "User-Agent": "portfolio-backend",
        },
      }
    );

    const repos = ghRes.data;

    // For each repo, also fetch its language breakdown
    const simplified = await Promise.all(
      repos.map(async (r) => {
        let langs = [];
        let langBytes = [];

        try {
          const langRes = await axios.get(r.languages_url, {
            headers: { "User-Agent": "portfolio-backend" },
          });

          const entries = Object.entries(langRes.data); // [ [lang, bytes], ... ]
          entries.sort((a, b) => b[1] - a[1]);
          langBytes = entries.map(([name, bytes]) => ({ name, bytes }));
          langs = langBytes.map((lb) => lb.name);
        } catch (err) {
          console.error("Languages error for", r.name, err.message);
        }

        return {
          id: r.id,
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language, // primary language
          langs,                // language names ordered by usage
          langBytes,            // [{ name, bytes }]
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at,
        };
      })
    );

    // Count how many repos use each primary language (for reference)
    const languages = {};
    // Sum total bytes per language across all repos (for the bar)
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

    res.json({
      username: GITHUB_USERNAME,
      repos: simplified,
      languages,      // repo counts by primary language
      languageBytes,  // total bytes per language across all repos
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