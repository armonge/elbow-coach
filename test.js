// Run: node test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PHASES, PLANS, IMAGES, exercises, trafficLight, todaysPlan, finishSession, replay, gripDue, steps, dose, GAMES_TO_WIN_SET } = require('./logic.js');

describe('trafficLight', () => {
  it('maps morning stiffness to green, amber, and red', () => {
    assert.equal(trafficLight(0), 'green');
    assert.equal(trafficLight(2), 'green');
    assert.equal(trafficLight(3), 'amber');
    assert.equal(trafficLight(5), 'amber');
    assert.equal(trafficLight(6), 'red');
    assert.equal(trafficLight(10), 'red');
  });

  it('caps green at amber after a flare-up yesterday', () => {
    assert.equal(trafficLight(1, { results: [0, 2, 0] }), 'amber');
    assert.equal(trafficLight(4, { results: [2] }), 'amber');
    assert.equal(trafficLight(7, { results: [2] }), 'red');
  });

  it('keeps green when yesterday had no flare-up', () => {
    assert.equal(trafficLight(1, { results: [0, 1, 0] }), 'green');
  });
});

describe('exercises and todaysPlan', () => {
  it('uses lateral by default and swaps medial overrides without leaking them', () => {
    assert.equal(todaysPlan(0, 'green')[0].name, 'Wrist extensor stretch');
    assert.equal(todaysPlan(0, 'red', 'medial')[0].name, 'Wrist flexor stretch');
    assert.equal(todaysPlan(0, 'amber', 'medial')[1].sets, 4);

    for (let i = 0; i < PHASES.length; i++) {
      const m = exercises(i, 'medial');
      assert.equal(m[0].kind, 'Stretch');
      assert.ok(
        m.every(e => !e.medial),
        'medial override should not leak',
      );
    }
  });

  it('adjusts daily load by traffic light', () => {
    assert.equal(todaysPlan(0, 'red').length, 1);
    assert.equal(todaysPlan(0, 'amber')[1].sets, 4);
    // Single-set exercises never drop below 1 set on amber days.
    assert.equal(todaysPlan(2, 'amber').find(e => e.kind === 'Activity').sets, 1);
  });

  it('keeps stretch first in every elbow stage for red days and #stretch', () => {
    for (const p of PHASES) assert.equal(p.exercises[0].kind, 'Stretch');
  });

  it('carries wrist strength into stage 5 and progresses grip to elbow straight', () => {
    const last = exercises(PHASES.length - 1).map(e => e.name);
    assert.ok(last.includes('Heavy slow wrist extension'));
    assert.ok(last.includes('Firm grip, elbow straight'));
    assert.ok(exercises(PHASES.length - 1, 'medial').some(e => e.name === 'Heavy slow wrist flexion'));
  });

  it('resolves exercise variants from choices and defaults to the first variant', () => {
    const def = todaysPlan(4, 'green');
    const rotDef = def.find(e => e.id === 'forearm-rotation');
    assert.equal(rotDef.variant, 'dumbbell');
    assert.equal(rotDef.img, 'forearm-rotation-db.jpg');
    assert.deepEqual(
      rotDef.variants.map(v => v.id),
      ['dumbbell', 'pan'],
    );

    const chosen = todaysPlan(4, 'green', 'lateral', 'elbow', { 'forearm-rotation': 'pan', 'firm-grip-straight': 'jug-hang' });
    const rotPan = chosen.find(e => e.id === 'forearm-rotation');
    assert.equal(rotPan.variant, 'pan');
    assert.equal(rotPan.img, 'forearm-rotation-pan.jpg');
    assert.match(rotPan.cues[0], /cast-iron pan/i);

    const hang = chosen.find(e => e.id === 'firm-grip-straight');
    assert.equal(hang.variant, 'jug-hang');
    assert.equal(hang.img, undefined, 'variant without an illustration should not inherit another variant image');

    const fallback = todaysPlan(4, 'green', 'lateral', 'elbow', { 'forearm-rotation': 'unknown' });
    assert.equal(fallback.find(e => e.id === 'forearm-rotation').variant, 'dumbbell');
  });

  it('follows thumb plan rules (gentle glides first, no passive stretch, isometric & eccentric progression)', () => {
    const T = PLANS.thumb;
    assert.equal(T.length, 5);
    for (let i = 0; i < T.length; i++) {
      assert.equal(todaysPlan(i, 'red', undefined, 'thumb')[0].name, 'Gentle thumb glides');
      assert.ok(
        exercises(i, 'lateral', 'thumb').every(e => e.kind !== 'Stretch'),
        'thumb plan avoids passive Finkelstein stretching',
      );
    }
    assert.ok(exercises(0, 'lateral', 'thumb').some(e => e.name === 'Isometric thumb extension (light)'));
    assert.ok(exercises(1, 'lateral', 'thumb').some(e => e.name === 'Isometric thumb abduction'));
    assert.ok(exercises(2, 'lateral', 'thumb').some(e => e.name.startsWith('Eccentric radial lift')));
    assert.ok(exercises(2, 'lateral', 'thumb').some(e => e.name.startsWith('Eccentric thumb lift')));
    assert.ok(exercises(3, 'lateral', 'thumb').some(e => e.name === 'Pinch hold with a book'));
    assert.ok(exercises(4, 'lateral', 'thumb').some(e => e.kind === 'Activity'));
  });
});

