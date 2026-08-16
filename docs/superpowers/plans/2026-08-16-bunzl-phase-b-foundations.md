# Bunzl Phase B: Foundations Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Phase A's single placeholder Foundations lesson with the real 4-lesson curriculum, a real hub page, a 4-question quiz, and a retextured take-home capstone ("The Loading Dock"), using only the shared infrastructure Phase A already built (nav.js/training-sidebar.js/slides-engine.js/progress-model.js/interactive.js) — no logic changes, only data.

**Architecture:** Content-only phase. Every file this plan creates or edits is either (a) a new lesson HTML file following the existing lesson template (`.module-strip` → `.page-header` → `.section`s), (b) an existing manifest array expanded from 1 entry to 4 (`nav.js` `CRAFTS[0]`, `training-sidebar.js` `MODULES[0]`, `foundations-slides.html`'s `SLIDES_CFG`), or (c) `escape-room/`'s config/copy retextured in place. No JS logic in `nav.js`, `training-sidebar.js`, `slides-engine.js`, `progress-model.js`, or `interactive.js`'s rendering functions changes — all were confirmed generic over lesson/quiz content in Phase A.

**Tech Stack:** Same as Phase A — vanilla HTML/CSS/JS, no build step. `node --test progress-model.test.js` is the regression check after any `interactive.js` edit (Task 4 adds quiz questions to the existing `QUIZZES.foundations` object; it does not touch `progress-model.js` or any function this plan doesn't name).

## Global Constraints

- All facts must be traceable to `bunzl-context.md` — do not invent a Microsoft or Bunzl fact not already in that document. Where this plan quotes a fact, it's sourced from `bunzl-context.md`'s §3/§4; do not add specificity (exact prices, model names, allowance figures) beyond what that document itself treats as confirmed rather than provisional.
- Never use "in-person," "in the room," or "bring your laptop" — this program is virtual/recorded (per `bunzl-context.md` §1 and Phase A's Global Constraints, still binding).
- Bunzl's confirmed preferred term for its workforce in practitioner-facing copy is **"team members"** (`bunzl-context.md` §1) — never "employees" or "teammates" in new lesson/hub copy.
- Track accent color for all Foundations content: `var(--teal)` / `#2f6b66` (dark) — unchanged from Phase A.
- File naming: `pages/training/foundations-NN-slug.html`, sequential within the Foundations track only (per Phase A's Global Constraints, still binding — per-track numbering, not cross-track).
- Every new lesson file follows the exact `<head>`/script-tag/`.module-strip` skeleton established in Phase A's `foundations-01-overview.html` (Task 2 of the Phase A plan) — reuse that structure, not a new one.
- Card classes used in lesson body content must be drawn from the four styled-in-`shared.css` classes DESIGN-SYSTEM.md recommends (`.insight-card`, `.dev-card`, `.bp-item`, `.tip-trick`) so both the lesson page and the auto-generated slide look right — confirmed present and styled in `styles/shared.css` from Phase A's codebase exploration.
- A `.section` that should NOT generate a slide (the quiz section) must have no `h2.sec-title` inside it — the exact convention Phase A's Task 10 review established and fixed.
- Working directory for every command below: repo root (`/Users/derrikkbroughton/Desktop/nimble-gravity-microsoft-copilot-bunzl`).

---

### Task 1: Lesson 1 — The Copilot Landscape

**Files:**
- Create: `pages/training/foundations-01-the-copilot-landscape.html`
- Delete: `pages/training/foundations-01-overview.html`

**Interfaces:**
- Consumes: the `.module-strip` skeleton pattern from Phase A's stub lesson (unchanged: Foundations active, Advanced/Governance upcoming — see Global Constraints; this does not change per-lesson within a track).
- Produces: the file Task 5's `nav.js`/`training-sidebar.js`/`foundations-slides.html` entries reference as lesson 1 of 4.

- [ ] **Step 1: Delete the Phase A placeholder**

```bash
rm pages/training/foundations-01-overview.html
```

- [ ] **Step 2: Create the lesson**

Create `pages/training/foundations-01-the-copilot-landscape.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>The Copilot Landscape — Foundations</title>
<link rel="stylesheet" href="../../styles/shared.css"/>
</head>
<body>
<script src="../../footer.js"></script>
<script src="../../nav.js"></script>
<script src="../../training-sidebar.js"></script>
<script src="../../progress-model.js"></script>
<script src="../../interactive.js"></script>

<div class="module-strip">
  <span class="ms-label">Track</span>
  <a href="foundations-01-the-copilot-landscape.html" class="ms-item active"><span class="ms-num">1</span>Foundations</a>
  <span class="ms-arrow">›</span>
  <a href="advanced-01-overview.html" class="ms-item upcoming"><span class="ms-num">2</span>Advanced</a>
  <span class="ms-arrow">›</span>
  <a href="governance-01-overview.html" class="ms-item upcoming"><span class="ms-num">3</span>Governance</a>
</div>

<div class="page-header" id="intro">
  <div class="eyebrow">Foundations · Lesson 1 of 4</div>
  <h1 class="title">The Copilot <em>Landscape</em></h1>
  <p class="subtitle">You already have a Copilot license. This lesson is the map: what's included in the free Copilot Chat every M365 subscriber gets, what the paid Copilot add-on layers on top of it, and how "grounding" actually works — so you know exactly what Copilot can and can't see before you ask it anything.</p>
  <div class="header-phase">
    <div class="header-phase-dot" style="background:var(--teal)"></div>
    Foundations · 2 hours · virtual, recorded
  </div>
</div>

<div class="section" id="two-tiers">
  <div class="sec-eyebrow">01 — Two products, one name</div>
  <h2 class="sec-title">Free Chat vs. the paid <em>add-on</em></h2>
  <p class="sec-sub">"Copilot" means two different things at Bunzl, and knowing which one you have changes what you should expect from it.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">What everyone gets: Copilot Chat</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Included free with your M365 subscription: web-grounded chat, enterprise data protection, file upload, Pages (shareable canvases from chat), and agents on a pay-as-you-go basis. This is a real, useful tool on its own — but it isn't grounded in your Bunzl work data by default.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">What the paid add-on adds</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">If you're in this session, you almost certainly have the paid Microsoft 365 Copilot add-on. It layers on <strong>work-grounded Chat</strong> (via Microsoft Graph — your mail, meetings, chats, and files), Copilot inside Word, Excel, PowerPoint, Outlook, and Teams, Copilot Search, the Researcher and Analyst reasoning agents, scheduled prompts, memory, and Notebooks.</p>
    </div>
  </div>

  <div class="tip-trick" style="margin-top:32px;">
    <div class="tip-trick-icon">💡</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">Why this matters</div>
      <p>A colleague on free Chat and a colleague on the paid add-on can ask the exact same question and get different answers — because only one of them is grounded in Bunzl's own mail, meetings, and files. If Copilot ever seems to "not know" something you'd expect it to, checking which surface you're on is the first thing to check, not the last.</p>
    </div>
  </div>
</div>

<div class="section" id="grounding">
  <div class="sec-eyebrow">02 — What Copilot can see</div>
  <h2 class="sec-title">Grounding is <em>signals</em>, not a switch</h2>
  <p class="sec-sub">There's no simple "Work" or "Web" toggle. What Copilot actually uses to answer you comes from five signals working together.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Work IQ</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">The Microsoft Graph context layer — your mail, meetings, chats, and files, plus any connected sources. Copilot only ever sees what you already have permission to see; it never surfaces a colleague's private file just because you asked about it.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Your prompt</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">What you actually type shapes what Copilot looks for. A vague prompt gets a vague, loosely-grounded answer.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Files you attach or reference</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Attaching a file, or referencing it by name, tells Copilot exactly where to look — the single most reliable way to ground an answer in something specific.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Sources it cites</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">A grounded answer shows you where it came from. If an answer has no citations, that's a signal to ask where the information is coming from before you trust it.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Which agent is selected</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Copilot Chat, Copilot in an app, and a dedicated agent are grounded differently by design — the surface you're on is itself a signal.</p>
    </div>
  </div>

  <div class="tip-trick" style="margin-top:32px;">
    <div class="tip-trick-icon">🔎</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">The habit that carries across everything</div>
      <p>Check citations before you trust an answer. It takes five seconds and it's the single habit every other lesson in this program builds on — whether you're drafting a memo in Lesson 2 or double-checking a number in the take-home capstone.</p>
    </div>
  </div>
</div>

<div class="page-footer"></div>
</body>
</html>
```

- [ ] **Step 3: Verify**

Run:
```bash
test -f pages/training/foundations-01-overview.html && echo "OLD FILE STILL EXISTS" || echo "old file removed"
grep -o "<title>[^<]*</title>" pages/training/foundations-01-the-copilot-landscape.html
grep -c "h2 class=\"sec-title\"" pages/training/foundations-01-the-copilot-landscape.html
```
Expected: `old file removed`; `<title>The Copilot Landscape — Foundations</title>`; `2` (two content sections, each generates one slide).

- [ ] **Step 4: Manual check**

With `./serve` running, fetch `http://localhost:8000/pages/training/foundations-01-the-copilot-landscape.html` and confirm HTTP 200 and the page's title/content match Step 2. (No browser-automation tool exists in this environment — HTTP reachability plus reading the served HTML back is the verification method, per the standing Phase A policy.)

- [ ] **Step 5: Commit**

```bash
git add pages/training/foundations-01-the-copilot-landscape.html
git rm pages/training/foundations-01-overview.html
git commit -m "feat(bunzl): Foundations Lesson 1 — The Copilot Landscape"
```

---

### Task 2: Lesson 2 — Prompting & Everyday Chat

**Files:**
- Create: `pages/training/foundations-02-prompting-everyday-chat.html`

**Interfaces:**
- Consumes: same `.module-strip`/skeleton pattern as Task 1.
- Produces: the file Task 5 references as lesson 2 of 4.

- [ ] **Step 1: Create the lesson**

Create `pages/training/foundations-02-prompting-everyday-chat.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Prompting & Everyday Chat — Foundations</title>
<link rel="stylesheet" href="../../styles/shared.css"/>
</head>
<body>
<script src="../../footer.js"></script>
<script src="../../nav.js"></script>
<script src="../../training-sidebar.js"></script>
<script src="../../progress-model.js"></script>
<script src="../../interactive.js"></script>

<div class="module-strip">
  <span class="ms-label">Track</span>
  <a href="foundations-01-the-copilot-landscape.html" class="ms-item active"><span class="ms-num">1</span>Foundations</a>
  <span class="ms-arrow">›</span>
  <a href="advanced-01-overview.html" class="ms-item upcoming"><span class="ms-num">2</span>Advanced</a>
  <span class="ms-arrow">›</span>
  <a href="governance-01-overview.html" class="ms-item upcoming"><span class="ms-num">3</span>Governance</a>
</div>

<div class="page-header" id="intro">
  <div class="eyebrow">Foundations · Lesson 2 of 4</div>
  <h1 class="title">Prompting &amp; Everyday <em>Chat</em></h1>
  <p class="subtitle">A good prompt is a skill, not luck. Microsoft's own four-element framework turns a vague ask into a grounded, specific one — and it works the same way whether you're drafting an email, summarizing a meeting, or looking for a file you can't remember the name of.</p>
  <div class="header-phase">
    <div class="header-phase-dot" style="background:var(--teal)"></div>
    Foundations · 2 hours · virtual, recorded
  </div>
</div>

<div class="section" id="four-elements">
  <div class="sec-eyebrow">01 — Microsoft's official framework</div>
  <h2 class="sec-title">Goal, Context, Expectations, <em>Source</em></h2>
  <p class="sec-sub">Four elements, in any order, turn "help me with this" into a prompt Copilot can actually ground an answer in.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Goal</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">What do you actually want? Be specific — "summarize this" is weaker than "summarize the three decisions made in this meeting."</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Context</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">What background does Copilot need? Who's the audience, what's the situation, what should it assume you already know?</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Expectations</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">What should the answer look like? A table, a short paragraph, three bullet points, a specific tone — say so.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Source</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">What should it ground the answer in? Reference a specific file, person, or meeting directly rather than leaving it to guess.</p>
    </div>
  </div>

  <div class="tip-trick" style="margin-top:32px;">
    <div class="tip-trick-icon">✅</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">Three habits that make every prompt better</div>
      <p>Use positive instructions ("write it formally") rather than negative ones ("don't write it casually") — Copilot follows a clear direction better than a prohibition. Keep one goal per prompt rather than stacking several asks together. And iterate: your second prompt, refining the first answer, is often more valuable than the first one.</p>
    </div>
  </div>
</div>

<div class="section" id="everyday-chat">
  <div class="sec-eyebrow">02 — Where this shows up every day</div>
  <h2 class="sec-title">Everyday <em>Chat</em></h2>
  <p class="sec-sub">The four elements apply to the three things most team members actually use Copilot Chat for.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Drafting</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">A first pass at an email, a memo, or a message — reference the person or thread it's replying to as your Source, and state the tone you want as your Expectation.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Summarizing</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">A long thread, a meeting, or a document, boiled down to what actually matters for your Goal — decisions made, not everything that was said.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Finding information</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Reference specific files, people, and meetings directly with "/" or an attachment — Work IQ from Lesson 1 is what makes this work, and a precise Source is what makes it fast.</p>
    </div>
  </div>

  <div class="tip-trick" style="margin-top:32px;">
    <div class="tip-trick-icon">🗓️</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">Scheduled prompts</div>
      <p>Any prompt can run on a recurring schedule — the output lands in your chat history automatically. Works in Copilot Chat, Teams, and Outlook. If you find yourself asking Copilot the same question every Monday morning, that's a candidate to schedule instead of repeat.</p>
    </div>
  </div>
</div>

<div class="page-footer"></div>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
grep -o "<title>[^<]*</title>" pages/training/foundations-02-prompting-everyday-chat.html
grep -c "h2 class=\"sec-title\"" pages/training/foundations-02-prompting-everyday-chat.html
```
Expected: `<title>Prompting & Everyday Chat — Foundations</title>`; `2`.

- [ ] **Step 3: Manual check**

Same pattern as Task 1 Step 4, against this file's URL.

- [ ] **Step 4: Commit**

```bash
git add pages/training/foundations-02-prompting-everyday-chat.html
git commit -m "feat(bunzl): Foundations Lesson 2 — Prompting & Everyday Chat"
```

---

### Task 3: Lesson 3 — Copilot in the Apps

**Files:**
- Create: `pages/training/foundations-03-copilot-in-the-apps.html`

**Interfaces:**
- Consumes: same skeleton pattern.
- Produces: the file Task 5 references as lesson 3 of 4.

- [ ] **Step 1: Create the lesson**

Create `pages/training/foundations-03-copilot-in-the-apps.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Copilot in the Apps — Foundations</title>
<link rel="stylesheet" href="../../styles/shared.css"/>
</head>
<body>
<script src="../../footer.js"></script>
<script src="../../nav.js"></script>
<script src="../../training-sidebar.js"></script>
<script src="../../progress-model.js"></script>
<script src="../../interactive.js"></script>

<div class="module-strip">
  <span class="ms-label">Track</span>
  <a href="foundations-01-the-copilot-landscape.html" class="ms-item active"><span class="ms-num">1</span>Foundations</a>
  <span class="ms-arrow">›</span>
  <a href="advanced-01-overview.html" class="ms-item upcoming"><span class="ms-num">2</span>Advanced</a>
  <span class="ms-arrow">›</span>
  <a href="governance-01-overview.html" class="ms-item upcoming"><span class="ms-num">3</span>Governance</a>
</div>

<div class="page-header" id="intro">
  <div class="eyebrow">Foundations · Lesson 3 of 4</div>
  <h1 class="title">Copilot in the <em>Apps</em></h1>
  <p class="subtitle">Same Copilot, five apps. This lesson covers the quick wins in Outlook, Teams, Word, PowerPoint, and Excel — including two of the most common gaps: knowing how to actually find a file, and knowing what Copilot can do inside a PowerPoint deck beyond generating slide text.</p>
  <div class="header-phase">
    <div class="header-phase-dot" style="background:var(--teal)"></div>
    Foundations · 2 hours · virtual, recorded
  </div>
</div>

<div class="section" id="outlook-teams">
  <div class="sec-eyebrow">01 — Outlook &amp; Teams</div>
  <h2 class="sec-title">Your inbox and your <em>meetings</em></h2>
  <p class="sec-sub">The two places most team members spend the most time.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Outlook</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Summarize a long thread before you reply, draft a response with instructions ("politely decline and suggest next Tuesday"), and use the Rules of the Road habit from Lesson 1: check who else was on the thread before you trust a Copilot summary of it.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Teams</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Intelligent recap captures notes, speaker attribution, and action items automatically. Missed a meeting? Ask Copilot for the recap instead of asking a colleague to retype their notes.</p>
    </div>
  </div>
</div>

<div class="section" id="word-powerpoint">
  <div class="sec-eyebrow">02 — Word &amp; PowerPoint</div>
  <h2 class="sec-title">Drafting and <em>presenting</em></h2>
  <p class="sec-sub">Copilot's role in both apps is the same: a fast, grounded first pass you edit, not a finished product you ship untouched.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Word</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Draft or rewrite a document grounded in files you reference — the four-element framework from Lesson 2 applies directly: state your Goal, give Context on the audience, set Expectations for length and tone, and name your Source documents.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">PowerPoint — three tips beyond "generate slides"</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">1) Start from an outline, not a blank deck — Copilot builds a stronger deck when you give it your structure first. 2) Reference an existing file or document as your source material rather than describing content from memory. 3) Ask for one change at a time ("tighten slide 3," not "fix the deck") — same one-goal-per-prompt habit from Lesson 2, applied to slides.</p>
    </div>
  </div>
</div>

<div class="section" id="excel-search">
  <div class="sec-eyebrow">03 — Excel &amp; finding what you need</div>
  <h2 class="sec-title">Numbers, and finding <em>files</em></h2>
  <p class="sec-sub">Two quick wins: getting a first read on a spreadsheet, and never digging through folders again.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Excel</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Ask Copilot to summarize a workbook, explain a formula, or highlight what changed — a fast way to orient in a spreadsheet someone else built, or one you haven't opened in months.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Finding a file</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Copilot Search is semantic search across the Microsoft Graph plus connected sources — ask for what a file is about, not its exact filename, and you'll usually find it faster than browsing folders.</p>
    </div>
  </div>

  <div class="tip-trick" style="margin-top:32px;">
    <div class="tip-trick-icon">🔍</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">One search, every connected source</div>
      <p>Copilot Search covers your Graph data plus 100+ connectors at no extra cost — it's the same "ask for what you need, not where it lives" habit as everyday Chat from Lesson 2, just applied to finding a file instead of drafting one.</p>
    </div>
  </div>
</div>

<div class="page-footer"></div>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
grep -o "<title>[^<]*</title>" pages/training/foundations-03-copilot-in-the-apps.html
grep -c "h2 class=\"sec-title\"" pages/training/foundations-03-copilot-in-the-apps.html
grep -c "PowerPoint\|finding a file\|Finding a file" pages/training/foundations-03-copilot-in-the-apps.html
```
Expected: `<title>Copilot in the Apps — Foundations</title>`; `3`; a nonzero count confirming both discovery-call-flagged topics are present.

- [ ] **Step 3: Manual check**

Same pattern as Task 1 Step 4.

- [ ] **Step 4: Commit**

```bash
git add pages/training/foundations-03-copilot-in-the-apps.html
git commit -m "feat(bunzl): Foundations Lesson 3 — Copilot in the Apps"
```

---

### Task 4: Lesson 4 — Practice + Knowledge Check, and the expanded quiz

**Files:**
- Create: `pages/training/foundations-04-practice-and-check.html`
- Modify: `interactive.js` (the `QUIZZES.foundations` entry)

**Interfaces:**
- Consumes: the 3 sample files from Phase A's Task 13 (`assets/lab-data/bunzl-quarterly-budget-review.xlsx`, `bunzl-business-review.pptx`, `bunzl-team-update-memo.docx`); `progress-model.js`'s `TRACKS`/`isTrackPassed` (unchanged — this task only adds quiz *content*, not logic).
- Produces: the file Task 5 references as lesson 4 of 4 (the one carrying `exercise: true`); the expanded `QUIZZES.foundations` object `interactive.js`'s existing `renderQuiz` reads generically by key.

- [ ] **Step 1: Create the lesson**

Create `pages/training/foundations-04-practice-and-check.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Practice & Knowledge Check — Foundations</title>
<link rel="stylesheet" href="../../styles/shared.css"/>
</head>
<body>
<script src="../../footer.js"></script>
<script src="../../nav.js"></script>
<script src="../../training-sidebar.js"></script>
<script src="../../progress-model.js"></script>
<script src="../../interactive.js"></script>

<div class="module-strip">
  <span class="ms-label">Track</span>
  <a href="foundations-01-the-copilot-landscape.html" class="ms-item active"><span class="ms-num">1</span>Foundations</a>
  <span class="ms-arrow">›</span>
  <a href="advanced-01-overview.html" class="ms-item upcoming"><span class="ms-num">2</span>Advanced</a>
  <span class="ms-arrow">›</span>
  <a href="governance-01-overview.html" class="ms-item upcoming"><span class="ms-num">3</span>Governance</a>
</div>

<div class="page-header" id="intro">
  <div class="eyebrow">Foundations · Lesson 4 of 4</div>
  <h1 class="title">Practice &amp; Knowledge <em>Check</em></h1>
  <p class="subtitle">Put Lessons 1–3 together on a real file, then check what stuck. Deeper practice — four more puzzles using the same sample files — is waiting for you in the take-home capstone below.</p>
  <div class="header-phase">
    <div class="header-phase-dot" style="background:var(--teal)"></div>
    Foundations · 2 hours · virtual, recorded
  </div>
</div>

<div class="section" id="practice">
  <div class="sec-eyebrow">01 — Try it yourself</div>
  <h2 class="sec-title">Three prompts, one <em>file</em></h2>
  <p class="sec-sub">Open <code>bunzl-quarterly-budget-review.xlsx</code> from <a href="../../assets/lab-data/bunzl-quarterly-budget-review.xlsx">the sample files</a> in Excel with Copilot, and try these — each one uses a habit from this session.</p>

  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">1 — Ground it (Lesson 1)</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Ask: "Summarize this workbook's Budget vs Actual sheet." Notice it's grounded in the attached file, not a guess — check that the segment names it lists match what's actually in the sheet.</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">2 — Prompt it (Lesson 2)</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Ask with all four elements: "Goal: find the segment with the largest variance. Context: this is a budget vs. actual sheet by business segment. Expectations: name the segment and the variance in $000s. Source: this file."</p>
    </div>
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">3 — Apply it (Lesson 3)</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">Ask Copilot to draft a two-sentence summary of the workbook suitable for a Teams message to your manager — a real everyday-app task, not a demo.</p>
    </div>
  </div>
</div>

<!-- KNOWLEDGE CHECK (no h2.sec-title so no slide is generated) -->
<div class="section" id="quiz">
  <div class="sec-eyebrow">02 — Knowledge check</div>
  <p class="sec-sub">Four questions covering everything in this track. Pass 3 of 4 to unlock your Foundations certificate on My Progress.</p>
  <div class="ix-quiz" data-ix-quiz="foundations" data-ix-pass="3"></div>
</div>

<div class="page-footer"></div>
</body>
</html>
```

- [ ] **Step 2: Replace `QUIZZES.foundations` in `interactive.js`**

Modify `interactive.js`, replacing the current `foundations` entry (a single-question object added in Phase A's Task 10) with:

```js
    foundations: {
      label: 'Foundations · M365 Copilot Essentials',
      questions: [
        { q: 'What does the paid Copilot add-on give you that free Copilot Chat does not?',
          options: ['Nothing — they are the same product', 'Work-grounded Chat via Microsoft Graph, plus Copilot inside the M365 apps, Copilot Search, and the Researcher/Analyst agents', 'A different color theme'],
          answer: 1 },
        { q: 'Which of the following is one of the five grounding signals Copilot actually uses to answer you?',
          options: ['Whether your webcam is on', 'The files you attach or reference', 'How many browser tabs you have open'],
          answer: 1 },
        { q: 'Microsoft\u2019s four elements of a strong prompt are\u2026',
          options: ['Goal, Context, Expectations, Source', 'Persona, Task, Format, Tone', 'Who, What, When, Where'],
          answer: 0 },
        { q: 'What\u2019s the fastest way to locate a file when you don\u2019t remember its exact name?',
          options: ['Browse every folder manually', 'Copilot Search \u2014 describe what the file is about, not its filename', 'Ask a colleague to email it to you again'],
          answer: 1 }
      ]
    },
```

Locate the exact current `foundations:` block in `interactive.js` (inside the `QUIZZES` object, added by Phase A's Task 10 Step 7) and replace it in place — leave the `advanced:` and `governance:` entries immediately before/after it untouched.

- [ ] **Step 3: Verify**

```bash
grep -o "<title>[^<]*</title>" pages/training/foundations-04-practice-and-check.html
grep -c 'h2 class="sec-title"' pages/training/foundations-04-practice-and-check.html
node -e "
const fs = require('fs');
const src = fs.readFileSync('interactive.js', 'utf8');
const start = src.indexOf('foundations:');
const end = src.indexOf('advanced:', start);
const slice = src.slice(start, end);
const count = (slice.match(/\{ q:/g) || []).length;
console.log('foundations question count:', count);
"
grep -n 'data-ix-quiz="foundations" data-ix-pass="3"' pages/training/foundations-04-practice-and-check.html
```
Expected: correct title; `1` (only the practice section has an `h2.sec-title` — the quiz section deliberately doesn't); `foundations question count: 4`; the `data-ix-pass="3"` line found.

- [ ] **Step 4: Run the Node test suite (regression check)**

```bash
node --test progress-model.test.js
```
Expected: PASS — `# pass 8`, `# fail 0` (this task doesn't touch `progress-model.js`; this just confirms nothing broke it).

- [ ] **Step 5: Manual check**

Same HTTP-reachability pattern as Task 1 Step 4, against this file's URL.

- [ ] **Step 6: Commit**

```bash
git add pages/training/foundations-04-practice-and-check.html interactive.js
git commit -m "feat(bunzl): Foundations Lesson 4 — practice exercise and expanded 4-question quiz"
```

---

### Task 5: Manifest updates — nav.js, training-sidebar.js, foundations-slides.html, my-progress.html

**Files:**
- Modify: `nav.js` (the `CRAFTS[0]` foundations entry)
- Modify: `training-sidebar.js` (the `MODULES[0]` foundations entry)
- Modify: `pages/training/foundations-slides.html` (`SLIDES_CFG.lessons`)
- Modify: `pages/workshops/my-progress.html` (the Foundations quiz link)

**Interfaces:**
- Consumes: the 4 lesson filenames from Tasks 1–4.
- Produces: nothing new — this task only re-points existing structures at the 4 real files instead of the 1 placeholder.

- [ ] **Step 1: Expand `nav.js`'s foundations `CRAFTS` entry**

Modify `nav.js`'s `CRAFTS[0]` (the `id: 'foundations'` entry), replacing:
```js
      filePrefix: ['foundations-01-'],
      pages: ['foundations-01-overview'],
      labels: ['Foundations Overview']
```
with:
```js
      filePrefix: ['foundations-01-', 'foundations-02-', 'foundations-03-', 'foundations-04-'],
      pages: [
        'foundations-01-the-copilot-landscape',
        'foundations-02-prompting-everyday-chat',
        'foundations-03-copilot-in-the-apps',
        'foundations-04-practice-and-check'
      ],
      labels: [
        'The Copilot Landscape',
        'Prompting & Everyday Chat',
        'Copilot in the Apps',
        'Practice & Knowledge Check'
      ]
```
Leave `id`, `folder`, `hub`, `label`, `subLabel`, `color`, `navColor` and the `advanced`/`governance` entries untouched.

- [ ] **Step 2: Expand `training-sidebar.js`'s foundations `MODULES` entry**

Modify `training-sidebar.js`'s `MODULES[0]` (the `label: 'Foundations'` entry), replacing:
```js
      lessons: [
        { file: 'foundations-01-overview.html', title: 'Foundations Overview', exercise: true }
      ]
```
with:
```js
      lessons: [
        { file: 'foundations-01-the-copilot-landscape.html', title: 'The Copilot Landscape' },
        { file: 'foundations-02-prompting-everyday-chat.html', title: 'Prompting & Everyday Chat' },
        { file: 'foundations-03-copilot-in-the-apps.html', title: 'Copilot in the Apps' },
        { file: 'foundations-04-practice-and-check.html', title: 'Practice & Knowledge Check', exercise: true }
      ]
```
(`exercise: true` moves from lesson 1 to lesson 4, since lesson 4 is now the one carrying the quiz.) Leave `label`, `subLabel`, `color`, `slidesFile` and the `advanced`/`governance` entries untouched.

- [ ] **Step 3: Expand `foundations-slides.html`'s `SLIDES_CFG.lessons`**

Modify `pages/training/foundations-slides.html`, replacing:
```js
  lessons: [
    { file: 'foundations-01-overview.html', title: 'Foundations Overview' }
  ]
```
with:
```js
  lessons: [
    { file: 'foundations-01-the-copilot-landscape.html', title: 'The Copilot Landscape' },
    { file: 'foundations-02-prompting-everyday-chat.html', title: 'Prompting & Everyday Chat' },
    { file: 'foundations-03-copilot-in-the-apps.html', title: 'Copilot in the Apps' },
    { file: 'foundations-04-practice-and-check.html', title: 'Practice & Knowledge Check' }
  ]
```
Leave `label`, `subLabel`, `color` untouched.

- [ ] **Step 4: Update `my-progress.html`'s Foundations quiz link**

Modify `pages/workshops/my-progress.html`, replacing:
```html
    <a href="../training/foundations-01-overview.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Foundations quiz →</a>
```
with:
```html
    <a href="../training/foundations-04-practice-and-check.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Foundations quiz →</a>
```

- [ ] **Step 5: Verify**

```bash
grep -c "foundations-01-overview" nav.js training-sidebar.js pages/training/foundations-slides.html pages/workshops/my-progress.html
grep -c "foundations-04-practice-and-check" nav.js training-sidebar.js pages/training/foundations-slides.html pages/workshops/my-progress.html
```
Expected: first command `0` for all 4 files; second command `1` for all 4 files (each references lesson 4 exactly once — the CRAFTS/MODULES/SLIDES_CFG arrays each list it once among the 4 lessons, and my-progress.html links to it once).

- [ ] **Step 6: Manual check**

With `./serve` running: fetch `foundations-01-the-copilot-landscape.html` and confirm the sidebar/nav render without JS errors (read the served HTML/JS for correctness — no browser-automation tool available, per standing policy). Fetch `foundations-slides.html` and confirm `SLIDES_CFG` in the response lists all 4 lessons.

- [ ] **Step 7: Commit**

```bash
git add nav.js training-sidebar.js pages/training/foundations-slides.html pages/workshops/my-progress.html
git commit -m "feat(bunzl): wire the 4 real Foundations lessons into nav/sidebar/slides/my-progress"
```

---

### Task 6: Foundations hub page — real pre-work and agenda

**Files:**
- Modify: `pages/workshops/foundations-workshop.html`

**Interfaces:**
- Consumes: the 4 lesson filenames from Tasks 1–4; the escape-room capstone link (unchanged path, `../../escape-room/index.html`, content retextured in Task 7).

- [ ] **Step 1: Replace the pre-work section**

Modify `pages/workshops/foundations-workshop.html`'s `.section#prework`, replacing:
```html
<div class="section" id="prework">
  <div class="sec-eyebrow">Stage 1 · Pre-work</div>
  <h2 class="sec-title">Before the <em>session</em></h2>
  <p class="sec-sub">Confirm Copilot access and get the sample files ready before you join.</p>
  <div class="tip-trick" style="margin-top:28px;">
    <div class="tip-trick-icon">📋</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">Setup checklist</div>
      <p>Full pre-work checklist lands in Phase B alongside the Foundations lesson content.</p>
    </div>
  </div>
</div>
```
with:
```html
<div class="section" id="prework">
  <div class="sec-eyebrow">Stage 1 · Pre-work</div>
  <h2 class="sec-title">Before the <em>session</em></h2>
  <p class="sec-sub">Ten minutes, any time before you join.</p>
  <div class="tip-trick" style="margin-top:28px;">
    <div class="tip-trick-icon">📋</div>
    <div class="tip-trick-copy">
      <div class="tip-trick-label">Setup checklist</div>
      <p>Sign in to the Microsoft 365 Copilot app and confirm you can see the <strong>Work</strong> tab. Take a look at the <a href="../../assets/lab-data/">sample files</a> we'll use in the practice exercise — no download or setup needed, they're right here on the site. Have your join link for the session ready.</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Replace the content section**

Modify the `.section#content` block, replacing:
```html
<div class="section" id="content">
  <div class="sec-eyebrow">Stage 2 · Session content</div>
  <h2 class="sec-title">What this track <em>covers</em></h2>
  <p class="sec-sub">Placeholder — the full Foundations curriculum and agenda are designed in Phase B.</p>
  <div class="module-grid" style="margin-top:28px;">
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">01</div>
        <div class="module-card-meta"><div class="module-label">Lesson</div>
          <div class="module-name">Foundations Overview</div>
          <div class="module-desc">Placeholder lesson — replaced with real Foundations content in Phase B.</div>
        </div></div>
      <div class="module-card-footer"><a href="../training/foundations-01-overview.html" class="module-cta">Open lesson <span>→</span></a></div>
    </div>
  </div>
  <p style="margin-top:24px;display:flex;gap:16px;flex-wrap:wrap;">
    <a href="../training/foundations-slides.html" class="slides-cta">⊞ Start Presentation</a>
    <a href="../../escape-room/index.html" style="display:inline-flex;align-items:center;gap:8px;color:var(--teal);text-decoration:none;font-weight:600;font-size:15px;">Take-home capstone: The Loading Dock →</a>
  </p>
</div>
```
with:
```html
<div class="section" id="content">
  <div class="sec-eyebrow">Stage 2 · Session content</div>
  <h2 class="sec-title">What this track <em>covers</em></h2>
  <p class="sec-sub">Four lessons, live and recorded — what your license includes, how to prompt well, where Copilot shows up in the apps you already use, and a practice round to make it stick.</p>
  <div class="agenda" style="margin-top:28px;">
    <div class="agenda-row">
      <div class="agenda-time">0:00–0:25<small>25 min</small></div>
      <div class="agenda-tag agenda-tag--teach">Teach</div>
      <div class="agenda-body"><strong>The Copilot landscape</strong><p><a href="../training/foundations-01-the-copilot-landscape.html">Lesson 1</a> — free Chat vs. the paid add-on, and grounding as five signals, not a toggle.</p></div>
    </div>
    <div class="agenda-row">
      <div class="agenda-time">0:25–0:50<small>25 min</small></div>
      <div class="agenda-tag agenda-tag--teach">Teach</div>
      <div class="agenda-body"><strong>Prompting &amp; everyday Chat</strong><p><a href="../training/foundations-02-prompting-everyday-chat.html">Lesson 2</a> — Goal, Context, Expectations, Source, and where it shows up in drafting, summarizing, and finding information.</p></div>
    </div>
    <div class="agenda-row">
      <div class="agenda-time">0:50–1:20<small>30 min</small></div>
      <div class="agenda-tag agenda-tag--teach">Teach</div>
      <div class="agenda-body"><strong>Copilot in the apps</strong><p><a href="../training/foundations-03-copilot-in-the-apps.html">Lesson 3</a> — Outlook, Teams, Word, PowerPoint, Excel, and finding a file with Copilot Search.</p></div>
    </div>
    <div class="agenda-row">
      <div class="agenda-time">1:20–1:45<small>25 min</small></div>
      <div class="agenda-tag agenda-tag--demo">Demo</div>
      <div class="agenda-body"><strong>Practice, live</strong><p><a href="../training/foundations-04-practice-and-check.html">Lesson 4</a> — three prompts on a shared sample file, then the knowledge check.</p></div>
    </div>
    <div class="agenda-row">
      <div class="agenda-time">1:45–2:00<small>15 min</small></div>
      <div class="agenda-tag agenda-tag--discuss">Discuss</div>
      <div class="agenda-body"><strong>Open Q&amp;A</strong><p>Bring what's actually blocking you — this is the block the discovery conversations flagged as the part people value most.</p></div>
    </div>
  </div>
  <div class="module-grid" style="margin-top:28px;">
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">01</div>
        <div class="module-card-meta"><div class="module-label">Lesson</div>
          <div class="module-name">The Copilot Landscape</div>
          <div class="module-desc">Free Chat vs. the paid add-on, and grounding as five signals.</div>
        </div></div>
      <div class="module-card-footer"><a href="../training/foundations-01-the-copilot-landscape.html" class="module-cta">Open lesson <span>→</span></a></div>
    </div>
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">02</div>
        <div class="module-card-meta"><div class="module-label">Lesson</div>
          <div class="module-name">Prompting &amp; Everyday Chat</div>
          <div class="module-desc">The four-element framework and where it shows up daily.</div>
        </div></div>
      <div class="module-card-footer"><a href="../training/foundations-02-prompting-everyday-chat.html" class="module-cta">Open lesson <span>→</span></a></div>
    </div>
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">03</div>
        <div class="module-card-meta"><div class="module-label">Lesson</div>
          <div class="module-name">Copilot in the Apps</div>
          <div class="module-desc">Outlook, Teams, Word, PowerPoint, Excel, and finding a file.</div>
        </div></div>
      <div class="module-card-footer"><a href="../training/foundations-03-copilot-in-the-apps.html" class="module-cta">Open lesson <span>→</span></a></div>
    </div>
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">04</div>
        <div class="module-card-meta"><div class="module-label">Lab + knowledge check</div>
          <div class="module-name">Practice &amp; Knowledge Check</div>
          <div class="module-desc">Three prompts on a shared file, then the Foundations quiz.</div>
        </div></div>
      <div class="module-card-footer"><a href="../training/foundations-04-practice-and-check.html" class="module-cta">Open lesson <span>→</span></a></div>
    </div>
  </div>
  <p style="margin-top:24px;display:flex;gap:16px;flex-wrap:wrap;">
    <a href="../training/foundations-slides.html" class="slides-cta">⊞ Start Presentation</a>
    <a href="../../escape-room/index.html" style="display:inline-flex;align-items:center;gap:8px;color:var(--teal);text-decoration:none;font-weight:600;font-size:15px;">Take-home capstone: The Loading Dock →</a>
  </p>
</div>
```

(This reuses the `.agenda`/`.agenda-row`/`.agenda-time`/`.agenda-tag`/`.agenda-body` pattern DESIGN-SYSTEM.md documents — already defined in `styles/shared.css` from the original B&B build, confirmed still present since Phase A never touched that CSS block.)

- [ ] **Step 2: Verify**

```bash
grep -c "Phase B\|Placeholder\|foundations-01-overview" pages/workshops/foundations-workshop.html
grep -o 'class="module-card"' pages/workshops/foundations-workshop.html | wc -l
grep -c "agenda-row" pages/workshops/foundations-workshop.html
```
Expected: `0` (no leftover placeholder text or old filename); `4` (one card per lesson); `5` (4 teach/demo blocks + 1 Q&A block).

- [ ] **Step 3: Manual check**

Same HTTP-reachability pattern as prior tasks, against `foundations-workshop.html`.

- [ ] **Step 4: Commit**

```bash
git add pages/workshops/foundations-workshop.html
git commit -m "feat(bunzl): Foundations hub — real pre-work, agenda, and materials grid for all 4 lessons"
```

---

### Task 7: The Loading Dock — retexture the Foundations capstone

**Files:**
- Modify: `escape-room/config/rooms.source.json`
- Modify: `escape-room/index.html`
- Modify: `escape-room/admin.html`
- Modify: `escape-room/README.md`
- Delete: `escape-room/lab-files/variance-vault-briefing.md`
- Create: `escape-room/lab-files/loading-dock-briefing.md`

**Interfaces:**
- Consumes: the 3 real sample files from Phase A's Task 13 (`assets/lab-data/bunzl-quarterly-budget-review.xlsx`, `bunzl-business-review.pptx`, `bunzl-team-update-memo.docx`) — the puzzle answers below are computed directly from those files' actual committed content, not invented.
- Produces: `escape-room/config/rooms.json` (regenerated), consumed by `escape-room/js/main.js` (unchanged).

- [ ] **Step 1: Confirm the source data this task's puzzle answers depend on**

Read `tools/sample-files/generate.py`'s `SEGMENTS` list to confirm the exact figures (do not proceed to Step 2 until you've confirmed these match what's actually committed in `assets/lab-data/bunzl-quarterly-budget-review.xlsx` — re-run `tools/sample-files/.venv/bin/python tools/sample-files/test_generate.py` first if you have any doubt the committed file matches the generator):

```
Grocery & Foodservice: budget 4200, actual 4385  → variance +185
Safety:                budget 2100, actual 1960  → variance -140
Cleaning & Hygiene:    budget 1850, actual 1972  → variance +122
Retail:                budget 1500, actual 1410  → variance -90
Healthcare:            budget 980,  actual 1055  → variance +75
```
`bunzl-business-review.pptx` has 4 slides in order: "Quarterly Business Review" (title), "Agenda", "Segment Performance", "Next Steps".
`bunzl-team-update-memo.docx` states Grocery & Foodservice and Cleaning & Hygiene are "running ahead of plan" and Safety and Retail "came in under" — it does **not** mention Healthcare, even though Healthcare's actual also exceeds its budget (+75) per the workbook. This is a real, intentional discrepancy between the two files (documented in Phase A's final review as a known quirk of the memo's hand-written prose) — Station 4 below uses it deliberately as a "verify before you trust a summary" puzzle.

- [ ] **Step 2: Replace `rooms.source.json`**

Replace `escape-room/config/rooms.source.json` entirely with:

```json
{
  "workshopTitle": "Foundations Track Capstone: The Loading Dock",
  "scenario": "A shipment just came in and the paperwork doesn't add up. Use Copilot — Chat, Excel, PowerPoint, or Word — to work through four stations on the Bunzl sample files and get the dock doors open.",
  "timeLimitMinutes": 30,
  "hintPenaltySeconds": 90,
  "rooms": [
    {
      "id": "room-1",
      "title": "The Intake Ledger",
      "narrative": "The budget workbook just arrived on the dock. Every segment shipped something different than planned this quarter — find the one that came in furthest ahead.",
      "labSteps": [
        "Open 'bunzl-quarterly-budget-review.xlsx' from the sample files — Excel with Copilot works, or ask Copilot Chat with the file attached.",
        "Build a four-element prompt: Goal (find the segment with the largest positive variance, actual minus budget), Context (this is a budget vs. actual sheet by business segment), Expectations (name the segment and the variance in $ thousands), Source (this file).",
        "Verify before you trust it: open the Budget vs Actual sheet yourself and check the actual and budget columns for the segment Copilot names.",
        "The unlock code is that segment's variance in $ thousands — digits only, no sign, no commas. Example format: 42"
      ],
      "codePlaintext": "185",
      "codeHash": "GENERATE_WITH_SCRIPT",
      "hints": [
        "Don't scan row by row — ask Copilot to compute actual minus budget for every segment and rank them.",
        "It's the largest segment in the sheet by budget, and it also has the largest dollar variance — not just the largest percentage one."
      ],
      "skillsTaught": [
        "Grounding a prompt in an attached Excel file",
        "The four-element prompt: Goal, Context, Expectations, Source",
        "Verifying a Copilot answer against the underlying rows"
      ]
    },
    {
      "id": "room-2",
      "title": "The Route Sheet",
      "narrative": "A slide deck was left at the loading dock with no cover note. Figure out what it is and what it's telling the next shift to do.",
      "labSteps": [
        "Open 'bunzl-business-review.pptx' from the sample files.",
        "Ask Copilot how many slides are in the deck, and what the title of the last slide is.",
        "The unlock code is the total slide count immediately followed by the last slide's title with no spaces, all uppercase. Example format: 3AGENDA"
      ],
      "codePlaintext": "4NEXTSTEPS",
      "codeHash": "GENERATE_WITH_SCRIPT",
      "hints": [
        "Ask Copilot to summarize the deck slide by slide if the count doesn't come back right the first time.",
        "The deck ends on a slide about what happens after this review, not the review itself."
      ],
      "skillsTaught": [
        "Asking Copilot to navigate and summarize a PowerPoint deck",
        "Getting a structured, checkable answer instead of a loose summary"
      ]
    },
    {
      "id": "room-3",
      "title": "The Delivery Note",
      "narrative": "A short memo came with the shipment. Someone needs to know which segments it says are running ahead of plan before the next station opens.",
      "labSteps": [
        "Open 'bunzl-team-update-memo.docx' from the sample files.",
        "Ask Copilot to summarize which segments the memo says are ahead of plan, and which are under.",
        "Count how many segments the memo names in total across both groups (ahead + under).",
        "The unlock code is that total count, immediately followed by the word SEGMENTS, no space. Example format: 3SEGMENTS"
      ],
      "codePlaintext": "4SEGMENTS",
      "codeHash": "GENERATE_WITH_SCRIPT",
      "hints": [
        "The memo names two segments as ahead of plan and two as under — add them together.",
        "Read the first real paragraph after the italic disclaimer line."
      ],
      "skillsTaught": [
        "Summarizing a Word document with Copilot",
        "Turning a loose summary into a specific, countable fact"
      ]
    },
    {
      "id": "room-4",
      "title": "The Missing Manifest",
      "narrative": "The memo from the last station said its piece — but the dock foreman taught you in Lesson 1 to check citations before trusting a summary. Cross-check the memo against the budget workbook. One segment is over budget in the workbook but never shows up in the memo's summary at all.",
      "labSteps": [
        "You'll need both files open: 'bunzl-team-update-memo.docx' and 'bunzl-quarterly-budget-review.xlsx'.",
        "List every segment the memo mentions (ahead or under). Then list every segment in the workbook whose actual is greater than its budget.",
        "Find the segment that appears in the second list but not the first — the one the memo simply left out.",
        "The unlock code is that segment's name in all uppercase, no spaces, immediately followed by its variance in $ thousands. Example format: RETAIL90"
      ],
      "codePlaintext": "HEALTHCARE75",
      "codeHash": "GENERATE_WITH_SCRIPT",
      "hints": [
        "The memo names four segments total across ahead-of-plan and under-plan. The workbook has five segments. One of the five never appears in the memo at all.",
        "It's the smallest segment by budget in the workbook, and its actual beat its budget by $75 thousand."
      ],
      "skillsTaught": [
        "The single most important habit from this track: verify a Copilot summary against its source before you trust it",
        "Cross-referencing two different file types (a document and a workbook) on the same underlying facts"
      ]
    }
  ]
}
```

- [ ] **Step 3: Retitle `escape-room/index.html`**

Find every occurrence of "Variance Vault" or "Skill Vault" in `escape-room/index.html` (`grep -n "Variance Vault\|Skill Vault" escape-room/index.html`) — including the `<title>` tag and any `.hud-title`/`<span>`-split heading (per Phase A's Task 9 review, which flagged exactly this gap on `governance-room/`: check both the `<title>` AND any on-screen heading, not just the title tag) — and replace each with "The Loading Dock" (preserving the same `<span>` wrapping structure the original uses to keep any CSS-targeted last-word styling intact — e.g. if the original is `The Variance <span>Vault</span>`, the replacement is `The Loading <span>Dock</span>`).

- [ ] **Step 4: Retitle `escape-room/admin.html`**

Same find-and-replace pattern as Step 3, applied to `escape-room/admin.html`.

- [ ] **Step 5: Replace the lab-files briefing**

```bash
rm escape-room/lab-files/variance-vault-briefing.md
```

Create `escape-room/lab-files/loading-dock-briefing.md`:

```markdown
# The Loading Dock — Facilitator Briefing

Foundations track capstone (take-home). Uses the 3 generic Bunzl sample files in
`assets/lab-data/` — no additional data needed. 4 stations, ~30 minutes, hint penalty 90 seconds
per hint.

## Answer key

| Station | File | Code | How it's derived |
|---|---|---|---|
| 1 — The Intake Ledger | `bunzl-quarterly-budget-review.xlsx` | `185` | Grocery & Foodservice's variance (actual 4385 − budget 4200), the largest positive variance across all 5 segments |
| 2 — The Route Sheet | `bunzl-business-review.pptx` | `4NEXTSTEPS` | 4 total slides; the last slide's title is "Next Steps" |
| 3 — The Delivery Note | `bunzl-team-update-memo.docx` | `4SEGMENTS` | The memo names 4 segments total: Grocery & Foodservice + Cleaning & Hygiene (ahead) + Safety + Retail (under) |
| 4 — The Missing Manifest | Both files, cross-referenced | `HEALTHCARE75` | Healthcare is over budget (+75) in the workbook but is the one segment the memo's summary never mentions — the deliberate "verify before you trust a summary" puzzle |

If `tools/sample-files/generate.py`'s `SEGMENTS` data or the memo's hardcoded paragraph text is
ever regenerated/edited, re-derive all 4 codes above and re-run
`node escape-room/tools/generate-hashes.mjs` before the next delivery.
```

- [ ] **Step 6: Update `escape-room/README.md`**

Replace any remaining "Variance Vault"/"Skill Vault" title/description text in `escape-room/README.md` with a short, accurate summary: this is now "The Loading Dock," the Foundations track capstone, 4 stations against the 3 Bunzl sample files, take-home format. Keep the rest of the README's mechanics documentation (state/leaderboard/hashing sections) — those describe the shared engine and are unaffected by this retexture.

- [ ] **Step 7: Regenerate `rooms.json`**

```bash
node escape-room/tools/generate-hashes.mjs escape-room/config/rooms.source.json escape-room/config/rooms.json
```
Expected: 4 `✓ Room N "..." — <CODE> → <hash prefix>…` lines, no `⚠` warnings, ending with `Wrote escape-room/config/rooms.json. codePlaintext stripped.`

- [ ] **Step 8: Verify**

```bash
grep -rn "Variance Vault\|Skill Vault" escape-room/index.html escape-room/admin.html escape-room/README.md
grep -c codePlaintext escape-room/config/rooms.json
grep -c "The Loading Dock" escape-room/index.html
```
Expected: first command empty (no output); second `0` (codes stripped); third `≥1` (title present).

- [ ] **Step 9: Manual check**

With `./serve` running, fetch `http://localhost:8000/escape-room/index.html` and confirm HTTP 200 and the served HTML's `<title>` reads "The Loading Dock" (not "The Variance Vault"). Per standing policy, this is an HTTP-reachability + content check, not a live visual confirmation of the 3D scene.

- [ ] **Step 10: Commit**

```bash
git add escape-room/
git commit -m "feat(bunzl): retexture the Foundations capstone as The Loading Dock"
```

---

### Task 8: Final cross-file verification sweep

**Files:** none created or modified — this task is verification-only, closing out Phase B the same way Phase A's whole-branch review did for Phase A.

**Interfaces:** none — reads the state Tasks 1–7 produced.

- [ ] **Step 1: Confirm no leftover Phase A placeholder language survives**

```bash
grep -rn "is designed and written in Phase B\|Coming in Phase B\|placeholder lesson\|Placeholder lesson" pages/training/foundations-*.html pages/workshops/foundations-workshop.html
```
Expected: no output. (If anything matches, a Task 1–6 edit missed a spot — go fix it before continuing.)

- [ ] **Step 2: Confirm all 4 lessons' module-strips are structurally identical**

```bash
for f in pages/training/foundations-01-the-copilot-landscape.html pages/training/foundations-02-prompting-everyday-chat.html pages/training/foundations-03-copilot-in-the-apps.html pages/training/foundations-04-practice-and-check.html; do
  grep -A6 'class="module-strip"' "$f" | md5 2>/dev/null || grep -A6 'class="module-strip"' "$f" | md5sum
done
```
Expected: all 4 hashes identical (the module-strip is track-level, not lesson-level — see this plan's Global Constraints; it should be byte-identical across all 4 files).

- [ ] **Step 3: Confirm the manifest counts match across all 4 places**

```bash
node -e "
const fs = require('fs');
function countBetween(src, startMarker) {
  const idx = src.indexOf(startMarker);
  const slice = src.slice(idx, idx + 2000);
  return (slice.match(/foundations-0[1-4]-/g) || []).length;
}
console.log('nav.js:', countBetween(fs.readFileSync('nav.js','utf8'), \"id: 'foundations'\"));
console.log('training-sidebar.js:', countBetween(fs.readFileSync('training-sidebar.js','utf8'), \"label: 'Foundations'\"));
console.log('foundations-slides.html:', (fs.readFileSync('pages/training/foundations-slides.html','utf8').match(/foundations-0[1-4]-/g) || []).length);
"
```
Expected: `nav.js: 8` (4 in `filePrefix[]` + 4 in `pages[]`), `training-sidebar.js: 4` (4 in `lessons[].file`), `foundations-slides.html: 4` (4 in `SLIDES_CFG.lessons[].file`). If any count is off, re-check the corresponding Task 5 step.

- [ ] **Step 4: Full regression — Node test suite**

```bash
node --test progress-model.test.js
```
Expected: `# pass 8`, `# fail 0`.

- [ ] **Step 5: Full regression — sample-file test suite (confirms Task 7's puzzle answers still match the committed files)**

```bash
tools/sample-files/.venv/bin/python tools/sample-files/test_generate.py
```
Expected: `OK`, `Ran 3 tests`.

- [ ] **Step 6: Confirm the escape-room hash regeneration is self-consistent**

```bash
node escape-room/tools/generate-hashes.mjs --code "185"
node escape-room/tools/generate-hashes.mjs --code "4NEXTSTEPS"
node escape-room/tools/generate-hashes.mjs --code "4SEGMENTS"
node escape-room/tools/generate-hashes.mjs --code "HEALTHCARE75"
```
For each, compare the printed `hash:` value against the corresponding `codeHash` in `escape-room/config/rooms.json` (`grep -A1 '"id": "room-N"' escape-room/config/rooms.json`) — they must match exactly for each of the 4 rooms.

- [ ] **Step 7: Confirm CLAUDE.md's Architecture-tree note about `escape-room/`'s title is now stale and needs a one-line fix**

```bash
grep -n "still titled \"The Variance Vault\"" CLAUDE.md
```
If this matches (it should — Phase A's Task 12 added this note, and it's now outdated since Task 7 above retextured the app), update that line in `CLAUDE.md`: remove the "still titled..." qualifier for `escape-room/` (keep it for `control-room/`, which Phase B does not touch), and commit:

```bash
git add CLAUDE.md
git commit -m "docs(bunzl): CLAUDE.md — escape-room/ is now retextured as The Loading Dock"
```

- [ ] **Step 8: Manual full-path check**

With `./serve` running: fetch `index.html` → confirm the Foundations card links to `foundations-workshop.html` → confirm that page's 4 lesson links resolve → confirm the capstone link resolves to `escape-room/index.html` with the new title. All via HTTP reachability + content-reading, per standing policy.

## Post-plan state

After Task 8, the Foundations track has real, 4-lesson content grounded in `bunzl-context.md`,
a real hub agenda, a working 4-question quiz gating an independent certificate, and a retextured
take-home capstone with codes verifiably derived from the actual committed sample files. Advanced
and Governance still carry their Phase A placeholder lesson and their Phase A capstone titles
("The Close Room," "The Compliance Room" respectively — unaffected by this phase). Phases C and D
follow the same shape as this plan, each with its own spec.
