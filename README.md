# Elbow Coach

Daily tennis elbow (lateral epicondylitis) rehab coach. Static web app, no build step.

- Morning stiffness check sets a traffic light: green = full session, amber = one set less, red = stretch only.
- 5 phases ("sets"): Acute → Early Rehab → Conditioning → Strength → Sport-Proofing. 6 clean green sessions win a set; a flare-up loses a game.
- Three exercises a day with an optional tempo/hold timer (audio metronome) and pain logging after each one.
- Progress is saved in the browser (`localStorage`).

Run: open `index.html`, or `python3 -m http.server` and visit it from your phone.
Test the rules: `node test.js`.

Not medical advice.
