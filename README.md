# Elbow Coach

Daily rehab coach for elbow pain from overuse (lateral or medial epicondylitis, from climbing, lifting, desk work or racket sports) and a second plan for wrist stability (`?plan=wrist`). Static web app, no build step, no dependencies.

- **Elbow plan**: pick outer (lateral, tennis elbow) or inner (medial, golfer's elbow) side; the stretch and strength exercises switch to match.
- **Wrist plan** (`?plan=wrist` or the Wrist button at the top): daily home routine for lax (hypermobile) wrists, progressing from mid-range control and stabilizers to climbing grips.
- **Traffic-light load**: morning stiffness/discomfort sets green (full session), amber (one set less) or red (gentle stretch / wrist circles only). A flare-up yesterday caps today at amber.
- **5 stages**: 6 good days (green, nothing above 3/10) move you up a stage; a flare-up takes one away. Elbow stages progress from 3 exercises a day up to 6 (adding shoulder work and straight-elbow grip).
- **Optional timer & breaks**: built-in audio metronome for holds and tempos, `/#stretch` for a standalone stretch/movement break, and `reminder.ics` for daily elbow calendar reminders.
- **Weekly grip check** (elbow plan): tracks pain-free grip strength alongside your session history.
- **Local storage**: progress stays in your browser (`localStorage`).

Pictures in `img/` are either by BruceBlaus ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via Wikimedia Commons) or AI-generated with Google Gemini, credited under each exercise.

Run: open `index.html`, or `python3 -m http.server` and visit it from your phone.
Test the rules: `node test.js`.

Not medical advice.

License: MIT, see `LICENSE`.
