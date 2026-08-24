# Zerya „Politik & Welt" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a quiz-free reading module „Politik & Welt" to Zerya's World (`zerya.html`): a new home-screen tile opens a list of 16 political topics; tapping a topic opens a detail screen with the full text; reading all 16 unlocks a new badge.

**Architecture:** `zerya.html` is a single static HTML file with an inline `<script>` block, `localStorage`-backed `DATA` object, and a `show(id)` screen-navigation pattern. This plan adds one new content array (`POLITICS`), one new `DATA` field (`politicsRead`), two new `.screen` divs, two new render functions (`renderPolitics`, `openPolitic`), reuses the existing `.manga`/`.mcard`/`.panel` CSS classes, and adds one entry to the existing `BADGES` array. No changes to the quiz engine, badge-checking loop, or persistence mechanism are needed — all of it is generic already.

**Tech Stack:** Plain HTML/CSS/JS, no build step, no test framework, `localStorage` for persistence.

## Global Constraints

- No automated test framework exists in this repo (no `package.json`, no test runner) — verification is manual, via loading the file in Chrome and clicking through the flow (per the codebase's existing pattern, see `docs/superpowers/plans/2026-07-28-zerya-english-niveaus.md`).
- No quiz/points for reading topics — only a single completion badge (per approved spec, `docs/superpowers/specs/2026-08-03-zerya-politik-welt-design.md`).
- Content must be neutral and factual on conflict topics (no one-sided framing), age-appropriate for 14–16.
- Reuse existing CSS classes (`.manga`, `.mcard`, `.panel`, `.note`, `.qhead`, `.back`) — no new CSS system, only minimal additions where an existing class doesn't cover a need (clickable whole-card cursor).

---

### Task 1: Add `POLITICS` content, `DATA.politicsRead`, and the `weltoffen` badge

**Files:**
- Modify: `zerya.html:248` (`DATA` default object)
- Modify: `zerya.html:263-278` (`BADGES` array)
- Modify: `zerya.html` — insert new `POLITICS` array + `renderPolitics`/`openPolitic` functions after the `renderManga` function (currently ends at line 603, right before the `/* ============ MEMORY GAME ============ */` comment at line 605)
- Modify: `zerya.html:914` (`INIT` block) — add `renderPolitics();` call

**Interfaces:**
- Consumes: existing `DATA`/`saveData`/`checkBadges`/`show` functions (unchanged signatures)
- Produces: `POLITICS` (array of `{id, e, n, teaser, text}`), `DATA.politicsRead` (array of read topic ids), `renderPolitics()` (fills `#politics-grid`, consumed by Task 2's screen), `openPolitic(id)` (fills `#pol-title`/`#pol-text` and navigates to `politics-detail`, consumed by Task 2's screen)

- [ ] **Step 1: Add the `politicsRead` field to the `DATA` default object**

In `zerya.html:248`, change:
```js
var DATA={points:0,quizDone:{},gamesWon:0,promptsGenerated:0,memesSeen:0,shortsSeen:0,mangaList:[],favPrompts:[],badgesUnlocked:[]};
```
to:
```js
var DATA={points:0,quizDone:{},gamesWon:0,promptsGenerated:0,memesSeen:0,shortsSeen:0,mangaList:[],favPrompts:[],badgesUnlocked:[],politicsRead:[]};
```

- [ ] **Step 2: Add the `weltoffen` badge**

In `zerya.html:273`, after the line:
```js
 {id:'bingewatcher',e:'🎬',n:'Shorts Binge',d:'Swipe 20 shorts',check:function(){return DATA.shortsSeen>=20;}},
```
insert a new line right after it:
```js
 {id:'weltoffen',e:'🌍',n:'Weltoffen',d:'Alle Politik-Themen gelesen',check:function(){return DATA.politicsRead.length>=POLITICS.length;}},
```
(`POLITICS` is defined later in the file via `var`, but this `check` function is only ever called from `checkBadges()` after the full script has parsed, so the forward reference is safe — same pattern already used throughout this file.)

- [ ] **Step 3: Insert the `POLITICS` content array and render/open functions**

In `zerya.html`, find the end of `renderManga` (the closing of the function, immediately before the `/* ============ MEMORY GAME ============ */` comment):
```js
function renderManga(){
 var g=document.getElementById('manga-grid');g.innerHTML='';
 MANGA_LIST.forEach(function(m){
  var saved=DATA.mangaList.indexOf(m.n)>=0;
  var d=document.createElement('div');d.className='mcard';
  d.innerHTML='<div class="me">'+m.e+'</div><div><div class="mn">'+m.n+'</div><div class="mh">'+m.h+'</div><div class="mtag">'+m.tag+'</div></div><button class="mstar">'+(saved?'★':'☆')+'</button>';
  d.querySelector('.mstar').onclick=function(ev){
   ev.stopPropagation();
   var idx=DATA.mangaList.indexOf(m.n);
   if(idx>=0)DATA.mangaList.splice(idx,1);else DATA.mangaList.push(m.n);
   checkBadges();saveData();renderManga();
  };
  g.appendChild(d);
 });
}

/* ============ MEMORY GAME ============ */
```
and change it to (inserting the new block between `renderManga`'s closing `}` and the memory-game comment):
```js
function renderManga(){
 var g=document.getElementById('manga-grid');g.innerHTML='';
 MANGA_LIST.forEach(function(m){
  var saved=DATA.mangaList.indexOf(m.n)>=0;
  var d=document.createElement('div');d.className='mcard';
  d.innerHTML='<div class="me">'+m.e+'</div><div><div class="mn">'+m.n+'</div><div class="mh">'+m.h+'</div><div class="mtag">'+m.tag+'</div></div><button class="mstar">'+(saved?'★':'☆')+'</button>';
  d.querySelector('.mstar').onclick=function(ev){
   ev.stopPropagation();
   var idx=DATA.mangaList.indexOf(m.n);
   if(idx>=0)DATA.mangaList.splice(idx,1);else DATA.mangaList.push(m.n);
   checkBadges();saveData();renderManga();
  };
  g.appendChild(d);
 });
}

/* ============ POLITIK & WELT ============ */
var POLITICS=[
 {id:'demokratie',e:'🗳️',n:'Demokratie',teaser:'Das Volk bestimmt mit – direkt oder über gewählte Vertreter.',text:'In einer Demokratie entscheidet nicht eine einzelne Person allein, sondern das Volk – entweder direkt durch Abstimmungen oder über gewählte Vertreter:innen im Parlament. Wichtige Grundpfeiler sind freie Wahlen, Meinungsfreiheit und der Schutz von Minderheiten. Die Schweiz gilt als besonders demokratisch, weil die Bevölkerung auch über einzelne Gesetze direkt abstimmen kann.'},
 {id:'diktatur',e:'⛓️',n:'Diktatur',teaser:'Eine Person oder kleine Gruppe hat die Macht – ohne freie Wahlen.',text:'In einer Diktatur liegt die gesamte Macht bei einer einzelnen Person oder einer kleinen Gruppe, die sich nicht durch freie Wahlen kontrollieren lässt. Kritik an der Regierung wird oft unterdrückt, und Medien sind meist nicht frei. Diktaturen gibt es auch heute noch in verschiedenen Teilen der Welt, auch wenn sie sich manchmal „demokratisch" nennen.'},
 {id:'gewaltenteilung',e:'⚖️',n:'Gewaltenteilung',teaser:'Macht wird auf drei unabhängige Bereiche verteilt.',text:'Damit niemand zu viel Macht bekommt, wird sie in vielen Staaten aufgeteilt: Die Legislative macht Gesetze (Parlament), die Exekutive setzt sie um (Regierung), und die Judikative prüft, ob sie eingehalten werden (Gerichte). Diese drei Bereiche kontrollieren sich gegenseitig. Das Prinzip nennt man Gewaltenteilung, und es soll Machtmissbrauch verhindern.'},
 {id:'menschenrechte',e:'🕊️',n:'Menschenrechte',teaser:'Rechte, die jedem Menschen einfach zustehen.',text:'Menschenrechte sind Rechte, die jeder Mensch besitzt – unabhängig von Herkunft, Geschlecht oder Religion. Dazu gehören zum Beispiel das Recht auf Leben, freie Meinungsäusserung und Bildung. 1948 wurden sie in der Allgemeinen Erklärung der Menschenrechte der UNO weltweit festgehalten. Trotzdem werden sie bis heute in vielen Ländern verletzt.'},
 {id:'wahlen-parteien',e:'🗳️',n:'Wahlen & Parteien',teaser:'Wie Bürger:innen ihre Stimme abgeben und wer sie vertritt.',text:'Bei Wahlen bestimmen Bürger:innen, wer sie im Parlament oder in der Regierung vertritt. Parteien sind Gruppen von Menschen mit ähnlichen politischen Ideen, die um Stimmen konkurrieren. In der Schweiz gibt es viele verschiedene Parteien, die von links bis rechts das ganze politische Spektrum abdecken. Wer eine Partei wählt, wählt also auch eine bestimmte Richtung für die Zukunft.'},
 {id:'verfassung',e:'📜',n:'Verfassung',teaser:'Die Grundregeln eines Staates – das oberste Gesetz.',text:'Eine Verfassung legt die wichtigsten Regeln eines Staates fest: wie die Regierung funktioniert, welche Rechte Bürger:innen haben und wie Gesetze entstehen. Sie steht über allen anderen Gesetzen – nichts darf ihr widersprechen. Die Schweizer Bundesverfassung kann nur geändert werden, wenn Volk und Stände in einer Abstimmung zustimmen.'},
 {id:'direkte-demokratie-ch',e:'🇨🇭',n:'Direkte Demokratie Schweiz',teaser:'In der Schweiz stimmt das Volk oft direkt über Gesetze ab.',text:'Die Schweiz hat ein besonderes System: Neben den gewählten Politiker:innen kann das Volk auch direkt über einzelne Gesetze abstimmen. Mit einer Volksinitiative können Bürger:innen sogar eine neue Verfassungsänderung vorschlagen, wenn sie genug Unterschriften sammeln. Mit einem Referendum kann ein vom Parlament beschlossenes Gesetz nochmals dem Volk zur Abstimmung vorgelegt werden. Deshalb wird in der Schweiz oft mehrmals im Jahr abgestimmt – über sehr unterschiedliche Themen.'},
 {id:'bundesrat-parlament',e:'🏛️',n:'Bundesrat & Parlament',teaser:'Wer die Schweiz regiert – und wer die Gesetze macht.',text:'Das Schweizer Parlament besteht aus zwei Kammern: dem Nationalrat (Volk) und dem Ständerat (Kantone). Zusammen wählen sie den Bundesrat – die Regierung der Schweiz mit sieben Mitgliedern, die gemeinsam entscheiden. Es gibt in der Schweiz also keine einzelne Präsidentin oder einen einzelnen Präsidenten mit grosser Macht, wie in vielen anderen Ländern. Der Bundespräsident wechselt jährlich und ist vor allem repräsentativ.'},
 {id:'uno',e:'🌐',n:'UNO',teaser:'Die Vereinten Nationen – fast alle Staaten der Welt an einem Tisch.',text:'Die UNO (Vereinte Nationen) wurde 1945 nach dem Zweiten Weltkrieg gegründet, um Kriege zu verhindern und die Zusammenarbeit zwischen Staaten zu fördern. Fast alle Länder der Welt sind Mitglied. Die UNO kümmert sich unter anderem um Frieden, Menschenrechte, Klimaschutz und Nothilfe bei Katastrophen. Der Sitz der UNO in Europa liegt übrigens in Genf, in der Schweiz.'},
 {id:'eu',e:'🇪🇺',n:'Die EU',teaser:'27 Länder Europas, die eng zusammenarbeiten.',text:'Die Europäische Union (EU) ist ein Zusammenschluss von 27 europäischen Ländern, die in vielen Bereichen eng zusammenarbeiten – etwa bei Handel, Reisen oder Umweltschutz. In vielen Mitgliedsländern gibt es eine gemeinsame Währung, den Euro. Die Schweiz ist kein EU-Mitglied, arbeitet aber über spezielle Verträge eng mit der EU zusammen.'},
 {id:'nato',e:'🛡️',n:'NATO',teaser:'Ein Verteidigungsbündnis mehrerer Staaten.',text:'Die NATO ist ein Militärbündnis, dem heute über 30 Länder angehören, vor allem aus Europa und Nordamerika. Der Grundgedanke: Wird ein Mitgliedsland angegriffen, gilt das als Angriff auf alle. Die NATO wurde während des Kalten Krieges gegründet, existiert aber bis heute weiter. Die Schweiz ist als neutrales Land kein NATO-Mitglied.'},
 {id:'mauerfall',e:'🧱',n:'Fall der Berliner Mauer',teaser:'1989: Das Ende der Teilung Deutschlands begann.',text:'Von 1961 bis 1989 teilte die Berliner Mauer die Stadt Berlin – und symbolisch die Welt – in Ost und West. Am 9. November 1989 wurde die Grenze überraschend geöffnet, und Menschen aus Ost- und Westberlin feierten gemeinsam an der Mauer. Ein Jahr später, 1990, wurden Ost- und Westdeutschland offiziell wiedervereinigt. Der Mauerfall gilt bis heute als eines der wichtigsten Symbole für das Ende des Kalten Krieges.'},
 {id:'kalter-krieg',e:'☭',n:'Kalter Krieg',teaser:'Jahrzehnte der Spannung zwischen Ost und West.',text:'Nach dem Zweiten Weltkrieg standen sich zwei Machtblöcke gegenüber: die USA und ihre Verbündeten auf der einen, die Sowjetunion und ihre Verbündeten auf der anderen Seite. Es kam nie zu einem direkten Krieg zwischen den beiden Supermächten, aber zu vielen Stellvertreterkonflikten und einem Wettrüsten mit Atomwaffen. Der Kalte Krieg endete Anfang der 1990er-Jahre mit dem Zusammenbruch der Sowjetunion. Viele heutige politische Spannungen haben ihre Wurzeln in dieser Zeit.'},
 {id:'klimapolitik',e:'🌡️',n:'Klimapolitik & Paris-Abkommen',teaser:'Wie Staaten gemeinsam gegen die Erderwärmung vorgehen.',text:'Im Pariser Klimaabkommen von 2015 einigten sich fast alle Staaten der Welt darauf, die Erderwärmung möglichst auf 1,5 bis 2 Grad zu begrenzen. Dafür müssen Länder ihren CO2-Ausstoss senken, zum Beispiel durch erneuerbare Energien statt Kohle und Öl. Die Umsetzung ist allerdings freiwillig, weshalb Kritiker:innen das Abkommen als zu zahnlos bezeichnen. Klimapolitik ist heute eines der wichtigsten Themen in fast jedem Land.'},
 {id:'ukraine-krieg',e:'🇺🇦',n:'Krieg in der Ukraine',teaser:'Seit 2022 ein grosser bewaffneter Konflikt in Europa.',text:'Im Februar 2022 begann Russland eine grossangelegte Invasion der Ukraine, nachdem es bereits 2014 die Krim annektiert hatte. Der Krieg hat Millionen Menschen zur Flucht gezwungen und gilt als einer der grössten bewaffneten Konflikte in Europa seit dem Zweiten Weltkrieg. International wurde Russland für den Angriff von den meisten Staaten scharf verurteilt und mit Sanktionen belegt. Viele Länder unterstützen die Ukraine seither mit humanitärer Hilfe, Geld oder Waffen.'},
 {id:'migration-asyl',e:'🧳',n:'Migration & Asyl',teaser:'Warum Menschen ihre Heimat verlassen – und was Asyl bedeutet.',text:'Menschen verlassen ihre Heimat aus ganz unterschiedlichen Gründen: Krieg, Verfolgung, Armut oder Naturkatastrophen. Wer in einem anderen Land Asyl beantragt, bittet um Schutz, weil er oder sie in der Heimat verfolgt wird oder in Gefahr ist. Migration ist eines der meistdiskutierten politischen Themen unserer Zeit, mit sehr unterschiedlichen Meinungen dazu. Die Schweiz hat ein eigenes Asylverfahren, das genau prüft, wer Schutz erhält.'}
];
function renderPolitics(){
 var g=document.getElementById('politics-grid');g.innerHTML='';
 POLITICS.forEach(function(p){
  var read=DATA.politicsRead.indexOf(p.id)>=0;
  var d=document.createElement('div');d.className='mcard polcard';
  d.innerHTML='<div class="me">'+p.e+'</div><div><div class="mn">'+p.n+'</div><div class="mh">'+p.teaser+'</div>'+(read?'<div class="mtag">✓ Gelesen</div>':'')+'</div>';
  d.onclick=function(){openPolitic(p.id);};
  g.appendChild(d);
 });
}
function openPolitic(id){
 var p=POLITICS.filter(function(x){return x.id===id;})[0];
 if(!p)return;
 document.getElementById('pol-title').textContent=p.e+' '+p.n;
 document.getElementById('pol-text').textContent=p.text;
 if(DATA.politicsRead.indexOf(id)<0){DATA.politicsRead.push(id);checkBadges();saveData();}
 show('politics-detail');
}

/* ============ MEMORY GAME ============ */
```

- [ ] **Step 4: Call `renderPolitics()` at init**

In `zerya.html:914`, change:
```js
renderManga();
document.getElementById('shorts-count').textContent=DATA.shortsSeen+' seen';
```
to:
```js
renderManga();
renderPolitics();
document.getElementById('shorts-count').textContent=DATA.shortsSeen+' seen';
```

- [ ] **Step 5: Manual verification (no UI yet — checking for syntax errors)**

Serve the repo root (`python -m http.server 8743` or equivalent) and open `http://localhost:8743/zerya.html` directly in Chrome (the new screens aren't reachable from the UI yet, so load the file directly to check it still parses). Use the `read_console_messages` tool to confirm there are no JS errors on load (a stray comma or unescaped quote in the `POLITICS` array would break the entire script and the home screen wouldn't render at all — that's the fastest signal something is wrong). Confirm the home screen still renders normally with all existing tiles.

- [ ] **Step 6: Commit**

```bash
git add zerya.html
git commit -m "Politik-Inhalte, Lese-Tracking und Weltoffen-Badge fuer Zeryas World ergaenzt"
```

---

### Task 2: Add the home-screen tile, the two new screens, and wire up navigation

**Files:**
- Modify: `zerya.html:83-90` (manga carousel CSS block) — add one CSS rule for the clickable whole-card cursor
- Modify: `zerya.html:149-151` (home screen, between the „Brain Stuff" and „Games & Fun" clusters)
- Modify: `zerya.html:217` (screens section, right after the `mangalist` screen, before the `shorts` screen)

**Interfaces:**
- Consumes: `renderPolitics()` and `openPolitic(id)` from Task 1, existing `show(id)` navigation function
- Produces: working „Politik & Welt" tile and its two screens (`politics`, `politics-detail`)

- [ ] **Step 1: Add the `.polcard` cursor rule**

In `zerya.html`, find the manga carousel CSS block:
```css
/* manga carousel */
.manga{display:flex;flex-direction:column;gap:10px}
.mcard{background:var(--panel);border:3px solid var(--line);border-radius:16px;padding:12px 14px;display:flex;gap:12px;align-items:center;box-shadow:3px 3px 0 var(--line)}
```
and change it to:
```css
/* manga carousel */
.manga{display:flex;flex-direction:column;gap:10px}
.mcard{background:var(--panel);border:3px solid var(--line);border-radius:16px;padding:12px 14px;display:flex;gap:12px;align-items:center;box-shadow:3px 3px 0 var(--line)}
.mcard.polcard{cursor:pointer}
```

- [ ] **Step 2: Add the home-screen cluster**

In `zerya.html:149-151`, change:
```html
  </div>
 </div>

 <div class="cluster">
  <h2>🎮 Games &amp; Fun</h2>
```
to:
```html
  </div>
 </div>

 <div class="cluster">
  <h2>🌍 Politik &amp; Welt</h2>
  <div class="card wide" onclick="show('politics');renderPolitics()"><div class="ci">🌍</div><div class="ct">Politik &amp; Welt</div><div class="cd">Wichtige Begriffe &amp; Ereignisse zum Nachlesen</div></div>
 </div>

 <div class="cluster">
  <h2>🎮 Games &amp; Fun</h2>
```

- [ ] **Step 3: Add the two new screens**

In `zerya.html`, find:
```html
<!-- ===== MANGA LIST ===== -->
<div id="mangalist" class="screen">
 <button class="back" onclick="show('home')">← Back</button>
 <div class="qhead"><div class="qt">Manga &amp; Anime Picks 📖</div></div>
 <p class="note" style="margin-bottom:10px">Tap ☆ to save one to your list.</p>
 <div class="manga" id="manga-grid"></div>
</div>

<!-- ===== SHORTS ===== -->
```
and change it to:
```html
<!-- ===== MANGA LIST ===== -->
<div id="mangalist" class="screen">
 <button class="back" onclick="show('home')">← Back</button>
 <div class="qhead"><div class="qt">Manga &amp; Anime Picks 📖</div></div>
 <p class="note" style="margin-bottom:10px">Tap ☆ to save one to your list.</p>
 <div class="manga" id="manga-grid"></div>
</div>

<!-- ===== POLITICS LIST ===== -->
<div id="politics" class="screen">
 <button class="back" onclick="show('home')">← Back</button>
 <div class="qhead"><div class="qt">Politik &amp; Welt 🌍</div></div>
 <p class="note" style="margin-bottom:10px">Tippe ein Thema an zum Lesen.</p>
 <div class="manga" id="politics-grid"></div>
</div>

<!-- ===== POLITICS DETAIL ===== -->
<div id="politics-detail" class="screen">
 <button class="back" onclick="show('politics')">← Back</button>
 <div class="qhead"><div class="qt" id="pol-title"></div></div>
 <div class="panel" id="pol-text"></div>
</div>

<!-- ===== SHORTS ===== -->
```

- [ ] **Step 4: Manual verification — full click-through in Chrome**

Reload `zerya.html` in Chrome (or navigate to `http://localhost:8743/zerya.html` again). On the home screen, confirm a new „🌍 Politik & Welt" cluster appears between „Brain Stuff" and „Games & Fun" with one wide card. Click it: confirm the `politics` screen opens showing 16 topic cards, each with an icon, title, and one-sentence teaser, none marked "✓ Gelesen" yet. Tap the first card ("Demokratie"): confirm the `politics-detail` screen opens showing the full paragraph text and a working "← Back" button that returns to the topic list (not the home screen). Confirm the "Demokratie" card in the list now shows a "✓ Gelesen" tag. Read all 16 topics (tap each once, back out to the list each time). After the 16th, go to the Badge Shelf (home → „View your badges") and confirm the "Weltoffen 🌍" badge is now unlocked (not greyed out). Use `read_console_messages` to confirm no JS errors occurred during the whole flow.

- [ ] **Step 5: Commit**

```bash
git add zerya.html
git commit -m "Politik & Welt: neue Kachel, Themenliste und Detailansicht in Zeryas World"
```
