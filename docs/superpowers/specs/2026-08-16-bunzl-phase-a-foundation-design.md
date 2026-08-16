# Bunzl Microsite — Phase A: Foundation Design

**Status:** Approved for implementation planning
**Scope:** The first of four planned phases rebuilding this repo's microsite for a new client
engagement (Bunzl, replacing the current Brown & Brown content). This spec covers the
*infrastructure* every subsequent phase depends on: researched facts, site information
architecture, the certificate/progress model, escape-room capstone instantiation, and
sample-file generation tooling. It does **not** cover lesson content, slide decks, or
escape-room narratives for any specific track — those are Phases B (Foundations), C
(Advanced), and D (Governance), each getting its own spec.

## 1. Engagement context

Nimble Gravity is delivering an M365 Copilot enablement program for Bunzl (global
distribution/outsourcing group — packaging, safety, cleaning & hygiene, grocery, healthcare,
foodservice; decentralized operating companies; heavy bolt-on-acquisition growth strategy).
This mirrors the prior Brown & Brown engagement's format (a tailored, sustainable microsite —
"train the trainer," not a one-off deck) but differs in real ways:

- **Audience is general/cross-functional**, not one department. A large population of team
  members hold M365 Copilot Premium licenses; content and sample files use generic knowledge-worker scenarios
  (memos, budgets, decks, reports) grounded in Bunzl's business rather than one function's
  workflows.
- **Copilot Cowork is genuinely in scope** (unlike the B&B build, where it was named only to
  situate it). It's currently restricted to a small consumption-priced allowance group, and
  Copilot Studio recently moved to a new consumption-based tier — both are fast-moving facts
  that need explicit re-verify flags before each delivery.
- **Delivery is virtual/remote and recorded**, with capacity-capped registration handled by a
  separate Nimble Gravity registration platform — not in-person/laptop-in-room like B&B.
