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
- After each exercise you rate the elbow on the spot, against the 3/10 limit in the cues: fine (3/10 or less), sore (above 3/10) or much worse (sharp pain). No waiting, so the flow stays do, tap, move on. A green session with every result "fine" is a good day. Any "much worse" is a flare-up and takes one away. 6 good days (`GAMES_TO_WIN_SET`) move you to the next phase. The UI says "good days" and "stages"; the code still calls them `games` and `setWon`.
- The morning check asks which side hurts (`state.side`: `lateral` default, or `medial`). Medial swaps in each exercise's `medial` name and cues (wrist flexors instead of extensors); doses stay the same.
- Once a week the morning check also asks for pain-free grip (0–10 against the good hand, `gripDue`). It's stored as `grip` on the log entry and shown in the history. It doesn't change the plan.
- Stages 3–5 add a shoulder exercise (band row) for the upper-limb kinetic chain.
- Grip progresses: gentle with the elbow bent (stage 1), firm with the elbow bent (stage 4), firm with the elbow straight, the position that usually provokes pain (stage 5). Stage 5 keeps heavy slow wrist extension at 2×8 as maintenance, so the tendon stays loaded on return to full activity. Stage 4 has five exercises, stage 5 six.
- Mid-session, "Back to plan" leads to "Redo morning check". After the session, "Redo today from scratch" drops today's log entry and rebuilds stage and good days with `replay`.
- `/#stretch` opens the current phase's stretch as a break outside the session. The "Stretch break now" button in the History card opens it too. It doesn't count towards good days. `reminder.ics` schedules it at 13:00 and 18:00, plus the session at 8:00.
- Two plans share the app: elbow (default) and wrist (`?plan=wrist`, `WRIST_PHASES`, key in `PLANS`). Each plan saves under its own key (`elbow-coach-v1`, `wrist-coach-v1`) and stores `plan` in its state. `[data-plan]` on `<html>` hides `.elbow-only` / `.wrist-only` parts, and `data-wrist` holds the wrist text of an element.
- The wrist plan is for lax (hypermobile) wrists, both sides, and has no medial side, grip check or calendar file. Stages: feel and hold, stabilizers (dart-thrower motion), mid-range strength, reaction (bottoms-up kettlebell, FlexBar shake), climbing transfer. It has no passive stretch: its first exercise is mid-range wrist circles, which red days and `/#stretch` use. Exercises with `move: true` (circles, ball roll, shake, weight shifts) say "Move" on the timer and drop "hold" from the dose. The morning slider asks for discomfort instead of stiffness.
- When you change a rule, update `test.js` and this section.

## Conventions

- Keep it dependency-free. Don't add a framework, bundler or service worker without asking.
- State lives in `localStorage` under `elbow-coach-v1`. If you change its shape, migrate old data or bump the key, because users have real progress saved.
- Colors and fonts come from the CSS tokens on `:root`. Every token needs both light and dark values.
- Exercise content (cues, doses) is health guidance. Keep it conservative and evidence-based, and don't remove the "not medical advice" note.
- Demos are a YouTube search link per exercise. Do not embed third-party clips or videos (such as Physiotec or CSP clips) due to copyright and licensing restrictions; keep using dynamic YouTube search links.
- Exception: pictures in `img/` (exercise `img` field, with extension). Each needs an entry in `IMAGES` in `logic.js` (title, author, source page, license); the caption under the picture links all four and says "resized". Most are from Wikimedia Commons (BruceBlaus, CC BY-SA 4.0, and one public-domain photo by Hipnotic88). The isometrics, gentle grip and band row are AI-generated with Google Gemini in the BruceBlaus style, credited as such with no license link; check any new AI picture against the cues before adding it. The Tyler twists have no picture on purpose: Gemini kept drawing the wrists straight, which is the one thing the exercise is about. Only use a picture that shows the exact movement (e.g. the wrist-curl picture is palm up, so it's medial only).
