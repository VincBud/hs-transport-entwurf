# Redesign-Übergabe: „Was wir fahren“, „Fahrer gesucht“, „Von wo wir fahren“

Freigegebener Entwurf aus dem Design-Canvas (v2). Diese Mappe enthält nur die
Sektionen **#leistungen**, **#karriere** und **#standorte**. Alles andere auf der
Seite bleibt, wie es ist.

| Datei | Inhalt |
|---|---|
| `sections.html` | Neues Markup für `<section id="leistungen">` und `<section id="karriere">` |
| `redesign.css` | CSS für beide Sektionen (Präfix `r-`, `svc-`, `kar-` …) |
| `redesign.js` | Zwei kleine Skripte: Bildwechsel in Leistungen, Einblenden beim Scrollen |
| `standorte.html` | Neues Markup für `<section id="standorte">` – Lagekarte als Inline-SVG statt Gliederzug-Zeichnung |
| `standorte.css` | CSS für die Standorte-Sektion (nach `redesign.css` einfügen) |
| `fotos.md` | Welche Originalfotos wie zugeschnitten und exportiert werden |

## Regeln
- Hero, Header, Entwurfs-Hinweis, „Unser Fuhrpark“, Über uns,
  Kontakt, Footer, Scroll-Straße, `.thumb`-Leiste: **unverändert**.
- Nur Manrope und die bestehenden CI-Farben (`--navy`, `--blau`, `--tief`,
  `--hell`, `--text`, `--grau`). Keine neuen Inhalte, `.ph`-Platzhalter bleiben.
- Bewegung nur mit JS, nur beim Scrollen, aus bei `prefers-reduced-motion`.
  Ohne JS ist alles sofort sichtbar.
- Die Fotos aus `fotos-original/` sind für diese beiden Sektionen freigegeben.

## Standorte: Entscheidung vom 14.10.2026
Die Gliederzug-Zeichnung (`bilder/lkw-seitenansicht-ohne-branding.svg`) fliegt aus
der Sektion. Ersatz ist eine Lagekarte (Gradnetz mit Main, Donau, schematischem
Alpenrand, Orientierungsstädten, Maßstab, Nordpfeil). Die SVG-Datei selbst bleibt
im Repo liegen, sie wird nur nicht mehr eingebunden. Die Abschnitte zur Zeichnung
in PRODUCT.md sind damit überholt.
