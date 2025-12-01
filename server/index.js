// server/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

const app = express();

// tighten body limits to mitigate DoS
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// allow your local React dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// ----------------- GitHub overview (yours, unchanged) -----------------
const GITHUB_USERNAME = "sunnycho100";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function githubHeaders() {
  const headers = {
    "User-Agent": "portfolio-backend",
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

app.get("/api/github/overview", async (req, res) => {
  try {
    const ghRes = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      { params: { per_page: 100, sort: "updated" }, headers: githubHeaders() }
    );

    const repos = ghRes.data;

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

    res.json({ username: GITHUB_USERNAME, repos: simplified, languages, languageBytes });
  } catch (err) {
    console.error("GitHub API error:", err.response?.status, err.message);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

// ----------------- Comments API -----------------
const CommentInput = z.object({
  name: z.string().trim().min(1).max(120),
  relationship: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(500),
});

// health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// list comments, newest first
app.get("/api/comments", async (req, res) => {
  try {
    const take = Math.min(Number(req.query.take) || 20, 100);
    const data = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// create a comment
app.post("/api/comments", async (req, res) => {
  const parsed = CommentInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  const { name, relationship, message } = parsed.data;

  try {
    const created = await prisma.comment.create({
      data: {
        name,
        relationship: relationship && relationship.length ? relationship : null,
        message,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});