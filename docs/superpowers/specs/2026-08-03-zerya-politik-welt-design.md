# Zerya: „Politik & Welt" – Lese-Modul (Design)

## Ziel
In Zeryas World (`zerya.html`) soll ein neuer, reiner Lese-Bereich zu Politik/Weltgeschehen entstehen, altersgerecht für 14–16 Jahre. Kein Quiz, keine Fragen zu beantworten — nur Themenkarten zum Antippen und Lesen.

## Platzierung & Navigation
- Neues Cluster `🌍 Politik & Welt` auf der Startseite, nach dem Cluster „🧠 Brain Stuff".
- Eine breite Karte `Politik & Welt` öffnet den Screen `politics` (Themenliste).
- Themenliste: Karten mit Icon, Titel, kurzem Teaser (analog `renderManga`/`mangalist`), aber ohne Stern/Speichern-Funktion.
- Antippen einer Karte öffnet den Screen `politics-detail` mit vollem Text (3–5 Sätze) und Zurück-Button (zurück zur Liste, nicht zur Startseite).

## Inhalt
Konstante `POLITICS` mit 16 Themen, neutral und faktenbasiert formuliert, keine einseitige Wertung bei Konfliktthemen. Mix aus:
- Grundbegriffen: Demokratie, Diktatur, Gewaltenteilung, Menschenrechte, Wahlen & Parteien, Verfassung
- Direkte Demokratie Schweiz: Abstimmungen/Initiativen, Bundesrat/Parlament
- Internationale Organisationen: UNO, EU, NATO
- Wichtigen Ereignissen/Themen: Fall der Berliner Mauer & Kalter Krieg, Pariser Klimaabkommen/Klimapolitik, Ukraine-Krieg (sachlich, altersgerecht), Migration/Asylpolitik in Kürze, Digitalisierung & Politik (z. B. Falschinformation/Fake News)

Jedes Thema: `{id, e (Emoji), n (Titel), teaser (kurz, ~1 Satz für die Liste), text (3–5 Sätze für die Detailansicht)}`.

## Datenmodell & Persistenz
- Neues Feld `DATA.politicsRead = []` (Array gelesener Themen-IDs), Teil des bestehenden `localStorage`-Objekts unter `SKEY`.
- Beim Öffnen eines Themas in der Detailansicht: ID wird (falls noch nicht enthalten) zu `DATA.politicsRead` hinzugefügt, `checkBadges()` + `saveData()` aufgerufen.

## Badge
- Neuer Eintrag im `BADGES`-Array: `{id:'weltoffen', e:'🌍', n:'Weltoffen', d:'Alle Politik-Themen gelesen', check: DATA.politicsRead.length >= POLITICS.length}`.
- Kein Punkte-Vergabe für das Lesen selbst (bewusst druckfrei, wie gewünscht) — nur der Abschluss-Badge als Belohnung.

## UI/Struktur (folgt bestehenden Mustern in `zerya.html`)
- CSS: bestehende Klassen `.manga`/`.mcard`-Stil wiederverwenden für die Themenliste (kein neues CSS-System nötig); für die Detailansicht bestehende `.panel`-Klasse nutzen.
- JS: `renderPolitics()` befüllt die Liste analog zu `renderManga()`; `openPolitic(id)` zeigt den Screen `politics-detail`, setzt Titel/Text, markiert als gelesen.
- Screens folgen dem bestehenden `show(id)`-Navigationsmuster.

## Out of Scope
- Keine Quiz-/Fragefunktion zu diesen Themen.
- Keine Punkte-Vergabe pro gelesenem Thema (nur Abschluss-Badge).
- Keine externen Links/Quellen — reiner In-App-Text.
