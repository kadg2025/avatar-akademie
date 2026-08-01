# Irohs Küche Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed "Waschen+Schneiden für alles"-Vorbereitung in Irohs Küche (`index.html`) durch eine Zutat-passende Aktions-Auswahl (Waschen/Schneiden/Aufschlagen/Abmessen), ergänzt um Iroh-Kommentare pro Zutat und eine sichtbare Dampf/Puls-Animation am Topf.

**Architecture:** Reines Client-seitiges JS in einer einzigen `index.html` (kein Build-Schritt, kein Framework). Neue Daten-Lookup-Tabelle `COOK_PREP_ACTIONS` ersetzt die bisherigen festen `washed`/`cut`-Flags; zwei bestehende Funktionen (`renderCookPrep`, `cookPrepStep`) werden ersetzt, eine neue Hilfsfunktion (`cookSteamPulse`) wird ergänzt und an zwei bestehenden Stellen aufgerufen (`cookDrop`, `cookingWin`). Kein neues HTML-Markup nötig — der Iroh-Kommentar wird in das bestehende `#cook-calc`-Element nachgeschoben.

**Tech Stack:** Vanilla JS (ES6), Vanilla CSS (keine Preprozessoren), keine Build-Tools, keine Test-Runner — dieses Repo hat kein automatisiertes Test-Setup für `index.html`.

## Global Constraints

- Nur die 12 bestehenden Gerichte/23 Zutaten betreffen — keine neuen Gerichte in diesem Plan (siehe Spec, Abschnitt "Nicht-Ziele").
- Kein Zeitdruck/Timer.
- UI-Text folgt der bestehenden Silbentrennung mit `·` (z. B. `Zu·tat`, `Wa·schen`) und verwendet `’` (U+2019) statt `'` (U+0027) in Textinhalten, damit einfach gequotete JS-Strings nicht brechen.
- Rechen-Schritt (`renderCookCalc`/`cookPickCalc`) und Kühlschrank-Drag-Schritt (`renderCookFridge`/`attachCookDrag`/`cookDrop`-Kernlogik) bleiben fachlich unverändert.
- Zutat-Zuordnung erfolgt über den **Namen** (`g.name`), nicht das Emoji — `See·tang` und `Sa·lat` teilen sich aktuell das Emoji 🥬.

---

### Task 1: Zutat-Aktions-Datentabelle anlegen

**Files:**
- Modify: `index.html` (unmittelbar vor `let cook=null;`, aktuell Zeile 2996 — direkt nach der bestehenden `COOK_DISTRACT`-Konstante)

**Interfaces:**
- Produces: `COOK_ACTIONS` (Array von `{key,emoji,label}`, die 4 festen Aktionen in fester Reihenfolge) und `COOK_PREP_ACTIONS` (Objekt `{ [Zutat-Name]: {actions:[key,...], tip:string} }`) — werden von Task 3 (`renderCookPrep`/`cookPrepStep`) konsumiert.

- [ ] **Step 1: Datentabelle einfügen**

Füge direkt nach der bestehenden Zeile

```js
const COOK_DISTRACT=[{emoji:'🍋',name:'Zi·tro·ne'},{emoji:'🍅',name:'To·ma·te'},{emoji:'🧅',name:'Zwie·bel'},{emoji:'🍇',name:'Trau·be'},{emoji:'🧀',name:'Kä·se'},{emoji:'🥔',name:'Kar·tof·fel'},{emoji:'🍄',name:'Pilz'},{emoji:'🥕',name:'Möh·re'}];
```

folgenden Block ein (vor `let cook=null;`):

