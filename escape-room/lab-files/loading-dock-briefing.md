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
