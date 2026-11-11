// Run: node test.js
const assert = require('node:assert');
const fs = require('node:fs');
const { PHASES, PLANS, IMAGES, exercises, trafficLight, todaysPlan, finishSession, replay, gripDue, steps, dose, GAMES_TO_WIN_SET } = require('./logic.js');

assert.equal(trafficLight(1), 'green');
assert.equal(trafficLight(4), 'amber');
assert.equal(trafficLight(7), 'red');
assert.equal(trafficLight(1, { results: [0, 2, 0] }), 'amber', 'flare yesterday caps at amber');

assert.equal(todaysPlan(0, 'red').length, 1);
assert.equal(todaysPlan(0, 'amber')[1].sets, 4);

let s = { phase: 0, games: 0, log: [] };
for (let i = 0; i < GAMES_TO_WIN_SET; i++) s = finishSession(s, { light: 'green', results: [0, 0, 0] });
assert.deepEqual([s.phase, s.games], [1, 0], 'six clean games win the set');
s = finishSession(s, { light: 'green', results: [0, 0, 0] });
s = finishSession(s, { light: 'amber', results: [0, 0, 0] });
assert.equal(s.games, 1, 'amber holds steady');
s = finishSession(s, { light: 'green', results: [0, 2, 0] });
assert.equal(s.games, 0, 'flare loses a game');
const r = replay(s, s.log.slice(0, -1));
assert.deepEqual([r.phase, r.games, r.log.length], [1, 1, s.log.length - 1], 'redoing today undoes its result');

assert.equal(steps({ mode: 'tempo', sets: 2, reps: 3, tempo: [1, 4] }).length, 2 * 3 * 2 + 1);
// Red days and the #stretch break both use the first exercise, so it must be the stretch.
for (const p of PHASES) assert.equal(p.exercises[0].kind, 'Stretch');

assert.equal(todaysPlan(0, 'green')[0].name, 'Wrist extensor stretch', 'lateral is the default side');
assert.equal(todaysPlan(0, 'red', 'medial')[0].name, 'Wrist flexor stretch');
assert.equal(todaysPlan(0, 'amber', 'medial')[1].sets, 4, 'medial keeps the dose');
for (let i = 0; i < PHASES.length; i++) {
  const m = exercises(i, 'medial');
  assert.equal(m[0].kind, 'Stretch');
  assert(
    m.every(e => !e.medial),
    'override is not leaked',
  );
}

// Wrist strength work carries on into the last stage, and grip progresses to the elbow straight.
const last = exercises(PHASES.length - 1).map(e => e.name);
assert(last.includes('Heavy slow wrist extension') && last.includes('Firm grip, elbow straight'));
assert(exercises(PHASES.length - 1, 'medial').some(e => e.name === 'Heavy slow wrist flexion'));

// Every demo image exists.
for (let i = 0; i < PHASES.length; i++)
  for (const side of ['lateral', 'medial']) for (const e of exercises(i, side)) if (e.img) assert(fs.existsSync(`${__dirname}/img/${e.img}`) && IMAGES[e.img], e.img);

// Wrist stage 2 trains the DRUJ stabilizers, and the dart-thrower path has a stop cue for midcarpal laxity.
assert(exercises(1, 'lateral', 'wrist').some(e => e.name === 'Isometric rotation holds'));
assert(
  exercises(1, 'lateral', 'wrist')
    .find(e => e.name.startsWith('Dart'))
    .cues.some(c => c.startsWith('Stop if the wrist clunks')),
);
// Wrist plan: red days and the stretch break give gentle mid-range circles (no passive stretch for lax wrists).
const W = PLANS.wrist;
for (let i = 0; i < W.length; i++) {
  assert.equal(todaysPlan(i, 'red', undefined, 'wrist')[0].name, 'Slow wrist circles, mid-range');
  for (const e of exercises(i, 'lateral', 'wrist')) if (e.img) assert(fs.existsSync(`${__dirname}/img/${e.img}`) && IMAGES[e.img], e.img);
}
let w = { plan: 'wrist', phase: W.length - 2, games: 0, log: [] };
for (let i = 0; i < GAMES_TO_WIN_SET * 2; i++) w = finishSession(w, { light: 'green', results: [0] });
assert.equal(w.phase, W.length - 1, 'wrist plan stops at its last stage');
assert.equal(dose(W[0].exercises[0]), '2 × 30 s', 'moving exercises are not called holds');
assert.equal(steps(W[0].exercises[0])[0].label, 'Set 1/2 · Move');
assert(
  W.every((_, i) => exercises(i, 'lateral', 'wrist').every(e => e.kind !== 'Activity')),
  'wrist plan is a home routine: no gym or session items',
);

assert(gripDue([], '2026-01-01'), 'first grip check is due');
const gripLog = [{ date: '2026-01-01', grip: 4 }, { date: '2026-01-03' }];
assert(!gripDue(gripLog, '2026-01-07'), 'weekly, not daily');
assert(gripDue(gripLog, '2026-01-08'));

// index.html: inline app script must parse, and the health note must stay.
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
for (const [, js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(js);
assert(/not medical advice/i.test(html), 'keep the "not medical advice" note');
console.log('ok');