- A discovery call (2026-08-13) with Bunzl stakeholders grounds this scope. Per an explicit
  decision in this design process: **that call's real specifics (names, dollar/credit figures,
  internal pain points) inform tone and scope only — never committed to this public repo
  verbatim.** The `bunzl-context.md` brief and all content must generalize them (e.g. "a
  consumption-based credit model," not a specific number).

## 2. The 3-track curriculum

| Track | Audience | Duration | Runs | Content anchor |
|---|---|---|---|---|
| **Foundations** | General/cross-functional Copilot Premium license holders (a large population) | 2 hours | Repeated on a recurring cadence, capacity-capped registration cohorts — **not** a fixed "twice"; scheduling is data, not structure (see §3.1) | M365 Copilot fundamentals: what Premium adds over free Copilot Chat, Work IQ/grounding explained simply, everyday Chat + app basics |
| **Advanced** | Champions/SMEs with (or eligible for) Cowork allowance-group access | 2 hours | Smaller, less frequent cohorts | Agent Build (reusable tasks), Cowork overview and delegation, Copilot Studio |
| **Governance** | IT/security/compliance leaders (the small admin-access group + AI-strategy stakeholders) | 1 hour | Infrequent, small group | Tenant controls, visibility/auditing, agent governance, data protection, EU data boundary caveat |

All three: **virtual/remote, recorded**, capacity-capped registration via an external NG
platform (the microsite links out to it, doesn't implement registration itself). Structure per
track: pre-work → live virtual session (recorded) → take-home depth, including that track's
escape-room capstone. This is the same three-beat shape B&B used (pre-work / in-room / take-home
extension), with "in-room" replaced by "live virtual" — copy throughout the site should say
"join the session" / "session recording" rather than "in the room" / "bring your laptop."

## 3. Site information architecture

An exploration of the current codebase (nav.js, training-sidebar.js, footer.js, index.html,
interactive.js, the module hub pages, and the escape-room/control-room apps) found the core
manifests (`CRAFTS` in nav.js, `MODULES` in training-sidebar.js) are already plain,
count-agnostic array iteration — no hard-coded "4 modules" assumption. The real restructuring
surface is the hand-authored HTML and the progress/certificate aggregation logic.

### 3.1 Track manifest — 3 entries, not 4, not Foundations×2

`CRAFTS` (nav.js) and `MODULES` (training-sidebar.js) become 3 entries: Foundations, Advanced,
Governance. Foundations is **one** entry, not two — duplicating it as two nav entries would
double-count lessons in the flattened prev/next "up next" sequence nav.js builds across all
craft entries. "Runs repeatedly" is a scheduling fact, conveyed via the existing
`data-client-slot="schedule-dates"` pattern (already used in `syllabus.html`) generalized to
hold "next session" info plus a link to the external registration platform — not a second
structural entry.

`MODULE_STAGES` (the shared `#prework`/`#content` 2-stage hub spine) stays as-is for all three
tracks — it's duration-agnostic and works fine for a 1-hour Governance hub as much as a 2-hour
Foundations hub.

### 3.2 Files requiring hand-editing (the duplicated-manifest surface)

Per the existing self-documented convention (`CLAUDE.md`'s "keep them in sync" callout,
`CLIENT-CUSTOMIZATION.md`'s manifest checklist), restructuring touches:

1. `nav.js` → `CRAFTS[]` (3 entries)
2. `training-sidebar.js` → `MODULES[]` (3 entries)
3. `pages/training/*-slides.html` → one `SLIDES_CFG` per track (3 decks; the engine is fully
   independent per deck, confirmed no numeric coupling)
4. `footer.js` → module chips (currently a static template string, not looped from any
   manifest — rewrite to reflect 3 tracks; also drop the "four-module, one session" prose)
5. `index.html` → `.module-grid` cards (3 cards) **and** the grid CSS (currently a fixed
   2-column grid that lays 4 cards as 2×2; 3 cards need a proper 3-up layout, not an orphaned
   2×2 gap — collapsing to 1 column at the existing 768px breakpoint)
6. The `.module-strip` block at the top of each lesson file (currently hand-copied per lesson;
   CSS is count-agnostic, content is not)
7. `pages/workshops/*-workshop.html` hub pages — one per track, hand-authored (pre-work cards,
   agenda timeline, materials grid, capstone link)
8. `my-progress.html` — quiz links + certificate section, restructured per §3.3
9. `DESIGN-SYSTEM.md` — the "module hub spine" and "How slides are generated" sections
   currently describe a 4-module/1-certificate model as canonical; needs a rewrite pass so it
   stays the accurate source of truth
10. `CLAUDE.md` — update the project description, architecture summary, and domain context for
    Bunzl once Phase A content lands

### 3.3 Certificate/progress model — independent per-track certificates

Today's `interactive.js` gates a single certificate on passing all 4 module quizzes (`4` is a
literal in 4 places; `['m1','m2','m3','m4']` is a literal in 3 places — confirmed via full file
read, not derived from any manifest). This doesn't fit Bunzl: most attendees take only
Foundations; a smaller group also takes Advanced; a handful take Governance. Requiring "all
tracks" for any certificate would leave nearly everyone without one.

**Decision: each track gets its own independent certificate**, gated on that track's own
quiz(zes) passing — no combined all-or-nothing gate. `my-progress.html` shows three independent
progress rows/certificates instead of one combined bar. This requires restructuring
`passedCount`/`renderReadout`/`renderProgress`/`renderCertificate` in `interactive.js` from
hard-coded `['m1'..'m4']`/literal-`4` logic to per-track logic (implementation detail for the
plan, not this spec).

## 4. Escape-room capstones (one per track)

Each track ends in a take-home/async escape-room capstone (consistent with how B&B's two
existing apps already work — they were take-home extensions, not live in-session labs, which
fits Bunzl's virtual/recorded format even better than it fit B&B's in-person one).

Confirmed via full diff of `escape-room/` vs `control-room/`: `js/crypto.js`, `js/rooms.js`,
and `tools/generate-hashes.mjs` are byte-identical (pure engine). `state.js`/`timer.js`/
`leaderboard.js`/`main.js`/`admin.js`/`ui.js` differ only in mechanical renames (localStorage
keys, a `room`/`station` terminology swap). The real per-deployment cost is each app's
from-scratch Three.js `scene.js`/`textures.js` (695-line diff between the two) plus
`config/rooms.source.json` content.

- **Foundations capstone** → reuse the `escape-room` folder/engine (its simpler ~481-line
  scene), retextured as a **warehouse/loading-dock** set — fits Bunzl's distribution business,
  approachable for a first-workshop audience.
- **Advanced capstone** → reuse `control-room`'s operations-floor engine, retooled around an
  **automation/agent-build incident** scenario.
- **Governance capstone** → a **third instance**, copied from `escape-room`'s simpler scene
  (cheaper than a from-scratch build) rather than control-room's, with only 2–3 stations
  (`rooms.source.json` supports 3–6 per the existing README) to fit the 1-hour format, themed
  around a **compliance/audit** scenario.
- Each new/retooled instance needs its own renamed localStorage keys and a regenerated
  `config/rooms.json` via `node tools/generate-hashes.mjs` — reusing keys across instances was
  explicitly flagged as a cross-contamination bug in the existing control-room README.
- Exact theme names/narrative copy are Phase B/C/D content decisions, not Phase A.

## 5. Sample knowledge-worker files

New synthetic, Bunzl-shaped (never real) data replaces `assets/lab-data/`'s B&B-specific CSVs.
Per an explicit decision in this design process, the deliverable is **real `.xlsx`/`.pptx`/
`.docx` files** (not CSV/Markdown as B&B used) — general knowledge-worker scenarios (a budget
workbook, a business-review deck, a memo/report doc) grounded in Bunzl's business.

**Tooling: Python** (`openpyxl`, `python-docx`, `python-pptx`) in a local, throwaway venv — not
a site dependency (nothing ships to the browser), same category of one-off tool as the existing
`tools/generate-hashes.mjs`. The generation script's internal data model (not a committed CSV)
is the single source of truth for both the rendered Office files and the escape-room unlock
codes derived from them — mirroring the role `assets/lab-data/` CSVs played for B&B, just
rendered to real Office formats instead of shipping the raw data files.

## 6. Research deliverable

A new `bunzl-context.md` replaces `copilot-context.md` as the grounding brief for all content,
same structure (engagement/positioning, curriculum design, researched facts with date stamps, a
re-verify list). Preliminary research already done in this design pass (to be formally verified
against primary sources during Phase A implementation):

- Company: Bunzl plc, London-HQ global distribution/outsourcing group, ~27,000 team members,
  decentralized operating companies, sectors = grocery, foodservice, safety, cleaning &
  hygiene, retail, healthcare; heavy bolt-on M&A ("buy and build") strategy — a workable
  parallel to B&B's Accession-integration framing.
- Language: Bunzl uses "team members," not "teammates" or "employees" — confirm exact preferred
  term before Phase B content lands.
- Most of the already-verified M365 Copilot platform facts from `copilot-context.md` carry over
  and just need re-date-stamping; net-new research is needed for Copilot Studio's current
  consumption-tier mechanics, Cowork's current credit-allowance model (generalized, no real
  figures), and tenant governance/DLP specifics for the Governance track.
- `SCAFFOLD`/`TODO` markers flag Bunzl-tenant-specific facts (what's actually enabled, current
  Copilot Studio state, EU data boundary applicability) for confirmation before delivery — same
  convention as B&B.

## 7. Repo strategy

Per the established precedent (Axos → Brown & Brown happened the same way): **replace the
current Brown & Brown content in place on `main`**, which is what the GitHub Pages deploy
workflow targets. Old content remains fully recoverable via git history.

## 8. Explicitly out of scope for Phase A

- Any lesson content, slide deck content, or escape-room narrative copy for any of the 3 tracks
  (Phases B/C/D).
- Building registration/scheduling functionality into the microsite — it links out to Nimble
  Gravity's separate registration platform via a slot, consistent with the existing
  `feedback-form-*` external-link slot pattern.
- Committing the discovery-call transcript, or any real Bunzl figures/names from it, to the
  repo.
