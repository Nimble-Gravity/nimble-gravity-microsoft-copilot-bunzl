# Bunzl Microsite — Phase B: Foundations Content Design

**Status:** Approved for implementation planning
**Scope:** The second of four planned phases (Phase A: infrastructure, complete). Phase B writes
the real Foundations track curriculum, replacing the single placeholder lesson Phase A left in
place, and retextures the Foundations capstone. It does **not** touch the Advanced or Governance
tracks (Phases C/D, each getting their own spec) or the shared infrastructure Phase A built
(nav/sidebar/slide-engine/certificate system are reused as-is, not modified).

## 1. Content scope

Per `bunzl-context.md` §1/§2 and the discovery-call-derived framing already baked into that
document: Foundations is a 2-hour, virtual/recorded session for general/cross-functional Bunzl
team members holding an M365 Copilot license, repeated on a recurring cadence. Content is
**level-setting, not advanced** — many attendees don't yet know what their license includes.

Confirmed in this design pass:

- **4 lessons**, replacing the single `foundations-01-overview.html` placeholder:
  1. `foundations-01-the-copilot-landscape.html` — what the paid Copilot add-on adds over free
     Copilot Chat; Work IQ/grounding explained simply (not a Work/Web toggle — signals: Work IQ,
     the prompt, files attached/referenced, sources cited).
  2. `foundations-02-prompting-everyday-chat.html` — Microsoft's four-element prompt framework
     (Goal, Context, Expectations, Source) taught at a beginner level; everyday Chat use cases
     (drafting, summarizing, finding information).
  3. `foundations-03-copilot-in-the-apps.html` — quick hits across Outlook, Word, PowerPoint,
     Excel, and Teams. Must explicitly cover **finding a file** and **PowerPoint tips** — both
     named directly in the discovery call as gaps real attendees have ("did they know what are
     some tips on creating a PowerPoint presentation").
  4. `foundations-04-practice-and-check.html` — a short follow-along exercise using the 3
     generic sample files already built in Phase A (`bunzl-quarterly-budget-review.xlsx`,
     `bunzl-business-review.pptx`, `bunzl-team-update-memo.docx`), then the knowledge-check quiz.
- **Quiz**: expands from the Phase A placeholder's 1 question to **4 questions, pass 3** —
  matching the pattern B&B's Module 1 used. Topics: the Premium/free distinction, Work
  IQ/grounding, the four-element framework, one app-basics fact. Mounted on lesson 4
  (`data-ix-quiz="foundations" data-ix-pass="3"`, `exercise: true`), same mechanism Phase A
  already wired (`progress-model.js`/`interactive.js` need no changes — they're already generic
  over quiz content).
- **Hub page** (`pages/workshops/foundations-workshop.html`): replace the Phase A placeholder
  pre-work/content copy with a real pre-work checklist (confirm Copilot access; the 3 sample
  files are already public, no OneDrive copy-step needed since there's no login-gated lab
  data — a difference from B&B's model) and a real 2-hour agenda. The agenda should reflect the
  discovery call's actual shape — mostly live teaching in shorter segments, Q&A-heavy in the
  final block — **not** a rigid B&B-style minute-by-minute breakdown; approximate blocks are
  fine (e.g. "0:00–0:25 · The Copilot landscape").

## 2. The Loading Dock (take-home capstone)

Retextures `escape-room/` (currently still "The Variance Vault," a B&B-era finance-variance
scenario) into a Bunzl-appropriate warehouse/distribution-center narrative, matching Bunzl's
actual business. Per this design's decision:

- **4 stations**, matching the existing engine's proven station count and B&B's precedent.
- Each station teaches **one Foundations-level skill** (not analyst-level data-hunting like
  B&B's Variance Vault): e.g. asking Copilot to find a specific fact in an attached file,
  summarizing a document, drafting from a prompt using the four-element framework, distinguishing
  what Work IQ can and can't see. Puzzles should read as genuinely basic — appropriate for an
  audience that may not yet know what their Copilot license includes.
- **Derives its unlock codes from the 3 existing generic sample files** (the budget workbook,
  business-review deck, team-update memo) — no new dataset needed. These files are intentionally
  small (a handful of rows/slides/paragraphs each); Foundations-level puzzles (simple lookups —
  "what is the Safety segment's budget figure," "what does slide 3's title say") fit that scale
  naturally and don't require B&B's richer, many-row CSVs. This keeps the puzzle design honest to
  the audience's actual skill level rather than manufacturing artificial data-hunting complexity.
- Mechanically: update `escape-room/config/rooms.source.json` with the 4 real stations, retitle
  `index.html`/`admin.html`/`README.md`/`lab-files/*.md` from "Variance Vault" to "The Loading
  Dock" (the `<h1>`/`.hud-title` span rename, not just `<title>` — Phase A's Task 9 review flagged
  this exact gap on `governance-room/`, so this phase must not repeat it), and regenerate
  `rooms.json` via `node tools/generate-hashes.mjs`. No engine code changes — `escape-room/`'s
  JS/Three.js scene is reused as-is (already confirmed reasonably generic/warehouse-appropriate
  per Phase A's spec).

## 3. Manifest updates (the Phase A-documented "keep in sync" surface)

Per `CLAUDE.md`'s "track manifest is duplicated in several places" callout, expanding from 1
lesson to 4 touches:

1. `nav.js` → `CRAFTS[0]` (foundations entry): `filePrefix[]`/`pages[]`/`labels[]` grow from
   1-element to 4-element arrays.
2. `training-sidebar.js` → `MODULES[0].lessons[]`: same expansion; `exercise: true` moves from
   lesson 1 to lesson 4.
3. `foundations-slides.html` → `SLIDES_CFG.lessons[]`: same 4-lesson expansion (the slide engine
   itself needs no changes — confirmed fully generic per Phase A's spec).
4. `my-progress.html` → the Foundations quiz link (`pages/workshops/my-progress.html`, currently
   pointing at `foundations-01-overview.html`) updates to point at
   `foundations-04-practice-and-check.html`.
5. `module-strip` block: added to all 4 new lesson files (the existing placeholder had one;
   the pattern is unchanged, just now needs authoring across 4 files instead of 1).
6. The old `foundations-01-overview.html` is superseded by `foundations-01-the-copilot-landscape.html`
   and deleted (its content was an explicit "this is a placeholder" stub with no real content to
   preserve).

## 4. Explicitly out of scope for Phase B

- Advanced and Governance track content (Phases C/D).
- Any change to `progress-model.js`, `interactive.js`'s quiz-rendering mechanism, `nav.js`'s
  rendering logic, or `training-sidebar.js`'s rendering logic — all confirmed generic over lesson
  count/content already; Phase B only adds data, not logic.
- The old, severed B&B portal pages (`pre-work.html`, `syllabus.html`, `resources.html`,
  `faq.html`, `facilitator-guide.html`, etc.) — still not part of the live site per Phase A's
  final fix; rebuilding them for Bunzl (if ever needed) is separate, undecided scope.
- `control-room/` and `governance-room/` retexturing (Phases C/D respectively).
