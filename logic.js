// Rehab rules: phases, daily load, progression. No DOM here so test.js can run it in Node.

const GAMES_TO_WIN_SET = 6;

// mode: 'hold' = isometric seconds, 'tempo' = reps at [up, down] seconds, 'time' = minutes of play
const PHASES = [
  {
    name: 'Acute Phase',
    goal: 'Calm the tendon. Isometrics reduce pain without stressing it.',
    exercises: [
      { kind: 'Stretch', name: 'Wrist extensor stretch', mode: 'hold', sets: 3, secs: 30,
        cues: ['Arm straight, palm down', 'Gently bend the wrist down with the other hand', 'Mild pull only, never sharp pain'] },
      { kind: 'Strength', name: 'Isometric wrist extension', mode: 'hold', sets: 5, secs: 45,
        cues: ['Forearm on a table, palm down, wrist off the edge', 'Push the back of the hand up into your other hand', 'About 50–70% effort, no movement', 'Pain up to 3/10 is OK'] },
      { kind: 'Tennis', name: 'Shadow strokes, no racquet', mode: 'time', sets: 1, mins: 3,
        cues: ['Slow forehand and backhand swings', 'Relaxed grip hand, lead with the shoulder', 'Stop if the elbow complains'] },
    ],
  },
  {
    name: 'Early Rehab',
    goal: 'Start loading the tendon with slow eccentrics.',
    exercises: [
      { kind: 'Stretch', name: 'Wrist extensor stretch', mode: 'hold', sets: 3, secs: 30,
        cues: ['Arm straight, palm down', 'Gently bend the wrist down', 'Mild pull only'] },
      { kind: 'Strength', name: 'Eccentric wrist extension (1–2 kg)', mode: 'tempo', sets: 3, reps: 15, tempo: [1, 4],
        cues: ['Forearm supported, palm down', 'Use the other hand to lift the weight up', 'Lower slowly over 4 seconds', 'Pain up to 3/10 is OK'] },
      { kind: 'Tennis', name: 'Racquet rotations', mode: 'tempo', sets: 2, reps: 15, tempo: [2, 2],
        cues: ['Hold the racquet at the throat', 'Rotate palm up, then palm down', 'Slow and controlled'] },
    ],
  },
  {
    name: 'Conditioning',
    goal: 'Add the Tyler twist and short hitting.',
    exercises: [
      { kind: 'Stretch', name: 'Extensor stretch, elbow straight', mode: 'hold', sets: 3, secs: 30,
        cues: ['Make a fist, palm down, arm straight', 'Bend the wrist down and toward the pinky', 'Mild pull only'] },
      { kind: 'Strength', name: 'FlexBar Tyler twist', mode: 'tempo', sets: 3, reps: 15, tempo: [1, 4],
        cues: ['Twist the bar with the good hand', 'Hold the twist, arms out in front', 'Let the bad wrist untwist slowly over 4 seconds'] },
      { kind: 'Tennis', name: 'Mini tennis at the service line', mode: 'time', sets: 1, mins: 10,
        cues: ['Soft feel shots, loose grip', 'Contact in front of the body', 'No backhand slices yet'] },
    ],
  },
  {
    name: 'Strength',
    goal: 'Heavy slow resistance builds tendon capacity.',
    exercises: [
      { kind: 'Stretch', name: 'Extensor stretch, elbow straight', mode: 'hold', sets: 3, secs: 30,
        cues: ['Fist, palm down, arm straight', 'Bend the wrist down', 'Mild pull only'] },
      { kind: 'Strength', name: 'Heavy slow wrist extension', mode: 'tempo', sets: 3, reps: 8, tempo: [3, 3],
        cues: ['Pick a weight where 8 reps is hard', '3 seconds up, 3 seconds down', 'Raise the weight when 8 feels easy'] },
      { kind: 'Tennis', name: 'Baseline rally at 70%', mode: 'time', sets: 1, mins: 20,
        cues: ['Groundstrokes only', 'Check grip pressure every few balls', 'Stop at the first sharp pain'] },
    ],
  },
  {
    name: 'Sport-Proofing',
    goal: 'Return to full play and keep the tendon strong.',
    exercises: [
      { kind: 'Stretch', name: 'Extensor stretch, elbow straight', mode: 'hold', sets: 2, secs: 30,
        cues: ['Fist, palm down, arm straight', 'Bend the wrist down', 'Mild pull only'] },
      { kind: 'Strength', name: 'Hammer pronation / supination', mode: 'tempo', sets: 3, reps: 10, tempo: [3, 3],
        cues: ['Hold a hammer by the handle, elbow at 90°', 'Rotate palm up, then palm down', 'Choke up to make it easier'] },
      { kind: 'Tennis', name: 'Serves and full practice', mode: 'time', sets: 1, mins: 30,
        cues: ['Warm up with 5 minutes of mini tennis', 'Serves at 80%, then full points', 'Keep doing strength work 2–3 times a week'] },
    ],
  },
];

