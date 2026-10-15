// Regressionstest für index.html.
//   node regression.mjs --referenz   Ausgangszustand als Referenz speichern
//   node regression.mjs              gegen die Referenz prüfen (Exit-Code 1 bei Abweichung)
//   Optionen: --nur=1440,390   nur diese Viewports   --szenarien=standard,nojs   Auswahl
//
// Externe Dateien (Google Fonts, GSAP vom CDN) werden beim ersten Lauf in .cache/
// abgelegt und danach von dort ausgeliefert - so hängt das Ergebnis nicht am Netz.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { starteServer } from './server.mjs';

const HIER = path.dirname(new URL(import.meta.url).pathname);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const arg = (n) => (process.argv.find((a) => a.startsWith('--' + n + '=')) || '').split('=')[1];
const REFERENZ = process.argv.includes('--referenz');
const ZIEL = path.join(HIER, REFERENZ ? 'referenz' : 'out/aktuell');
const REF = path.join(HIER, 'referenz');
const CACHE = path.join(HIER, '.cache');

// Toleranzen. Pixel: Anteil abweichender Pixel je Bild (Video-Dekoder und
// Kantenglättung schwanken minimal). Messwerte: absolute Abweichung.
const TOL = { pixelAnteil: 0.002, px: 1.5, zeit: 0.06, winkel: 0.6, deckkraft: 0.02 };

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080, mobil: false },
  { name: '1440', width: 1440, height: 900, mobil: false },
  { name: '390', width: 390, height: 844, mobil: true },
  { name: '360', width: 360, height: 800, mobil: true },
].filter((v) => !arg('nur') || arg('nur').split(',').includes(v.name));
const SZENARIEN = (arg('szenarien') || 'standard,rueckwaerts,schnell,groesse,nojs,ruhig,savedata,langsam,cdn,reload').split(',');

fs.rmSync(ZIEL, { recursive: true, force: true });
fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

const server = await starteServer();
const BASIS = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = await chromium.launch({ executablePath: CHROME, headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });

// ---------- Hilfen ----------
async function cacheRoute(context, { cdnSperren = false } = {}) {
  // GSAP-Ausfall gilt für CDN und lokale Kopie gleichermaßen.
  if (cdnSperren) await context.route(/gsap|ScrollTrigger/, (route) => route.abort('failed'));
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (route) => {
    const url = route.request().url();
    if (cdnSperren && /gsap|ScrollTrigger/.test(url)) return route.abort('failed');
    const key = crypto.createHash('sha1').update(url).digest('hex');
    const datei = path.join(CACHE, key);
    if (fs.existsSync(datei)) {
      const meta = JSON.parse(fs.readFileSync(datei + '.json', 'utf8'));
      return route.fulfill({ status: 200, headers: meta, body: fs.readFileSync(datei) });
    }
    const antwort = await route.fetch();
    const body = await antwort.body();
    const kopf = { 'content-type': antwort.headers()['content-type'] || 'application/octet-stream',
                   'access-control-allow-origin': '*' };
    fs.writeFileSync(datei, body);
    fs.writeFileSync(datei + '.json', JSON.stringify(kopf));
    return route.fulfill({ status: antwort.status(), headers: kopf, body });
  });
}

async function neueSeite(vp, opt = {}) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1,
    isMobile: vp.mobil, hasTouch: vp.mobil, javaScriptEnabled: opt.js !== false,
    reducedMotion: opt.ruhig ? 'reduce' : 'no-preference',
  });
  await cacheRoute(context, opt);
  if (opt.netz) {
    await context.addInitScript((netz) => {
      Object.defineProperty(Navigator.prototype, 'connection', { configurable: true,
        get() { return { saveData: !!netz.saveData, effectiveType: netz.effectiveType || '4g',
                         addEventListener() {}, removeEventListener() {} }; } });
    }, opt.netz);
  }
  const page = await context.newPage();
  const log = { fehler: [], konsole: [], anfragenFehler: [] };
  page.on('pageerror', (e) => log.fehler.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.konsole.push(m.type() + ': ' + m.text()); });
  page.on('requestfailed', (r) => log.anfragenFehler.push(r.url().replace(/^http:\/\/127\.0\.0\.1:\d+/, '') + ' ' + (r.failure() || {}).errorText));
  return { context, page, log };
}

