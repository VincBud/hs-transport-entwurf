# Regressionstest

Einmalig: `npm install` in diesem Ordner. Braucht das installierte Google Chrome.

- `node regression.mjs --referenz` – Ausgangszustand speichern (Screenshots bei 1920, 1440, 390, 360 an 16 Scrollpositionen plus Messwerte; Szenarien: vorwärts, rückwärts, schnell, Fenstergröße ändern, ohne JS, reduzierte Bewegung, Save-Data, 3G, CDN-Ausfall, Reload mitten in der Seite).
- Unter 768 px (390, 360) gibt es keine Video-Szene: dort zwei Positionen im Handy-Hero statt acht in der Bühne, und der Test schlägt unabhängig von der Referenz fehl, sobald am Handy ein Video oder das Hero-Poster angefragt wird.
- `node regression.mjs` – gegen die Referenz prüfen. Bericht in `out/bericht.txt`, Differenzbilder in `out/diff/`. Exit-Code 1 bei Abweichung.
- `node lighthouse.mjs vorher|nachher` – Lighthouse Desktop und Mobil (Median aus 3 Läufen) und Gesamtgewicht nach komplettem Durchscrollen.
- `node proben.mjs` – gezielte Proben zu einzelnen Audit-Befunden.
