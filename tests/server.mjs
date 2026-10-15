// Kleiner statischer Server für die Tests: liefert das Repo-Verzeichnis aus,
// beherrscht Range-Anfragen (nötig, damit Chrome im Video springen kann) und
// gzip für Text, wie GitHub Pages.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

// HS_WURZEL: anderes Verzeichnis ausliefern (z. B. einen Schnappschuss eines Commits).
const WURZEL = path.resolve(process.env.HS_WURZEL || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4',
  '.txt': 'text/plain', '.woff2': 'font/woff2',
};
const TEXT = /^(text\/|application\/json|image\/svg)/;

export function starteServer(port = 0) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let datei = path.join(WURZEL, decodeURIComponent(url.pathname));
    if (!datei.startsWith(WURZEL)) { res.writeHead(403).end(); return; }
    if (datei.endsWith(path.sep)) datei = path.join(datei, 'index.html');
    fs.stat(datei, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404).end('404'); return; }
      const typ = TYPEN[path.extname(datei)] || 'application/octet-stream';
      const kopf = { 'Content-Type': typ, 'Accept-Ranges': 'bytes', 'Cache-Control': 'max-age=600' };
      const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
      if (range) {
        const start = range[1] ? +range[1] : st.size - +range[2];
        const ende = range[1] && range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
        if (start >= st.size) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }).end(); return; }
        res.writeHead(206, { ...kopf, 'Content-Range': `bytes ${start}-${ende}/${st.size}`, 'Content-Length': ende - start + 1 });
        fs.createReadStream(datei, { start, end: ende }).pipe(res);
        return;
      }
      if (TEXT.test(typ) && /gzip/.test(req.headers['accept-encoding'] || '')) {
        res.writeHead(200, { ...kopf, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
        fs.createReadStream(datei).pipe(zlib.createGzip()).pipe(res);
        return;
      }
      res.writeHead(200, { ...kopf, 'Content-Length': st.size });
      fs.createReadStream(datei).pipe(res);
    });
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = await starteServer(+process.argv[2] || 8123);
  console.log('http://127.0.0.1:' + s.address().port + '/');
}
