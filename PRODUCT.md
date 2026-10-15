# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Statisches HTML ohne Build-Schritt: alles in `index.html`, CSS und JS inline. Hosting auf GitHub Pages. **Keine externen Server** (seit 15.10.2026): Manrope (variabel, 400–800) und GSAP 3.13.0 liegen unverändert unter `vendor/` im Repo – keine IP-Übertragung an Google oder ein CDN (DSGVO, vgl. LG München I, 3 O 17493/20). Kein Server, also kein serverseitiges Formular-Backend. Interne Dateien (`PRODUCT.md`, `tests/`, `redesign-handoff/`, `README.md`) sind per `_config.yml` von Pages ausgenommen.

Regressionstest unter `tests/` (Playwright, Anleitung in `tests/README.md`): vor und nach jeder Änderung an Animation oder Layout laufen lassen.

## Users

**1. Fahrer und Disponenten (primär).** Berufskraftfahrer mit Klasse CE, bevorzugt mit Wechselbrückenerfahrung, sowie Disponent/innen im Güterkraftverkehr. Sie kommen überwiegend mobil und über Kleinanzeigen, WhatsApp und Instagram, oft einhändig und zwischen zwei Touren. Ihr Job auf der Seite: in wenigen Sekunden einschätzen, ob dieser Arbeitgeber einen Anruf wert ist, und sich dann ohne Anschreiben bewerben.

**2. Auftraggeber aus dem Systemverkehr (sekundär, aber geschäftstragend).** Disponenten und Einkäufer, die Linienkapazität für Wechselbrücken brauchen. Ihr Job: Zuverlässigkeit, Kapazität und Technik beurteilen und dann Kontakt aufnehmen.

Die Reihenfolge dieser beiden Ziele ist eine Arbeitsannahme von Vincent, von der Firma noch nicht bestätigt (siehe offene Punkte).

## Product Purpose

Website der HS Transport GmbH, Spedition mit Sitz in Siegsdorf. Zwei Ziele: Fahrer und Disponenten gewinnen, und bei Auftraggebern aus dem Systemverkehr Vertrauen aufbauen. Erfolg heißt: eine Bewerbung per WhatsApp oder Anruf, beziehungsweise eine Kontaktaufnahme durch einen Auftraggeber.

## Positioning

Spezialist für Wechselbrücken und Systemverkehr, nicht eine regionale Spedition für Einzeltransporte. Konkret: 30 LKW mit Euro-6-Motoren, Multiwechsler für 745er und 782er Wechselbrücken, Telematik mit laufender Standortortung und Analyse der Fahrzeugdaten, 24/7 erreichbar, täglicher Systemlinienverkehr, Kombiverkehr Schiene–Straße und nationales WAB-Trucking. Zwei Betriebsstätten statt eines Standorts. Das ist die Kombination, die eine Nachbar-Spedition nicht einfach behaupten kann.

## Operating Context

Der aktuelle Stand ist ein privater Entwurf von Vincent Fitsch, der später als Vorschlag an die Firma geht. Er bleibt bis dahin unindexiert (`noindex, nofollow` plus `robots.txt`-Disallow) und trägt ein sichtbares Hinweis-Banner, dass er nicht die offizielle Website ist. Impressum und Datenschutz liegen weiterhin auf der alten Seite h-s-transport.de und werden dorthin verlinkt.

Standorte: Firmensitz und Betriebsstätte Siegsdorf, Betriebsstätte Rodgau, zusätzliche Einsatzgebiete Altenstadt und Langgöns/Butzbach.

Offene Stellen:
- LKW-Fahrer mit Wechselbrückenerfahrung, Klasse CE, ab sofort, **an beiden Standorten: Siegsdorf und Rodgau**.
- Disponent/in (m/w/d) im Güterkraftverkehr, Klasse CE erwünscht, Siegsdorf, ab sofort.
- Zusätzlich Wechselbrückenfahrer für Nachteinsätze in Rodgau.

## Capabilities and Constraints

