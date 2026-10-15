# AGENTS.md

Elbow Coach: a mobile-first web app for daily tennis elbow rehab. Static files, no build, no dependencies.

## Files

- `logic.js`: phases, exercises, and the rules (`trafficLight`, `todaysPlan`, `finishSession`, `steps`, `dose`). No DOM. Loaded as a classic `<script>` in the browser and via `require` in Node.
- `index.html`: all UI, CSS and app code. Screens are `<section>`s toggled with `hidden` (`show(id)`), and `render()` redraws from `state`.
- `test.js`: assert-based checks for `logic.js`.

## Commands

- Test: `node test.js` (prints `ok`).
- Run: `python3 -m http.server`, then open `http://localhost:8000`.

## Rules of the app

- Morning stiffness 0–2 = green (full dose), 3–5 = amber (one set less), 6+ = red (stretch only). A "much worse" result yesterday caps today at amber.
- A green session with every result "same or better" wins a game. Any "much worse" loses one. 6 games (`GAMES_TO_WIN_SET`) win a set, which moves you to the next phase.
- `/#stretch` opens the current phase's stretch as a break outside the session. It doesn't count towards games. `reminder.ics` schedules it at 13:00 and 18:00, plus the session at 8:00.
- When you change a rule, update `test.js` and this section.

## Conventions

- Keep it dependency-free. Don't add a framework, bundler or service worker without asking.
- State lives in `localStorage` under `elbow-coach-v1`. If you change its shape, migrate old data or bump the key, because users have real progress saved.
- Colors and fonts come from the CSS tokens on `:root`. Every token needs both light and dark values.
- Exercise content (cues, doses) is health guidance. Keep it conservative and evidence-based, and don't remove the "not medical advice" note.
- Demos are a YouTube search link per exercise. Don't embed third-party clips without confirming they play on elbow-coach.armonge.info (the CSP/Physiotec SproutVideo clips are domain-locked).
