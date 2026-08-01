# Irohs Küche: sinnvolle Zubereitung + mehr Lernwert (Design)

## Kontext / Problem

"Irohs Küche" (`index.html`, `s-cooking`) lässt Rozarin für jede Zutat eines Gerichts
immer denselben Ablauf durchlaufen: 🧼 Waschen → 🔪 Schneiden → Multiplikations-
Aufgabe → richtige Anzahl der Zutat aus dem Kühlschrank in den Topf ziehen.

Zwei Probleme, die Kadir gemeldet hat:

1. **Kein Sinn:** Waschen+Schneiden wird auf *jede* Zutat angewendet, auch auf Milch,
   Honig, Eier, Butter — das ergibt inhaltlich keinen Sinn.
2. **Zu wenig Lernwert / langweilig:** Weil der Ablauf immer identisch ist, wird das
   Modul schnell eintönig.

## Ziel

Die Zubereitung wird zu einer eigenen kleinen Zuordnungs-Aufgabe: Rozarin wählt pro
Zutat selbst die passende(n) Aktion(en) aus einem festen Aktions-Set. Iroh begleitet
jede Zutat mit einem kurzen Kommentar, und der Topf zeigt sichtbar/hörbar, dass
gerade gekocht wird.

## Nicht-Ziele (bewusst außen vor)

- Keine neuen Gerichte/Zutaten in diesem Schritt (siehe [[roza-lernprofil]] — überschaubar
  halten). Kommt ggf. als eigener, späterer Schritt.
- Der Rechen-Schritt (Multiplikation) und der Kühlschrank-Drag-Schritt bleiben
  fachlich unverändert — nur die Vorbereitung davor wird ersetzt.
- Kein Zeitdruck/Timer — passt nicht zu Rozarins Profil (ADHS, keine Prüfungssituation).

## 1. Die vier festen Zubereitungs-Aktionen

Immer dieselben 4 Knöpfe, gleiche Icons, gleiche Reihenfolge, unabhängig von der
Zutat — Wiedererkennbarkeit statt Überraschung:

| Icon | Aktion | Bedeutung |
|---|---|---|
| 🧼 | Waschen | frisches Obst/Gemüse abspülen |
| 🔪 | Schneiden | klein schneiden |
| 🥚 | Aufschlagen | nur für Eier |
| 🥄 | Abmessen | Vorrats-/Backzutaten abmessen |

Pro Zutat sind 1–2 dieser Aktionen korrekt (siehe Tabelle unten). Rozarin tippt die
richtige(n) an; falsch angetippte Aktionen geben sanftes Feedback über `cook-fb`
("Fast! ... probier's nochmal 🍵") ohne Bestrafung. Der Schritt gilt als fertig,
sobald alle korrekten Aktionen angetippt wurden — danach automatisch weiter zum
Iroh-Kommentar und der bestehenden Rechen-Aufgabe.

## 2. Zutat → Aktion(en) Zuordnung + Iroh-Kommentar

Schlüssel ist der Zutat-**Name** (nicht das Emoji — `Salat` und `Seetang` teilen sich
aktuell das Emoji 🥬, siehe `COOK_INGS`/`DISHES`). Alle 23 aktuell in `DISHES`
verwendeten Zutaten:

| Zutat | Aktion(en) | Iroh-Kommentar (nach korrekter Aktion) |
|---|---|---|
| Ei | 🥚 Aufschlagen | "Eier schlägt man auf, nie schneiden — vorsichtig mit der Schale!" |
| Mehl | 🥄 Abmessen | "Mehl wird abgemessen, nicht gewaschen — sonst wird's klebrig!" |
| Honig | 🥄 Abmessen | "Honig einfach abmessen — er ist schon süß und sauber genug." |
| Salz | 🥄 Abmessen | "Nur eine kleine Prise abmessen, Salz braucht kein Wasser." |
| Butter | 🥄 Abmessen | "Butter wird abgemessen, nicht geschnitten — sie schmilzt gleich im Topf." |
| Nudeln | 🥄 Abmessen | "Trockene Nudeln misst man einfach ab, bevor sie ins kochende Wasser kommen." |
| Reis | 🧼 Waschen | "Reis wäscht man kurz ab, dann wird er schön locker." |
| Seetang | 🧼 Waschen | "Seetang kommt frisch aus dem Meer — kurz abwaschen reicht." |
| Jasmin | 🧼 Waschen | "Zarte Jasminblüten nur sanft abspülen, nicht schneiden." |
| Garnele | 🧼 Waschen | "Garnelen kurz abwaschen, dann sind sie bereit für den Topf." |
| Erdbeere | 🧼 Waschen | "Erdbeeren nur abwaschen — sie sind schon perfekt so, wie sie sind." |
| Traube | 🧼 Waschen | "Trauben einfach abwaschen und direkt genießen." |
| Banane | 🧼 Waschen | "Banane abwaschen reicht — geschält wird sie sowieso." |
| Salat | 🧼 Waschen | "Frischer Salat wird gewaschen, bevor er in die Schüssel kommt." |
| Mais | 🧼 Waschen + 🔪 Schneiden | "Mais waschen und in Stücke schneiden — so wird er schön knackig." |
| Möhre | 🧼 Waschen + 🔪 Schneiden | "Möhren erst abwaschen, dann in Scheiben schneiden." |
| Tomate | 🧼 Waschen + 🔪 Schneiden | "Tomaten waschen und klein schneiden — für den besten Geschmack." |
| Pilz | 🧼 Waschen + 🔪 Schneiden | "Pilze vorsichtig abwaschen und in Scheiben schneiden." |
| Pfirsich | 🧼 Waschen + 🔪 Schneiden | "Pfirsich waschen und schneiden — so süß und saftig!" |
| Chili | 🧼 Waschen + 🔪 Schneiden | "Chili waschen und fein schneiden — Vorsicht, der ist scharf!" |
| Fisch | 🧼 Waschen + 🔪 Schneiden | "Fisch wird gewaschen und filetiert, bevor er in den Topf kommt." |
| Avocado | 🔪 Schneiden | "Avocado einfach aufschneiden und den Kern entfernen." |
| Käse | 🔪 Schneiden | "Käse wird in Stücke geschnitten — perfekt zum Überbacken." |

