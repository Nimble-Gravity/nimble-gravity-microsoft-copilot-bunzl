# Design System Notes

This file captures layout and spacing rules that should be reused when adding new pages or expanding existing sections.

## Card Grids

- Shared card grids should use CSS Grid and explicitly stretch cards to the tallest item in the row.
- Use `gap: 24px` by default for editorial card grids. Denser utility grids can tighten to `16px` or `20px`, but the spacing should be deliberate and consistent within the pattern.
- Card grids must set `align-items: stretch`.
- Cards inside shared grids should fill the row height of the largest card in that grid.
- In shared grid patterns, apply `height: 100%` to the direct grid children so equal-height behavior is explicit rather than accidental.
- If a card appears in a grid, equal-height presentation is the default. Opt out only when the layout is intentionally masonry-like or list-like.

## Card Internals

- Shared editorial cards should use a vertical stack pattern: `display: flex`, `flex-direction: column`, `gap: 12px`.
- Do not build card rhythm with one-off `margin-bottom` and `margin-top` rules on headings, labels, quotes, and metadata if the card can use a shared stack.
- Keep card padding consistent unless a card type is structurally different:
  `padding: 22px 24px`
- Section-level spacing should live on the grid or the section wrapper, not on the first or last child inside the card.
- If a card uses nested body wrappers, the wrapper should usually take `flex: 1` so the card content fills the available height cleanly.
- If a stretched card has a footer, CTA row, or step list, use `flex: 1` on the body wrapper or `margin-top: auto` on the lower content block so empty height stays intentional instead of appearing as stray whitespace under the card content.

## Tips & Tricks

- Reusable editorial tips should use the shared `tip-trick` pattern from `shared.css` instead of ad hoc highlighted paragraphs.
- Keep them short, practical, and action-oriented: one move the reader can apply immediately on that page.
- Use the dark variant in dark sections: `tip-trick tip-trick--dark`.

## Development Page Pattern

For development-page cards in `shared.css`, the reference pattern is:

- Grid gap: `24px`
- Card internal gap: `12px`
- Card padding: `22px 24px`
- Grid items: stretched to equal height within the row

If a new development section introduces a new card type, match this pattern first and only diverge when the content structure actually requires it.

## Page Openings

- Do not place a standalone utility header bar directly under the global nav if the page already opens with a hero or page-header block.
- Each page should have one top-level introduction pattern only:
  a hero section, or a page-header block, but not both plus an extra header bar.
- Use the hero eyebrow, title, subtitle, chips, or metadata rows to carry orientation details instead of adding a redundant second header.
- Do not add top-of-page reading progress strips as a default pattern. If progress matters, solve it in-page with section navigation or other content-specific UI rather than a persistent strip under the nav.

## Badges And Pills

- Labels that serve the same job across pages should share one base shape, type scale, and spacing system.
- Reuse the shared badge language in `shared.css` for chips, tags, phase badges, comparison badges, prompt badges, and craft labels instead of inventing page-specific badge styling.
- Badge variants should usually change color only. Avoid introducing new font sizes, padding, corner radii, or casing rules for a one-off page treatment.
- If a new badge needs a different meaning, add a modifier class to the shared badge pattern instead of styling it inline in the HTML.

## How Slides Are Generated

Slide decks are **not authored separately** — `pages/training/slides-engine.js` builds a Reveal.js
deck by fetching each lesson listed in a deck's `window.SLIDES_CFG` and scraping its HTML. Write a
lesson with the right structure and its slides appear automatically. To add a deck, copy an existing
`<track>-slides.html` (e.g. `foundations-slides.html`) and edit its `SLIDES_CFG` (`label`, `subLabel`, `color`, `lessons[]`).

What the engine extracts from each lesson:

- **Lesson-title slide** — from `.page-header`: its `.eyebrow`, `h1.title`, and `.subtitle`.
- **One content slide per `.section`** — needs an `h2.sec-title`. The section's *direct-child*
  `.sec-eyebrow` becomes the slide eyebrow and its *direct-child* `p.sec-sub` (or first `<p>`) the
  subtitle. (Direct-child only — eyebrows inside cards are ignored.)
- **One bullet per card**, pulled from these card classes inside the section (all cards are kept —
  a slide whose content overflows the 1280×720 box auto-shrinks via CSS zoom to fit):

  | Card class | Bullet heading ← | Bullet body ← |
  |---|---|---|
  | `.insight-card` | `.sec-eyebrow` or `h3` | first `<p>` |
  | `.dev-card` | `.dev-kicker` + `h3` | first `<p>` |
  | `.bp-item` | `.bp-title` | `.bp-body` / `<p>` |
  | `.tip-trick` / `.tip-box` / `.callout` | `.tip-trick-label` / `strong` | `<p>` (styled amber on the slide) |
  | `.comp-card` | `.comp-label` + `.comp-name` | `.comp-body` / `<p>` |
  | `.hy-card` | `.hy-label` + `.hy-title` | `.hy-body` / `<p>` |
  | `.sg-card` | `.sg-header` / `.sg-title` | `.sg-title` + `<p>` |
  | `.reflect-card` | `.reflect-q` | `.reflect-hint` |
  | `.qa-card` / `.step-card` / `.pro-con-card` / `.comparison-card` | `h3` / `.card-label` / `strong` | `<p>` |

Notes for authors:

- The four classes that are **styled in `shared.css`** are `.insight-card`, `.dev-card`, `.bp-item`,
  and `.tip-trick` — prefer these so the lesson page and the slide both look right. The others
  (`.comp-card`, `.hy-card`, `.sg-card`, `.comparison-card`, …) extract to slides but were page-scoped
  in the originals; add page CSS if you use them.
- `<em>` inside titles is preserved on slides; bullet bodies keep their full text (no truncation).
- Add `class="section-dark"` to render a slide on the dark background.

## Authoring Rule

- Before adding a new shared layout pattern, check whether it belongs in `shared.css` and should be documented here.
- If a spacing fix is needed in more than one place, fix the component pattern and update this file instead of patching a single page.
- When reviewing a grid of cards, check two things every time:
  equal-height rows across each grid
  consistent vertical spacing inside each card and between the grid and adjacent elements
- When reviewing a new page, check that the top of the page contains a single introduction pattern and no redundant header bar beneath the global nav.

## Workshop agenda timeline (`.agenda`)

The per-track hubs (`pages/workshops/<track>-workshop.html`) use a small timeline pattern: a vertical list of `.agenda-row`s, each with a `.agenda-time` (left column, with a `<small>` duration), a coloured `.agenda-tag` chip, and an `.agenda-body`. Tag modifiers: `--teach`, `--demo`, `--lab`, `--discuss`, `--break` (no modifier = neutral, for Open / Debrief / Close). Defined in `styles/shared.css`; the tag reuses the badge/chip language. Each hub's rows cover that track's own session (Foundations and Advanced are each 2 hours; Governance is 1 hour — times are relative to that track's own session start, not a shared clock across tracks). Pages under `pages/workshops/` are not listed in any `SLIDES_CFG`, so they do not generate slides.

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
