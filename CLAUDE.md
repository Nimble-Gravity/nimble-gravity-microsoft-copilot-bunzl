# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

```
index.html              — Homepage (hero + module cards + how-it-runs)
nav.js                  — Self-contained top-nav component (IIFE; injects its own CSS; CRAFTS manifest)
footer.js               — Self-contained footer (NG wordmark + program blurb + track chips)
training-sidebar.js     — Left module/lesson sidebar for training pages (MODULES manifest)
interactive.js          — Quizzes (QUIZZES foundations/advanced/governance), maturity poll, per-track progress/certificate, ack gate
styles/shared.css       — Shared design system: tokens plus cross-page layout/components
DESIGN-SYSTEM.md        — Layout/spacing rules + "How slides are generated" (card classes)
bunzl-context.md        — Subject brief: Bunzl and M365 Copilot facts, program design
session-script.md       — Facilitator session script ([SAY]/[DO] spine)
pages/training/*.html   — Per-track lessons + slide decks + slide engine + theme
escape-room/            — Foundations capstone (own README); still titled "The Variance Vault" from
                          the prior engagement — rename to "The Loading Dock" is Phase B content work
control-room/           — Advanced capstone (same engine, own README); still titled "The Close Room"
                          from the prior engagement — rename to "The Automation Floor" is Phase C content work
governance-room/        — "The Compliance Room" — Governance capstone (same engine, own README)
pages/workshops/*.html  — Track hubs, my-progress.html, and coming-soon.html (a placeholder that
                          Resources/FAQ/Syllabus and the old B&B portal pages route to until
                          Phase B/C/D writes real Bunzl portal content); the pre-Bunzl portal
                          pages (pre-work, syllabus, resources, faq, facilitator-guide, etc.)
                          still exist on disk but are no longer linked from anywhere live
assets/lab-data/        — Mixed as of Phase A: 3 new Bunzl sample files (.xlsx/.pptx/.docx,
                          generic, not yet used by any lab) alongside the legacy B&B CSVs/
                          data-room still read by escape-room/control-room's current puzzles;
                          see its README (still B&B-focused — needs a Phase B/C update)
```

**Every page** follows this structure: `<link>` to shared.css → `<style>` block for page-specific CSS →
`<script src="footer.js">` then `<script src="nav.js">` (and `training-sidebar.js` on training pages;
`interactive.js` only on pages with quiz/poll/progress/ack mounts) at the start of `<body>` → one
primary intro pattern (`hero` or `page-header`) → section divs → page-footer div → optional inline script.

**The track manifest is duplicated in several places — keep them in sync** when adding/renaming/
reordering tracks or lessons: the `CRAFTS` array in `nav.js` (the `filePrefix[]` plus the
positionally-zipped `pages[]`/`labels[]`; each craft also carries a `hub`), the `MODULES` array in
`training-sidebar.js`, the `window.SLIDES_CFG` in each `pages/training/<track>-slides.html`, the
footer track chips in `footer.js`, the `module-strip` block duplicated at the top of every lesson,
the `.module-grid` cards inside each hub's `#content` stage and on `index.html`, and the three
track certificate mounts on `my-progress.html`. Display order = array order, not filename order;
always add a new lesson's numeric prefix to the owning track's `filePrefix[]` in `nav.js` or the
page renders with an empty sub-nav. See `CLIENT-CUSTOMIZATION.md`.

**Navigation model:** the top nav's track labels (Foundations/Advanced/Governance) link to each
track's **hub** (`CRAFTS[n].hub`); the nav sub-row shows each hub's two stages (`MODULE_STAGES` →
`#prework`/`#content` anchors). Each track's knowledge check is the animated `data-ix-quiz`
component (keys `foundations`/`advanced`/`governance`) at the end of that track's lab/capstone
lesson, feeding an **independent** certificate on `my-progress.html` (`data-ix-certificate`,
gated by `progress-model.js`; localStorage key `ng-copilot:v1`) — passing one track never gates
another's certificate. See DESIGN-SYSTEM.md "The track hub spine".

**Slides build themselves from lesson HTML.** A deck file (`<track>-slides.html`) is just a
`window.SLIDES_CFG`; `slides-engine.js` fetches each listed lesson and extracts slides from known card
classes (all cards, full text — overflowing slides auto-shrink to fit; a section without
`h2.sec-title` generates no slide — that's how quiz sections stay off decks). See DESIGN-SYSTEM.md "How slides are generated".

**The three game labs share one engine** (vanilla JS + Three.js): `escape-room/` (Foundations
capstone), `control-room/` (Advanced capstone), and `governance-room/` (Governance capstone).
Content lives in each app's `config/rooms.source.json`; unlock codes are hashed via
`node tools/generate-hashes.mjs` in each app, and answer keys/derivation formulas live in each
app's README. As of Phase A: `escape-room/`'s and `control-room/`'s puzzles are still the prior
engagement's, with codes derived from the legacy B&B CSVs in `assets/lab-data/` (retitling and
rewriting them for Bunzl is Phase B/C content work); `governance-room/`'s two stations are
placeholder codes (`PLACEHOLDER1`/`PLACEHOLDER2`), not yet derived from anything. The 3 real
Bunzl sample files (`.xlsx`/`.pptx`/`.docx` in `assets/lab-data/`, generated by the Python tool
in `tools/sample-files/`) are generic knowledge-worker files, not yet wired into any capstone's
lab steps or codes — that wiring happens when each track's real capstone content is written.

## CSS Conventions

- All colors reference CSS variables from shared.css — never hardcode hex values that duplicate an existing variable.
- Responsive breakpoints: `900px` (two-column collapse) and `768px` (single-column / mobile padding).
- Reusable layout or card patterns that appear across pages should be implemented in `shared.css` and documented in `DESIGN-SYSTEM.md`.
- Shared editorial card grids stretch cards to the tallest sibling (grid `align-items: stretch`, `height: 100%` children, internal stack pattern).
- Page-specific class names are scoped by page unless the pattern is intentionally shared.
- Dark sections use `var(--navy)` background; text flips to `var(--white)` / `var(--slatel)` / `var(--mint-on-dark)`.
- Track accents: Foundations `var(--teal)` · Advanced `var(--violet)` · Governance `var(--blueD)`.
- Do not add a second standalone header bar beneath the global nav when a page already has a hero or page-header. No top-of-page reading-progress strips. Reuse the shared badge language for chips/tags.

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