Logik: festes Obst/Gemüse → waschen+schneiden; weiche Beeren/Banane → nur waschen;
Fisch → waschen+filetieren; Vorratszutaten (Mehl/Honig/Salz/Butter/Nudeln) →
abmessen statt waschen/schneiden; Ei → aufschlagen; Avocado/Käse → nur schneiden.

## 3. Sichtbare Verwandlung im Topf

Sobald die Zielmenge einer Zutat im Topf erreicht ist (bestehende Logik in
`cookDrop`), bevor zur nächsten Zutat gewechselt wird:

- Kurze CSS-Animation am Topf: 2–3 Dampf-Emojis (💨) steigen auf und verblassen
  (neues `@keyframes steamRise`, analog zu bestehenden Animationen wie `sakuraFall`/
  `appaBob`), Topf-Rahmen pulsiert kurz in `d.col` (Nationsfarbe des Gerichts).
- Kurzer Ton über bestehendes `tone()`/`sfxTea()`-Muster.
- Dauer ca. 700–900ms (ähnlich dem bestehenden `setTimeout(...,900)` vor dem
  Zutat-Wechsel in `cookDrop`) — passt in den bestehenden Ablauf, kein zusätzlicher
  Wartezustand nötig.

Beim fertigen Gericht (`cookingWin`) zusätzlich ein etwas größerer Dampf-Effekt vor
der bestehenden Konfetti-Animation, bevor das fertige Gericht groß erscheint.

## 4. Betroffene Stellen in `index.html`

- **Neu:** `COOK_PREP_ACTIONS` — Lookup-Objekt `{ [Zutat-Name]: { actions: [...],
  tip: '...' } }` mit den 23 Einträgen aus Abschnitt 2.
- **Ersetzt:** `renderCookPrep(g)` — rendert jetzt die 4 festen Aktions-Knöpfe statt
  der 2 fixen Waschen/Schneiden-Knöpfe.
- **Ersetzt:** `cookPrepStep(key)` — validiert gegen `COOK_PREP_ACTIONS[g.name]
  .actions` statt der bisherigen festen `washed`/`cut`-Flags; zeigt bei falscher
  Auswahl Feedback über `cook-fb`; zeigt bei vollständiger Auswahl den
  Iroh-Kommentar, bevor `renderCookCalc()` aufgerufen wird.
- **Neu:** kleine Steam/Pulse-Funktion, aufgerufen in `cookDrop` sobald
  `cook.placed>=target`, vor dem bestehenden `setTimeout`.
- **Unverändert:** `renderCookCalc`, `cookPickCalc`, `renderCookFridge`,
  `attachCookDrag`, `cookDrop`-Kernlogik, `cookingWin`-Kernlogik (nur um
  Dampf-Effekt ergänzt).

## Testing

Diese App hat kein automatisiertes Test-Setup (reines HTML/JS, `index.html`). Prüfung
manuell im Browser (lokaler Server, siehe vorheriger Mobil-Test-Workflow):

- Für jede der 23 Zutaten einmal ein Gericht kochen, das sie enthält, und
  verifizieren: richtige Aktion(en) nötig, falsche Aktion gibt Feedback ohne
  hängen zu bleiben, Iroh-Kommentar erscheint, Topf-Animation läuft, Gericht wird
  am Ende fertig.
- Kurzer Mobil-Test wie beim letzten Fix (gleiches WLAN, lokaler Server), da
  Touch-Interaktion (Tap statt Drag) hier im Vordergrund steht.