- Verifizierte Stammdaten: HS Transport GmbH, Gamstraße 16, 83313 Siegsdorf. Amtsgericht Traunstein, HRB 32007. Geschäftsführer Christoph Schnack.
- Kontakt: Telefon +49 8662 6682425, E-Mail info@h-s-transport.de (von der Firma als die Adresse für die Seite bestätigt), Instagram @hstransport_gmbh.
- Bewerbungskanal WhatsApp: +49 151 21217148 (https://wa.me/4915121217148). Muss mobil mit einem Daumen erreichbar sein.
- **CS Logistics** ist ein Einzelunternehmen des Gründers für Beratung und Vermittlung in Transport und Logistik. Es ist bewusst nachrangig: höchstens ein kurzer Hinweis im Über-uns-Bereich oder im Footer, **kein eigenes Logo in der Navigation** und keine eigene Sektion.
- Kein Backend: Auftraggeber-Formular läuft über `mailto:` und bleibt schlank (Firma, Ansprechpartner, Kontakt, Anliegen). Abhol- und Zielort-Felder sind gestrichen, sie gehören zum falschen Geschäftsmodell.
- Kein Google-Maps-Embed. Standorte als SVG-Karte oder Liste.
- Keine Bilder von der alten Seite hotlinken, keine Stockfotos. **Ausnahme seit 14.10.2026:** Für „Was wir fahren“ und „Fahrer gesucht“ sind die Fotos aus `fotos-original/` freigegeben; „Über uns“ nutzt die vorhandenen `bilder/ueberuns-*.webp`, „Von wo wir fahren“ hat bewusst kein Foto (Zuschnitte laut `redesign-handoff/fotos.md`). Fotos mit großen Fremdlogos (DHL, Dachser, Fercam, Lermer) und der Kühlauflieger bleiben draußen.
- Ton: direkt und bodenständig, Fahrer-Sprache statt Marketing-Floskeln. **Du** für Bewerber, **Sie** für Auftraggeber.
- **Keine Aussagen gegen Subunternehmer, Partner oder zugekaufte Kapazität** (Stand 08.10.2026). Subunternehmer sind in der Branche üblich, und HS Transport arbeitet selbst im Unternehmerverbund mit einem Partner. Formulierungen wie „keine zugekaufte Kapazität“, „kein Subunternehmer-Karussell“ oder „mit eigenen Fahrzeugen statt …“ sind damit ausgeschlossen. Der eigene Fuhrpark darf als Tatsache genannt werden, aber nicht als Abgrenzung.
- Für später vorbereitet, aber auskommentiert: JSON-LD für LocalBusiness (nicht MovingCompany – das hieße Umzugsunternehmen) und JobPosting für beide Stellen. Die JobPostings bleiben aus, bis die Firma Gehalt und Details liefert; die fehlenden Pflichtfelder stehen als Kommentar in `index.html`.

### Explizit unentschieden — nicht erfinden, als rosa Platzhalter `[so]` stehen lassen

- Butzbach oder Langgöns (die alte Seite widerspricht sich).
- Für welche Auftraggeber beziehungsweise Netzwerke gefahren wird.
- Was Fahrer konkret bekommen: Gehalt, Touren, Zeiten, Zuhause-Tage, Einarbeitung.
- Welche Vorteile die Disponenten-Stelle bietet.
- Firmengeschichte und Team-Text.
- Namentliche Ansprechpartner für Bewerbung und für Auftraggeber.
- Welches der beiden Ziele Vorrang hat: Fahrer gewinnen oder Aufträge gewinnen. Der Entwurf arbeitet bis zur Klärung mit Fahrern zuerst.
- Fotos für die übrigen Sektionen (über `fotos-original/` hinaus).
- Ob **alle 30 LKW Eigentum** der HS Transport GmbH sind oder ein Teil geleast, gemietet oder ueber den Unternehmerverbund gefahren wird. Bis zur Klaerung heisst es auf der Seite nur „30 LKW im Fuhrpark“, nicht „im eigenen Fuhrpark“.
- Farbe der eigenen Wechselbrücken. Arbeitsannahme bis zur Klärung: hellgrau-weißer Kofferaufbau mit Schriftzug in Navy `#2A3977`.
- Inhalte der fünf Ladeetiketten im Laderaum der Eröffnungsszene (Leistung 01–05; zwei davon noch mit Platzhaltern).
- ~~Scroll-Straße am rechten Rand~~ — gebaut. Stand im Abschnitt „Bauplan Scroll-Straße" am Ende dieser Datei.

## Brand Commitments

- Name: HS Transport GmbH. Slogan: „Kollegialität & Fairness wird bei uns groß geschrieben".
- **Echte CI, am 07.10.2026 aus h-s-transport.de ausgelesen** (Joomla/T4-Template `hs_transport`, `:root` in `/media/t4/css/15.css`): Primärblau `#2748AC`, Linkhover `#092579`, Überschriften und Footer `#201F1E`, Fließtext `#4F4F4F`, Seitengrund `#FFFFFF`, Creme `#FEFCE6` (konfiguriert, aber auf der Seite nirgends verwendet). Schrift: **Manrope**, Gewichte 200–800, für Text und Überschriften. **Die CI hat kein Gelb** — Blau ist der Akzent.
- Logo-Eigenfarben: Navy `#2A3977`, Hellblau `#3F6BC4` (Schreibschrift „GmbH"), Metallgrau `#A2ABAE`. Das Metallgrau liegt auf Weiß bei **2,34:1** und darf dort nie Text sein.
- **Verworfen am 07.10.2026:** Der Industrie-Look des ersten Entwurfs — Graphit `#16191C`, Papier `#F2F0EB`, Signalgelb `#E8A317`, Archivo, IBM Plex Sans — war eine Annahme von Vincent und ist **keine** CI der Firma. Er wird vollständig entfernt, nicht nur im Hero. Die ganze Seite läuft auf Primärblau, Navy, `#201F1E`, Weiß und Manrope.
- **Einzige Ausnahme:** Die Markierung offener Inhalte (`.ph`) bleibt. Sie ist Arbeitsmarkierung für den Entwurf, nicht CI. Ab 07.10.2026 **nicht mehr gelb**, sondern hellrosa, damit sie nicht mit der CI verwechselt wird. Sie verschwindet, sobald die Firma die Fakten liefert.
- **Vorgaben für die CI-Umstellung des Seitenkörpers (Schritt 2, umgesetzt):** Signalgelb verschwindet restlos, auch aus Flächen, Buttons, Header, Logo-Kachel und Linien. Die Karriere-Sektion bekommt statt der gelben Vollfläche eine CI-Fläche (Navy `#2A3977` mit weißer Schrift oder Weiß mit Blau als Akzent). Der WhatsApp-Button wird Primärblau `#2748AC`. Überschriften in Manrope statt Archivo.
- Keine KI-Klischees: keine Verläufe als Deko, keine gleichförmigen Karten-Raster überall, keine Emojis, keine Fantasie-Zahlen.

## Evidence on Hand

- Alte Website h-s-transport.de: Leistungen, Fuhrpark, Technik, Standorte, Stellen, Slogan, Impressum, Datenschutz.
- Handelsregister: Amtsgericht Traunstein HRB 32007, Geschäftsführer Christoph Schnack.
- Instagram @hstransport_gmbh.
- Logo liegt **nur als Raster** vor: `/images/logo.png`, 1346 × 178, RGBA. Keine SVG-Fassung auffindbar. Motiv: zwei graue Keile als Fahrtlinien, dunkelblauer 3D-Block, „HST" in Metallic-Grau mit Verlauf, „ransport" in Hellgrau, „GmbH" in blauer Schreibschrift. Nicht hotlinken, nicht als Raster übernehmen — bis zu einer SVG-Datei bleibt jeder Schriftzug Platzhalter.
- CS-Logistics-Logo: `/images/cs-logo.png`, 450 × 120, Schwarz mit reinem Blau `#0000FF`. Wird laut Firma ohnehin nicht prominent gezeigt.
- Direkte Auskunft der Firma (06.10.2026): 30 LKW im Fuhrpark (die alte Seite nannte 20, der korrekte Wert ist 30), CS Logistics als Einzelunternehmen des Gründers, Fahrerstellen an beiden Standorten, info@h-s-transport.de als Kontaktadresse.
- **Fotos:** `fotos-original/` (50 Aufnahmen eigener Fahrzeuge und des Betriebshofs) ist für Leistungen und Karriere freigegeben. Team-Fotos fehlen weiterhin.
- Keine Referenzen, Testimonials, Zertifikate oder Kennzahlen über die oben genannten hinaus. Nichts davon darf ergänzt werden.

## Product Principles

1. **Nichts erfinden.** Eine sichtbare Lücke ist besser als eine plausible Behauptung. Offene Fakten bleiben markierte Platzhalter und wandern am Ende in eine Fragenliste an die Firma.
2. **Fahrergewinnung schlägt Hochglanz.** Die Karriere-Sektion ist die wichtigste der Seite, und der Weg zur Bewerbung ist ein Daumen weit: WhatsApp oder Anruf, ausdrücklich ohne Anschreiben.
3. **Vertrauen entsteht aus Kapazität und Technik**, nicht aus Werbesprache. Konkrete Zahlen und Fachbegriffe des Systemverkehrs sind das Verkaufsargument.
4. **Mobil zuerst.** Die meisten Fahrer kommen über das Handy. Was am Handy nicht einhändig funktioniert, funktioniert nicht.
5. **Zwei Ansprachen, eine Seite.** Bewerber und Auftraggeber dürfen sich nicht gegenseitig im Weg stehen; beide müssen ihren Weg in den ersten Sekunden erkennen.

## Accessibility & Inclusion

Zoom nicht sperren (kein `maximum-scale`/`user-scalable=no`), Textkontrast mindestens 4,5:1, sichtbarer Fokus auf allen interaktiven Elementen, Klick- und Tap-Flächen mindestens 44 px, `prefers-reduced-motion` respektieren. Begründung: Nutzung überwiegend mobil, draußen, bei wechselndem Licht und oft einhändig.


## Bauplan Scroll-Straße (gebaut)

Vollständig beschlossen am 07.10.2026. Beim Bauen gilt dieser Abschnitt, nichts muss neu hergeleitet werden.

**Zweck.** Vertikale Straße am rechten Bildschirmrand, fixiert. Darauf ein LKW in Draufsicht, dessen Position dem Scrollfortschritt der Seite entspricht. Die gefahrene Strecke leuchtet. Fünf anklickbare Haltepunkte für Leistungen, Karriere, Standorte, Über uns, Kontakt.

**Technik: ohne MotionPathPlugin.** `path.getTotalLength()` und `path.getPointAtLength()` sind im Browser eingebaut und reichen; das Plugin würde 9.702 B gzip kosten und nichts beitragen, was hier gebraucht wird. Den Tangentenwinkel aus einer zweiten Abtastung knapp daneben rechnen. Beim Laden und bei jedem Resize eine Tabelle mit ~200 Stützpunkten anlegen und im Scroll nur interpolieren — keine Geometrieabfrage pro Frame.

**Verzerrungsfalle.** Das Straßen-SVG hat `viewBox="0 0 76 1000"` und `preserveAspectRatio="none"`, damit es jede Viewport-Höhe füllt. Der LKW darf das nicht mitmachen, sonst wird er gestaucht: eigenes Element, per `translate`/`rotate` in Pixeln positioniert. Der Winkel muss um die ungleiche Skalierung korrigiert werden — `atan2(dy * H/1000, dx)`, **nicht** `atan2(dy, dx)`.

**Fünf Linien auf demselben Pfad**, von unten nach oben (Stand im Code):

| Ebene | Farbe und Breite |
|---|---|
| Fahrbahn | Navy `#2A3977`, 14 % Deckkraft, 40 px |
| Mittelstreifen | gestrichelt `6 10`, Navy 26 % |
| Glow (nur gefahren) | Blau `#2748AC`, 44 px, 18 % Deckkraft |
| Gefahrene Strecke | Blau `#2748AC` deckend, 40 px |
| Mittelstreifen auf der gefahrenen Strecke | gestrichelt `6 10`, Weiß 55 % |

Die drei Linien der gefahrenen Strecke bekommen `stroke-dasharray` = Pfadlänge und einen vom Scroll gesteuerten `stroke-dashoffset`. **Kein `filter: drop-shadow`** für den Glow — die breitere, transparente Zweitlinie sieht gleich aus und erzeugt keine eigene Kompositionsebene.

**Pfadform.** Vier bis fünf sanfte Kurven über die volle Höhe, Auslenkung etwa ±14 px um die Mittelachse. Genug für sichtbare Drehung des LKW, zu wenig für eine Schlangenlinie.

**LKW.** Eigenes kleines SVG in Draufsicht, passend zum Hero-Video: weißes Fahrerhaus, kleine Lücke, dann zwei schwarze Wechselbrücken — Motorwagen plus Anhänger, kein durchgehender Kasten. Rund 26 px breit, 70 px lang.

**Haltepunkte.** Position **nicht fest eintragen**, sondern zur Laufzeit aus `offsetTop / Dokumenthöhe` je Abschnitt rechnen und über dieselbe Stützpunkt-Tabelle auf den Pfad legen — so sitzen sie auch nach Inhaltsänderungen richtig. Die fünf IDs `leistungen`, `karriere`, `standorte`, `ueber-uns`, `kontakt` existieren. Darstellung: Ring gedämpft, nach dem Passieren gefüllt in Blau, per Klassenwechsel statt Dauer-Animation.

**Platz schaffen.** `body { padding-right: var(--strasse) }` mit `--strasse: 76px`, damit die vollflächigen Bänder (Kennzahlen, Karriere, Footer) vor dem Streifen enden und hinter der Straße immer der Seitenhintergrund liegt. Der Hero bekommt eine Ausnahme über negativen `margin-right`, damit das Video bis zum Rand läuft; dort ist die Straße ohnehin ausgeblendet. Folge: Der Inhalt sitzt auf mittleren Bildschirmen leicht links der Mitte — gewollt.

**Vorrang für den Hero.** Straße startet mit `opacity: 0` und blendet erst auf, wenn die Hero-Bühne bis auf 200 px durchgelaufen ist. Kein ScrollTrigger: das eigene Scroll-Skript prüft die Schwelle, der Übergang ist eine CSS-Transition (260 ms). Ausgeblendet sind die Haltepunkte weder klick- noch fokussierbar (`visibility`).

**Handy: unter 1024 px vollständig ausblenden.** Begründung, damit sie nicht später wieder aufgemacht wird: Am rechten Rand liegen auf Android die Systemgesten, Klickziele dort provozieren Fehlgriffe; die vier Haltepunkte verdoppeln nur die Hauptnavigation, die mobil schon im Menü steckt, es geht also keine Funktion verloren; und unten liegt bereits die fixierte Bewerbungsleiste — ein zweites fixiertes Element am Rand wäre eines zu viel.

**prefers-reduced-motion.** Straße bleibt sichtbar, **LKW wird ausgeblendet**. Die gefahrene Strecke füllt sich weiter mit dem Scrollfortschritt, aber ohne Scrub-Glättung, also ohne Nachlauf. Haltepunkte bleiben anklickbar und leuchten beim Passieren auf.

**Barrierefreiheit.** Straßen-SVG `aria-hidden="true"`. Die Haltepunkte sind echte `<a>` mit Textbeschriftung in einem `<nav aria-label="Seitenfortschritt">`, sichtbarer Fokus, Trefferfläche mindestens 44 px (darf größer sein als der sichtbare Ring). Bekannt und akzeptiert: Diese vier Links verdoppeln die Hauptnavigation und erzeugen vier zusätzliche Tab-Stopps.

**Größe.** SVG ~2,4 KB, CSS ~1,2 KB, JS ~1,8 KB — zusammen rund **5,4 KB roh, ~1,6 KB gzip**.

## Hero im Hochformat (eigene Komposition, nicht das Querformat verkleinert)

Das Hero-Video ist 16:9, ein Handy ist etwa 9:19,5. Beide Formate lassen sich nicht mit derselben Bildführung bedienen. Im Hochformat gilt deshalb eine eigene Anordnung; der Querformat-Hero bleibt davon unberührt.

**Reihenfolge von oben nach unten:** Überschrift, Fließtext, Video in voller Breite, Button. Kein Text liegt auf dem Video. Die Reste an freier Höhe liegen zu gleichen Teilen oben und unten, die Innenabstände sind mit 40 px großzügig — so liest sich die Bühne als Komposition und nicht als Video mit schwarzen Rändern.

**3:2 ist die Untergrenze für den Ausschnitt.** Flacher geht nicht, sonst fällt die Zugmaschine aus dem Bild; 4:3 schneidet sie bereits ab. Auf sehr niedrigen Geräten wird das Band gekürzt, bevor Text oder Button unter die WhatsApp-Leiste rutschen.

**Kein Hineinzoomen im Hochformat — bewusste Abweichung vom Querformat.** Im Schlussbild stehen die Paletten am linken und rechten Bildrand; erkennbar bleiben sie nur, solange rund 85 % der Bildbreite sichtbar sind. Das entspricht einem Ausschnitt von höchstens 1,51:1, bei 390 px Breite also rund 258 px Höhe. Jeder stärkere Zoom zeigt nur noch den leeren Gang. Die Anforderung "Paletten gut erkennbar" schließt das Mitwachsen des Ausschnitts auf dem Handy damit aus.

**Text bleibt bis zum Schluss stehen.** Im Querformat liegt die Überschrift auf dem Video und muss bei rund 4 s abtreten. Im Hochformat steht sie darüber, hat also keinen Grund zu verschwinden: Sie bleibt bis kurz vor den Etiketten und wechselt dann direkt zu "Was wir fahren". Sonst stünde die halbe Strecke eine leere Bühne um ein kleines Videoband.

**Fünf Etiketten nacheinander statt gleichzeitig.** Je rund 180 px Scrollweg, davon etwa 140 px Standzeit. Dafür ist die Bühne im Hochformat 420 svh lang statt 260. Die Zähler 01/05 bis 05/05 bleiben, das letzte Etikett steht bis zum Ende.

**Die Überschrift bekommt eine eigene Fläche.** Im sichtbaren Ausschnitt ist die Rückwand hell; weiße Schrift käme dort selbst bei 0,32 Abdunklung nur auf 2,90:1. Statt stärker abzudunkeln liegt "Was wir fahren" auf `rgba(26,30,46,.86)` — 10,66:1 auch über reinem Weiß. So kann die Abdunklung bei 0,16 und der Weichzeichner bei 0,8 px bleiben.

**Entwurfs-Hinweis.** Bleibt oben kleben, der Header rastet darunter ein. Seine Höhe misst ein eigenes Skript in `--hinweis`; der CSS-Rückfallwert 49 px gilt nur ohne JavaScript und stimmt für zweizeiligen Umbruch ab 360 px Breite.

**Größenänderung und Reload.** Auf Touch-Geräten baut der Hero nur neu, wenn sich Breite, Ausrichtung oder die Höhe um mindestens 160 px ändert – das Ein- und Ausfahren der Adressleiste löst keinen Neuaufbau aus (die Bühne rechnet mit `svh`). Nach einem Reload mitten in der Seite setzt `onRefresh` das Video auf den Stand der Zeitachse. Während eines Videosprungs meldet das Video `readyState` 1; Scrub-Werte werden deshalb schon ab Metadaten geschrieben, sonst bleibt das Bild nach schnellem Scrollen auf einem Zwischenstand stehen.

## Fahrzeugzeichnungen: ein Massraster für beide Ansichten

Alle Fahrzeugteile auf der Seite folgen denselben echten Massen, damit Draufsicht und Seitenansicht zueinander passen: Fahrerhaus 2,3 m, Wechselbrücke 7,45 m lang und 2,67 m hoch, Lücke 1,0 m, Breite 2,55 m, Ladekante 1,25 m über der Fahrbahn, Rad 1,05 m. Wer eine Zeichnung ändert, rechnet sie aus diesen Zahlen neu — nicht nach Augenmass.

**Scroll-Strasse, Draufsicht.** Das Fahrerhaus zeigt in der Zeichnung nach **unten**, also in Fahrtrichtung bei zunehmendem Scroll. Die Winkelformel `atan2(-dx, dy * sy)` bleibt dabei unverändert; sie dreht die Grundrichtung „nach unten" auf die Tangente und stimmt in beide Kurvenrichtungen. Wird die Zeichnung je wieder gedreht, fährt der Zug rückwärts.

**Zwei Sprites, kein starres Bild.** Motorwagen (28 × 107 px) und Anhänger (28 × 93 px) sitzen auf je eigenen Punkten des Pfads, der Anhänger 100 px Pfadlänge dahinter, jeder mit dem Winkel seines eigenen Punktes. Ein durchgehendes Bild über die ganze Zuglänge von gut 200 px würde die Kurven schneiden. Die Fahrbahn ist dafür von 34 auf 40 px Strichstärke gewachsen — mehr geht nicht, ohne dass der Glanz die 76 px des Streifens verlässt.

**Haltepunkte mit weissem Aussenring.** Seit der Zug länger ist, liegt er häufig unter einem Haltepunkt. Der weisse Ring hält den Punkt über Fahrbahn *und* Fahrzeug lesbar.

**Standorte: Gliederzug-Zeichnung überholt (14.10.2026).** Die Abschnitte zur handgezeichneten Seitenansicht (Planenflächen, ausgemessene Prozentwerte, Fahrbahnlinie, `cqw`-Schriften, Karten unter 1024 px) gelten nicht mehr. `bilder/lkw-seitenansicht-ohne-branding.svg` bleibt im Repo, wird aber nicht mehr eingebunden. Ihre Masse oben gelten nur noch für die Draufsicht der Scroll-Strasse.

## Standorte: Lagekarte

Ersatz für die Zeichnung ist eine Lagekarte als Inline-SVG (`redesign-handoff/standorte.html`): Gradnetz 9–13° O / 48–50° N, Main, Donau, schematischer Alpenrand, Orientierungsstädte (Würzburg, Nürnberg, Stuttgart, Augsburg, München, Regensburg), Maßstab 100 km, Nordpfeil, Rodgau (B) und Siegsdorf (A) mit Koordinaten und „rund 500 km“ auf der Verbindungslinie. Kein Kartendienst, kein Embed.

- Links Text mit Adressliste (Siegsdorf zuerst, Firmensitz), rechts die Karte. **Unter 980 px** steht die Karte unter dem Text.
- **Unter 640 px** sind die Orientierungsstädte (`.karte-ref`) ausgeblendet, damit Rodgau und Siegsdorf lesbar bleiben.
- Unter der Karte bewusst **kein** Bildband (Entscheidung vom 14.10.2026).
- Einblenden wie in den beiden anderen Redesign-Sektionen (`.rv`, `.cur`), aus bei `prefers-reduced-motion`.


## Offene Punkte

**HST-Logo: Nachbau, kein Original.** `bilder/logo-hst.svg` ist ein Nachbau nach den Fotos 03 und 07, angelegt als Übergangslösung bis die Vektordatei vom Folierer vorliegt. Abweichungen zum Original: „HST" und „ransport" stehen in Manrope statt der Originalgrotesk, „GmbH" ist eine einlinig nachgezeichnete Schreibschrift. **Zum Austausch nur diese eine Datei ersetzen und das Seitenverhältnis 640 : 160 beibehalten**, sonst verrutscht jede Platzierung.

Im Abschnitt „Von wo wir fahren" wird das Logo **nicht** gebraucht — dort steht seit 14.10.2026 die Lagekarte. Die Datei liegt für das Hero-Video bereit, wo der generische Schriftzug noch im Bild steht.

**Noch offen:** Im Hero-Video trägt der Zug weiterhin den erfundenen Schriftzug. Dort ist er bisher nicht ersetzt, weil er sich über die ganze Laufzeit bewegt — das wäre eine Nachbearbeitung des Videos, keine Überlagerung.
