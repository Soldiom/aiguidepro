// Simple Express proxy for AI news feeds to bypass CORS.
// Usage: node server/proxy.js (ensure you have express installed)
// Then set VITE_NEWS_PROXY_URL=http://localhost:4000/proxy in .env.local

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED = (process.env.ALLOWED_HOSTS || 'export.arxiv.org,ai.googleblog.com,openai.com,blogs.nvidia.com,thegradient.pub').split(',').map(s=>s.trim());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('Missing url');
  }
  try {
    const u = new URL(url);
    if (!ALLOWED.includes(u.host)) {
      return res.status(403).send('Host not allowed');
    }
    const r = await fetch(url);
    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.send(text);
  } catch (e) {
    res.status(500).send('Fetch failed');
  }
});

app.listen(PORT, () => {
  console.log('Proxy running on port', PORT);
});
