// Rehab rules: phases, daily load, progression. No DOM here so test.js can run it in Node.

const GAMES_TO_WIN_SET = 6;

// img: file in img/ (BruceBlaus, CC BY-SA 4.0, Wikimedia Commons). Medial overrides it; the curl picture is palm up, so lateral extension has none.
// mode: 'hold' = isometric seconds, 'tempo' = reps at [up, down] seconds, 'time' = minutes of activity
const PHASES = [
  {
    name: 'Acute Phase',
    goal: 'Calm the tendon. Isometrics load it gently without movement; the benefit builds over weeks.',
    exercises: [
      {
        kind: 'Stretch',
        name: 'Wrist extensor stretch',
        img: 'extensor-stretch.jpg',
        mode: 'hold',
        sets: 3,
        secs: 30,
        cues: ['Arm straight, palm down', 'Gently bend the wrist down with the other hand', 'Mild pull only, never sharp pain'],
        medial: {
          name: 'Wrist flexor stretch',
          img: 'flexor-stretch.jpg',
          cues: ['Arm straight in front, fingers up, palm facing away', 'Gently pull the fingers back toward you with the other hand', 'Mild pull only, never sharp pain'],
        },
      },
      {
        kind: 'Strength',
        name: 'Isometric wrist extension',
        mode: 'hold',
        sets: 5,
        secs: 45,
        cues: ['Forearm on a table, palm down, wrist off the edge', 'Push the back of the hand up into your other hand', 'Start light, about 30–40% effort, no movement', 'Pain up to 3/10 is OK'],
        medial: {
          name: 'Isometric wrist flexion',
          cues: ['Forearm on a table, palm up, wrist off the edge', 'Push the palm up into your other hand', 'Start light, about 30–40% effort, no movement', 'Pain up to 3/10 is OK'],
        },
      },
      {
        kind: 'Activity',
        name: 'Gentle grip, elbow bent',
        mode: 'hold',
        sets: 3,
        secs: 20,
        cues: ['Squeeze a soft ball or rolled towel, elbow bent at 90°', 'Light effort, about 30%', 'Pain up to 3/10 is OK'],
      },
    ],
  },
  {
    name: 'Early Rehab',
    goal: 'Start loading the tendon with slow eccentrics.',
    exercises: [
      {
        kind: 'Stretch',
        name: 'Wrist extensor stretch',
        img: 'extensor-stretch.jpg',
        mode: 'hold',
        sets: 3,
        secs: 30,
        cues: ['Arm straight, palm down', 'Gently bend the wrist down', 'Mild pull only'],
        medial: {
          name: 'Wrist flexor stretch',
          img: 'flexor-stretch.jpg',
          cues: ['Arm straight in front, fingers up, palm facing away', 'Gently pull the fingers back toward you with the other hand', 'Mild pull only'],
        },
      },
      {
        kind: 'Strength',
        name: 'Eccentric wrist extension (1–2 kg)',
        mode: 'tempo',
        sets: 3,
        reps: 15,
        tempo: [1, 4],
        cues: ['Forearm supported, palm down', 'Use the other hand to lift the weight up', 'Lower slowly over 4 seconds', 'Pain up to 3/10 is OK'],
        medial: {
          name: 'Eccentric wrist flexion (1–2 kg)',
          img: 'wrist-curls.jpg',
          cues: ['Forearm supported, palm up', 'Use the other hand to curl the weight up', 'Lower slowly over 4 seconds', 'Pain up to 3/10 is OK'],
        },
      },
      {
        kind: 'Activity',
        name: 'Finger extension with a rubber band',
        mode: 'tempo',
        sets: 2,
        reps: 15,
        tempo: [1, 2],
        cues: ['Loop a rubber band around the fingertips and thumb', 'Spread the fingers open, then let them close slowly', 'Slow and controlled'],
      },
    ],
  },
  {
    name: 'Conditioning',
    goal: 'Add the Tyler twist, shoulder work and easy activity.',
    exercises: [
      {
        kind: 'Stretch',
        name: 'Extensor stretch, elbow straight',
        img: 'extensor-stretch.jpg',
        mode: 'hold',
        sets: 3,
        secs: 30,
        cues: ['Make a fist, palm down, arm straight', 'Bend the wrist down and toward the pinky', 'Mild pull only'],
        medial: {
          name: 'Flexor stretch, elbow straight',
          img: 'flexor-stretch.jpg',
          cues: ['Arm straight in front, fingers up, palm facing away', 'Gently pull the fingers back toward you with the other hand', 'Mild pull only'],
        },
      },
      {
        kind: 'Strength',
        name: 'Tyler twist (resistance bar)',
        mode: 'tempo',
        sets: 3,
        reps: 15,
        tempo: [1, 4],
        cues: [
          'Hold the bar upright in the sore hand, wrist bent fully back',
          'Grab the top end with the good hand, palm facing away',
          'Twist the top with the good hand while the sore wrist stays bent back',
          'Hold the twist and bring both arms out in front, elbows straight',
          'Let the sore wrist slowly untwist over 4 seconds',
          'Release and reset with the good hand',
        ],
        medial: {
          name: 'Reverse Tyler twist (resistance bar)',
          cues: [
            'Hold one end of the bar in the sore hand, wrist curled in fully',
            'Grab the other end with the good hand',
            'Curl the good wrist to twist the bar while the sore wrist stays curled',
            'Keep the twist and bring both arms out in front, elbows straight',
            'Let the sore wrist slowly uncurl over 4 seconds',
            'Release and reset with the good hand',
          ],
        },
      },
      {
        kind: 'Shoulder',
        name: 'Band row',
        mode: 'tempo',
        sets: 2,
        reps: 15,
        tempo: [2, 2],
        cues: ['Light band anchored at chest height', 'Loose grip, or loop the band around the wrist', 'Pull the elbow back past your side and squeeze the shoulder blades', 'Return slowly'],
      },
      {
        kind: 'Activity',
        name: 'Your sport or task at 50%',
        mode: 'time',
        sets: 1,
        mins: 10,
        cues: ['Easy version only, e.g. big holds, light tools, short rallies', 'Loose grip, relax between efforts', 'Stop if the elbow complains'],
      },
    ],
  },
  {
    name: 'Strength',
    goal: 'Heavy slow resistance builds tendon capacity.',
    exercises: [
      {
        kind: 'Stretch',
        name: 'Extensor stretch, elbow straight',
        img: 'extensor-stretch.jpg',
        mode: 'hold',
        sets: 3,
        secs: 30,
        cues: ['Fist, palm down, arm straight', 'Bend the wrist down', 'Mild pull only'],
        medial: {
          name: 'Flexor stretch, elbow straight',
          img: 'flexor-stretch.jpg',
          cues: ['Arm straight in front, fingers up, palm facing away', 'Gently pull the fingers back toward you with the other hand', 'Mild pull only'],
        },
      },
      {
        kind: 'Strength',
        name: 'Heavy slow wrist extension',
        mode: 'tempo',
        sets: 3,
        reps: 8,
        tempo: [3, 3],
        cues: ['Pick a weight where 8 reps is hard', '3 seconds up, 3 seconds down', 'Raise the weight when 8 feels easy'],
        medial: {
          name: 'Heavy slow wrist flexion',
          img: 'wrist-curls.jpg',
          cues: ['Forearm supported, palm up', 'Pick a weight where 8 reps is hard', '3 seconds up, 3 seconds down', 'Raise the weight when 8 feels easy'],
        },
      },
      {
        kind: 'Shoulder',
        name: 'Band row',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [2, 2],
        cues: ['Light band anchored at chest height', 'Loose grip, or loop the band around the wrist', 'Pull the elbow back past your side and squeeze the shoulder blades', 'Return slowly'],
      },
      {
        kind: 'Activity',
        name: 'Your sport or task at 70%',
        mode: 'time',
        sets: 1,
        mins: 20,
        cues: ['Skip your hardest moves for now (small crimps, heavy lifts, slices)', 'Check grip pressure every few balls', 'Stop at the first sharp pain'],
      },
    ],
  },
  {
    name: 'Sport-Proofing',
    goal: 'Return to full activity and keep the tendon strong.',
    exercises: [
      {
        kind: 'Stretch',
        name: 'Extensor stretch, elbow straight',
        img: 'extensor-stretch.jpg',
        mode: 'hold',
        sets: 2,
        secs: 30,
        cues: ['Fist, palm down, arm straight', 'Bend the wrist down', 'Mild pull only'],
        medial: {
          name: 'Flexor stretch, elbow straight',
          img: 'flexor-stretch.jpg',
          cues: ['Arm straight in front, fingers up, palm facing away', 'Gently pull the fingers back toward you with the other hand', 'Mild pull only'],
        },
      },
      {
        kind: 'Strength',
        name: 'Hammer pronation / supination',
        img: 'forearm-rotation.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: ['Hold a hammer by the handle, elbow at 90°', 'Rotate palm up, then palm down', 'Choke up to make it easier'],
      },
      {
        kind: 'Shoulder',
        name: 'Band row',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [2, 2],
        cues: ['Light band anchored at chest height', 'Loose grip, or loop the band around the wrist', 'Pull the elbow back past your side and squeeze the shoulder blades', 'Return slowly'],
      },
      {
        kind: 'Activity',
        name: 'Full sport or work session',
        mode: 'time',
        sets: 1,
        mins: 30,
        cues: ['Warm up with 5–10 easy minutes', 'Build to full intensity over the session', 'Keep doing strength work 2–3 times a week'],
      },
    ],
  },
];

