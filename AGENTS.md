# AGENTS.md

Elbow Coach: a mobile-first web app for daily elbow pain (lateral epicondylitis) rehab, for any cause, not just tennis. Static files, no build, no dependencies.

## Files

- `logic.js`: phases, exercises, and the rules (`trafficLight`, `exercises`, `todaysPlan`, `finishSession`, `steps`, `dose`). No DOM. Loaded as a classic `<script>` in the browser and via `require` in Node.
- `index.html`: all UI, CSS and app code. Screens are `<section>`s toggled with `hidden` (`show(id)`), and `render()` redraws from `state`.
- `test.js`: unit tests for `logic.js` and `index.html` using `node:test` and `node:assert/strict`.

## Commands

- Test: `node test.js` (uses `node:test`). Also checks that the inline script in `index.html` parses.
- Hooks: `prek install` once per clone; `.pre-commit-config.yaml` runs hygiene checks, Biome (`biome.json`: lint, plus formatting for `.js` only) and `node test.js` on commit.
- Run: `python3 -m http.server`, then open `http://localhost:8000`.

## Rules of the app

- Morning stiffness 0–2 = green (full dose), 3–5 = amber (one set less), 6+ = red (stretch only). A "much worse" result yesterday caps today at amber.
- After each exercise you rate the elbow on the spot, against the 3/10 limit in the cues: fine (3/10 or less), sore (above 3/10) or much worse (sharp pain). No waiting, so the flow stays do, tap, move on. A green session with every result "fine" is a good day. Any "much worse" is a flare-up and takes one away. 6 good days (`GAMES_TO_WIN_SET`) move you to the next phase. The UI says "good days" and "stages"; the code still calls them `games` and `setWon`.
- The morning check asks which side hurts (`state.side`: `lateral` default, or `medial`). Medial swaps in each exercise's `medial` name and cues (wrist flexors instead of extensors); doses stay the same.
- Once a week the morning check also asks for pain-free grip (0–10 against the good hand, `gripDue`). It's stored as `grip` on the log entry and shown in the history. It doesn't change the plan.
- Stages 3–5 add a shoulder exercise (band row) for the upper-limb kinetic chain.
- Grip progresses: gentle with the elbow bent (stage 1), firm with the elbow bent (stage 4), firm with the elbow straight, the position that usually provokes pain (stage 5). Stage 5 keeps heavy slow wrist extension at 2×8 as maintenance, so the tendon stays loaded on return to full activity. Stage 4 has five exercises, stage 5 six.
- Mid-session, "Back to plan" leads to "Redo morning check". After the session, "Redo today from scratch" drops today's log entry and rebuilds stage and good days with `replay`.
- `/#stretch` opens the current phase's stretch as a break outside the session. The "Stretch break" link next to the Elbow / Thumb buttons opens it too ("Glide break" on the thumb plan). It doesn't count towards good days. `reminder.ics` schedules it at 13:00 and 18:00, plus the session at 8:00.
- Two plans share the app: elbow (default) and thumb (`?plan=thumb`, `THUMB_PHASES`, key in `PLANS`). Each plan saves under its own key (`elbow-coach-v1`, `thumb-coach-v1`) and stores `plan` in its state. The Elbow / Thumb buttons at the top of the board switch plans. `[data-plan]` on `<html>` hides `.elbow-only` / `.thumb-only` parts, and `data-thumb` holds the thumb text of an element.
- The thumb plan is for de Quervain's tenosynovitis (first dorsal compartment: APL and EPB tendons) and has no medial side, grip check or calendar file. Stages: calm and glide (gentle thumb glides + light isometrics), isometrics and control (firmer thumb extension/abduction isometrics + rubber band spread), eccentric loading (radial lift, banded thumb lift, gentle grip), strength (slow radial lift, heavier band spread, book pinch hold, slow wrist extension), daily proofing (longer-lever radial lift, forearm rotation, firm grip, everyday task practice). It has no passive Finkelstein stretch: its first exercise is gentle active thumb glides (`move: true`), which red days and `/#stretch` use. Exercises with `move: true` say "Move" on the timer and drop "hold" from the dose. The morning slider asks for stiffness or soreness. Sources are in the comment above `THUMB_PHASES`.
- When you change a rule, update `test.js` and this section.

## Conventions

- Keep it dependency-free. Don't add a framework, bundler or service worker without asking.
- State lives in `localStorage` under `elbow-coach-v1`. If you change its shape, migrate old data or bump the key, because users have real progress saved.
- Colors and fonts come from the CSS tokens on `:root`. Every token needs both light and dark values.
- Exercise content (cues, doses) is health guidance. Keep it conservative and evidence-based, and don't remove the "not medical advice" note.
- Demos are a YouTube search link per exercise. Do not embed third-party clips or videos (such as Physiotec or CSP clips) due to copyright and licensing restrictions; keep using dynamic YouTube search links.
- Exception: pictures in `img/` (exercise `img` field, with extension). Each needs an entry in `IMAGES` in `logic.js` (title, author, source page, license); the caption under the picture links all four and says "resized". Some are from Wikimedia Commons (BruceBlaus, CC BY-SA 4.0). The others are AI-generated with Google Gemini in the same style, credited as such with no license link: arm close-ups copy the BruceBlaus 3D-render look (`isometric-extension.jpg` as the style reference), and pictures with a body copy `band-row.jpg` (same man and clothes). Keep one style: no photos, no painted look. Movement arrows are drawn afterwards with `magick` (curved, blue, white outline), never by the AI. Make one picture at a time and check it against the cues and a reference video before the next. These have no picture on purpose: the Tyler twists (Gemini keeps drawing the wrists straight, which is the one thing the exercise is about) and the Activity items (sport sessions). Weights are dumbbells, never hammers. Gemini cannot draw a dumbbell held at one end (it bends the handle or adds a weight), so those pictures are composites made with `magick`. Only use a picture that shows the exact movement (e.g. the wrist-curl picture is palm up, so it's medial only).
