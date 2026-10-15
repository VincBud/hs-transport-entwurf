// Lighthouse für Desktop und Mobil gegen den lokalen Server (echtes Netz für
// Google Fonts und CDN). Ergebnis: out/lighthouse-<name>.json und eine Kurzfassung.
//   node lighthouse.mjs [name]      name z. B. "vorher" oder "nachher"
// Zusätzlich: Gesamtgewicht nach komplettem Durchscrollen (Playwright).
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { starteServer } from './server.mjs';

const HIER = path.dirname(new URL(import.meta.url).pathname);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const NAME = process.argv[2] || 'lauf';
const LAEUFE = 3;
fs.mkdirSync(path.join(HIER, 'out'), { recursive: true });

const server = await starteServer();
const URL_ = `http://127.0.0.1:${server.address().port}/index.html`;
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

const kurz = {};
for (const form of ['mobile', 'desktop']) {
  const runs = [];
  for (let i = 0; i < LAEUFE; i++) {
    const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ['--headless=new', '--no-first-run'] });
    const cfg = form === 'desktop'
      ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : { extends: 'lighthouse:default' };
    const r = await lighthouse(URL_, { port: chrome.port, output: 'json', logLevel: 'error' }, cfg);
    await chrome.kill();
    runs.push(r.lhr);
  }
  const lhr = runs[0];
  fs.writeFileSync(path.join(HIER, 'out', `lighthouse-${NAME}-${form}.json`), JSON.stringify(lhr));
  const a = (id) => median(runs.map((l) => l.audits[id].numericValue || 0));
  kurz[form] = {
    performance: median(runs.map((l) => Math.round(l.categories.performance.score * 100))),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    FCP_ms: Math.round(a('first-contentful-paint')), LCP_ms: Math.round(a('largest-contentful-paint')),
    TBT_ms: Math.round(a('total-blocking-time')), CLS: +a('cumulative-layout-shift').toFixed(3),
    SI_ms: Math.round(a('speed-index')), gewicht_kB: Math.round(a('total-byte-weight') / 1024),
    renderBlocking: (lhr.audits['render-blocking-resources'].details?.items || lhr.audits['render-blocking-insight']?.details?.items || []).map((x) => x.url),
    fehlgeschlagen: Object.values(lhr.audits).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && x.scoreDisplayMode !== 'manual')
      .map((x) => `${x.id}: ${x.displayValue || x.score}`),
  };
}

// Gesamtgewicht beim kompletten Durchscrollen, je Viewport.
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const vp of [{ n: '1440', w: 1440, h: 900, m: false }, { n: '390', w: 390, h: 844, m: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  const bytes = {};
  cdp.on('Network.loadingFinished', (e) => { bytes[e.requestId] = (bytes[e.requestId] || 0) + e.encodedDataLength; });
  const typ = {};
  cdp.on('Network.responseReceived', (e) => { typ[e.requestId] = e.type + ' ' + e.response.url.split('/').pop().slice(0, 40); });
  await page.goto(URL_, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60); }
  await page.waitForTimeout(2500);
  const proTyp = {};
  for (const [id, b] of Object.entries(bytes)) { const t = (typ[id] || 'Other').split(' ')[0]; proTyp[t] = (proTyp[t] || 0) + b; }
  kurz['durchgescrollt-' + vp.n] = { gesamt_kB: Math.round(Object.values(bytes).reduce((a, b) => a + b, 0) / 1024),
    proTyp_kB: Object.fromEntries(Object.entries(proTyp).map(([k, v]) => [k, Math.round(v / 1024)])) };
  await ctx.close();
}
await browser.close(); server.close();
fs.writeFileSync(path.join(HIER, 'out', `lighthouse-${NAME}.json`), JSON.stringify(kurz, null, 1));
console.log(JSON.stringify(kurz, null, 1));