// Pain after an exercise: 0 = same or better, 1 = slightly worse, 2 = much worse.
const PAIN = ['Same or better', 'Slightly worse', 'Much worse'];

// Morning stiffness 0–10 plus yesterday's result gives today's light.
function trafficLight(stiffness, lastEntry) {
  let light = stiffness <= 2 ? 'green' : stiffness <= 5 ? 'amber' : 'red';
  const flared = lastEntry && lastEntry.results && lastEntry.results.includes(2);
  if (flared && light === 'green') light = 'amber';
  return light;
}

// green = full dose, amber = one set less, red = only the stretch
function todaysPlan(phase, light) {
  const ex = PHASES[phase].exercises;
  if (light === 'red') return [ex[0]];
  if (light === 'amber') return ex.map(e => ({ ...e, sets: Math.max(1, e.sets - 1) }));
  return ex;
}

// Returns a new state after a finished session.
function finishSession(state, entry) {
  const s = { ...state, log: [...state.log, entry] };
  const flare = entry.results.includes(2);
  const clean = entry.light === 'green' && entry.results.every(r => r === 0);
  if (flare) s.games = Math.max(0, s.games - 1);
  else if (clean) s.games += 1;
  if (s.games >= GAMES_TO_WIN_SET && s.phase < PHASES.length - 1) {
    s.phase += 1;
    s.games = 0;
    entry.setWon = true;
  }
  return s;
}

// Timer steps for one exercise.
function steps(ex) {
  const out = [];
  for (let set = 1; set <= ex.sets; set++) {
    const tag = ex.sets > 1 ? `Set ${set}/${ex.sets} · ` : '';
    if (ex.mode === 'hold') out.push({ label: tag + 'Hold', secs: ex.secs });
    if (ex.mode === 'time') out.push({ label: 'Play', secs: ex.mins * 60 });
    if (ex.mode === 'tempo') {
      for (let r = 1; r <= ex.reps; r++) {
        out.push({ label: `${tag}Rep ${r}/${ex.reps} · Up`, secs: ex.tempo[0] });
        out.push({ label: `${tag}Rep ${r}/${ex.reps} · Down`, secs: ex.tempo[1] });
      }
    }
    if (set < ex.sets) out.push({ label: 'Rest', secs: ex.mode === 'tempo' ? 90 : 30, rest: true });
  }
  return out;
}

function dose(ex) {
  if (ex.mode === 'hold') return `${ex.sets} × ${ex.secs} s hold`;
  if (ex.mode === 'time') return `${ex.mins} min`;
  return `${ex.sets} × ${ex.reps} · tempo ${ex.tempo[0]} s up / ${ex.tempo[1]} s down`;
}

if (typeof module !== 'undefined') module.exports = { PHASES, PAIN, GAMES_TO_WIN_SET, trafficLight, todaysPlan, finishSession, steps, dose };
