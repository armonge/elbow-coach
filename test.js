// Run: node test.js
const assert = require('assert');
const { trafficLight, todaysPlan, finishSession, steps, GAMES_TO_WIN_SET } = require('./logic.js');

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
console.log('ok');
