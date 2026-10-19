# AGENTS.md

Elbow Coach: a mobile-first web app for daily elbow pain (lateral epicondylitis) rehab, for any cause, not just tennis. Static files, no build, no dependencies.

## Files

- `logic.js`: phases, exercises, and the rules (`trafficLight`, `exercises`, `todaysPlan`, `finishSession`, `steps`, `dose`). No DOM. Loaded as a classic `<script>` in the browser and via `require` in Node.
- `index.html`: all UI, CSS and app code. Screens are `<section>`s toggled with `hidden` (`show(id)`), and `render()` redraws from `state`.
- `test.js`: assert-based checks for `logic.js`.

## Commands

- Test: `node test.js` (prints `ok`) Also checks that the inline script in `index.html` parses.
- Hooks: `prek install` once per clone; `.pre-commit-config.yaml` runs hygiene checks, Biome (`biome.json`: lint, plus formatting for `.js` only) and `node test.js` on commit.
- Run: `python3 -m http.server`, then open `http://localhost:8000`.

## Rules of the app

- Morning stiffness 0–2 = green (full dose), 3–5 = amber (one set less), 6+ = red (stretch only). A "much worse" result yesterday caps today at amber.
- A green session with every result "same or better" is a good day. Any "much worse" is a flare-up and takes one away. 6 good days (`GAMES_TO_WIN_SET`) move you to the next phase. The UI says "good days" and "stages"; the code still calls them `games` and `setWon`.
- The morning check asks which side hurts (`state.side`: `lateral` default, or `medial`). Medial swaps in each exercise's `medial` name and cues (wrist flexors instead of extensors); doses stay the same.
- `/#stretch` opens the current phase's stretch as a break outside the session. It doesn't count towards good days. `reminder.ics` schedules it at 13:00 and 18:00, plus the session at 8:00.
- When you change a rule, update `test.js` and this section.

## Conventions

- Keep it dependency-free. Don't add a framework, bundler or service worker without asking.
- State lives in `localStorage` under `elbow-coach-v1`. If you change its shape, migrate old data or bump the key, because users have real progress saved.
- Colors and fonts come from the CSS tokens on `:root`. Every token needs both light and dark values.
- Exercise content (cues, doses) is health guidance. Keep it conservative and evidence-based, and don't remove the "not medical advice" note.
- Demos are a YouTube search link per exercise. Do not embed third-party clips or videos (such as Physiotec or CSP clips) due to copyright and licensing restrictions; keep using dynamic YouTube search links.
