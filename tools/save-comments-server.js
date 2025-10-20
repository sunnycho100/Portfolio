const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const OUT_DIR = path.join(__dirname, '..', 'saved-comments');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function safeFilename(name) {
  return (name || 'comment').replace(/[^a-z0-9\-_. ]/gi, '').replace(/\s+/g, '-').toLowerCase();
}

app.post('/save-comment', (req, res) => {
  const { name, comment } = req.body || {};
  const base = safeFilename(name || 'anon');
  const fname = `${base}-${Date.now()}.txt`;
  const full = path.join(OUT_DIR, fname);
  const payload = `Name: ${name || ''}\n\nComment:\n\n${comment || ''}\n`;
  fs.writeFile(full, payload, (err) => {
    if (err) {
      console.error('write error', err);
      return res.status(500).send('Write failed');
    }
    console.log('Saved', full);
    res.send('OK');
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Save-comments server running on http://localhost:${port}/ — output:${OUT_DIR}`));