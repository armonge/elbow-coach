# Elbow Coach

Daily rehab coach for elbow pain from overuse (lateral epicondylitis, often called tennis elbow, though climbing, lifting or desk work cause it too). Static web app, no build step.

- Pick outer (lateral) or inner (medial, golfer's elbow) side; the stretch and strength exercises switch to match.
- Morning stiffness check sets a traffic light: green = full session, amber = one set less, red = stretch only.
- 5 stages: Acute → Early Rehab → Conditioning → Strength → Sport-Proofing. 6 good days (green, nothing worse) move you up a stage; a flare-up takes one away.
- Three exercises a day with an optional tempo/hold timer (audio metronome) and pain logging after each one.
- Progress is saved in the browser (`localStorage`).

Run: open `index.html`, or `python3 -m http.server` and visit it from your phone.
Test the rules: `node test.js`.

Not medical advice.

License: MIT, see `LICENSE`.
