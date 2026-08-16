# Bunzl Phase A: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild this repo's infrastructure (research brief, 3-track navigation/slides/progress system, escape-room capstone scaffolding, sample-file generation tooling) for the Bunzl M365 Copilot engagement, replacing the current Brown & Brown content in place on `main`, with zero lesson content yet (Phases B/C/D).

**Architecture:** Three independent tracks (Foundations, Advanced, Governance) replace the current four sequential modules. The existing `CRAFTS`/`MODULES` array-based manifests already support an arbitrary number of entries, so the structural work is: (1) repoint those manifests plus the hand-authored hub/footer/homepage/certificate surfaces at 3 tracks instead of 4 modules, using one placeholder lesson per track so the whole pipeline (nav → sidebar → slides → quiz → certificate → escape room) is provably wired end-to-end before any real content is written, and (2) stand up a third escape-room-engine instance for the Governance capstone.

**Tech Stack:** Vanilla HTML/CSS/JS (no build step, no framework — existing project convention). Node v26's built-in test runner (`node --test`, zero dependencies) for the one piece of non-trivial logic (per-track certificate gating). Python 3 + `openpyxl`/`python-docx`/`python-pptx` in a throwaway venv for real `.xlsx`/`.pptx`/`.docx` sample-file generation (a one-off content-generation tool, not a site dependency — nothing it produces ships as code to the browser).

## Global Constraints