async function laden(page, opt = {}) {
  await page.goto(BASIS, { waitUntil: 'load' });
  if (opt.js !== false) {
    await page.evaluate(() => document.fonts.ready);
    if (opt.videoErwartet) {
      await page.waitForFunction(() => document.documentElement.classList.contains('js-szene') && document.querySelector('.film').classList.contains('bereit') && document.querySelector('.film').readyState >= 2, null, { timeout: 30000 });
    }
  }
  await page.mouse.move(1, 1).catch(() => {});
  await page.waitForTimeout(600);
}

async function scrollen(page, y) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
}

// Wartet, bis Scrub, Videosprung, Einblendungen und Bilder zur Ruhe gekommen sind.
async function ruhe(page, js = true) {
  await page.waitForTimeout(js ? 1500 : 300);
  if (!js) return;
  let alt = null;
  for (let i = 0; i < 30; i++) {
    const z = await page.evaluate(() => {
      const f = document.querySelector('.film');
      const bilder = [...document.images].filter((b) => {
        const r = b.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && r.width > 0 && getComputedStyle(b).display !== 'none';
      });
      return JSON.stringify({ t: f ? +f.currentTime.toFixed(3) : 0, s: f ? f.seeking : false,
                              b: bilder.every((b) => b.complete), y: scrollY });
    });
    const o = JSON.parse(z);
    if (z === alt && !o.s && o.b) break;
    alt = z;
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
}

// Alle Messwerte an der aktuellen Position.
async function messen(page) {
  return page.evaluate(() => {
    const r1 = (n) => Math.round(n * 10) / 10;
    const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [r1(r.x), r1(r.y), r1(r.width), r1(r.height)]; };
    const cs = (el) => el ? getComputedStyle(el) : null;
    const f = document.querySelector('.film');
    const winkel = (el) => {
      if (!el) return null;
      const m = /rotate\((-?[\d.]+)deg\)/.exec(el.style.transform || '');
      const t = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(el.style.transform || '');
      return { sichtbar: cs(el).display !== 'none', x: t ? r1(+t[1]) : null, y: t ? r1(+t[2]) : null, w: m ? +m[1] : null };
    };
    const de = document.documentElement;
    return {
      scrollY: Math.round(scrollY), docH: de.scrollHeight,
      ueberlauf: de.scrollWidth - de.clientWidth,
      klassen: ['js-szene', 'rv-on', 'js-svc'].filter((k) => de.classList.contains(k)),
      video: f ? { src: (f.currentSrc || '').split('/').pop(), t: +f.currentTime.toFixed(3),
                   bereit: f.classList.contains('bereit'), rs: f.readyState } : null,
      poster: rect(document.querySelector('.poster')),
      kopfText: { o: +cs(document.querySelector('.szene-ui')).opacity, r: rect(document.querySelector('.szene-ui')) },
      // Unsichtbare Elemente: nur Zustand, keine Lage (deren Startversatz ist bedeutungslos).
      titel: (() => { const t = document.querySelector('.gang-titel'); const v = cs(t).visibility;
        return { o: +cs(t).opacity, v, r: v === 'hidden' ? null : rect(t) }; })(),
      etiketten: [...document.querySelectorAll('.etikett')].map((e) => { const v = cs(e).visibility;
        return { o: +(+cs(e).opacity).toFixed(3), v, r: v === 'hidden' ? null : rect(e), tf: v === 'hidden' ? null : cs(e).transform }; }),
      strasse: (() => {
        const s = document.querySelector('.strasse');
        return { sichtbar: s.classList.contains('sichtbar'), anzeige: cs(s).display,
                 lkw: winkel(document.querySelector('.strasse-lkw')),
                 haenger: winkel(document.querySelector('.strasse-haenger')),
                 offset: r1(parseFloat(document.querySelector('.strasse-bahn .gefahren').style.strokeDashoffset) || 0) };
      })(),
      halte: [...document.querySelectorAll('.halte a')].map((a) => ({
        ziel: a.dataset.ziel, erreicht: a.classList.contains('erreicht'),
        x: r1(parseFloat(a.style.left) || 0), y: r1(parseFloat(a.style.top) || 0) })),
      svcAktiv: [...document.querySelectorAll('.svc-i')].findIndex((e) => e.classList.contains('on')),
      eingeblendet: document.querySelectorAll('.rv.in, .cur.in').length,
      abschnitte: Object.fromEntries(['inhalt', 'leistungen', 'karriere', 'standorte', 'ueber-uns', 'kontakt']
        .map((id) => [id, document.getElementById(id) ? Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY) : null])),
    };
  });
}

