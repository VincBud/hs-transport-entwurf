# Redesign-Übergabe: „Was wir fahren“, „Fahrer gesucht“, „Von wo wir fahren“, „Über uns“

Freigegebener Entwurf aus dem Design-Canvas (v2). Diese Mappe enthält nur die
Sektionen **#leistungen**, **#karriere**, **#standorte** und **#ueber-uns**. Alles andere auf der
Seite bleibt, wie es ist.

| Datei | Inhalt |
|---|---|
| `sections.html` | Neues Markup für `<section id="leistungen">` und `<section id="karriere">` |
| `redesign.css` | CSS für beide Sektionen (Präfix `r-`, `svc-`, `kar-` …) |
| `redesign.js` | Zwei kleine Skripte: Bildwechsel in Leistungen, Einblenden beim Scrollen |
| `standorte.html` | Neues Markup für `<section id="standorte">` – Lagekarte als Inline-SVG statt Gliederzug-Zeichnung |
| `standorte.css` | CSS für die Standorte-Sektion (nach `redesign.css` einfügen) |
| `ueberuns.html` | Neues Markup für `<section id="ueber-uns">` – Zitat führt, Foto klein |
| `ueberuns.css` | CSS für Über uns (nach `standorte.css` einfügen) |
| `fotos.md` | Welche Originalfotos wie zugeschnitten und exportiert werden |

## Regeln
- Hero, Header, Entwurfs-Hinweis, „Unser Fuhrpark“,
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
in PRODUCT.md sind damit überholt. Unter der Karte steht bewusst **kein**
großes Bildband.

## Über uns: Entscheidung vom 14.10.2026
Das große Hochformat-Foto weicht einem großen Zitat mit deutschen
Anführungszeichen. Das Foto (vorhandene `bilder/ueberuns-*.webp`) steht klein
rechts daneben. Darunter eine Zeile mit Firmentext-Platzhalter, Geschäftsführung
und CS-Logistics-Hinweis.
