# Zerya's English-Quiz in zwei Niveaus (Mittel/Schwer, Sek-3 Schweiz)

## Kontext

`zerya.html` ist die Zerya-App, erreichbar über index.html → Button „Fa·mi·lie" → `arena.html` → Profil „Zerya" → `zerya.html`. Im Bereich „🧠 Brain Stuff" (Zeile 140–148) gibt es aktuell eine Kachel „English (Hard)", die über `startQuiz('english')` die Fragenbank `BANK.english` (Zeile 643–703, ~60 Fragen) lädt — ein gemischter Pool aus fortgeschrittenem Wortschatz (z.B. „eloquent", „notorious") und fortgeschrittener Grammatik (3rd Conditional, Inversion, Passiv mit Gerundium), Niveau B2/C1.

Ziel: Zwei getrennte Niveaus anbieten — ein mittleres (B1, durchschnittliches Sek-3-Niveau CH) und ein schwieriges (B2/C1, bestehender Inhalt) — analog zur bereits bestehenden Zwei-Kacheln-Optik der App (Algebra, Deutsch, Avatar Lore etc.).

## Änderungen

### 1. Bestehende Bank umbenennen: `english` → `englishHard`

- `BANK.english` (Zeile 643) wird zu `BANK.englishHard`. Inhalt unverändert (~60 Fragen bleiben wie sie sind).
- `QUIZBANKS.english` (Zeile 299) wird zu `QUIZBANKS.englishHard`, Titel bleibt `'English (Hard)'`.

### 2. Neue Bank `BANK.englishMedium` (~35–40 Fragen)

Zielniveau B1 (Lehrplan21-Zielstufe Ende Sek-3, „mittlere Anforderungen"). Gleiches Format `{q, a, o}` wie bestehende Bänke. Inhaltsmix:

- **Alltagswortschatz** statt Fremdwörter — einfache Bedeutungsfragen (z.B. „borrow" vs. „lend", „since" vs. „for", gängige Synonyme/Gegensatzpaare auf A2/B1-Niveau)
- **Grundzeiten:** Simple Past vs. Present Perfect, 1st Conditional, einfaches Passiv (nur Present/Past Simple, keine Gerundium-Konstruktionen)
- **Modalverben:** must/have to/should/can, Komparativ/Superlativ
- **Einfache Relativsätze:** who/which/that (kein whose/whom, keine non-defining clauses)
- **Häufige Phrasal Verbs & einfache Redewendungen** (kein „hit the books"-Register, eher „look for", „give up", "turn on" etc.)

Explizit **ausgeschlossen** aus Medium (bleibt Hard vorbehalten): 2nd/3rd Conditional, reported speech, Inversion, unreal past (wish/as if), whose/whom, Gerundium nach bestimmten Verben, seltenes Vokabular (C1-Register).

### 3. Neue Kachel im Home-Screen (Zeile 140–148, Cluster „🧠 Brain Stuff")

Neue Kachel zwischen Algebra und English (Hard):

```html
<div class="card" onclick="startQuiz('englishMedium')"><div class="ci">🗣️</div><div class="ct">English (Medium)</div><div class="cd">Vocab &amp; grammar</div></div>
```

Bestehende Hard-Kachel (Zeile 144) bleibt inhaltlich gleich, nur `onclick="startQuiz('english')"` → `onclick="startQuiz('englishHard')"`.

### 4. `DATA.quizDone` — zwei Keys statt einem

- `startQuiz`/`finishQuiz` setzen automatisch `DATA.quizDone[Q.key]` (Zeile 350) — funktioniert bereits generisch für neue Keys `englishMedium`/`englishHard`, keine Code-Änderung nötig außer der Badge-Prüfung.
- **Badge „Wordsmith"** (Zeile 264): `check` von `!!DATA.quizDone.english` auf `!!DATA.quizDone.englishMedium || !!DATA.quizDone.englishHard` ändern — Badge greift, sobald **eines** der beiden Level abgeschlossen wurde.

### 5. Unverändert

- Quiz-Engine (`renderQ`, `answerQ`, `finishQuiz`, `startQuiz`) — funktioniert bereits generisch über `BANK[key]`, kein Sonderfall wie bei `math` nötig
- Punktelogik, alle anderen Quiz-Bänke (german, avatar, japan) und Kacheln
- `arena.html` / `Avatar Arena (Familie).html` bleiben unangetastet

## Out of scope

- Ein gemeinsamer Auswahlbildschirm statt zwei Kacheln (vom Nutzer explizit abgelehnt)
- Freitext-Eingabe statt Multiple-Choice
- Anpassung der Deutsch-Quiz-Bank auf ähnliche Zwei-Niveau-Struktur (nicht angefragt)