```js
const COOK_ACTIONS=[
 {key:'wash',emoji:'🧼',label:'Wa·schen'},
 {key:'cut',emoji:'🔪',label:'Schnei·den'},
 {key:'crack',emoji:'🥚',label:'Auf·schla·gen'},
 {key:'measure',emoji:'🥄',label:'Ab·mes·sen'}
];
const COOK_PREP_ACTIONS={
 'Ei':{actions:['crack'],tip:'Ei·er schlägt man auf, nie schnei·den — vor·sich·tig mit der Scha·le!'},
 'Mehl':{actions:['measure'],tip:'Mehl wird ab·ge·mes·sen, nicht ge·wa·schen — sonst wird’s kle·brig!'},
 'Ho·nig':{actions:['measure'],tip:'Ho·nig ein·fach ab·mes·sen — er ist schon süß und sau·ber ge·nug.'},
 'Salz':{actions:['measure'],tip:'Nur ei·ne klei·ne Pri·se ab·mes·sen, Salz braucht kein Was·ser.'},
 'But·ter':{actions:['measure'],tip:'But·ter wird ab·ge·mes·sen, nicht ge·schnit·ten — sie schmilzt gleich im Topf.'},
 'Nu·deln':{actions:['measure'],tip:'Tro·cke·ne Nu·deln misst man ein·fach ab, be·vor sie ins Was·ser kom·men.'},
 'Reis':{actions:['wash'],tip:'Reis wäscht man kurz ab, dann wird er schön lo·cker.'},
 'See·tang':{actions:['wash'],tip:'See·tang kommt frisch aus dem Meer — kurz ab·wa·schen reicht.'},
 'Jas·min':{actions:['wash'],tip:'Zar·te Jas·min·blü·ten nur sanft ab·spü·len, nicht schnei·den.'},
 'Gar·ne·le':{actions:['wash'],tip:'Gar·ne·len kurz ab·wa·schen, dann sind sie be·reit für den Topf.'},
 'Erd·bee·re':{actions:['wash'],tip:'Erd·bee·ren nur ab·wa·schen — sie sind schon per·fekt so wie sie sind.'},
 'Trau·be':{actions:['wash'],tip:'Trau·ben ein·fach ab·wa·schen und di·rekt ge·nie·ßen.'},
 'Ba·na·ne':{actions:['wash'],tip:'Ba·na·ne ab·wa·schen reicht — ge·schält wird sie so·wie·so.'},
 'Sa·lat':{actions:['wash'],tip:'Fri·scher Sa·lat wird ge·wa·schen, be·vor er in die Schüs·sel kommt.'},
 'Mais':{actions:['wash','cut'],tip:'Mais wa·schen und in Stü·cke schnei·den — so wird er schön kna·ckig.'},
 'Möh·re':{actions:['wash','cut'],tip:'Möh·ren erst ab·wa·schen, dann in Schei·ben schnei·den.'},
 'To·ma·te':{actions:['wash','cut'],tip:'To·ma·ten wa·schen und klein schnei·den — für den bes·ten Ge·schmack.'},
 'Pilz':{actions:['wash','cut'],tip:'Pil·ze vor·sich·tig ab·wa·schen und in Schei·ben schnei·den.'},
 'Pfir·sich':{actions:['wash','cut'],tip:'Pfir·sich wa·schen und schnei·den — so süß und saf·tig!'},
 'Chi·li':{actions:['wash','cut'],tip:'Chi·li wa·schen und fein schnei·den — Vor·sicht, der ist scharf!'},
 'Fisch':{actions:['wash','cut'],tip:'Fisch wird ge·wa·schen und fi·le·tiert, be·vor er in den Topf kommt.'},
 'A·vo·ca·do':{actions:['cut'],tip:'A·vo·ca·do ein·fach auf·schnei·den und den Kern ent·fer·nen.'},
 'Kä·se':{actions:['cut'],tip:'Kä·se wird in Stü·cke ge·schnit·ten — per·fekt zum Über·ba·cken.'}
};
```

- [ ] **Step 2: Syntax-Check**

Run:
```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const re=/<script[^>]*>([\s\S]*?)<\/script>/g;
let m,i=0;
while((m=re.exec(html))){ i++; try{ new Function(m[1]); console.log('block',i,'OK'); } catch(e){ console.log('block',i,'FAILED:',e.message); } }
"
```
Expected: `block 1 OK` und `block 2 OK` (keine `FAILED`-Zeile).

- [ ] **Step 3: Vollständigkeitscheck der Zuordnungstabelle**