// Pain after an exercise: 0 = same or better, 1 = slightly worse, 2 = much worse.
const PAIN = ['Same or better', 'Slightly worse', 'Much worse'];

// Morning stiffness 0–10 plus yesterday's result gives today's light.
function trafficLight(stiffness, lastEntry) {
  let light = stiffness <= 2 ? 'green' : stiffness <= 5 ? 'amber' : 'red';
  const flared = lastEntry?.results?.includes(2);
  if (flared && light === 'green') light = 'amber';
  return light;
}

// side: 'lateral' (outer elbow, wrist extensors) or 'medial' (inner elbow, wrist flexors).
// Medial swaps in an exercise's `medial` name and cues; exercises without one suit both sides.
function exercises(phase, side = 'lateral') {
  return PHASES[phase].exercises.map(({ medial, ...e }) => (side === 'medial' && medial ? { ...e, ...medial } : e));
}

// green = full dose, amber = one set less, red = only the stretch
function todaysPlan(phase, light, side) {
  const ex = exercises(phase, side);
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

// Pain-free grip (0–10, 10 = as strong as the good hand) is asked once a week in the morning check.
function gripDue(log, date) {
  const last = log.findLast(e => e.grip != null);
  return !last || (Date.parse(date) - Date.parse(last.date)) / 864e5 >= 7;
}

// Timer steps for one exercise.
function steps(ex) {
  const out = [];
  for (let set = 1; set <= ex.sets; set++) {
    const tag = ex.sets > 1 ? `Set ${set}/${ex.sets} · ` : '';
    if (ex.mode === 'hold') out.push({ label: `${tag}Hold`, secs: ex.secs });
    if (ex.mode === 'time') out.push({ label: 'Activity', secs: ex.mins * 60 });
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

if (typeof module !== 'undefined') module.exports = { PHASES, PAIN, GAMES_TO_WIN_SET, trafficLight, exercises, todaysPlan, finishSession, gripDue, steps, dose };
