# Zerya English Mittel/Schwer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split Zerya's single "English (Hard)" quiz into two selectable levels — "English (Medium)" (B1, Sek-3-Zielniveau) and "English (Hard)" (B2/C1, bestehender Inhalt) — as two home-screen tiles.

**Architecture:** `zerya.html` is a single static HTML file with an inline `<script>` block. The quiz engine (`startQuiz`, `renderQ`, `answerQ`, `finishQuiz`) already works generically over any key in `QUIZBANKS`/`BANK` — no engine changes needed. This plan only (1) renames the existing bank/tile to `englishHard`, (2) adds a new `englishMedium` bank + tile, (3) updates the badge check that references the old single key.

**Tech Stack:** Plain HTML/CSS/JS, no build step, no test framework, `localStorage` for persistence.

## Global Constraints

- No automated test framework exists in this repo (no `package.json`, no test runner) — verification is manual, via loading the file in Chrome and clicking through the flow (per the codebase's existing pattern for the math-module change).
- Preserve existing `{q, a, o}` object format for every quiz bank entry (`q`=question string, `a`=correct answer string, `o`=array of 4 option strings including the correct one).
- Keep German UI copy conventions used elsewhere in the file (tile subtitles in English, matching existing tiles like "Vocab & grammar").
- Medium bank content must stay at B1 (CEFR) / Sek-3-Zielniveau — explicitly excludes 2nd/3rd conditional, reported speech, inversion, unreal past, whose/whom, gerund-after-verb patterns, and C1-register vocabulary (those stay exclusive to Hard).

---

### Task 1: Rename existing English bank/tile to `englishHard`

**Files:**
- Modify: `zerya.html:144` (home screen tile)
- Modify: `zerya.html:299` (`QUIZBANKS` entry)
- Modify: `zerya.html:643` (`BANK` key)
- Modify: `zerya.html:264` (Wordsmith badge check)

**Interfaces:**
- Consumes: existing `startQuiz(key)` function (unchanged, reads `QUIZBANKS[key]` and `BANK[key]`)
- Produces: `BANK.englishHard` (array, same content as old `BANK.english`), `QUIZBANKS.englishHard` (`{title:'English (Hard)', emoji:'🗣️'}`)

- [ ] **Step 1: Rename the tile's onclick handler**

In `zerya.html:144`, change:
```html
<div class="card" onclick="startQuiz('english')"><div class="ci">🗣️</div><div class="ct">English (Hard)</div><div class="cd">Vocab &amp; grammar</div></div>
```
to:
```html
<div class="card" onclick="startQuiz('englishHard')"><div class="ci">🗣️</div><div class="ct">English (Hard)</div><div class="cd">Vocab &amp; grammar</div></div>
```

- [ ] **Step 2: Rename the `QUIZBANKS` key**

In `zerya.html:299`, change:
```js
 english:{title:'English (Hard)',emoji:'🗣️'},
```
to:
```js
 englishHard:{title:'English (Hard)',emoji:'🗣️'},
```

- [ ] **Step 3: Rename the `BANK` key**

In `zerya.html:643`, change:
```js
english:[
```
to:
```js
englishHard:[
```
(The array contents below it, lines 644–703, stay exactly as they are.)

- [ ] **Step 4: Update the Wordsmith badge check**

In `zerya.html:264`, change:
```js
 {id:'wordsmith',e:'🗣️',n:'Wordsmith',d:'Finish an English quiz',check:function(){return !!DATA.quizDone.english;}},
```
to:
```js
 {id:'wordsmith',e:'🗣️',n:'Wordsmith',d:'Finish an English quiz',check:function(){return !!DATA.quizDone.englishMedium || !!DATA.quizDone.englishHard;}},
```

- [ ] **Step 5: Manual verification**

Serve the repo root (`python -m http.server 8743` or equivalent) and open `http://localhost:8743/index.html` in Chrome. Navigate: index.html → "Familie" → arena.html → profile "Zerya" → zerya.html. Click the "English (Hard)" tile. Confirm the quiz starts and shows a question (title bar should read "English (Hard)"). Finish the quiz, confirm no console errors, and confirm the "Wordsmith" badge unlocks (Badge Shelf screen).

- [ ] **Step 6: Commit**

```bash
git add zerya.html
git commit -m "Zeryas English-Quiz-Bank auf englishHard umbenannt (Vorbereitung Mittel-Niveau)"
```

---

### Task 2: Add the `englishMedium` bank (B1 content)

**Files:**
- Modify: `zerya.html` — insert a new `BANK.englishMedium` array immediately before the (now renamed) `englishHard:[` array (i.e., right after the `var BANK={` line, so `englishMedium` is the first key in the object)

**Interfaces:**
- Consumes: same `{q, a, o}` format as `englishHard`
- Produces: `BANK.englishMedium` (array of 36 question objects) — consumed by Task 3's tile via `startQuiz('englishMedium')`

- [ ] **Step 1: Insert the new bank**

In `zerya.html`, find:
```js
var BANK={
englishHard:[
```
and change it to:
```js
var BANK={
englishMedium:[
{q:"'Borrow' means to…",a:'take something and give it back later',o:['take something and give it back later','give something away permanently','buy something new','lose something']},
{q:"'Lend' means to…",a:'give something to someone temporarily',o:['give something to someone temporarily','take something from someone','borrow something','keep something forever']},
{q:"'Enormous' means…",a:'very big',o:['very big','very small','very old','very cheap']},
{q:"'Exhausted' means…",a:'very tired',o:['very tired','very happy','very hungry','very fast']},
{q:"'Furious' means…",a:'very angry',o:['very angry','very calm','very sad','very bored']},
{q:"'Delighted' means…",a:'very happy',o:['very happy','very angry','very tired','very confused']},
{q:"'Fix' can mean to…",a:'repair',o:['repair','break','sell','buy']},
{q:"'Look for' means to…",a:'search for',o:['search for','find immediately','give away','throw away']},
{q:"'Give up' means to…",a:'stop trying',o:['stop trying','start again','win','continue']},
{q:"'Turn down' an offer means to…",a:'refuse it',o:['refuse it','accept it','forget it','repeat it']},
{q:"'Find out' means to…",a:'discover',o:['discover','hide','forget','ignore']},
{q:"'Get on with' someone means to…",a:'have a good relationship with them',o:['have a good relationship with them','argue with them a lot','avoid them','compete with them']},
{q:"Idiom: 'It's raining cats and dogs' means…",a:"it's raining heavily",o:["it's raining heavily",'animals are falling','it’s sunny','it’s very quiet']},
{q:"Idiom: 'to break the ice' means to…",a:'make people feel more relaxed',o:['make people feel more relaxed','end a friendship','start a fight','cancel a plan']},
{q:"'Eventually' means…",a:'in the end',o:['in the end','possibly','never','immediately']},
{q:"'Actually' means…",a:'in fact, really',o:['in fact, really','at the moment','currently','soon']},
{q:"'Rarely' means…",a:'not often',o:['not often','very often','always','never']},
{q:"'I ___ to Paris last summer.' (finished action, specific time)",a:'went',o:['went','have gone','go','was going']},
{q:"'She ___ never ___ sushi before.' (Present Perfect)",a:'has / eaten',o:['has / eaten','have / eaten','did / eat','was / eating']},
{q:"'If it ___ tomorrow, we will stay home.' (1st Conditional)",a:'rains',o:['rains','will rain','rained','would rain']},
{q:"'If you study hard, you ___ pass the exam.'",a:'will',o:['will','would','can','must']},
{q:"'English ___ all over the world.' (Present Simple Passive)",a:'is spoken',o:['is spoken','speaks','was spoken','is speaking']},
{q:"'The letter ___ yesterday.' (Past Simple Passive)",a:'was written',o:['was written','wrote','is written','has written']},
{q:"'You ___ wear a seatbelt in the car.' (obligation)",a:'must',o:['must','might','could','would']},
{q:"'It ___ rain later, take an umbrella just in case.' (possibility)",a:'might',o:['might','must','have to','should']},
{q:"'This book is ___ than that one.' (interesting)",a:'more interesting',o:['more interesting','interestinger','most interesting','interesting']},
{q:"'This is ___ day of my life.' (good)",a:'the best',o:['the best','the goodest','more good','gooder']},
{q:"'The girl ___ sits next to me is my cousin.'",a:'who',o:['who','which','whose','whom']},
{q:"'That's the book ___ I told you about.'",a:'that',o:['that','who','whose','whom']},
{q:"'You like pizza, ___?' (question tag)",a:"don't you",o:["don't you",'do you','aren’t you','didn’t you']},
{q:"'She isn't coming, ___?' (question tag)",a:'is she',o:['is she','isn’t she','does she','doesn’t she']},
{q:"'The meeting is ___ Monday ___ 9 o'clock.'",a:'on / at',o:['on / at','in / on','at / in','on / on']},
{q:"'I was born ___ 2011.'",a:'in',o:['in','on','at','since']},
{q:"'She has lived here ___ five years.' (duration)",a:'for',o:['for','since','from','at']},
{q:"'He has worked here ___ 2020.' (starting point)",a:'since',o:['since','for','from','at']},
{q:"'I enjoy ___ books.' (gerund after enjoy)",a:'reading',o:['reading','to read','read','reads']},
{q:"'We ___ go to the cinema every Friday.' (habit)",a:'usually',o:['usually','usual','usually to','use to']}
],
englishHard:[
```

- [ ] **Step 2: Manual verification**

Reload `zerya.html` in the Chrome tab already open (`ctrl+r` or the `navigate` tool with `url:"forward"`/re-navigate). Open the browser console (or use the `read_console_messages` tool) and confirm there are no JS syntax errors on load — a syntax error in the array (e.g. a stray comma) will break the whole script and the home screen won't render at all, which is the fastest signal something is wrong.

- [ ] **Step 3: Commit**

```bash
git add zerya.html
git commit -m "Neue englishMedium-Fragenbank (36 Fragen, B1/Sek-3-Niveau)"
```

---

### Task 3: Add the "English (Medium)" tile and wire it up

**Files:**
- Modify: `zerya.html:143-144` (Brain-Stuff tile cluster)
- Modify: `zerya.html:299` (`QUIZBANKS`)

**Interfaces:**
- Consumes: `BANK.englishMedium` (from Task 2), `startQuiz(key)` (unchanged)
- Produces: working "English (Medium)" tile

- [ ] **Step 1: Add the `QUIZBANKS` entry**

In `zerya.html:299` area, change:
```js
 englishHard:{title:'English (Hard)',emoji:'🗣️'},
```
to:
```js
 englishMedium:{title:'English (Medium)',emoji:'🗣️'},
 englishHard:{title:'English (Hard)',emoji:'🗣️'},
```

- [ ] **Step 2: Add the home-screen tile**

In `zerya.html:143-144`, change:
```html
   <div class="card" onclick="startQuiz('math')"><div class="ci">🧮</div><div class="ct">Algebra</div><div class="cd">Terme, Gleichungen &amp; Variablen</div></div>
   <div class="card" onclick="startQuiz('englishHard')"><div class="ci">🗣️</div><div class="ct">English (Hard)</div><div class="cd">Vocab &amp; grammar</div></div>
```
to:
```html
   <div class="card" onclick="startQuiz('math')"><div class="ci">🧮</div><div class="ct">Algebra</div><div class="cd">Terme, Gleichungen &amp; Variablen</div></div>
   <div class="card" onclick="startQuiz('englishMedium')"><div class="ci">🗣️</div><div class="ct">English (Medium)</div><div class="cd">Vocab &amp; grammar</div></div>
   <div class="card" onclick="startQuiz('englishHard')"><div class="ci">🗣️</div><div class="ct">English (Hard)</div><div class="cd">Vocab &amp; grammar</div></div>
```

- [ ] **Step 3: Manual verification**

Reload zerya.html in Chrome. Confirm three tiles now show: Algebra, English (Medium), English (Hard). Click "English (Medium)", confirm the quiz starts, title bar reads "English (Medium)", and the questions shown are B1-level (not the old advanced-vocab ones). Play through all 10 questions to `qresult`, confirm score displays and "Play again" restarts the same level. Go back home, click "English (Hard)", confirm it still shows the original advanced content. Check the Badge Shelf: finishing either quiz should unlock "Wordsmith".

- [ ] **Step 4: Commit**

```bash
git add zerya.html
git commit -m "English (Medium)-Kachel hinzugefuegt, zwei Niveaus jetzt waehlbar"
```
