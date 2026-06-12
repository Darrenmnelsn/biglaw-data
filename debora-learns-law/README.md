# Debora Learns Law — BigLaw Inbox

A fast, juicy rebuild of the law-firm survival game. Partners email you cases;
answer the legal question before the deadline, keep your streak alive, bank
billable hours, upgrade the firm, and come back tomorrow for the Daily Case.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Content

All ~360 questions are loaded from the JSON banks at the repo root —
`questions.json` (partner emails), `exam_questions.json` and
`civexam_questions.json` (issue-spotter facts with rule explanations), and
`caselib.json` (case/doctrine matching). Edit those files to change the game's
content; no code changes needed.

## Game systems

- **Core loop** — cases arrive in your inbox with individual deadlines (capacity
  5; overflow costs a heart). Correct answers stamp **CASE WON**; mistakes stamp
  **MALPRACTICE**, show the governing rule, and cost a heart. Three hearts and
  the firm closes. Keys `1–4` answer, `R` researches, `Esc` closes a case.
- **Streaks** — multipliers at 3 (×1.5), 6 (×2), and 10 (×3) consecutive wins,
  with confetti at milestones. Answer within 8 s for a ⚡ rush bonus.
- **Spaced repetition** — questions you miss re-enter the queue later in the
  run and are weighted ×3 in future runs until you answer them correctly
  (persisted in `localStorage`).
- **Meta-progression** — billable hours bank between runs. Firm Shop upgrades:
  Paralegal (absorbs one mistake/day), Espresso Machine (+15 s/day per level),
  Westlaw (2 research uses/day), Senior Associate (auto-wins one overflow case),
  Corner Office (+1 heart).
- **Dynamic difficulty** — spawn rate adapts to your rolling accuracy (over 85 %
  speeds up, under 60 % eases off) and each new day escalates: faster spawns,
  tighter deadlines.
- **Daily Case** — 10 date-seeded questions, the same for every player, once
  per day, with a shareable 🟩🟥 emoji grid.
- **Weekly theme** — one subject pays ×1.25 each week and appears twice as
  often, rotating through Torts, Contracts, Criminal Law, and Civil Procedure.
- **Social** — local top-10 leaderboard with your best pinned, and one-tap
  copy-to-clipboard share cards for runs and dailies.

The day clock pauses automatically when the tab is hidden, sounds are
synthesized with WebAudio (mutable, persisted), and all animation respects
`prefers-reduced-motion`.