describe('finishSession and replay', () => {
  it('advances stage after 6 clean green days without mutating the entry', () => {
    let s = { phase: 0, games: 0, log: [] };
    const entries = [];
    for (let i = 0; i < GAMES_TO_WIN_SET; i++) {
      const entry = { light: 'green', results: [0, 0, 0] };
      entries.push(entry);
      s = finishSession(s, entry);
    }
    assert.deepEqual([s.phase, s.games], [1, 0]);
    assert.equal(s.log.at(-1).setWon, true);
    assert.equal(entries.at(-1).setWon, undefined, 'caller entry should not be mutated');
  });

  it('holds steady on amber, red, or green with sore exercises', () => {
    let s = { phase: 1, games: 2, log: [] };
    s = finishSession(s, { light: 'amber', results: [0, 0, 0] });
    s = finishSession(s, { light: 'red', results: [0] });
    s = finishSession(s, { light: 'green', results: [0, 1, 0] });
    assert.equal(s.games, 2);
  });

  it('loses one good day on a flare-up, floored at 0', () => {
    let s = { phase: 1, games: 1, log: [] };
    s = finishSession(s, { light: 'green', results: [0, 2, 0] });
    assert.equal(s.games, 0);
    s = finishSession(s, { light: 'amber', results: [2] });
    assert.equal(s.games, 0);
  });

  it('caps good days at GAMES_TO_WIN_SET on the final stage', () => {
    const T = PLANS.thumb;
    let t = { plan: 'thumb', phase: T.length - 2, games: 0, log: [] };
    for (let i = 0; i < GAMES_TO_WIN_SET * 2 + 3; i++) t = finishSession(t, { light: 'green', results: [0] });
    assert.equal(t.phase, T.length - 1);
    assert.equal(t.games, GAMES_TO_WIN_SET);
    assert.equal(t.log.at(-1).setWon, undefined);
  });

  it('rebuilds stage and good days when redoing today', () => {
    let s = { phase: 0, games: 0, log: [] };
    for (let i = 0; i < GAMES_TO_WIN_SET; i++) s = finishSession(s, { light: 'green', results: [0, 0, 0] });
    assert.deepEqual([s.phase, s.games], [1, 0]);

    const undoneStageUp = replay(s, s.log.slice(0, -1));
    assert.deepEqual([undoneStageUp.phase, undoneStageUp.games, undoneStageUp.log.length], [0, GAMES_TO_WIN_SET - 1, GAMES_TO_WIN_SET - 1]);

    s = finishSession(s, { light: 'green', results: [0, 0, 0] });
    s = finishSession(s, { light: 'green', results: [0, 2, 0] });
    const undoneFlare = replay(s, s.log.slice(0, -1));
    assert.deepEqual([undoneFlare.phase, undoneFlare.games, undoneFlare.log.length], [1, 1, s.log.length - 1]);
  });
});

describe('gripDue', () => {
  it('asks on the first session and then every 7 days', () => {
    assert.equal(gripDue([], '2026-01-01'), true);
    const gripLog = [{ date: '2026-01-01', grip: 4 }, { date: '2026-01-03' }];
    assert.equal(gripDue(gripLog, '2026-01-07'), false);
    assert.equal(gripDue(gripLog, '2026-01-08'), true);
  });
});

describe('steps and dose', () => {
  it('formats dose and generates steps for hold, moving hold, tempo, and time exercises', () => {
    const moving = PLANS.thumb[0].exercises[0];
    assert.equal(dose(moving), '2 × 30 s');
    assert.equal(steps(moving)[0].label, 'Set 1/2 · Move');

    const hold = PHASES[0].exercises[0];
    assert.equal(dose(hold), '3 × 30 s hold');
    assert.equal(steps(hold)[0].label, 'Set 1/3 · Hold');
    assert.equal(steps(hold)[1].rest, true);
    assert.equal(steps(hold)[1].secs, 30);

    const tempo = { mode: 'tempo', sets: 2, reps: 3, tempo: [1, 4] };
    assert.equal(dose(tempo), '2 × 3 · tempo 1 s up / 4 s down');
    assert.equal(steps(tempo).length, 2 * 3 * 2 + 1);
    assert.equal(steps(tempo)[6].secs, 90);

    const activity = { mode: 'time', sets: 1, mins: 10 };
    assert.equal(dose(activity), '10 min');
    assert.deepEqual(steps(activity), [{ label: 'Activity', secs: 600 }]);
  });
});

describe('assets and index.html', () => {
  it('has an existing file and credit for every referenced image, and no unused credits', () => {
    const used = new Set();
    const check = img => {
      if (!img) return;
      used.add(img);
      assert.ok(fs.existsSync(`${__dirname}/img/${img}`), `missing file: img/${img}`);
      assert.ok(IMAGES[img], `missing IMAGES credit: ${img}`);
    };
    for (const [plan, phases] of Object.entries(PLANS)) {
      const sides = plan === 'elbow' ? ['lateral', 'medial'] : ['lateral'];
      for (let i = 0; i < phases.length; i++) {
        for (const side of sides) {
          for (const e of exercises(i, side, plan)) {
            check(e.img);
            for (const v of e.variants || []) {
              const resolved = exercises(i, side, plan, { [e.id]: v.id }).find(x => x.id === e.id);
              check(resolved.img);
            }
          }
        }
      }
    }
    for (const img of Object.keys(IMAGES)) assert.ok(used.has(img), `unused IMAGES credit: ${img}`);
  });

  it('parses the inline script and keeps the medical disclaimer', () => {
    const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
    for (const [, js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(js);
    assert.match(html, /not medical advice/i);
  });
});