- No build step, no framework, no package manager for the site itself — every HTML page is self-contained and loads `shared.css` + the shared JS components directly via `<script src>` (per `CLAUDE.md`).
- Never hardcode a hex color value that duplicates an existing `styles/shared.css` variable (per `CLAUDE.md` CSS Conventions).
- Track colors (reusing 3 of the existing 4 module accent pairs from `styles/shared.css`/`nav.js`, retiring amber since we've gone from 4 tracks to 3):
  | Track | `color` (dark) | `navColor` (light) |
  |---|---|---|
  | `foundations` | `#2f6b66` (`--teal`) | `#4f9990` (`--mint-on-dark`) |
  | `advanced` | `#8c47e4` (`--violet`) | `#c4b5fd` |
  | `governance` | `#2b6880` (`--blueD`) | `#7dd3e8` |
- Never commit real Bunzl figures, names, or the discovery-call transcript to this public repo (per the approved spec, `docs/superpowers/specs/2026-08-16-bunzl-phase-a-foundation-design.md` §1). Content must generalize (e.g. "a consumption-based credit model," never a specific number or person's name).
- File/naming convention for this rebuild (per-track prefixes, replacing the old cross-track sequential numbering — justified because Bunzl attendees typically take only one track, unlike the old B&B one-continuous-session-through-all-modules model):
  - Lessons: `pages/training/<track>-NN-slug.html` (Phase A creates only `<track>-01-overview.html` stubs)
  - Hubs: `pages/workshops/<track>-workshop.html`
  - Slide decks: `pages/training/<track>-slides.html`
  - Escape-room capstones: `escape-room/` → Foundations, `control-room/` → Advanced, `governance-room/` → Governance (new)
- Track durations/format for all copy: Foundations "2 hours · virtual, recorded", Advanced "2 hours · virtual, recorded", Governance "1 hour · virtual, recorded". Never use "in-person" or "bring your laptop" language — sessions are virtual/remote with capacity-capped registration handled by an external Nimble Gravity platform (the site links out, never implements registration).
- Working directory for every command below: repo root (`/Users/derrikkbroughton/Desktop/nimble-gravity-microsoft-copilot-bunzl`) unless a step says otherwise.

---

### Task 1: Bunzl research brief (`bunzl-context.md`)

**Files:**
- Create: `bunzl-context.md`

**Interfaces:**
- Produces: the grounding facts every later task's copy (hub pages, homepage hero, footer) draws its company/product language from — specifically the confirmed preferred term for employees and the three track names/descriptions used verbatim in Tasks 3–8.

- [ ] **Step 1: Run the research queries**

Use WebSearch/WebFetch for each of these (already partially done during design — verify/deepen, and add primary sources where possible):
1. `Bunzl plc annual report 2025 business segments revenue` (primary-source company facts, supersede secondary aggregator summaries used during design)
2. `Bunzl "team members" OR "teammates" careers site official language` (confirm the exact preferred term before it's used in Task 3–8 copy)
3. `Microsoft 365 Copilot Studio consumption pricing 2026 message pack` (current Copilot Studio licensing mechanics — a fast-moving fact per the discovery call)
4. `Microsoft Copilot Cowork credits pricing consumption model 2026` (current Cowork licensing mechanics)
5. `Microsoft 365 Copilot admin governance data loss prevention agent oversight 2026` (Governance-track facts: tenant controls, DLP, agent governance)
6. `Microsoft 365 Copilot EU Data Boundary Anthropic models 2026` (re-verify this caveat is still accurate, carried over from `copilot-context.md`)

- [ ] **Step 2: Write `bunzl-context.md`**

Structure (mirrors `copilot-context.md`, adapted per the approved spec §6):

```markdown
# M365 Copilot for Bunzl — Subject Brief

Read this before writing or revising lesson content. Captures who the program is for, the
agreed structure, and researched facts the content is grounded in.

> **Date-sensitive — researched 2026-08-16.** Re-verify the flagged items in §6 before each
> delivery — especially Copilot Studio's and Cowork's current consumption/pricing mechanics,
> which change frequently.

## 1. Engagement & positioning

- **Client:** Bunzl plc — general/cross-functional team members across the business, not one
  department. Delivered by **Nimble Gravity** (site keeps NG branding; Bunzl appears as the
  client throughout).
- **Format:** three independent tracks, each virtual/remote and recorded, capacity-capped
  registration via an external Nimble Gravity platform (not built into this site):
  Foundations (2 hours, repeated on a recurring cadence), Advanced (2 hours, smaller
  champion/SME cohorts), Governance (1 hour, IT/security/compliance leaders).
- **Subject:** Foundations is rooted in core M365 Copilot (what Premium adds over free Copilot
  Chat, Work IQ/grounding, everyday Chat and app basics). Advanced covers Agent Build
  (reusable tasks), Copilot Cowork, and Copilot Studio. Governance covers tenant controls,
  visibility/auditing, and agent governance for admins.
- **Tone:** practitioner-to-practitioner. Use Bunzl's own preferred term for its people
  (confirmed via Step 1, query 2 — record the exact word here). Frame AI as helping absorb a
  fast-growing, decentralized, acquisition-heavy business's workload — never as commentary on
  performance.
- **Confidentiality:** every fact below is either public (company/product facts) or
  generalized from private discovery-call context per the approved design — no real names,
  dollar figures, or credit counts appear anywhere in this repo.

## 2. The 3-track curriculum

[Same table as spec §2 — Track / Audience / Duration / Runs / Content anchor]

## 3. Researched facts — Bunzl

[Company overview, business segments, decentralized operating-company model, buy-and-build
M&A strategy, confirmed people-language — all from Step 1 queries 1–2, cited]

## 4. Researched facts — Microsoft 365 Copilot (verified 2026-08-16)

[Carry forward the still-accurate facts from `copilot-context.md` §3 with a fresh date stamp,
plus net-new facts from Step 1 queries 3–6: current Copilot Studio consumption mechanics,
current Cowork consumption mechanics (generalized, no real figures), governance/DLP facts for
the Governance track, EU Data Boundary re-verification]

## 5. `SCAFFOLD` / `TODO` — confirm before delivery

- What's actually enabled in Bunzl's tenant (which agents, which connectors)
- Current Copilot Studio tier/pricing at time of delivery (changes weekly per discovery call)
- Current Cowork allowance-group mechanics at time of delivery
- EU Data Boundary applicability if Bunzl has EU operations in scope

## 6. Re-verify list before each delivery

- Copilot Studio pricing/tier mechanics
- Cowork consumption/credit mechanics
- Model names/versions
- Bunzl's latest reported quarter/segment figures if referenced generically
```

- [ ] **Step 3: Verify no confidential specifics leaked**

Read back the full document and manually confirm it contains no name of any individual from
the private discovery call, no specific credit-allowance or user-count figures from that call,
and nothing else that could only have come from that private conversation rather than public
research. Do not write those private specifics down anywhere — including in a search pattern —
while performing this check; if you're unsure whether something counts, re-read the
confidentiality rule in this plan's Global Constraints and generalize further rather than check
against a literal list. If you find anything that reads as privately sourced, generalize that
sentence and re-check.

- [ ] **Step 4: Verify required sections are present**

Run:
```bash
grep -c "^## " bunzl-context.md
```
Expected: `6` (six `##` sections, matching the structure above).

- [ ] **Step 5: Commit**

```bash
git add bunzl-context.md
git commit -m "docs(bunzl): add researched subject brief, replacing copilot-context.md's B&B scope"
```

---

### Task 2: Naming conventions + 3 placeholder lesson stub pages

**Files:**
- Create: `pages/training/foundations-01-overview.html`
- Create: `pages/training/advanced-01-overview.html`
- Create: `pages/training/governance-01-overview.html`

**Interfaces:**
- Consumes: track labels/colors from Global Constraints above; the confirmed people-language term from Task 1 (use in placeholder body copy if you want, not required for structural correctness).
- Produces: three lesson files at fixed paths that Tasks 3–5, 7, and 10 all link to or configure. Each has a `.page-header` (`.eyebrow`, `h1.title`, `.subtitle`) and one `.section` with `h2.sec-title` + one `.insight-card`, so `slides-engine.js` (Task 5) has real content to scrape.

- [ ] **Step 1: Create the Foundations stub lesson**

Create `pages/training/foundations-01-overview.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Foundations Overview — M365 Copilot for Bunzl</title>
<link rel="stylesheet" href="../../styles/shared.css"/>
</head>
<body>
<script src="../../footer.js"></script>
<script src="../../nav.js"></script>
<script src="../../training-sidebar.js"></script>

<div class="module-strip">
  <span class="ms-label">Track</span>
  <a href="foundations-01-overview.html" class="ms-item active"><span class="ms-num">1</span>Foundations</a>
  <span class="ms-arrow">›</span>
  <a href="advanced-01-overview.html" class="ms-item upcoming"><span class="ms-num">2</span>Advanced</a>
  <span class="ms-arrow">›</span>
  <a href="governance-01-overview.html" class="ms-item upcoming"><span class="ms-num">3</span>Governance</a>
</div>

<div class="page-header" id="intro">
  <div class="eyebrow">Foundations · Lesson 1 of 1 (placeholder)</div>
  <h1 class="title">Foundations <em>Overview</em></h1>
  <p class="subtitle">Placeholder lesson content. The full Foundations curriculum — what M365 Copilot Premium adds over free Copilot Chat, Work IQ and grounding explained simply, and everyday Chat and app basics — is designed and written in Phase B.</p>
  <div class="header-phase">
    <div class="header-phase-dot" style="background:#2f6b66"></div>
    Foundations · 2 hours · virtual, recorded
  </div>
</div>

<div class="section" id="placeholder">
  <div class="sec-eyebrow">01 — Coming in Phase B</div>
  <h2 class="sec-title">This lesson is a <em>placeholder</em></h2>
  <p class="sec-sub">Phase A wires up the site's navigation, slide engine, and progress system end-to-end before any lesson content is written. This stub proves the pattern works; Phase B replaces it with the real Foundations curriculum.</p>
  <div class="insight-grid" style="margin-top:28px;">
    <div class="insight-card">
      <div class="sec-eyebrow" style="margin-bottom:6px;">Why this page exists</div>
      <p style="font-size:15px;color:var(--slate);line-height:1.65;margin:0;">A working, testable site skeleton — nav, sidebar, slides, quiz, certificate — comes before content, so structural bugs surface now instead of after three tracks' worth of lessons are written on top of a broken foundation.</p>
    </div>
  </div>
</div>

<div class="page-footer"></div>
</body>
</html>
```

- [ ] **Step 2: Create the Advanced stub lesson**

Create `pages/training/advanced-01-overview.html` — same structure as Step 1, with these substitutions: `<title>Advanced Overview — M365 Copilot for Bunzl</title>`; module-strip's `advanced-01-overview.html` item gets `class="ms-item active"` and `foundations-01-overview.html` gets `class="ms-item done"` (already covered) while `governance-01-overview.html` stays `class="ms-item upcoming"`; eyebrow `Advanced · Lesson 1 of 1 (placeholder)`; `<h1 class="title">Advanced <em>Overview</em></h1>`; subtitle `Placeholder lesson content. The full Advanced curriculum — Agent Build, Copilot Cowork, and Copilot Studio for champions and SMEs — is designed and written in Phase C.`; header-phase dot `background:#8c47e4` and text `Advanced · 2 hours · virtual, recorded`; section eyebrow `01 — Coming in Phase C`; rest identical to Step 1's placeholder-explanation copy.

- [ ] **Step 3: Create the Governance stub lesson**

Create `pages/training/governance-01-overview.html` — same structure, substitutions: `<title>Governance Overview — M365 Copilot for Bunzl</title>`; module-strip's `governance-01-overview.html` item is `active`, both others `done`; eyebrow `Governance · Lesson 1 of 1 (placeholder)`; `<h1 class="title">Governance <em>Overview</em></h1>`; subtitle `Placeholder lesson content. The full Governance curriculum — tenant controls, visibility and auditing, and agent governance for IT and compliance leaders — is designed and written in Phase D.`; header-phase dot `background:#2b6880` and text `Governance · 1 hour · virtual, recorded`; section eyebrow `01 — Coming in Phase D`.

- [ ] **Step 4: Verify all three files exist with correct titles**

Run:
```bash
for f in foundations advanced governance; do
  grep -o "<title>[^<]*</title>" "pages/training/${f}-01-overview.html"
done
```
Expected:
```
<title>Foundations Overview — M365 Copilot for Bunzl</title>
<title>Advanced Overview — M365 Copilot for Bunzl</title>
<title>Governance Overview — M365 Copilot for Bunzl</title>
```

- [ ] **Step 5: Manual browser check**

Run `./serve`, then open `http://localhost:8000/pages/training/foundations-01-overview.html`, `.../advanced-01-overview.html`, and `.../governance-01-overview.html`. Confirm each loads without a console error, shows its own title/subtitle, and the module-strip highlights the correct track as active. (nav.js/training-sidebar.js will show stale "Module 1–4" labels until Tasks 3–4 land — that's expected at this point.)

- [ ] **Step 6: Commit**

```bash
git add pages/training/foundations-01-overview.html pages/training/advanced-01-overview.html pages/training/governance-01-overview.html
git commit -m "feat(bunzl): add placeholder lesson stubs for the 3 new tracks"
```

---

### Task 3: `nav.js` — 3-track `CRAFTS` manifest

**Files:**
- Modify: `nav.js:6-95`

**Interfaces:**
- Consumes: `pages/training/<track>-01-overview.html` (Task 2), `pages/workshops/<track>-workshop.html` (Task 7 — not yet created; nav.js only stores the path string, doesn't require the file to exist to load without error, but the link will 404 until Task 7 lands).
- Produces: `CRAFTS` array with `id`s `foundations`/`advanced`/`governance`, read by `training-sidebar.js` styling (Task 4), and by any later task that needs the canonical track id/label/color triple.

- [ ] **Step 1: Replace the `CRAFTS` array**

Modify `nav.js:6-95`, replacing the entire block (from `var CRAFTS = [` through its closing `];`) with:

```js
  var CRAFTS = [
    {
      id: 'foundations',
      folder: 'training',
      hub: 'pages/workshops/foundations-workshop.html',
      label: 'Foundations',
      subLabel: 'M365 Copilot Essentials',
      color: '#2f6b66',
      navColor: '#4f9990',
      filePrefix: ['foundations-01-'],
      pages: ['foundations-01-overview'],
      labels: ['Foundations Overview']
    },
    {
      id: 'advanced',
      folder: 'training',
      hub: 'pages/workshops/advanced-workshop.html',
      label: 'Advanced',
      subLabel: 'Agents, Cowork & Copilot Studio',
      color: '#8c47e4',
      navColor: '#c4b5fd',
      filePrefix: ['advanced-01-'],
      pages: ['advanced-01-overview'],
      labels: ['Advanced Overview']
    },
    {
      id: 'governance',
      folder: 'training',
      hub: 'pages/workshops/governance-workshop.html',
      label: 'Governance',
      subLabel: 'Admin, Risk & Oversight',
      color: '#2b6880',
      navColor: '#7dd3e8',
      filePrefix: ['governance-01-'],
      pages: ['governance-01-overview'],
      labels: ['Governance Overview']
    }
  ];
```

- [ ] **Step 2: Verify the old 4-module strings are gone and the new ones are present**

Run:
```bash
grep -c "id: 'm1'\|id: 'm2'\|id: 'm3'\|id: 'm4'" nav.js
grep -c "id: 'foundations'\|id: 'advanced'\|id: 'governance'" nav.js
```
Expected: first command outputs `0`, second outputs `3`.

- [ ] **Step 3: Manual browser check**

Run `./serve`, open `http://localhost:8000/pages/training/foundations-01-overview.html`. Confirm the top nav shows three craft chips labeled "Foundations", "Advanced", "Governance" (not "Module 1–4"), and "Foundations" is highlighted active. Open the mobile-width view (resize below ~900px) and confirm the mobile overlay also lists all three.

- [ ] **Step 4: Commit**

```bash
git add nav.js
git commit -m "feat(bunzl): repoint nav.js CRAFTS at the 3 Bunzl tracks"
```

---

### Task 4: `training-sidebar.js` — 3-track `MODULES` manifest

**Files:**
- Modify: `training-sidebar.js:4-53`

**Interfaces:**
- Consumes: same track id/label/color/lesson-file conventions as Task 3 (kept in lockstep — this file has no shared source with `nav.js`'s `CRAFTS`, per the existing repo pattern documented in `CLIENT-CUSTOMIZATION.md`).
- Produces: sidebar entries whose `slidesFile` points at `<track>-slides.html`, created in Task 5.

- [ ] **Step 1: Replace the `MODULES` array**

Modify `training-sidebar.js:4-53`, replacing from `var MODULES = [` through its closing `];` with:

```js
  var MODULES = [
    {
      label: 'Foundations',
      subLabel: 'M365 Copilot Essentials',
      color: '#4f9990',
      slidesFile: 'foundations-slides.html',
      lessons: [
        { file: 'foundations-01-overview.html', title: 'Foundations Overview', exercise: true }
      ]
    },
    {
      label: 'Advanced',
      subLabel: 'Agents, Cowork & Copilot Studio',
      color: '#c4b5fd',
      slidesFile: 'advanced-slides.html',
      lessons: [
        { file: 'advanced-01-overview.html', title: 'Advanced Overview', exercise: true }
      ]
    },
    {
      label: 'Governance',
      subLabel: 'Admin, Risk & Oversight',
      color: '#7dd3e8',
      slidesFile: 'governance-slides.html',
      lessons: [
        { file: 'governance-01-overview.html', title: 'Governance Overview', exercise: true }
      ]
    }
  ];
```

(`exercise: true` marks the lesson as carrying the track's quiz, matching the existing convention where the lab/capstone lesson gets the `✦` marker — appropriate here since Phase A's single stub lesson per track is also where Task 10 mounts that track's placeholder quiz.)

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "label: 'Module 1'\|label: 'Module 2'\|label: 'Module 3'\|label: 'Module 4'" training-sidebar.js
grep -c "label: 'Foundations'\|label: 'Advanced'\|label: 'Governance'" training-sidebar.js
```
Expected: first `0`, second `3`.

- [ ] **Step 3: Manual browser check**

With `./serve` running, open `http://localhost:8000/pages/training/foundations-01-overview.html` at a viewport wider than 1024px. Confirm the left sidebar shows three groups (Foundations, Advanced, Governance) each with one lesson link and a "⊞ Slides" link (the slides links will 404 until Task 5 — expected at this point).

- [ ] **Step 4: Commit**

```bash
git add training-sidebar.js
git commit -m "feat(bunzl): repoint training-sidebar.js MODULES at the 3 Bunzl tracks"
```

---

### Task 5: 3 slide decks

**Files:**
- Create: `pages/training/foundations-slides.html`
- Create: `pages/training/advanced-slides.html`
- Create: `pages/training/governance-slides.html`

**Interfaces:**
- Consumes: `slides-engine.js` (unchanged — confirmed count-agnostic, reads only `cfg.label`/`cfg.subLabel`/`cfg.color`/`cfg.lessons[]`), the stub lesson files from Task 2.
- Produces: the `slidesFile` targets referenced by Task 4's `MODULES` and Task 7's hub "⊞ Start Presentation" links.

- [ ] **Step 1: Create `foundations-slides.html`**

Copy the structure of the existing `pages/training/module-1-slides.html` (unchanged file — do not modify it yet; it's deleted in a later cleanup once Phases B/C/D fully replace the old lesson set). Create `pages/training/foundations-slides.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Foundations — M365 Copilot for Bunzl Slides</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css"/>
<link rel="stylesheet" href="slides-theme.css"/>
</head>
<body>
<div class="reveal">
  <div class="slides" id="deck">
    <section class="sl-loading"><p>Loading slides…</p></section>
  </div>
</div>
<script>
window.SLIDES_CFG = {
  label:    'Foundations',
  subLabel: 'M365 Copilot Essentials',
  color:    '#4f9990',
  lessons: [
    { file: 'foundations-01-overview.html', title: 'Foundations Overview' }
  ]
};
</script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
<script src="slides-engine.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `advanced-slides.html`**

Same structure, substitutions: `<title>Advanced — M365 Copilot for Bunzl Slides</title>`; `SLIDES_CFG` = `{ label: 'Advanced', subLabel: 'Agents, Cowork & Copilot Studio', color: '#c4b5fd', lessons: [{ file: 'advanced-01-overview.html', title: 'Advanced Overview' }] }`.

- [ ] **Step 3: Create `governance-slides.html`**

Same structure, substitutions: `<title>Governance — M365 Copilot for Bunzl Slides</title>`; `SLIDES_CFG` = `{ label: 'Governance', subLabel: 'Admin, Risk & Oversight', color: '#7dd3e8', lessons: [{ file: 'governance-01-overview.html', title: 'Governance Overview' }] }`.

- [ ] **Step 4: Verify**

Run:
```bash
for f in foundations advanced governance; do grep -o "label:    '[A-Za-z]*'" "pages/training/${f}-slides.html"; done
```
Expected: `label:    'Foundations'`, `label:    'Advanced'`, `label:    'Governance'`.

- [ ] **Step 5: Manual browser check**

With `./serve` running, open `http://localhost:8000/pages/training/foundations-slides.html`. Confirm a Reveal.js deck loads with 2 slides (title slide from `.page-header`, one content slide from the `.section#placeholder`). Repeat for `advanced-slides.html` and `governance-slides.html`.

- [ ] **Step 6: Commit**

```bash
git add pages/training/foundations-slides.html pages/training/advanced-slides.html pages/training/governance-slides.html
git commit -m "feat(bunzl): add slide decks for the 3 Bunzl tracks"
```

---

### Task 6: `footer.js` — 3-track chips and prose

**Files:**
- Modify: `footer.js:44-60`

**Interfaces:**
- Produces: footer copy shown on every page (loaded via `<script src=".../footer.js">` site-wide).

- [ ] **Step 1: Replace the footer template**

Modify `footer.js:49-56` (the `nav-footer-title` through closing `</div>` of `nav-footer-stages`), replacing:

```js
        '<div class="nav-footer-title">M365 Copilot Advanced Session · Brown &amp;amp; Brown Finance</div>' +
        '<div class="nav-footer-text">A four-module, hands-on session that takes the Brown &amp;amp; Brown finance team deep into Microsoft 365 Copilot — mastering Copilot Chat, Copilot in Excel, Outlook, Word, and PowerPoint, then the Researcher and Analyst reasoning agents on real finance workflows.</div>' +
        '<div class="nav-footer-stages" aria-label="Modules">' +
          '<span class="nav-footer-stage">Module 1 · Foundations &amp;amp; Copilot Chat</span>' +
          '<span class="nav-footer-stage">Module 2 · Copilot in the Apps</span>' +
          '<span class="nav-footer-stage">Module 3 · The Researcher Agent</span>' +
          '<span class="nav-footer-stage">Module 4 · Analyst &amp;amp; The Close Room</span>' +
        '</div>' +
```

with:

```js
        '<div class="nav-footer-title">M365 Copilot for Bunzl</div>' +
        '<div class="nav-footer-text">Three virtual, recorded sessions for Bunzl team members: Foundations (M365 Copilot essentials, offered on a recurring cadence), Advanced (Agent Build, Copilot Cowork, and Copilot Studio for champions and SMEs), and Governance (tenant controls and oversight for IT and compliance leaders).</div>' +
        '<div class="nav-footer-stages" aria-label="Tracks">' +
          '<span class="nav-footer-stage">Foundations · M365 Copilot Essentials</span>' +
          '<span class="nav-footer-stage">Advanced · Agents, Cowork &amp; Copilot Studio</span>' +
          '<span class="nav-footer-stage">Governance · Admin, Risk &amp; Oversight</span>' +
        '</div>' +
```

(Note: the source-of-truth string in the JS file itself uses a single `&amp;` — the doubled `&amp;amp;` above reflects how it appears already-escaped in the file; match whatever escaping the surrounding lines already use when you edit.)

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "Brown &" footer.js
grep -c "M365 Copilot for Bunzl" footer.js
```
Expected: first `0`, second `1`.

- [ ] **Step 3: Manual browser check**

With `./serve` running, open any page (e.g. `http://localhost:8000/index.html`), scroll to the footer, confirm it shows "M365 Copilot for Bunzl" and three track chips (not four module chips).

- [ ] **Step 4: Commit**

```bash
git add footer.js
git commit -m "feat(bunzl): update shared footer copy and chips for the 3 Bunzl tracks"
```

---

### Task 7: 3 hub pages

**Files:**
- Create: `pages/workshops/foundations-workshop.html`
- Create: `pages/workshops/advanced-workshop.html`
- Create: `pages/workshops/governance-workshop.html`

**Interfaces:**
- Consumes: `CRAFTS[].hub` paths from Task 3, lesson files from Task 2, slide decks from Task 5, and the escape-room capstone paths (`escape-room/index.html`, `control-room/index.html`, `governance-room/index.html` — the last created in Task 9, so its link will 404 until then, which is acceptable since this task's own verification doesn't require that link to resolve).
- Produces: the `#prework`/`#content` anchor ids that `nav.js`'s shared `MODULE_STAGES` scroll-spies (unchanged in this rebuild).

- [ ] **Step 1: Create `pages/workshops/foundations-workshop.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Foundations — M365 Copilot for Bunzl</title>
<link rel="stylesheet" href="../../styles/shared.css"/>
</head>
<body>
<script src="../../footer.js"></script>
<script src="../../nav.js"></script>

<div class="page-header" id="intro">
  <div class="eyebrow">Bunzl · Foundations</div>
  <h1 class="title">Foundations · M365 Copilot <em>Essentials</em></h1>
  <p class="subtitle">A 2-hour virtual, recorded session for Bunzl team members with an M365 Copilot Premium license — what Premium adds over free Copilot Chat, Work IQ and grounding explained simply, and everyday Chat and app basics. Offered on a recurring cadence with capacity-capped registration. This page is the track's home base — pre-work first, then the session content.</p>
  <div class="header-phase">
    <div class="header-phase-dot" style="background:#2f6b66"></div>
    Foundations · 2 hours · virtual, recorded
  </div>
</div>

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

<div class="page-footer"></div>
</body>
</html>
```

- [ ] **Step 2: Create `pages/workshops/advanced-workshop.html`**

Same structure as Step 1, substitutions: title `Advanced — M365 Copilot for Bunzl`; eyebrow `Bunzl · Advanced`; h1 `Advanced · Agents, Cowork &amp; <em>Copilot Studio</em>`; subtitle `A 2-hour virtual, recorded session for Bunzl champions and SMEs with (or eligible for) Copilot Cowork access — Agent Build (reusable tasks), delegating to Cowork, and Copilot Studio. This page is the track's home base — pre-work first, then the session content.`; header-phase dot `#8c47e4`, text `Advanced · 2 hours · virtual, recorded`; prework tip-trick copy `Full pre-work checklist lands in Phase C alongside the Advanced lesson content.`; content sec-sub `Placeholder — the full Advanced curriculum and agenda are designed in Phase C.`; module-card links to `advanced-01-overview.html` titled "Advanced Overview"; slides link to `../training/advanced-slides.html`; capstone link `../../control-room/index.html` labeled `Take-home capstone: The Automation Floor →`.

- [ ] **Step 3: Create `pages/workshops/governance-workshop.html`**

Same structure, substitutions: title `Governance — M365 Copilot for Bunzl`; eyebrow `Bunzl · Governance`; h1 `Governance · Admin, Risk &amp; <em>Oversight</em>`; subtitle `A 1-hour virtual, recorded session for Bunzl IT, security, and compliance leaders — tenant controls, visibility and auditing, and agent governance across Copilot, Cowork, and Copilot Studio. This page is the track's home base — pre-work first, then the session content.`; header-phase dot `#2b6880`, text `Governance · 1 hour · virtual, recorded`; prework tip-trick copy `Full pre-work checklist lands in Phase D alongside the Governance lesson content.`; content sec-sub `Placeholder — the full Governance curriculum and agenda are designed in Phase D.`; module-card links to `governance-01-overview.html` titled "Governance Overview"; slides link to `../training/governance-slides.html`; capstone link `../../governance-room/index.html` labeled `Take-home capstone: The Compliance Room →`.

- [ ] **Step 4: Verify**

Run:
```bash
for f in foundations advanced governance; do grep -o "<title>[^<]*</title>" "pages/workshops/${f}-workshop.html"; done
grep -l 'id="prework"' pages/workshops/foundations-workshop.html pages/workshops/advanced-workshop.html pages/workshops/governance-workshop.html | wc -l
grep -l 'id="content"' pages/workshops/foundations-workshop.html pages/workshops/advanced-workshop.html pages/workshops/governance-workshop.html | wc -l
```
Expected: 3 correct titles, then `3` and `3` (both anchors present in all three files).

- [ ] **Step 5: Manual browser check**

With `./serve` running, open each of the three hub URLs. Confirm the nav's sub-row ("Pre-work" / "Session content") scroll-spies correctly as you scroll, and clicking "Open lesson" lands on the matching Task 2 stub.

- [ ] **Step 6: Commit**

```bash
git add pages/workshops/foundations-workshop.html pages/workshops/advanced-workshop.html pages/workshops/governance-workshop.html
git commit -m "feat(bunzl): add the 3 track hub pages"
```

---

### Task 8: Homepage + 3-card grid

**Files:**
- Modify: `index.html`
- Modify: `styles/shared.css:3670-3671`

**Interfaces:**
- Consumes: hub paths from Task 7.

- [ ] **Step 1: Update `.module-grid` CSS for a 3-up layout**

Modify `styles/shared.css:3670-3671`, replacing:

```css
.module-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 40px; align-items: stretch; }
@media (max-width: 768px) { .module-grid { grid-template-columns: 1fr; } }
```

with:

```css
.module-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; align-items: stretch; }
@media (max-width: 900px) { .module-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .module-grid { grid-template-columns: 1fr; } }
```

(This rule is also used by the per-track hub pages' materials grids, which only ever show 1 card in Phase A — a 1-card row in a 3-column grid renders fine, left-aligned, no visual defect.)

- [ ] **Step 2: Replace `index.html`'s hero, module grid, and "how it runs" section**

Modify `index.html:6` (the `<title>`), replacing:
```html
<title>M365 Copilot Advanced Session — Brown &amp; Brown × Nimble Gravity</title>
```
with:
```html
<title>M365 Copilot for Bunzl — Nimble Gravity</title>
```

Modify `index.html:14-22` (the `page-header` hero block), replacing the whole block with:

```html
<div class="page-header page-header--index" id="top">
  <div class="eyebrow">Nimble Gravity × Bunzl · Copilot Enablement</div>
  <h1 class="hero-title">Go beyond the basics<br>with <em>M365 Copilot.</em></h1>
  <p class="hero-sub">Three virtual, recorded sessions for Bunzl team members. Foundations levels everyone up on core M365 Copilot; Advanced takes champions and SMEs into Agent Build, Copilot Cowork, and Copilot Studio; Governance equips IT and compliance leaders with tenant controls and oversight. This site is your portal — do the pre-work, join the session, and go deeper after.</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">
    <a href="pages/workshops/pre-work.html" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:var(--teal);color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:6px;">Start: Pre-work <span>→</span></a>
    <a href="pages/workshops/syllabus.html" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.85);font-size:14px;font-weight:600;text-decoration:none;border-radius:6px;border:1px solid rgba(255,255,255,.2);">See the session schedule</a>
  </div>
</div>
```

Modify `index.html:43-82` (the "THE FOUR MODULES" section), replacing the whole block (from `<div class="section section--off" id="workshops">` through its closing `</div>`) with:

```html
<div class="section section--off" id="workshops">
  <div class="sec-eyebrow">The Program</div>
  <h2 class="sec-title">Three tracks, one <em>program</em></h2>
  <p class="sec-sub">Each track is its own virtual, recorded session with its own hub — pre-work, session content, lessons, and a take-home capstone. Take the one that fits your role; the depth stays here for whenever you need it.</p>

  <div class="module-grid" style="margin-top:28px;">
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">1</div>
        <div class="module-card-meta"><div class="module-label">2 hours · virtual, recorded</div>
          <div class="module-name">Foundations</div>
          <div class="module-desc">M365 Copilot essentials — what Premium adds over free Copilot Chat, Work IQ and grounding explained simply, and everyday Chat and app basics. Offered on a recurring cadence for all Copilot-licensed team members.</div>
        </div></div>
      <div class="module-card-footer"><a href="pages/workshops/foundations-workshop.html" class="module-cta">Open Foundations <span>→</span></a></div>
    </div>
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">2</div>
        <div class="module-card-meta"><div class="module-label">2 hours · virtual, recorded</div>
          <div class="module-name">Advanced</div>
          <div class="module-desc">For champions and SMEs: Agent Build (reusable tasks), delegating to Copilot Cowork, and Copilot Studio.</div>
        </div></div>
      <div class="module-card-footer"><a href="pages/workshops/advanced-workshop.html" class="module-cta">Open Advanced <span>→</span></a></div>
    </div>
    <div class="module-card">
      <div class="module-card-top"><div class="module-num-big">3</div>
        <div class="module-card-meta"><div class="module-label">1 hour · virtual, recorded</div>
          <div class="module-name">Governance</div>
          <div class="module-desc">For IT, security, and compliance leaders: tenant controls, visibility and auditing, and agent governance.</div>
        </div></div>
      <div class="module-card-footer"><a href="pages/workshops/governance-workshop.html" class="module-cta">Open Governance <span>→</span></a></div>
    </div>
  </div>
</div>
```

Modify `index.html:90-95` (the `bp-grid--light` "How it runs" cards), replacing:

```html
  <div class="bp-grid--light" style="margin-top:28px;">
    <div class="bp-item"><div class="bp-num">01</div><div class="bp-title">Pre-work</div><div class="bp-body">Fifteen minutes before the session — confirm Copilot access, copy the lab files to your OneDrive, take the quick poll.</div></div>
    <div class="bp-item"><div class="bp-num">02</div><div class="bp-title">The session</div><div class="bp-body">Two hours, laptops open: four modules, live demos, and hands-on runs on synthetic finance data shaped like ours.</div></div>
    <div class="bp-item"><div class="bp-num">03</div><div class="bp-title">Knowledge checks</div><div class="bp-body">A short quiz per module — pass all four to unlock your certificate on My Progress.</div></div>
    <div class="bp-item"><div class="bp-num">04</div><div class="bp-title">Take-home</div><div class="bp-body">The Variance Vault and The Close Room challenges, plus a one-week practice plan to turn reps into habits.</div></div>
  </div>
```

with:

```html
  <div class="bp-grid--light" style="margin-top:28px;">
    <div class="bp-item"><div class="bp-num">01</div><div class="bp-title">Pre-work</div><div class="bp-body">Before the session — confirm Copilot access, copy the sample files to your OneDrive, take the quick poll.</div></div>
    <div class="bp-item"><div class="bp-num">02</div><div class="bp-title">The session</div><div class="bp-body">Live and recorded, virtual: teach segments, live demos, and follow-along on Bunzl-shaped sample data.</div></div>
    <div class="bp-item"><div class="bp-num">03</div><div class="bp-title">Knowledge check</div><div class="bp-body">A short quiz at the end of the track — pass it to unlock that track's certificate on My Progress. Each track's certificate is independent.</div></div>
    <div class="bp-item"><div class="bp-num">04</div><div class="bp-title">Take-home</div><div class="bp-body">Each track ends in its own take-home escape-room capstone, plus a practice plan to turn reps into habits.</div></div>
  </div>
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -c "Brown &" index.html
grep -c "module-card" index.html
grep "grid-template-columns: repeat(3, 1fr)" styles/shared.css
```
Expected: first `0`; second `3` (one `module-card` open tag per track card — adjust if your editor also matches `module-card-top`/`module-card-meta`/`module-card-footer` substrings, in which case use `grep -o 'class="module-card"' index.html | wc -l` instead, expecting `3`); third command prints the new rule.

- [ ] **Step 4: Manual browser check**

With `./serve` running, open `http://localhost:8000/index.html`. Confirm the hero no longer says "in-person," the module grid shows exactly 3 cards in a row on a wide viewport (2 cards + 1 on a mid viewport, 1 column on mobile), and all three "Open ___" links land on their Task 7 hub pages.

- [ ] **Step 5: Commit**

```bash
git add index.html styles/shared.css
git commit -m "feat(bunzl): rebuild homepage hero and module grid for the 3 Bunzl tracks"
```

---

### Task 9: Governance capstone escape-room scaffolding (`governance-room/`)

**Files:**
- Create: `governance-room/` (copied from `escape-room/`, then modified — see steps)
- Modify (within the new folder only): `governance-room/js/state.js`, `governance-room/js/leaderboard.js`, `governance-room/js/main.js`, `governance-room/js/admin.js`, `governance-room/config/app-config.js`, `governance-room/config/rooms.source.json`, `governance-room/index.html`, `governance-room/admin.html`, `governance-room/README.md`
- Delete: `governance-room/lab-files/variance-vault-briefing.md`
- Create: `governance-room/lab-files/governance-room-briefing.md`

**Interfaces:**
- Consumes: nothing from earlier tasks (self-contained app).
- Produces: `governance-room/index.html`, linked from Task 7's `governance-workshop.html`.

- [ ] **Step 1: Copy the folder**

```bash
cp -r escape-room governance-room
```

- [ ] **Step 2: Rename the localStorage state key**

Modify `governance-room/js/state.js:4`, replacing:
```js
const KEY = 'skillVault.state.v1';
```
with:
```js
const KEY = 'governanceRoom.state.v1';
```

- [ ] **Step 3: Rename the leaderboard keys**

Modify `governance-room/js/leaderboard.js:9-10`, replacing:
```js
const RUNS_KEY = 'skillVault.teams.v1';
const RESET_KEY = 'skillVault.resetFlags.v1';
```
with:
```js
const RUNS_KEY = 'governanceRoom.teams.v1';
const RESET_KEY = 'governanceRoom.resetFlags.v1';
```

Modify `governance-room/js/leaderboard.js:67`, replacing:
```js
function supabaseAdapter({ supabaseUrl, supabaseAnonKey, supabaseTable = 'skill_vault_teams' }) {
```
with:
```js
function supabaseAdapter({ supabaseUrl, supabaseAnonKey, supabaseTable = 'governance_room_teams' }) {
```

- [ ] **Step 4: Rename the global config variable**

Modify `governance-room/config/app-config.js:3`, replacing:
```js
window.SKILL_VAULT_CONFIG = {
```
with:
```js
window.GOVERNANCE_ROOM_CONFIG = {
```

Modify `governance-room/config/app-config.js:13`, replacing:
```js
  supabaseTable: 'skill_vault_teams',
```
with:
```js
  supabaseTable: 'governance_room_teams',
```

Modify `governance-room/js/main.js:9`, replacing:
```js
const CFG = globalThis.SKILL_VAULT_CONFIG || {};
```
with:
```js
const CFG = globalThis.GOVERNANCE_ROOM_CONFIG || {};
```

Modify `governance-room/js/admin.js:6`, replacing:
```js
const CFG = globalThis.SKILL_VAULT_CONFIG || {};
```
with:
```js
const CFG = globalThis.GOVERNANCE_ROOM_CONFIG || {};
```

- [ ] **Step 5: Replace the room content with a 2-station placeholder**

Replace `governance-room/config/rooms.source.json` entirely with:

```json
{
  "workshopTitle": "Governance Track Capstone: The Compliance Room",
  "scenario": "Placeholder scenario. A tenant-governance audit fire drill — the real narrative, lab steps, and unlock codes (derived from Bunzl-shaped sample data) are written in Phase D.",
  "timeLimitMinutes": 20,
  "hintPenaltySeconds": 60,
  "rooms": [
    {
      "id": "room-1",
      "title": "Placeholder Station 1",
      "narrative": "Placeholder — replaced with real Governance-track content in Phase D.",
      "labSteps": [
        "Placeholder lab step — Phase D replaces this with a real Copilot admin-portal task."
      ],
      "codePlaintext": "PLACEHOLDER1",
      "codeHash": "GENERATE_WITH_SCRIPT",
      "hints": ["Placeholder hint."],
      "skillsTaught": ["Placeholder skill."]
    },
    {
      "id": "room-2",
      "title": "Placeholder Station 2",
      "narrative": "Placeholder — replaced with real Governance-track content in Phase D.",
      "labSteps": [
        "Placeholder lab step — Phase D replaces this with a real Copilot admin-portal task."
      ],
      "codePlaintext": "PLACEHOLDER2",
      "codeHash": "GENERATE_WITH_SCRIPT",
      "hints": ["Placeholder hint."],
      "skillsTaught": ["Placeholder skill."]
    }
  ]
}
```

- [ ] **Step 6: Replace the lab-files briefing**

```bash
rm governance-room/lab-files/variance-vault-briefing.md
```

Create `governance-room/lab-files/governance-room-briefing.md`:

```markdown
# The Compliance Room — Briefing (placeholder)

This is a placeholder briefing document. The real Governance-track capstone briefing,
grounded in the Bunzl-shaped sample data from Task 13, is written in Phase D.
```

- [ ] **Step 7: Update titles/copy in `index.html`, `admin.html`, `README.md`**

Modify `governance-room/index.html` and `governance-room/admin.html`: find every occurrence of "Variance Vault" or "Skill Vault" (`grep -n "Variance Vault\|Skill Vault" governance-room/index.html governance-room/admin.html`) and replace with "The Compliance Room". Modify `governance-room/README.md`: replace its title/intro paragraph referencing "Variance Vault" with a short note: "The Compliance Room — Governance track capstone. Scaffolded from `escape-room/` in Phase A with placeholder content; real narrative/lab-steps/codes land in Phase D. See `escape-room/README.md` for the shared engine mechanics (state, leaderboard, hashing) — identical here except for the renamed storage keys and config global (`GOVERNANCE_ROOM_CONFIG`)."

- [ ] **Step 8: Regenerate the hashed rooms file**

```bash
node governance-room/tools/generate-hashes.mjs governance-room/config/rooms.source.json governance-room/config/rooms.json
```
Expected output: two `✓ Room N "Placeholder Station N" — PLACEHOLDERN → <hash prefix>…` lines, no `⚠` warnings, ending with `Wrote governance-room/config/rooms.json. codePlaintext stripped.`

- [ ] **Step 9: Verify no leftover `skillVault`/`SKILL_VAULT_CONFIG`/`skill_vault` strings remain (the cross-contamination check the control-room README explicitly warns about)**

```bash
grep -rn "skillVault\|SKILL_VAULT_CONFIG\|skill_vault" governance-room/
```
Expected: no output (empty). If anything matches, it's a missed rename from Steps 2–4 — fix it before proceeding, since a shared key would let a Foundations-track escape-room run bleed into the Governance one (same origin, same localStorage).

- [ ] **Step 10: Verify `rooms.json` has no plaintext codes**

```bash
grep -c codePlaintext governance-room/config/rooms.json
```
Expected: `0` (the generator script strips `codePlaintext` from its output — confirms Step 8 ran correctly).

- [ ] **Step 11: Manual browser check**

With `./serve` running, open `http://localhost:8000/governance-room/index.html`. Confirm the 3D scene loads (reused from `escape-room/`'s Three.js set), the title reads "The Compliance Room," and there are 2 stations instead of `escape-room/`'s original 4.

- [ ] **Step 12: Commit**

```bash
git add governance-room/
git commit -m "feat(bunzl): scaffold governance-room as the Governance track capstone engine"
```

---

### Task 10: Independent per-track certificates

**Files:**
- Create: `progress-model.js`
- Create: `progress-model.test.js`
- Modify: `interactive.js` (multiple sections — see steps)
- Modify: `pages/workshops/my-progress.html`
- Modify: `pages/training/foundations-01-overview.html`, `pages/training/advanced-01-overview.html`, `pages/training/governance-01-overview.html` (add quiz mount + script tags)

**Interfaces:**
- Produces: `window.ProgressModel` (browser) / `module.exports` (Node) with `TRACKS`, `trackIds()`, `trackLabel(id)`, `isTrackPassed(quizState, id)`, `passedTracks(quizState)` — consumed by `interactive.js`'s `renderReadout`/`renderProgress`/`renderCertificate`.

- [ ] **Step 1: Write the failing test**

Create `progress-model.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const ProgressModel = require('./progress-model.js');

test('trackIds returns the three Bunzl tracks in order', () => {
  assert.deepEqual(ProgressModel.trackIds(), ['foundations', 'advanced', 'governance']);
});

test('trackLabel returns the human-readable label for a known id', () => {
  assert.equal(ProgressModel.trackLabel('foundations'), 'Foundations · M365 Copilot Essentials');
});

test('trackLabel falls back to the raw id for an unknown id', () => {
  assert.equal(ProgressModel.trackLabel('nope'), 'nope');
});

test('isTrackPassed is false when the track has no quiz result', () => {
  assert.equal(ProgressModel.isTrackPassed({}, 'foundations'), false);
});

test('isTrackPassed is false when the quiz result exists but passed is false', () => {
  assert.equal(ProgressModel.isTrackPassed({ foundations: { passed: false } }, 'foundations'), false);
});

test('isTrackPassed is true when the quiz result has passed: true', () => {
  assert.equal(ProgressModel.isTrackPassed({ foundations: { passed: true } }, 'foundations'), true);
});

test('passedTracks returns only the ids whose quiz passed, in track order', () => {
  const quizState = { advanced: { passed: true }, governance: { passed: true } };
  assert.deepEqual(ProgressModel.passedTracks(quizState), ['advanced', 'governance']);
});

test('passedTracks returns an empty array when nothing has passed', () => {
  assert.deepEqual(ProgressModel.passedTracks({}), []);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test progress-model.test.js`
Expected: FAIL — `Cannot find module './progress-model.js'`.

- [ ] **Step 3: Write `progress-model.js`**

```js
(function (root) {
  'use strict';

  var TRACKS = [
    { id: 'foundations', label: 'Foundations · M365 Copilot Essentials' },
    { id: 'advanced',    label: 'Advanced · Agents, Cowork & Copilot Studio' },
    { id: 'governance',  label: 'Governance · Admin, Risk & Oversight' }
  ];

  function trackIds() {
    return TRACKS.map(function (t) { return t.id; });
  }

  function trackLabel(id) {
    var match = TRACKS.filter(function (t) { return t.id === id; })[0];
    return match ? match.label : id;
  }

  function isTrackPassed(quizState, trackId) {
    var q = quizState && quizState[trackId];
    return !!(q && q.passed);
  }

  function passedTracks(quizState) {
    return trackIds().filter(function (id) { return isTrackPassed(quizState, id); });
  }

  var api = {
    TRACKS: TRACKS,
    trackIds: trackIds,
    trackLabel: trackLabel,
    isTrackPassed: isTrackPassed,
    passedTracks: passedTracks
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ProgressModel = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test progress-model.test.js`
Expected: PASS — `# pass 8`, `# fail 0`.

- [ ] **Step 5: Load `progress-model.js` in the browser wherever `interactive.js` is used**

Modify `pages/workshops/my-progress.html:15`, replacing:
```html
<script src="../../interactive.js"></script>
```
with:
```html
<script src="../../progress-model.js"></script>
<script src="../../interactive.js"></script>
```

Modify each of `pages/training/foundations-01-overview.html`, `pages/training/advanced-01-overview.html`, `pages/training/governance-01-overview.html`: after the existing `<script src="../../training-sidebar.js"></script>` line, add:
```html
<script src="../../progress-model.js"></script>
<script src="../../interactive.js"></script>
```

- [ ] **Step 6: Add a quiz mount + script wiring to each stub lesson**

In each of the three stub lesson files, add this section immediately before the closing `<div class="page-footer"></div>` (after the existing `.section#placeholder`):

For `pages/training/foundations-01-overview.html`:
```html
<div class="section" id="quiz">
  <div class="sec-eyebrow">02 — Knowledge check (placeholder)</div>
  <h2 class="sec-title">One <em>question</em></h2>
  <p class="sec-sub">A single placeholder question — Phase B replaces this with the real Foundations quiz.</p>
  <div class="ix-quiz" data-ix-quiz="foundations" data-ix-pass="1"></div>
</div>
```
For `pages/training/advanced-01-overview.html`, same block with `data-ix-quiz="advanced"` and matching eyebrow/title text for Advanced.
For `pages/training/governance-01-overview.html`, same block with `data-ix-quiz="governance"` and matching text for Governance.

- [ ] **Step 7: Replace `QUIZZES` in `interactive.js`**

Modify `interactive.js:55-130ish` (the entire `var QUIZZES = { m1: {...}, m2: {...}, m3: {...}, m4: {...} };` block — locate its exact closing `};` by searching for the line after `m4`'s content), replacing the whole object with:

```js
  var QUIZZES = {
    foundations: {
      label: 'Foundations · M365 Copilot Essentials',
      questions: [
        { q: 'What does an M365 Copilot Premium license add that free Copilot Chat does not?',
          options: ['Nothing — they are the same product', 'Work-grounded Chat against your Microsoft Graph data, plus Copilot inside the M365 apps and the Researcher/Analyst agents', 'Only a different color theme'],
          answer: 1 }
      ]
    },
    advanced: {
      label: 'Advanced · Agents, Cowork & Copilot Studio',
      questions: [
        { q: 'What does delegating a task to Copilot Cowork add over asking Copilot Chat directly?',
          options: ['Nothing — Cowork is just a rebrand of Chat', 'Cowork can carry out longer, multi-step tasks on your behalf and report back, rather than answering one prompt at a time', 'Cowork can only summarize emails'],
          answer: 1 }
      ]
    },
    governance: {
      label: 'Governance · Admin, Risk & Oversight',
      questions: [
        { q: 'Why does agent governance (Copilot Studio, Cowork) need active oversight rather than a one-time setup?',
          options: ['It does not — agent settings never change once configured', 'Agent capabilities, licensing, and consumption models change frequently, so visibility and review need to be ongoing', 'Only Microsoft can see what agents are doing, so no local oversight is possible'],
          answer: 1 }
      ]
    }
  };
```

- [ ] **Step 8: Remove `MODULE_LABELS` and `passedCount`, delegate to `ProgressModel`**

Modify `interactive.js:50-51`, deleting these two lines entirely:
```js
  var MODULE_LABELS = { m1: 'Module 1 · Foundations & Copilot Chat', m2: 'Module 2 · Copilot in the Apps', m3: 'Module 3 · The Researcher Agent', m4: 'Module 4 · Analyst & The Close Room' };
  function passedCount() { var s = getStore(); var q = s.quiz || {}; var n = 0; ['m1','m2','m3','m4'].forEach(function (m) { if (q[m] && q[m].passed) n++; }); return n; }
```

- [ ] **Step 9: Rewrite `renderReadout`**

Modify `interactive.js:508-513` (inside `renderReadout`), replacing:
```js
    ['m1', 'm2', 'm3', 'm4'].forEach(function (m, i) {
      var passed = quiz[m] && quiz[m].passed;
      var pill = el('span', 'ix-pill' + (passed ? ' on' : ''));
      pill.appendChild(el('span', null, (passed ? '✓ ' : '○ ') + 'Module ' + (i + 1)));
      grid.appendChild(pill);
    });
```
with:
```js
    ProgressModel.trackIds().forEach(function (id) {
      var passed = ProgressModel.isTrackPassed(quiz, id);
      var pill = el('span', 'ix-pill' + (passed ? ' on' : ''));
      pill.appendChild(el('span', null, (passed ? '✓ ' : '○ ') + ProgressModel.trackLabel(id).split(' · ')[0]));
      grid.appendChild(pill);
    });
```

- [ ] **Step 10: Rewrite `renderProgress`**

Modify `interactive.js:573-589` (inside `renderProgress`), replacing:
```js
    ['m1', 'm2', 'm3', 'm4'].forEach(function (m) {
      var q = quiz[m];
      var passed = q && q.passed;
      var row = el('div', 'ix-prog-row' + (passed ? ' on' : ''));
      row.appendChild(el('span', 'ix-prog-check', passed ? '✓' : '○'));
      row.appendChild(el('span', 'ix-prog-label', MODULE_LABELS[m]));
      row.appendChild(el('span', 'ix-prog-score', q ? (q.score + '/' + q.total) : '—'));
      rows.appendChild(row);
    });
    card.appendChild(rows);
    var n = passedCount();
    var bar = el('div', 'ix-bar');
    var fill = el('div', 'ix-bar-fill');
    fill.style.width = (n / 4 * 100) + '%';
    bar.appendChild(fill);
    card.appendChild(bar);
    card.appendChild(el('p', 'ix-prog-summary', n + ' of 4 modules complete' + (n === 4 ? ' — certificate unlocked below.' : '.')));
```
with:
```js
    ProgressModel.trackIds().forEach(function (id) {
      var q = quiz[id];
      var passed = ProgressModel.isTrackPassed(quiz, id);
      var row = el('div', 'ix-prog-row' + (passed ? ' on' : ''));
      row.appendChild(el('span', 'ix-prog-check', passed ? '✓' : '○'));
      row.appendChild(el('span', 'ix-prog-label', ProgressModel.trackLabel(id)));
      row.appendChild(el('span', 'ix-prog-score', q ? (q.score + '/' + q.total) : '—'));
      rows.appendChild(row);
    });
    card.appendChild(rows);
    var n = ProgressModel.passedTracks(quiz).length;
    card.appendChild(el('p', 'ix-prog-summary', n + ' of ' + ProgressModel.trackIds().length + ' track certificates unlocked — each track is independent, so you do not need all three.'));
```
(The combined progress bar is removed — a 4-of-4-style bar implied a single shared completion gate, which no longer exists. Each track's own certificate section, below, is the per-track "am I done" signal.)

- [ ] **Step 11: Rewrite `buildCertNode` to take a `trackId`**

Modify `interactive.js:600-614` (`buildCertNode`), replacing:
```js
  function buildCertNode() {
    var prof = getProfile();
    var name = (prof && prof.name) ? prof.name : '';
    var cert = el('div', 'ix-cert');
    cert.appendChild(el('div', 'ix-cert-eyebrow', 'Nimble Gravity & Brown & Brown · Copilot Enablement'));
    cert.appendChild(el('div', 'ix-cert-title', 'Certificate of Completion'));
    cert.appendChild(el('div', 'ix-cert-line', 'This certifies that'));
    cert.appendChild(el('div', 'ix-cert-name', name || 'Your name'));
    cert.appendChild(el('div', 'ix-cert-line', 'completed the four-module M365 Copilot Advanced Workshop.'));
    var d = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    cert.appendChild(el('div', 'ix-cert-meta', months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()));
    cert.appendChild(el('div', 'ix-cert-disclaimer', 'A personal record of completion — not an official Brown & Brown training record.'));
    return cert;
  }
```
(exact `&` escaping may differ slightly in the live file — match whatever's there) with:
```js
  function buildCertNode(trackId) {
    var prof = getProfile();
    var name = (prof && prof.name) ? prof.name : '';
    var cert = el('div', 'ix-cert');
    cert.appendChild(el('div', 'ix-cert-eyebrow', 'Nimble Gravity × Bunzl · Copilot Enablement'));
    cert.appendChild(el('div', 'ix-cert-title', 'Certificate of Completion'));
    cert.appendChild(el('div', 'ix-cert-line', 'This certifies that'));
    cert.appendChild(el('div', 'ix-cert-name', name || 'Your name'));
    cert.appendChild(el('div', 'ix-cert-line', 'completed the ' + ProgressModel.trackLabel(trackId).split(' · ')[0] + ' track of the M365 Copilot for Bunzl program.'));
    var d = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    cert.appendChild(el('div', 'ix-cert-meta', months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()));
    cert.appendChild(el('div', 'ix-cert-disclaimer', 'A personal record of completion — not an official Bunzl training record.'));
    return cert;
  }
```

- [ ] **Step 12: Rewrite `renderCertificate` to read the mount's `data-ix-certificate` track id**

Modify `interactive.js:616-626`, replacing:
```js
  function renderCertificate(mount) {
    mount.innerHTML = '';
    var n = passedCount();
    if (n < 4) {
      var locked = el('div', 'ix-locked');
      locked.appendChild(el('div', 'ix-locked-icon', '🔒'));
      locked.appendChild(el('div', 'ix-locked-title', 'Certificate locked'));
      locked.appendChild(el('div', 'ix-locked-sub', 'Pass all four module quizzes to unlock your certificate — ' + n + ' of 4 done. Each one lives at the end of its module’s lab lesson.'));
      mount.appendChild(locked);
      return;
    }
```
with:
```js
  function renderCertificate(mount) {
    mount.innerHTML = '';
    var trackId = mount.getAttribute('data-ix-certificate');
    var quiz = (getStore().quiz) || {};
    if (!ProgressModel.isTrackPassed(quiz, trackId)) {
      var locked = el('div', 'ix-locked');
      locked.appendChild(el('div', 'ix-locked-icon', '🔒'));
      locked.appendChild(el('div', 'ix-locked-title', 'Certificate locked'));
      locked.appendChild(el('div', 'ix-locked-sub', 'Pass the ' + ProgressModel.trackLabel(trackId).split(' · ')[0] + ' quiz to unlock this certificate. It lives at the end of that track’s lesson.'));
      mount.appendChild(locked);
      return;
    }
```

Then, a few lines further down inside the same function, modify the `buildCertNode()` call, replacing:
```js
    card.appendChild(buildCertNode());
```
with:
```js
    card.appendChild(buildCertNode(trackId));
```

- [ ] **Step 13: Replace `pages/workshops/my-progress.html`'s progress and certificate sections**

Modify `pages/workshops/my-progress.html:17-20` (the intro), replacing:
```html
  <div class="eyebrow">Brown &amp; Brown · Copilot Session</div>
  <h1 class="title">My <em>Progress</em></h1>
  <p class="subtitle">Track what you've completed across the four modules and unlock your certificate once you've passed all four module quizzes. Everything here is saved on this device only — it's a personal record, not an official Brown &amp; Brown training record.</p>
```
with:
```html
  <div class="eyebrow">Bunzl · M365 Copilot Program</div>
  <h1 class="title">My <em>Progress</em></h1>
  <p class="subtitle">Track your progress on each track you take and unlock that track's certificate once you've passed its quiz. Tracks are independent — you don't need all three. Everything here is saved on this device only — it's a personal record, not an official Bunzl training record.</p>
```

Modify `pages/workshops/my-progress.html:36-47` (the progress section), replacing:
```html
<div class="section section--off" id="progress">
  <div class="sec-eyebrow">02 — Your progress</div>
  <h2 class="sec-title">Four modules, four <em>quizzes</em></h2>
  <p class="sec-sub">Each module's quiz is at the end of its lab. Pass it to mark the module complete.</p>
  <div class="ix-progress" data-ix-progress></div>
  <p style="margin-top:20px;display:flex;gap:16px;flex-wrap:wrap;">
    <a href="../training/03-grounded-chat-lab.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Module 1 · Foundations &amp; Copilot Chat quiz →</a>
    <a href="../training/07-close-package-lab.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Module 2 · Copilot in the Apps quiz →</a>
    <a href="../training/11-researcher-mission-lab.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Module 3 · The Researcher Agent quiz →</a>
    <a href="../training/16-the-close-room.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Module 4 · Analyst &amp; The Close Room quiz →</a>
  </p>
</div>
```
with:
```html
<div class="section section--off" id="progress">
  <div class="sec-eyebrow">02 — Your progress</div>
  <h2 class="sec-title">Three tracks, three <em>quizzes</em></h2>
  <p class="sec-sub">Each track's quiz is at the end of its lesson. Pass it to unlock that track's certificate below.</p>
  <div class="ix-progress" data-ix-progress></div>
  <p style="margin-top:20px;display:flex;gap:16px;flex-wrap:wrap;">
    <a href="../training/foundations-01-overview.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Foundations quiz →</a>
    <a href="../training/advanced-01-overview.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Advanced quiz →</a>
    <a href="../training/governance-01-overview.html" style="color:var(--teal);text-decoration:none;font-weight:600;font-size:14px;">Governance quiz →</a>
  </p>
</div>
```

Modify `pages/workshops/my-progress.html:50-55` (the certificate section), replacing:
```html
<div class="section" id="certificate">
  <div class="sec-eyebrow">03 — Your certificate</div>
  <h2 class="sec-title">Finish all four to <em>unlock</em> it</h2>
  <p class="sec-sub">Once all four module quizzes are passed, your certificate appears here, ready to print or save as a PDF.</p>
  <div class="ix-certificate" data-ix-certificate></div>
</div>
```
with:
```html
<div class="section" id="certificate">
  <div class="sec-eyebrow">03 — Your certificates</div>
  <h2 class="sec-title">Unlock each track's <em>certificate</em></h2>
  <p class="sec-sub">Each certificate unlocks independently, as soon as that track's quiz is passed — ready to print or save as a PDF.</p>
  <div class="ix-certificate" data-ix-certificate="foundations"></div>
  <div class="ix-certificate" data-ix-certificate="advanced" style="margin-top:20px;"></div>
  <div class="ix-certificate" data-ix-certificate="governance" style="margin-top:20px;"></div>
</div>
```

Modify `pages/workshops/my-progress.html:14` (`<script src="../../interactive.js"></script>`), adding `progress-model.js` before it, same as Step 5.

- [ ] **Step 14: Run the Node test suite again (regression check after all `interactive.js` edits)**

Run: `node --test progress-model.test.js`
Expected: PASS — `# pass 8`, `# fail 0` (unchanged; `progress-model.js` itself wasn't touched in Steps 7–13, this just confirms nothing broke it).

- [ ] **Step 15: Verify no old module-count literals remain in `interactive.js`**

```bash
grep -c "MODULE_LABELS\|passedCount\|'m1'\|'m2'\|'m3'\|'m4'" interactive.js
```
Expected: `0`.

- [ ] **Step 16: Manual browser check — full pipeline**

With `./serve` running: open `http://localhost:8000/pages/training/foundations-01-overview.html`, scroll to the quiz, answer it correctly, confirm it reports passed. Open `http://localhost:8000/pages/workshops/my-progress.html`, confirm the Foundations row shows passed and the Foundations certificate is unlocked (prints your name if set) while Advanced/Governance certificates still show locked. Repeat for Advanced and Governance to confirm all three unlock independently and none require the other two.

- [ ] **Step 17: Commit**

```bash
git add progress-model.js progress-model.test.js interactive.js pages/workshops/my-progress.html pages/training/foundations-01-overview.html pages/training/advanced-01-overview.html pages/training/governance-01-overview.html
git commit -m "feat(bunzl): independent per-track certificates, replacing the combined 4-of-4 gate"
```

---

### Task 11: `DESIGN-SYSTEM.md` rewrite pass

**Files:**
- Modify: `DESIGN-SYSTEM.md:56-61`, `DESIGN-SYSTEM.md:104`, `DESIGN-SYSTEM.md:106-117`

- [ ] **Step 1: Update the "How Slides Are Generated" intro**

Modify `DESIGN-SYSTEM.md:60`, replacing:
```
`module-N-slides.html` and edit its `SLIDES_CFG` (`label`, `subLabel`, `color`, `lessons[]`).
```
with:
```
`<track>-slides.html` (e.g. `foundations-slides.html`) and edit its `SLIDES_CFG` (`label`, `subLabel`, `color`, `lessons[]`).
```

- [ ] **Step 2: Update the agenda-timeline paragraph**

Modify `DESIGN-SYSTEM.md:104`, replacing:
```
The per-module hubs (`pages/workshops/module-N-workshop.html`) use a small timeline pattern: a vertical list of `.agenda-row`s, each with a `.agenda-time` (left column, with a `<small>` duration), a coloured `.agenda-tag` chip, and an `.agenda-body`. Tag modifiers: `--teach`, `--demo`, `--lab`, `--discuss`, `--break` (no modifier = neutral, for Open / Debrief / Close). Defined in `styles/shared.css`; the tag reuses the badge/chip language. Each hub's rows cover that module's block within the single 2-hour session (times are absolute session times, e.g. Module 3 = 1:05–1:30); the full run of show lives on `syllabus.html`. Pages under `pages/workshops/` are not listed in any `SLIDES_CFG`, so they do not generate slides.
```
with:
```
The per-track hubs (`pages/workshops/<track>-workshop.html`) use a small timeline pattern: a vertical list of `.agenda-row`s, each with a `.agenda-time` (left column, with a `<small>` duration), a coloured `.agenda-tag` chip, and an `.agenda-body`. Tag modifiers: `--teach`, `--demo`, `--lab`, `--discuss`, `--break` (no modifier = neutral, for Open / Debrief / Close). Defined in `styles/shared.css`; the tag reuses the badge/chip language. Each hub's rows cover that track's own session (Foundations and Advanced are each 2 hours; Governance is 1 hour — times are relative to that track's own session start, not a shared clock across tracks). Pages under `pages/workshops/` are not listed in any `SLIDES_CFG`, so they do not generate slides.
```

- [ ] **Step 3: Update "The module hub spine" section**

Modify `DESIGN-SYSTEM.md:106-117`, replacing the entire section (from `## The module hub spine` through its last paragraph) with:

```markdown
## The track hub spine

Each track's **hub** (`pages/workshops/<track>-workshop.html`) is the track's home base, and is
the unit the nav "enters" — the top-nav label is the track's `label` (e.g. **`Foundations`**)
and links to the hub (`CRAFTS[n].hub` in `nav.js`), matching the Home page's track cards. Every
hub is organized into the **same two ordered, anchored sections**:

| Stage | Section `id` | Holds |
|---|---|---|
| Pre-work | `#prework` | Before-the-session items; links to `pre-work.html` for the full before/after |
| Session content | `#content` | Objectives → `.agenda` run-of-show → lesson cards + `⊞ Start Presentation` + take-home capstone link |

`nav.js` exposes these two as the **sub-row** (the navigation bar) via the shared
`MODULE_STAGES` array (label + `#hash`), whenever you're on a track's hub **or** one of its
lessons. On the hub the sub-row **scroll-spies** the section ids; on a lesson page it marks
**Session content** active. Keep the two hub `id`s and the `MODULE_STAGES`/`hub` entries in
sync.

The **knowledge check** is not on the hub: each track's `data-ix-quiz` mount (ids
`foundations`/`advanced`/`governance`) lives at the end of its lab/capstone lesson and renders
as the animated one-question-at-a-time component in `interactive.js`. Each track's
certificate is **independent** — passing one track's quiz unlocks only that track's
certificate on `my-progress.html` (`data-ix-certificate="<track-id>"`); there is no combined
"complete every track" gate, since most attendees take only one or two tracks. Certificate
gating logic lives in `progress-model.js` (a small, framework-free module tested with Node's
built-in `node --test progress-model.test.js`), consumed by `interactive.js`'s
`renderReadout`/`renderProgress`/`renderCertificate`.
```

- [ ] **Step 4: Verify**

```bash
grep -c "module-N-workshop\|Module N\|module hub spine" DESIGN-SYSTEM.md
```
Expected: `0`.

- [ ] **Step 5: Commit**

```bash
git add DESIGN-SYSTEM.md
git commit -m "docs(bunzl): update DESIGN-SYSTEM.md for the 3-track hub spine and per-track certificates"
```

---

### Task 12: `CLAUDE.md` rewrite pass

**Files:**
- Modify: `CLAUDE.md` (the "What This Is" section, the module-manifest-duplication paragraph, the navigation-model paragraph, the CSS Conventions module-accents line, and the Domain Context section)

- [ ] **Step 1: Update "What This Is"**

Replace the opening section (from `## What This Is` through the `To run locally` code block) with:

```markdown
## What This Is

A **Nimble Gravity** enablement microsite for **Bunzl** (a global distribution and
outsourcing group): the **M365 Copilot for Bunzl** program — three independent, virtual,
recorded sessions for general/cross-functional Bunzl team members. **Foundations** (2 hours,
repeated on a recurring cadence) covers core M365 Copilot; **Advanced** (2 hours, champions
and SMEs) covers Agent Build, Copilot Cowork, and Copilot Studio; **Governance** (1 hour, IT
and compliance leaders) covers tenant controls and oversight. No build step, no framework, no
package manager.

The framework (nav, footer, design system, slide engine, page template) was forked from an
earlier workshop template (previous content: Claude Cowork training for Axos, then the M365
Copilot Advanced Workshop for Brown & Brown — see git history). The Bunzl content is grounded
in `bunzl-context.md` — the subject brief holding all researched Bunzl and Microsoft facts,
the program design, and the re-verify list. **Read it before writing or revising any content.**

To run locally:
```bash
./serve
# Visit http://localhost:8000
```

For a plain static server without live reload:
```bash
python -m http.server
```
```

- [ ] **Step 2: Update the module-manifest-duplication paragraph**

Find the paragraph beginning `**The module manifest is duplicated in several places...` and replace it with:

```markdown
**The track manifest is duplicated in several places — keep them in sync** when adding/renaming/
reordering tracks or lessons: the `CRAFTS` array in `nav.js` (the `filePrefix[]` plus the
positionally-zipped `pages[]`/`labels[]`; each craft also carries a `hub`), the `MODULES` array in
`training-sidebar.js`, the `window.SLIDES_CFG` in each `pages/training/<track>-slides.html`, the
footer track chips in `footer.js`, the `module-strip` block duplicated at the top of every lesson,
the `.module-grid` cards inside each hub's `#content` stage and on `index.html`, and the three
track certificate mounts on `my-progress.html`. Display order = array order, not filename order;
always add a new lesson's numeric prefix to the owning track's `filePrefix[]` in `nav.js` or the
page renders with an empty sub-nav. See `CLIENT-CUSTOMIZATION.md`.
```

- [ ] **Step 3: Update the navigation-model paragraph**

Find the paragraph beginning `**Navigation model:**` and replace it with:

```markdown
**Navigation model:** the top nav's track labels (Foundations/Advanced/Governance) link to each
track's **hub** (`CRAFTS[n].hub`); the nav sub-row shows each hub's two stages (`MODULE_STAGES` →
`#prework`/`#content` anchors). Each track's knowledge check is the animated `data-ix-quiz`
component (keys `foundations`/`advanced`/`governance`) at the end of that track's lab/capstone
lesson, feeding an **independent** certificate on `my-progress.html` (`data-ix-certificate`,
gated by `progress-model.js`; localStorage key `ng-copilot:v1`) — passing one track never gates
another's certificate. See DESIGN-SYSTEM.md "The track hub spine".
```

- [ ] **Step 4: Update the slides-build paragraph's filename reference**

Find the paragraph beginning `**Slides build themselves from lesson HTML.**` and replace the phrase `a deck file (\`module-N-slides.html\`)` with `a deck file (\`<track>-slides.html\`)`.

- [ ] **Step 5: Update the escape-room paragraph**

Find the paragraph beginning `**The two game labs share one engine**` and replace it with:

```markdown
**The three game labs share one engine** (vanilla JS + Three.js): `escape-room/` (Foundations
capstone), `control-room/` (Advanced capstone), and `governance-room/` (Governance capstone).
Content lives in each app's `config/rooms.source.json`; unlock codes are **derived from
`assets/lab-data/` contents** — if the datasets change, re-derive the codes and run
`node tools/generate-hashes.mjs` in each app. Answer keys and derivation formulas live in each
app's README. The datasets are generated by the Python tool in `tools/sample-files/`;
regenerate only deliberately, updating the codes and the facilitator guide's planted-finding
notes together.
```

- [ ] **Step 6: Update the CSS Conventions module-accents line**

Find the line `- Module accents: M1 \`var(--teal)\` · M2 \`var(--violet)\` · M3 \`var(--blueD)\` · M4 \`var(--amber)\` (use \`--amber-accessible\` for amber text on white).` and replace it with:

```markdown
- Track accents: Foundations `var(--teal)` · Advanced `var(--violet)` · Governance `var(--blueD)`.
```

- [ ] **Step 7: Update the Domain Context section**

Replace the entire `## Domain Context` section with:

```markdown
## Domain Context

The audience is **general/cross-functional Bunzl team members** — every attendee holds an M365
Copilot license; sessions are **virtual and recorded**, with capacity-capped registration
handled by a separate Nimble Gravity registration platform (this site links out, never
implements registration). Sample files use **synthetic, Bunzl-shaped knowledge-worker
scenarios** (`assets/lab-data/`, see its README) — deterministic, fictional, Copilot-safe, never
real Bunzl data. Tone is practitioner-to-practitioner; use Bunzl's own preferred term for its
people (confirmed in `bunzl-context.md` §1) — never invent a term.

The 3-track program (each track is its own independent virtual, recorded session):

1. **Foundations** (2 hours, recurring cadence) — M365 Copilot essentials: what Premium adds
   over free Copilot Chat, Work IQ and grounding explained simply, everyday Chat and app basics.
   Take-home capstone: **The Loading Dock**.
2. **Advanced** (2 hours, champions/SMEs) — Agent Build (reusable tasks), delegating to Copilot
   Cowork, and Copilot Studio. Take-home capstone: **The Automation Floor**.
3. **Governance** (1 hour, IT/security/compliance leaders) — tenant controls, visibility and
   auditing, and agent governance. Take-home capstone: **The Compliance Room**.

Guidelines for content:

- **Facts come from `bunzl-context.md` only** — Bunzl company facts and Microsoft product facts
  are researched and date-stamped. Re-verify the flagged re-verify list before each delivery
  (Copilot Studio's and Cowork's consumption/pricing mechanics move weekly).
- Every lab is **hands-on and produces a deliverable** on the synthetic sample data.
- **Never commit real Bunzl specifics** (names, dollar/credit figures, internal pain points from
  any discovery call) — content generalizes them. See `bunzl-context.md` §1.
- `SCAFFOLD` / `TODO` markers flag where tenant-specific confirmation or NG IP drops in (what's
  enabled in Bunzl's tenant: which agents, which connectors, current Copilot Studio/Cowork tier).
- **Date-sensitive** — M365 Copilot, Copilot Studio, and Cowork all ship/change frequently;
  anything claiming a capability should carry its date stamp from `bunzl-context.md`.
```

- [ ] **Step 8: Verify**

```bash
grep -c "Brown & Brown\|module-N-workshop\|M1.*teal.*M2.*violet.*M3.*blueD.*M4" CLAUDE.md
```
Expected: `0` (the one legitimate exception — "then the M365 Copilot Advanced Workshop for Brown & Brown — see git history" in Step 1's history note — means this grep should actually return `1`; if so, confirm the single match is that history reference and not a leftover live-content mention before treating this as a failure).

- [ ] **Step 9: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(bunzl): update CLAUDE.md for the 3-track Bunzl program"
```

---

### Task 13: Sample-file generation tool + initial Bunzl-shaped files

**Files:**
- Create: `tools/sample-files/requirements.txt`
- Create: `tools/sample-files/generate.py`
- Create: `tools/sample-files/test_generate.py`
- Create: `tools/sample-files/README.md`
- Create: `.gitignore`
- Create (generated output, committed): `assets/lab-data/bunzl-quarterly-budget-review.xlsx`, `assets/lab-data/bunzl-business-review.pptx`, `assets/lab-data/bunzl-team-update-memo.docx`

**Interfaces:**
- Produces: three real Office files in `assets/lab-data/`, usable as generic knowledge-worker sample files across all three tracks; Phases B/C/D may extend `generate.py`'s `SOURCE_DATA` dict with track-specific lab scenarios later without changing its rendering functions.

- [ ] **Step 1: Add a `.gitignore` for the venv and Python cache**

Create `.gitignore`:
```
tools/sample-files/.venv/
__pycache__/
*.pyc
```

- [ ] **Step 2: Create the venv and install dependencies**

Create `tools/sample-files/requirements.txt`:
```
openpyxl==3.1.5
python-docx==1.1.2
python-pptx==1.0.2
```

Run:
```bash
python3 -m venv tools/sample-files/.venv
tools/sample-files/.venv/bin/pip install -r tools/sample-files/requirements.txt
```
Expected: pip reports all three packages successfully installed.

- [ ] **Step 3: Write the failing validation test**

Create `tools/sample-files/test_generate.py`:

```python
import os
import subprocess
import sys
import unittest

import openpyxl
from docx import Document
from pptx import Presentation

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, '..', '..', 'assets', 'lab-data'))

XLSX_PATH = os.path.join(OUT_DIR, 'bunzl-quarterly-budget-review.xlsx')
PPTX_PATH = os.path.join(OUT_DIR, 'bunzl-business-review.pptx')
DOCX_PATH = os.path.join(OUT_DIR, 'bunzl-team-update-memo.docx')


class TestGeneratedFiles(unittest.TestCase):
    def test_xlsx_has_expected_sheets_and_row_count(self):
        wb = openpyxl.load_workbook(XLSX_PATH)
        self.assertEqual(wb.sheetnames, ['Budget vs Actual', 'Notes'])
        sheet = wb['Budget vs Actual']
        # header row + 5 segment rows
        self.assertEqual(sheet.max_row, 6)
        self.assertEqual(sheet['A1'].value, 'Segment')

    def test_pptx_has_expected_slide_count(self):
        prs = Presentation(PPTX_PATH)
        self.assertEqual(len(prs.slides), 4)

    def test_docx_has_expected_title_paragraph(self):
        doc = Document(DOCX_PATH)
        self.assertGreater(len(doc.paragraphs), 0)
        self.assertIn('Team Update', doc.paragraphs[0].text)


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 4: Run the test to verify it fails**

Run:
```bash
tools/sample-files/.venv/bin/python tools/sample-files/test_generate.py
```
Expected: FAIL — `FileNotFoundError` (the `.xlsx`/`.pptx`/`.docx` files don't exist yet).

- [ ] **Step 5: Write `generate.py`**

Create `tools/sample-files/generate.py`:

```python
"""Generates synthetic, Bunzl-shaped knowledge-worker sample files.

Real Office-format output (.xlsx/.pptx/.docx) for Copilot lab exercises. Business-segment
NAMES are public (Bunzl's own reporting structure); every FIGURE below is invented for
training and must never be treated as real. Run: .venv/bin/python generate.py
"""
import os

import openpyxl
from openpyxl.styles import Font
from docx import Document
from docx.shared import Pt
from pptx import Presentation
from pptx.util import Inches, Pt as PptPt

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, '..', '..', 'assets', 'lab-data'))

# ── Source data (single source of truth — extend here for later phases) ─────
SEGMENTS = [
    {'name': 'Grocery & Foodservice', 'budget': 4200, 'actual': 4385},
    {'name': 'Safety',                'budget': 2100, 'actual': 1960},
    {'name': 'Cleaning & Hygiene',    'budget': 1850, 'actual': 1972},
    {'name': 'Retail',                'budget': 1500, 'actual': 1410},
    {'name': 'Healthcare',            'budget': 980,  'actual': 1055},
]


def generate_xlsx():
    wb = openpyxl.Workbook()
    sheet = wb.active
    sheet.title = 'Budget vs Actual'
    headers = ['Segment', 'Budget ($000s)', 'Actual ($000s)', 'Variance ($000s)']
    for col, header in enumerate(headers, start=1):
        cell = sheet.cell(row=1, column=col, value=header)
        cell.font = Font(bold=True)
    for row, seg in enumerate(SEGMENTS, start=2):
        sheet.cell(row=row, column=1, value=seg['name'])
        sheet.cell(row=row, column=2, value=seg['budget'])
        sheet.cell(row=row, column=3, value=seg['actual'])
        sheet.cell(row=row, column=4, value=seg['actual'] - seg['budget'])

    notes = wb.create_sheet('Notes')
    notes['A1'] = 'All figures are synthetic — generated for Copilot training, not real Bunzl financials.'

    out_path = os.path.join(OUT_DIR, 'bunzl-quarterly-budget-review.xlsx')
    wb.save(out_path)
    print(f'Wrote {out_path}')


def generate_pptx():
    prs = Presentation()

    title_slide = prs.slides.add_slide(prs.slide_layouts[0])
    title_slide.shapes.title.text = 'Quarterly Business Review'
    title_slide.placeholders[1].text = 'Synthetic sample deck — Copilot training use only'

    agenda_slide = prs.slides.add_slide(prs.slide_layouts[1])
    agenda_slide.shapes.title.text = 'Agenda'
    body = agenda_slide.placeholders[1].text_frame
    body.text = 'Segment performance'
    for line in ['Key initiatives', 'Next steps']:
        p = body.add_paragraph()
        p.text = line

    perf_slide = prs.slides.add_slide(prs.slide_layouts[1])
    perf_slide.shapes.title.text = 'Segment Performance'
    body = perf_slide.placeholders[1].text_frame
    body.text = f"{SEGMENTS[0]['name']}: actual ${SEGMENTS[0]['actual']}k vs budget ${SEGMENTS[0]['budget']}k"
    for seg in SEGMENTS[1:]:
        p = body.add_paragraph()
        p.text = f"{seg['name']}: actual ${seg['actual']}k vs budget ${seg['budget']}k"

    next_slide = prs.slides.add_slide(prs.slide_layouts[1])
    next_slide.shapes.title.text = 'Next Steps'
    body = next_slide.placeholders[1].text_frame
    body.text = 'Review variance drivers by segment'
    p = body.add_paragraph()
    p.text = 'Confirm Q3 initiative owners'

    out_path = os.path.join(OUT_DIR, 'bunzl-business-review.pptx')
    prs.save(out_path)
    print(f'Wrote {out_path}')


def generate_docx():
    doc = Document()
    title = doc.add_heading('Team Update Memo', level=1)
    doc.add_paragraph('Synthetic sample document — Copilot training use only.').italic = True
    doc.add_paragraph(
        'This quarter, our segments delivered mixed results against budget, with '
        'Grocery & Foodservice and Cleaning & Hygiene running ahead of plan while '
        'Safety and Retail came in under. Details are in the attached budget review.'
    )
    doc.add_paragraph(
        'Next steps: each segment lead reviews their variance drivers and confirms '
        'initiative owners for next quarter.'
    )

    out_path = os.path.join(OUT_DIR, 'bunzl-team-update-memo.docx')
    doc.save(out_path)
    print(f'Wrote {out_path}')


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    generate_xlsx()
    generate_pptx()
    generate_docx()
```

- [ ] **Step 6: Run the generator**

```bash
tools/sample-files/.venv/bin/python tools/sample-files/generate.py
```
Expected:
```
Wrote .../assets/lab-data/bunzl-quarterly-budget-review.xlsx
Wrote .../assets/lab-data/bunzl-business-review.pptx
Wrote .../assets/lab-data/bunzl-team-update-memo.docx
```

- [ ] **Step 7: Run the test to verify it passes**

```bash
tools/sample-files/.venv/bin/python tools/sample-files/test_generate.py
```
Expected: `OK` with `Ran 3 tests`.

- [ ] **Step 8: Write `tools/sample-files/README.md`**

```markdown
# Sample-file generator

Generates synthetic, Bunzl-shaped `.xlsx`/`.pptx`/`.docx` knowledge-worker sample files into
`assets/lab-data/`. Business-segment names are public (Bunzl's own reporting structure);
every number is invented for training — never real Bunzl financials.

## Usage

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python generate.py
.venv/bin/python test_generate.py   # validates the generated files round-trip correctly
```

Extend `SOURCE_DATA`-style dicts at the top of `generate.py` to add track-specific lab
scenarios in later phases — keep the rendering functions (`generate_xlsx`/`generate_pptx`/
`generate_docx`) generic and put new content in data, not new render functions, unless the
shape genuinely differs.
```

- [ ] **Step 9: Commit**

```bash
git add tools/sample-files/ assets/lab-data/bunzl-quarterly-budget-review.xlsx assets/lab-data/bunzl-business-review.pptx assets/lab-data/bunzl-team-update-memo.docx .gitignore
git commit -m "feat(bunzl): add sample-file generation tool and initial knowledge-worker files"
```

---

## Post-plan state

After Task 13, `main` has: a Bunzl research brief; a fully wired 3-track nav/sidebar/slide/
progress system with one placeholder lesson per track; three independent per-track
certificates backed by a tested `progress-model.js`; three escape-room capstone apps
(2 reused engines + 1 new instance, all placeholder content); and a tested Python tool that's
already produced 3 real sample Office files. The old Brown & Brown lesson files
(`01-the-copilot-landscape.html` through `16-the-close-room.html`, `module-1..4-workshop.html`,
`module-1..4-slides.html`) and the old `assets/lab-data/*.csv` files still exist on disk but are
now fully unreferenced by any manifest — cleanup (deleting them) is left to whichever of Phases
B/C/D happens to touch each one, so nothing is deleted before its replacement content exists.

Phases B, C, and D (Foundations, Advanced, Governance content, respectively) each get their own
brainstorming → spec → plan cycle, expanding their track's single placeholder lesson into a real
multi-lesson curriculum, writing that track's hub agenda/pre-work in full, retexturing that
track's escape-room capstone with real narrative content, and extending the sample-file
generator with track-specific lab scenarios.
