# Zerya's Mathe-Modul auf Sek-3-Niveau (Schweiz)

## Kontext

`zerya.html` ist die Zerya-App, erreichbar über index.html → Button „Fa·mi·lie" → `arena.html` → Profil „Zerya" → `zerya.html`. Dort gibt es die Kachel „Easy Math", die über `startQuiz('math')` die Funktion `genMathEasy()` aufruft (Zeile 358–371). Aktuell generiert diese Funktion nur triviale Grundrechenarten (Addition/Subtraktion/Multiplikation/Division bis 60, eine einfache Prozent- und eine einfache Bruchaufgabe, sowie eine Trivial-Gleichung `9 + x = ...`).

Ziel: Das Mathe-Modul auf Schweizer Sek-3-Niveau anheben — mit Termen, Gleichungen und Variablen, wie von Kadir gewünscht.

## Änderungen

### 1. `genMathEasy()` ersetzen (zerya.html, Zeile 358–371)

Neue Funktion mit 9 Aufgabentypen (rotierend per `rnd(0,8)`), alle im bestehenden Rückgabeformat `{q, a, o}` (o = 4 Multiple-Choice-Strings, a = korrekte Antwort als String):

1. **Terme vereinfachen** — gleichartige Terme mit negativen Koeffizienten, z.B. `5x + 3x − 7x` → Antwort als Term (z.B. `x`, `−2x`)
2. **Klammer ausmultiplizieren in Gleichung** — z.B. `3·(x + 4) = 21` → `x = ?`
3. **Gleichung, 1 Schritt** — `ax + b = c` → `x = ?`
4. **Gleichung, 2 Schritte, negatives Ergebnis möglich** — `ax − b = c` → `x = ?`
5. **Variable auf beiden Seiten** — `5x + 3 = 2x + 12` → `x = ?`
6. **Klammer + Variable auf beiden Seiten** — `3·(x − 2) = 2x + 1` → `x = ?`
7. **Term mit Potenz einsetzen** — z.B. `3x² − 2x` für `x = −2` auswerten
8. **Bruchgleichung** — `x/3 + 4 = 9` → `x = ?`
9. **Prozentsatz/Verhältnis berechnen** — z.B. „Wieviel % sind 18 von 40?"

Negative Zwischenwerte und Ergebnisse sind zulässig. Distraktoren (falsche Multiple-Choice-Optionen) sollen typische Rechenfehler simulieren (Vorzeichenfehler, falsch verteilte Klammer, vertauschte Operation) statt nur `ans + rnd(-6,6)`, damit die Auswahl nicht trivial erratbar ist. Bei Term-Antworten (Typ 1) werden Distraktoren als Terme mit abweichendem Koeffizienten erzeugt (analog zum bestehenden Muster in `arena.html` Typ 8).

### 2. Label-Updates

- Zeile 143 (Kachel in Haupt-Menü): `Easy Math` / `Quick brain warm-up` → `Algebra` / `Terme, Gleichungen & Variablen`
- Zeile 298 (`QUIZBANKS.math.title`): `Easy Math` → `Algebra`

### 3. Unverändert

- Multiple-Choice-UI-Format (`renderQ`, `answerQ`, `finishQuiz`)
- Punktelogik, Achievement „Math Whiz"
- Alle anderen Quiz-Bänke (english, german, avatar, japan)
- `arena.html` / `Avatar Arena (Familie).html` bleiben unangetastet — der Live-Pfad „Familie → Zerya" führt zu `zerya.html`, nicht zum `teen`-Screen in `arena.html`

## Out of scope

- Freitext-Eingabe statt Multiple-Choice (UI-Änderung, nicht angefragt)
- Änderungen an `arena.html`'s eigenem „Brain Math" (bereits auf ähnlichem Niveau, separate Aufgabe falls gewünscht)