Run:
```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const namesInDishes=[...html.matchAll(/name:'([^']+)',n:\d+/g)].map(m=>m[1]);
const uniqueNames=[...new Set(namesInDishes)];
const tableSrc=html.match(/const COOK_PREP_ACTIONS=\{[\s\S]*?\n\};/)[0];
const missing=uniqueNames.filter(n=>!tableSrc.includes(\"'\"+n+\"':\"));
console.log('Zutaten in DISHES:',uniqueNames.length);
console.log('Fehlend in COOK_PREP_ACTIONS:',missing.length?missing:'keine — alle abgedeckt');
"
```
Expected: `Fehlend in COOK_PREP_ACTIONS: keine — alle abgedeckt`. Falls Zutaten fehlen, Eintrag in `COOK_PREP_ACTIONS` ergänzen und Step 3 wiederholen.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Irohs Kueche: Zutat-zu-Aktion Datentabelle ergaenzt"
```

---

### Task 2: CSS für Topf-Animation ergänzen

**Files:**
- Modify: `index.html` (im `<style>`-Block, direkt nach der bestehenden `sakuraFall`-Keyframe-Zeile, aktuell Zeile 322)

**Interfaces:**
- Produces: CSS-Klassen `.pot-cooked` und `.steam-puff` — werden von Task 4 (`cookSteamPulse`) konsumiert.

- [ ] **Step 1: Keyframes einfügen**

Füge direkt nach dieser bestehenden Zeile:

```css
@keyframes sakuraFall{0%{opacity:0;transform:translateY(0) rotate(0deg) translateX(0)}5%{opacity:.65}85%{opacity:.50}100%{opacity:0;transform:translateY(110vh) rotate(720deg) translateX(45px)}}
```

folgenden Block ein:

```css
/* ── Irohs Küche: Topf-Animation ── */
@keyframes potCookPulse{0%{transform:scale(1)}30%{transform:scale(1.04)}60%{transform:scale(.99)}100%{transform:scale(1)}}
@keyframes steamPuff{0%{opacity:0;transform:translate(-50%,0) scale(.6)}25%{opacity:.85}100%{opacity:0;transform:translate(-50%,-42px) scale(1.4)}}
.pot-cooked{animation:potCookPulse .7s ease}
.steam-puff{position:absolute;bottom:60%;font-size:22px;pointer-events:none;animation:steamPuff .8s ease forwards}
```

- [ ] **Step 2: Syntax-Check**

Run (gleicher Befehl wie Task 1, Step 2):
```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const re=/<script[^>]*>([\s\S]*?)<\/script>/g;
let m,i=0;
while((m=re.exec(html))){ i++; try{ new Function(m[1]); console.log('block',i,'OK'); } catch(e){ console.log('block',i,'FAILED:',e.message); } }
"
```
Expected: beide Blöcke `OK` (CSS-Änderung betrifft kein `<script>`, dient hier nur als Regressions-Check, dass vorher/nachher nichts kaputt ist).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Irohs Kueche: CSS fuer Topf-Puls und Dampf-Animation"
```

---

### Task 3: Vorbereitungs-Schritt auf Zutat-passende Aktionen umstellen

**Files:**
- Modify: `index.html:3021-3045` (Funktionen `renderCookStep`, `renderCookPrep`, `cookPrepStep`)

**Interfaces:**
- Consumes: `COOK_ACTIONS`, `COOK_PREP_ACTIONS` (aus Task 1); `setFb(id,txt,ok)`, `sfxStep()`, `sfxWrong()` (bestehend).
- Produces: `cook.needActions` (Array von Action-Keys, die für die aktuelle Zutat nötig sind), `cook.doneActions` (Array bereits korrekt getippter Keys), `cook.prepTip` (String) — nur intern in diesem Modul verwendet, keine neuen externen Konsumenten.

- [ ] **Step 1: `renderCookStep` anpassen — `washed`/`cut`-Init entfernen**

Ersetze:

