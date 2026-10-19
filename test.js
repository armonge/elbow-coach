// Run: node test.js
const assert = require('node:assert');
const fs = require('node:fs');
const { PHASES, exercises, trafficLight, todaysPlan, finishSession, steps, GAMES_TO_WIN_SET } = require('./logic.js');

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

// index.html: inline app script must parse, and the health note must stay.
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
for (const [, js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(js);
assert(html.includes('not medical advice'), 'keep the "not medical advice" note');
console.log('ok');