// Scrollpositionen: acht in der Hero-Bühne, dann jeder Abschnitt und das Seitenende.
async function positionen(page) {
  return page.evaluate(() => {
    const b = document.querySelector('.szene-buehne');
    const max = document.documentElement.scrollHeight - innerHeight;
    const start = Math.max(0, b.getBoundingClientRect().top + scrollY);
    const weg = Math.max(0, b.offsetHeight - innerHeight);
    const p = [];
    [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.88, 1].forEach((f, i) => p.push({ name: 'hero-' + i, y: Math.round(start + weg * f) }));
    const top = (s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY);
    p.push({ name: 'zahlen', y: top('.zahlen') - 40 });
    p.push({ name: 'leistungen', y: top('#leistungen') });
    p.push({ name: 'leistungen-mitte', y: top('#leistungen') + Math.round(document.querySelector('#leistungen').offsetHeight * 0.5) });
    p.push({ name: 'karriere', y: top('#karriere') });
    p.push({ name: 'standorte', y: top('#standorte') });
    p.push({ name: 'ueber-uns', y: top('#ueber-uns') });
    p.push({ name: 'kontakt', y: top('#kontakt') });
    p.push({ name: 'ende', y: max });
    return p.map((x) => ({ ...x, y: Math.min(max, Math.max(0, x.y)) }));
  });
}

const ergebnis = {};
function speichere(id, daten) { ergebnis[id] = daten; }
async function bild(page, id) {
  const datei = path.join(ZIEL, id + '.png');
  await page.screenshot({ path: datei, animations: 'allow', caret: 'hide' });
}

// ---------- Szenarien ----------
async function standard(vp) {
  const { context, page, log } = await neueSeite(vp);
  await laden(page, { videoErwartet: true });
  const pos = await positionen(page);
  const werte = {};
  for (const p of pos) {
    await scrollen(page, p.y); await ruhe(page);
    werte[p.name] = await messen(page);
    await bild(page, `${vp.name}-standard-${p.name}`);
  }
  speichere(`${vp.name}-standard`, { positionen: pos, werte, log });
  await context.close();
  return pos;
}

async function rueckwaerts(vp, pos) {
  const { context, page, log } = await neueSeite(vp);
  await laden(page, { videoErwartet: true });
  await scrollen(page, pos[pos.length - 1].y); await ruhe(page);
  const werte = {};
  for (const p of [...pos].reverse()) {
    await scrollen(page, p.y); await ruhe(page);
    werte[p.name] = await messen(page);
    if (p.name.startsWith('hero')) await bild(page, `${vp.name}-rueckwaerts-${p.name}`);
  }
  speichere(`${vp.name}-rueckwaerts`, { werte, log });
  await context.close();
}

async function schnell(vp, pos) {
  const { context, page, log } = await neueSeite(vp);
  await laden(page, { videoErwartet: true });
  const ende = pos[pos.length - 1].y;
  // 60 Sprünge à 16 ms bis zum Ende, dann zurück in die Bühnenmitte.
  for (let i = 1; i <= 60; i++) { await scrollen(page, Math.round(ende * i / 60)); await page.waitForTimeout(16); }
  await ruhe(page);
  const werte = { ende: await messen(page) };
  const mitte = pos.find((p) => p.name === 'hero-4');
  for (let i = 1; i <= 30; i++) { await scrollen(page, Math.round(ende - (ende - mitte.y) * i / 30)); await page.waitForTimeout(16); }
  await ruhe(page);
  werte['hero-4'] = await messen(page);
  await bild(page, `${vp.name}-schnell-hero-4`);
  speichere(`${vp.name}-schnell`, { werte, log });
  await context.close();
}