```js
function renderCookStep(){
 const d=cook.dish,f=cook.factor,g=d.ings[cook.ii];const target=g.n*f;
 cook.placed=0;cook.calcOK=false;cook.washed=false;cook.cut=false;
 document.getElementById('cook-prog').textContent='Zu·tat '+(cook.ii+1)+'/'+d.ings.length;
 document.getElementById('cook-fb').textContent='';
 document.getElementById('cook-step').innerHTML=g.emoji+' <b>'+g.name+'</b>: für 1 Per·son '+g.n+' → für '+f+' Per·so·nen?';
 renderCookPot(target);
 document.getElementById('cook-fridge').innerHTML='';
 renderCookPrep(g);
}
```

durch:

```js
function renderCookStep(){
 const d=cook.dish,f=cook.factor,g=d.ings[cook.ii];const target=g.n*f;
 cook.placed=0;cook.calcOK=false;
 document.getElementById('cook-prog').textContent='Zu·tat '+(cook.ii+1)+'/'+d.ings.length;
 document.getElementById('cook-fb').textContent='';
 document.getElementById('cook-step').innerHTML=g.emoji+' <b>'+g.name+'</b>: für 1 Per·son '+g.n+' → für '+f+' Per·so·nen?';
 renderCookPot(target);
 document.getElementById('cook-fridge').innerHTML='';
 renderCookPrep(g);
}
```

- [ ] **Step 2: `renderCookPrep` und `cookPrepStep` ersetzen**

Ersetze:

```js
function renderCookPrep(g){
 document.getElementById('cook-calc').innerHTML=
  '<div style="font-size:13px;font-weight:800;color:var(--muted);margin-bottom:8px">Erst vor·be·rei·ten, '+g.emoji+' '+g.name+':</div>'
  +'<div style="display:flex;gap:10px;justify-content:center">'
  +'<button class="btn bgray" id="cook-wash-btn" style="flex:1;max-width:150px" onclick="cookPrepStep(\'washed\')">🧼 Wasch es!</button>'
  +'<button class="btn bgray" id="cook-cut-btn" style="flex:1;max-width:150px" onclick="cookPrepStep(\'cut\')">🔪 Schnei·de es!</button>'
  +'</div>';
}
function cookPrepStep(key){
 if(cook[key])return;
 cook[key]=true;sfxStep();
 const btn=document.getElementById(key==='washed'?'cook-wash-btn':'cook-cut-btn');
 if(btn){btn.disabled=true;btn.style.opacity='.4';btn.textContent=(key==='washed'?'🧼 Ge·wa·schen ✓':'🔪 Ge·schnit·ten ✓');}
 if(cook.washed&&cook.cut)renderCookCalc();
}
```

durch:

```js
function renderCookPrep(g){
 const info=COOK_PREP_ACTIONS[g.name];
 cook.needActions=info.actions.slice();
 cook.doneActions=[];
 cook.prepTip=info.tip;
 document.getElementById('cook-calc').innerHTML=
  '<div style="font-size:13px;font-weight:800;color:var(--muted);margin-bottom:8px">Erst vor·be·rei·ten, '+g.emoji+' '+g.name+':</div>'
  +'<div id="cook-prep-row" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">'
  +COOK_ACTIONS.map(function(a){
   return '<button class="qopt" id="cook-act-'+a.key+'" style="padding:10px 6px;font-size:14px;min-width:100px;flex:1 1 40%" onclick="cookPrepStep(\''+a.key+'\')">'+a.emoji+'<br>'+a.label+'</button>';
  }).join('')
  +'</div>';
}
function cookPrepStep(key){
 if(cook.doneActions.indexOf(key)>=0)return;
 const btn=document.getElementById('cook-act-'+key);
 if(cook.needActions.indexOf(key)<0){
  sfxWrong();
  if(btn){btn.classList.add('wrong');setTimeout(function(){btn.classList.remove('wrong');},500);}
  setFb('cook-fb','Fast! Das passt hier nicht — pro·bier’s noch·mal 🍵',false);
  return;
 }
 cook.doneActions.push(key);sfxStep();
 document.getElementById('cook-fb').textContent='';
 if(btn){btn.disabled=true;btn.style.opacity='.4';btn.classList.add('right');}
 if(cook.doneActions.length>=cook.needActions.length){
  const row=document.getElementById('cook-prep-row');
  if(row)row.insertAdjacentHTML('afterend','<div style="margin-top:10px;font-size:13px;font-weight:800;color:var(--muted);background:#fff6ea;border-radius:12px;padding:8px">🍵 '+cook.prepTip+'</div>');
  setTimeout(renderCookCalc,1400);
 }
}
```

