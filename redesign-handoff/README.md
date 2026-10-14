# Redesign-Übergabe: „Was wir fahren“ + „Fahrer gesucht“

Freigegebener Entwurf aus dem Design-Canvas (v2). Diese Mappe enthält nur die
beiden Sektionen **#leistungen** und **#karriere**. Alles andere auf der Seite
bleibt, wie es ist.

| Datei | Inhalt |
|---|---|
| `sections.html` | Neues Markup für `<section id="leistungen">` und `<section id="karriere">` |
| `redesign.css` | CSS für beide Sektionen (Präfix `r-`, `svc-`, `kar-` …) |
| `redesign.js` | Zwei kleine Skripte: Bildwechsel in Leistungen, Einblenden beim Scrollen |
| `fotos.md` | Welche Originalfotos wie zugeschnitten und exportiert werden |

## Regeln
- Hero, Header, Entwurfs-Hinweis, „Unser Fuhrpark“, Standorte, Über uns,
  Kontakt, Footer, Scroll-Straße, `.thumb`-Leiste: **unverändert**.
- Nur Manrope und die bestehenden CI-Farben (`--navy`, `--blau`, `--tief`,
  `--hell`, `--text`, `--grau`). Keine neuen Inhalte, `.ph`-Platzhalter bleiben.
- Bewegung nur mit JS, nur beim Scrollen, aus bei `prefers-reduced-motion`.
  Ohne JS ist alles sofort sichtbar.
- Die Fotos aus `fotos-original/` sind für diese beiden Sektionen freigegeben.
