// Gezielte Proben für einzelne Audit-Befunde (kein Regressionsvergleich).
//   node proben.mjs
import { chromium } from 'playwright-core';
import { starteServer } from './server.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const HIER = path.dirname(new URL(import.meta.url).pathname);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const server = await starteServer();
const URL_ = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
const CACHE = path.join(HIER, '.cache');

async function seite(vp, { videoVerzoegerung = 0, init } = {}) {
  const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, isMobile: vp[0] < 900, hasTouch: vp[0] < 900 });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (route) => {
    const key = crypto.createHash('sha1').update(route.request().url()).digest('hex');
    const d = path.join(CACHE, key);
    if (fs.existsSync(d)) return route.fulfill({ status: 200, headers: JSON.parse(fs.readFileSync(d + '.json', 'utf8')), body: fs.readFileSync(d) });
    return route.continue();
  });
  if (videoVerzoegerung) await ctx.route(/\.mp4/, async (r) => { await new Promise((ok) => setTimeout(ok, videoVerzoegerung)); r.continue(); });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  return { ctx, page };
}
const warte = (p, ms) => p.waitForTimeout(ms);
const js = (p) => p.waitForFunction(() => document.documentElement.classList.contains('js-szene') && document.querySelector('.film').classList.contains('bereit') && document.querySelector('.film').readyState >= 2, null, { timeout: 30000 });
const out = {};

// 1) Reload mitten in der Seite, dann zurück in die Hero-Bühne.
for (const vp of [[1440, 900], [390, 844]]) {
  const { ctx, page } = await seite(vp);
  await page.goto(URL_); await js(page); await warte(page, 500);
  const k = await page.evaluate(() => document.getElementById('karriere').offsetTop);
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), k); await warte(page, 1200);
  await page.reload(); await js(page); await warte(page, 2000);
  const nachReload = await page.evaluate(() => ({ y: scrollY, t: document.querySelector('.film').currentTime }));
  const ende = await page.evaluate(() => { const b = document.querySelector('.szene-buehne'); return b.getBoundingClientRect().top + scrollY + b.offsetHeight - innerHeight; });
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), ende); await warte(page, 2000);
  const zurueck = await page.evaluate(() => ({ y: scrollY, t: document.querySelector('.film').currentTime,
    etik: [...document.querySelectorAll('.etikett')].map((e) => getComputedStyle(e).opacity).join(',') }));
  out['reload-' + vp[0]] = { nachReload, zurueckAmBuehnenende: zurueck };
  await ctx.close();
}

// 2) Video kommt spät (4 s), Nutzer ist schon weiter unten: springt der Inhalt?
for (const vp of [[1440, 900], [390, 844]]) {
  const { ctx, page } = await seite(vp, { videoVerzoegerung: 4000 });
  await page.goto(URL_, { waitUntil: 'domcontentloaded' }); await warte(page, 800);
  const ziel = await page.evaluate(() => document.getElementById('leistungen').offsetTop);
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), ziel); await warte(page, 300);
  const vor = await page.evaluate(() => ({ y: scrollY, leistungenImViewport: Math.round(document.getElementById('leistungen').getBoundingClientRect().top) }));
  await js(page); await warte(page, 1500);
  const nach = await page.evaluate(() => ({ y: scrollY, leistungenImViewport: Math.round(document.getElementById('leistungen').getBoundingClientRect().top) }));
  out['spaetesVideo-' + vp[0]] = { vor, nach, sprungPx: nach.leistungenImViewport - vor.leistungenImViewport };
  await ctx.close();
}

// 3) Haltepunkte oben unsichtbar, aber klick- und fokussierbar?
{
  const { ctx, page } = await seite([1440, 900]);
  await page.goto(URL_); await js(page); await warte(page, 800);
  const r = await page.evaluate(() => {
    const a = [...document.querySelectorAll('.halte a')];
    const treffer = a.map((x) => { const b = x.getBoundingClientRect(); const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return el && el.closest('.halte a') === x; });
    return { halteDeckkraft: getComputedStyle(document.querySelector('.halte')).opacity, klickbar: treffer, sichtbarkeit: getComputedStyle(a[0]).visibility };
  });
  // Tab-Reihenfolge: wann landet der Fokus in .halte?
  const tabs = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => { const e = document.activeElement; return (e.closest('.halte') ? 'HALTE ' : '') + (e.textContent || '').trim().slice(0, 24) + ' @' + Math.round(e.getBoundingClientRect().top); });
    tabs.push(f);
  }
  out.haltepunkteOben = { ...r, tabFolge: tabs };
  await ctx.close();
}

// 4) Layout-Arbeit pro Scroll-Frame (Desktop, nach dem Hero).
for (const vp of [[1440, 900], [390, 844]]) {
  const { ctx, page } = await seite(vp);
  await page.goto(URL_); await js(page); await warte(page, 800);
  const cdp = await ctx.newCDPSession(page); await cdp.send('Performance.enable');
  const start = await page.evaluate(() => document.getElementById('leistungen').offsetTop);
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), start); await warte(page, 1500);
  const m = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
  const a = await m();
  const frames = await page.evaluate(async (start) => {
    let n = 0;
    for (let i = 0; i < 120; i++) { scrollTo({ top: start + i * 25, behavior: 'instant' }); await new Promise((ok) => requestAnimationFrame(ok)); n++; }
    return n;
  }, start);
  const b = await m();
  out['scrollkosten-' + vp[0]] = { frames, layoutsProFrame: +((b.LayoutCount - a.LayoutCount) / frames).toFixed(2),
    styleRecalcsProFrame: +((b.RecalcStyleCount - a.RecalcStyleCount) / frames).toFixed(2),
    layoutMsProFrame: +(((b.LayoutDuration - a.LayoutDuration) * 1000) / frames).toFixed(3),
    scriptMsProFrame: +(((b.ScriptDuration - a.ScriptDuration) * 1000) / frames).toFixed(3) };
  await ctx.close();
}

// 5) Mobile Adressleiste: nur die Höhe ändert sich um 60 px - baut der Hero neu auf?
{
  const zaehler = () => {
    let g; window.__neu = 0;
    Object.defineProperty(window, 'gsap', { configurable: true, get() { return g; }, set(v) {
      const t = v.timeline.bind(v); v.timeline = function (o) { if (o && o.scrollTrigger) window.__neu++; return t(o); }; g = v; } });
  };
  const { ctx, page } = await seite([390, 844], { init: zaehler });
  await page.goto(URL_); await js(page); await warte(page, 1000);
  const y = await page.evaluate(() => { const b = document.querySelector('.szene-buehne'); return Math.round(b.getBoundingClientRect().top + scrollY + (b.offsetHeight - innerHeight) * 0.7); });
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y); await warte(page, 1500);
  const vor = await page.evaluate(() => window.__neu);
  for (const h of [784, 844, 784, 844]) { await page.setViewportSize({ width: 390, height: h }); await warte(page, 400); }
  await warte(page, 800);
  out.adressleiste = { aufbautenVorher: vor, aufbautenNachVierHoehenwechseln: await page.evaluate(() => window.__neu) };
  await ctx.close();
}

await browser.close(); server.close();
fs.writeFileSync(path.join(HIER, 'out', 'proben.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