- [ ] **Step 3: Syntax-Check**

Run (gleicher Befehl wie Task 1, Step 2). Expected: beide Blöcke `OK`.

- [ ] **Step 4: Manuelle Verifikation im Browser**

```bash
python -m http.server 8000
```

Öffne `http://localhost:8000/`, gehe zu "Irohs Küche" (Belohnung & Ruhe-Kategorie), und prüfe für mindestens 3 unterschiedliche Gerichte (z. B. Mond·pfir·sich-Tar·te mit Ei, Jas·min-Tee-Kek·se mit Mehl/Butter, Gar·ten-Pizza mit Käse):

- Bei Ei erscheinen 4 Knöpfe, nur "🥚 Auf·schla·gen" ist korrekt; Antippen von "🧼 Wa·schen" zeigt kurz rote Markierung + Feedback-Text, verschwindet nach 0,5s wieder anklickbar.
- Nach korrekter Aktion erscheint Irohs Kommentar-Zeile, nach ca. 1,4s wechselt die Ansicht automatisch zur Rechen-Aufgabe.
- Bei einer Zutat mit 2 nötigen Aktionen (z. B. Möhre) müssen beide angetippt werden, bevor es weitergeht.
- Rechen-Aufgabe und Kühlschrank-Drag funktionieren unverändert wie vorher.

Server danach mit `Strg+C` beenden.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Irohs Kueche: Vorbereitung durch Zutat-passende Aktions-Auswahl ersetzt"
```

---

### Task 4: Sichtbare Verwandlung im Topf (Dampf/Puls-Animation)

**Files:**
- Modify: `index.html:3116-3135` (Funktionen `cookDrop`, `cookingWin`)

**Interfaces:**
- Consumes: `.pot-cooked`/`.steam-puff` CSS-Klassen (aus Task 2); `#cook-pot`-Element (bestehend, hat bereits `position:relative`).
- Produces: `cookSteamPulse(count)` — neue globale Funktion, `count` optional (Default 3).

- [ ] **Step 1: `cookSteamPulse` Funktion hinzufügen**

Füge direkt vor `function cookDrop(t){` (aktuell Zeile 3116) folgende neue Funktion ein:

```js
function cookSteamPulse(count){
 const pot=document.getElementById('cook-pot');
 if(!pot)return;
 pot.style.borderColor=cook.dish.col;
 pot.classList.remove('pot-cooked');void pot.offsetWidth;pot.classList.add('pot-cooked');
 const n=count||3;
 for(let i=0;i<n;i++){
  const s=document.createElement('div');
  s.className='steam-puff';s.textContent='💨';
  s.style.left=(24+i*(52/Math.max(n-1,1)))+'%';
  s.style.animationDelay=(i*0.12)+'s';
  pot.appendChild(s);
  setTimeout(function(){s.remove();},900);
 }
}
```

- [ ] **Step 2: `cookDrop` erweitern**

Ersetze:

```js
 if(cook.placed>=target){
  sfxRight();maybeCheer();
  setFb('cook-fb','✅ '+target+'× '+g.name+' im Topf! 🍲',true);
```

durch:

```js
 if(cook.placed>=target){
  cookSteamPulse();
  sfxRight();maybeCheer();
  setFb('cook-fb','✅ '+target+'× '+g.name+' im Topf! 🍲',true);
```

- [ ] **Step 3: `cookingWin` erweitern**

Ersetze:

```js
function cookingWin(){
 award(2);sfxWin();fireConfetti();
 document.getElementById('cook-win-score').innerHTML='<b>'+cook.dish.name+'</b> für '+cook.factor+' Per·so·nen ist fer·tig! +2 📜';
 go('s-cooking-win');
}
```

durch:

```js
function cookingWin(){
 cookSteamPulse(6);
 award(2);sfxWin();fireConfetti();
 document.getElementById('cook-win-score').innerHTML='<b>'+cook.dish.name+'</b> für '+cook.factor+' Per·so·nen ist fer·tig! +2 📜';
 go('s-cooking-win');
}
```