async function groesse(vp, pos) {
  const { context, page, log } = await neueSeite(vp);
  await laden(page, { videoErwartet: true });
  const p = pos.find((x) => x.name === 'hero-5');
  await scrollen(page, p.y); await page.waitForTimeout(150);
  const andere = vp.mobil ? { width: vp.width + 40, height: vp.height - 120 } : { width: 1100, height: 760 };
  await page.setViewportSize(andere); await page.waitForTimeout(80);
  await scrollen(page, p.y + 120); await page.waitForTimeout(80);
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(500);
  await scrollen(page, p.y); await ruhe(page);
  const werte = { 'hero-5': await messen(page) };
  await bild(page, `${vp.name}-groesse-hero-5`);
  speichere(`${vp.name}-groesse`, { werte, log });
  await context.close();
}

async function ohneVideo(vp, name, opt, schnappschuesse) {
  const { context, page, log } = await neueSeite(vp, opt);
  await laden(page, opt);
  const werte = {};
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const ziele = await page.evaluate(() => ['leistungen', 'karriere', 'standorte', 'kontakt']
    .map((id) => Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY)));
  const liste = [['oben', 0], ['leistungen', ziele[0]], ['karriere', ziele[1]], ['standorte', ziele[2]], ['kontakt', ziele[3]], ['ende', max]];
  for (const [n, y] of liste) {
    await scrollen(page, Math.min(max, y)); await ruhe(page, opt.js !== false);
    werte[n] = opt.js === false ? await page.evaluate(() => ({ scrollY: Math.round(scrollY), docH: document.documentElement.scrollHeight,
      ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth })) : await messen(page);
    if (schnappschuesse.includes(n)) await bild(page, `${vp.name}-${name}-${n}`);
  }
  speichere(`${vp.name}-${name}`, { werte, log });
  await context.close();
}

async function reload(vp, pos) {
  const { context, page, log } = await neueSeite(vp);
  await laden(page, { videoErwartet: true });
  const p = pos.find((x) => x.name === 'karriere');
  await scrollen(page, p.y); await ruhe(page);
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.documentElement.classList.contains('js-szene') && document.querySelector('.film').classList.contains('bereit') && document.querySelector('.film').readyState >= 2, null, { timeout: 30000 }).catch(() => {});
  await ruhe(page);
  const werte = { karriere: await messen(page) };
  await bild(page, `${vp.name}-reload-karriere`);
  speichere(`${vp.name}-reload`, { werte, log });
  await context.close();
}

const t0 = Date.now();
for (const vp of VIEWPORTS) {
  process.stdout.write(`Viewport ${vp.name}: `);
  const pos = await standard(vp); process.stdout.write('standard ');
  if (SZENARIEN.includes('rueckwaerts')) { await rueckwaerts(vp, pos); process.stdout.write('rueckwaerts '); }
  if (SZENARIEN.includes('schnell')) { await schnell(vp, pos); process.stdout.write('schnell '); }
  if (SZENARIEN.includes('groesse')) { await groesse(vp, pos); process.stdout.write('groesse '); }
  if (SZENARIEN.includes('nojs')) { await ohneVideo(vp, 'nojs', { js: false }, ['oben', 'standorte', 'ende']); process.stdout.write('nojs '); }
  if (SZENARIEN.includes('ruhig')) { await ohneVideo(vp, 'ruhig', { ruhig: true }, ['oben', 'karriere', 'ende']); process.stdout.write('ruhig '); }
  if (SZENARIEN.includes('savedata')) { await ohneVideo(vp, 'savedata', { netz: { saveData: true } }, ['oben', 'leistungen']); process.stdout.write('savedata '); }
  if (SZENARIEN.includes('langsam')) { await ohneVideo(vp, 'langsam', { netz: { effectiveType: '3g' } }, ['oben']); process.stdout.write('langsam '); }
  if (SZENARIEN.includes('cdn')) { await ohneVideo(vp, 'cdn', { cdnSperren: true }, ['oben', 'leistungen']); process.stdout.write('cdn '); }
  if (SZENARIEN.includes('reload')) { await reload(vp, pos); process.stdout.write('reload '); }
  console.log();
}
await browser.close(); server.close();
fs.writeFileSync(path.join(ZIEL, 'messwerte.json'), JSON.stringify(ergebnis, null, 1));
console.log(`Fertig in ${Math.round((Date.now() - t0) / 1000)} s -> ${path.relative(process.cwd(), ZIEL)}`);
if (REFERENZ) process.exit(0);