- [ ] **Step 4: Syntax-Check**

Run (gleicher Befehl wie Task 1, Step 2). Expected: beide Blöcke `OK`.

- [ ] **Step 5: Manuelle Verifikation im Browser**

```bash
python -m http.server 8000
```

Öffne `http://localhost:8000/`, koche ein komplettes Gericht durch (alle Zutaten):

- Nach jeder vollständig in den Topf gezogenen Zutat: Topf pulsiert kurz sichtbar (leicht größer/kleiner), 3 Dampf-Emojis steigen auf und verschwinden nach ca. 0,8s.
- Nach der letzten Zutat (Gerichts-Fertigstellung): deutlich mehr Dampf (6 Emojis) kurz bevor das Konfetti und der Sieg-Screen erscheinen.
- Keine JavaScript-Fehler in der Browser-Konsole während des kompletten Durchlaufs.

Server danach mit `Strg+C` beenden.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Irohs Kueche: sichtbare Dampf/Puls-Animation im Topf ergaenzt"
```

---

### Task 5: Mobil-Verifikation und Abschluss

**Files:** keine Code-Änderungen — reine Verifikation.

**Interfaces:** keine.

- [ ] **Step 1: Lokalen Server mit Netzwerk-Zugriff starten**

```bash
python -m http.server 8000 --bind 0.0.0.0
```

- [ ] **Step 2: Lokale IP ermitteln (falls nicht mehr bekannt)**

```bash
ipconfig | grep -A4 "Wireless LAN adapter Wi-Fi"
```

- [ ] **Step 3: Auf dem Handy testen**

Handy im gleichen WLAN, im Browser `http://<lokale-IP>:8000/` öffnen, zu "Irohs Küche" gehen und mindestens ein Gericht komplett durchkochen — Tippen der Aktions-Knöpfe, Rechen-Aufgabe, Kühlschrank-Drag, Topf-Animation. Alles muss per Touch genauso funktionieren wie am Desktop.

- [ ] **Step 4: Server stoppen**

Terminal mit dem laufenden Server mit `Strg+C` beenden (oder den Hintergrundprozess killen).

- [ ] **Step 5: Bei Kadir rückmelden**

Kurze Zusammenfassung an Kadir: was getestet wurde, ob alles wie erwartet lief, und ob auf dem Handy alles funktioniert hat — erst nach seinem OK gilt die Umsetzung als abgeschlossen (kein automatisierter Push ohne seine Bestätigung, siehe bisheriges Vorgehen bei Mobil-Fixes in diesem Projekt).

---

## Self-Review (durchgeführt beim Schreiben dieses Plans)

**Spec-Abdeckung:**
- Abschnitt 1 (4 feste Aktionen) → Task 1 (Datentabelle) + Task 3 (UI). ✓
- Abschnitt 2 (Zuordnungstabelle + Iroh-Kommentare, alle 23 Zutaten) → Task 1, vollständig ausformuliert, kein Platzhalter. ✓
- Abschnitt 3 (sichtbare Verwandlung im Topf) → Task 2 (CSS) + Task 4 (JS-Logik + beide Aufrufstellen). ✓
- Abschnitt 4 (betroffene Stellen) → jede genannte Funktion hat eine eigene Task-Zuordnung. ✓
- Testing-Abschnitt der Spec (manuell, alle 23 Zutaten, Mobil-Test) → Task 3/Step 4, Task 4/Step 5, Task 5 komplett. ✓

**Platzhalter-Scan:** Keine TBD/TODO, alle Code-Blöcke vollständig, alle 23 Tabelleneinträge ausformuliert (nicht nur Beispiele).

**Typ-/Namenskonsistenz:** `cook.needActions`/`cook.doneActions`/`cook.prepTip` konsistent in Task 3 definiert und verwendet; `cookSteamPulse(count)` in Task 4 einheitlich mit und ohne Argument aufgerufen (Default via `count||3`); CSS-Klassennamen `.pot-cooked`/`.steam-puff` in Task 2 definiert, in Task 4 exakt so referenziert.