// ---------- Vergleich ----------
const ref = JSON.parse(fs.readFileSync(path.join(REF, 'messwerte.json'), 'utf8'));
const abw = [];
function vergleiche(a, b, pfad) {
  if (typeof a === 'number' && typeof b === 'number') {
    const k = pfad.split('.').pop();
    const tol = k === 't' ? TOL.zeit : k === 'w' ? TOL.winkel : (k === 'o' ? TOL.deckkraft : TOL.px);
    if (Math.abs(a - b) > tol) abw.push(`${pfad}: ${b} -> ${a}`);
    return;
  }
  if (Array.isArray(a) && Array.isArray(b) && pfad.endsWith('.log.konsole')) {
    if (a.length > b.length) abw.push(`${pfad}: neue Meldungen ${JSON.stringify(a.filter((x) => !b.includes(x)))}`);
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (k === 'positionen' || k === 'anfragenFehler') continue;
      vergleiche(a[k], b[k], pfad + '.' + k);
    }
    return;
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) abw.push(`${pfad}: ${JSON.stringify(b)} -> ${JSON.stringify(a)}`);
}
for (const id of Object.keys(ergebnis)) vergleiche(ergebnis[id], ref[id], id);
for (const id of Object.keys(ergebnis)) {
  const neu = ergebnis[id].log.fehler.filter((f) => !(ref[id] ? ref[id].log.fehler : []).includes(f));
  if (neu.length) abw.push(`${id}: neue JS-Fehler ${JSON.stringify(neu)}`);
}

fs.mkdirSync(path.join(HIER, 'out/diff'), { recursive: true });
fs.rmSync(path.join(HIER, 'out/diff'), { recursive: true, force: true });
fs.mkdirSync(path.join(HIER, 'out/diff'), { recursive: true });
const bildAbw = [];
for (const datei of fs.readdirSync(ZIEL).filter((d) => d.endsWith('.png'))) {
  const rp = path.join(REF, datei);
  if (!fs.existsSync(rp)) { bildAbw.push(`${datei}: keine Referenz`); continue; }
  const a = PNG.sync.read(fs.readFileSync(path.join(ZIEL, datei)));
  const b = PNG.sync.read(fs.readFileSync(rp));
  if (a.width !== b.width || a.height !== b.height) { bildAbw.push(`${datei}: Größe ${b.width}x${b.height} -> ${a.width}x${a.height}`); continue; }
  const d = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 });
  const anteil = n / (a.width * a.height);
  if (anteil > TOL.pixelAnteil) {
    bildAbw.push(`${datei}: ${(anteil * 100).toFixed(2)} % Pixel abweichend`);
    fs.writeFileSync(path.join(HIER, 'out/diff', datei), PNG.sync.write(d));
  }
}
const bericht = [`Messwert-Abweichungen: ${abw.length}`, ...abw.slice(0, 200), '', `Bild-Abweichungen: ${bildAbw.length}`, ...bildAbw].join('\n');
fs.writeFileSync(path.join(HIER, 'out/bericht.txt'), bericht);
console.log(bericht.split('\n').slice(0, 60).join('\n'));
process.exit(abw.length || bildAbw.length ? 1 : 0);
