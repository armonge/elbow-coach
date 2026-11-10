// Rehab rules: phases, daily load, progression. No DOM here so test.js can run it in Node.

const GAMES_TO_WIN_SET = 6;

// Credits for img/ files (title, author, source, license). All are resized JPGs of the originals.
// AI pictures have no source page or license, so the caption shows them without links.
const BRUCE_BLAUS = { by: 'BruceBlaus', byUrl: 'https://commons.wikimedia.org/wiki/User:BruceBlaus', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const IMAGES = {
  'extensor-stretch.jpg': { ...BRUCE_BLAUS, title: 'Exercise Wrist Extensor Stretch', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Wrist_Extensor_Stretch.png' },
  'flexor-stretch.jpg': { ...BRUCE_BLAUS, title: 'Exercise Wrist Flexor Stretch', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Wrist_Flexor_Stretch.png' },
  'wrist-curls.jpg': { ...BRUCE_BLAUS, title: 'Exercise Wrist Curls', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Wrist_Curls.png' },
  'forearm-rotation.jpg': { ...BRUCE_BLAUS, title: 'Exercise Forearm Rotation', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Forearm_Rotation.png' },
  'finger-extensions.jpg': { ...BRUCE_BLAUS, title: 'Exercise Finger Extensions', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Finger_Extensions.png' },
  'wrist-extension.jpg': {
    title: 'Wrist curls',
    src: 'https://commons.wikimedia.org/wiki/File:Wrist_curls.jpg',
    by: 'Hipnotic88',
    byUrl: 'https://commons.wikimedia.org/wiki/User:Hipnotic88',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
  },
  'isometric-extension.jpg': { title: 'Isometric Wrist Extension', by: 'Google Gemini (AI-generated)' },
  'isometric-flexion.jpg': { title: 'Isometric Wrist Flexion', by: 'Google Gemini (AI-generated)' },
  'gentle-grip.jpg': { title: 'Gentle Grip', by: 'Google Gemini (AI-generated)' },
  'band-row.jpg': { title: 'Band Row', by: 'Google Gemini (AI-generated)' },
};

// img: file in img/, credited from IMAGES. Medial overrides it (the BruceBlaus curl picture is palm up, so it's medial only).
// move: true = a 'hold' exercise where you keep moving (timer says Move, dose has no 'hold').
// mode: 'hold' = isometric seconds, 'tempo' = reps at [up, down] seconds, 'time' = minutes of activity
const PHASES = [
  {
    name: 'Acute Phase',
    goal: 'Calm the tendon. Isometrics load it gently without movement. The benefit builds over weeks.',
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
        img: 'isometric-extension.jpg',
        mode: 'hold',
        sets: 5,
        secs: 45,
        cues: ['Forearm on a table, palm down, wrist off the edge', 'Push the back of the hand up into your other hand', 'Start light, about 30–40% effort, no movement', 'Pain up to 3/10 is OK'],
        medial: {
          name: 'Isometric wrist flexion',
          img: 'isometric-flexion.jpg',
          cues: ['Forearm on a table, palm up, wrist off the edge', 'Push the palm up into your other hand', 'Start light, about 30–40% effort, no movement', 'Pain up to 3/10 is OK'],
        },
      },
      {
        kind: 'Activity',
        name: 'Gentle grip, elbow bent',
        img: 'gentle-grip.jpg',
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
        img: 'wrist-extension.jpg',
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
        img: 'finger-extensions.jpg',
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
        img: 'band-row.jpg',
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
        cues: [
          'Easy version only, e.g. big holds, light tools, short rallies',
          'Climbing: easy problems on jugs only, no crimps, pockets or dynos',
          'Loose grip, relax between efforts',
          'Stop at the first twinge',
        ],
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
        img: 'wrist-extension.jpg',
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
        kind: 'Strength',
        name: 'Firm grip, elbow bent',
        img: 'gentle-grip.jpg',
        mode: 'hold',
        sets: 3,
        secs: 10,
        cues: ['Squeeze a firm ball or hand gripper, elbow bent at 90°', 'Medium effort, about 60%', 'Pain up to 3/10 is OK'],
      },
      {
        kind: 'Shoulder',
        name: 'Band row',
        img: 'band-row.jpg',
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
        cues: [
          'Skip your hardest moves for now (small crimps, heavy lifts, slices)',
          'Climbing: moderate problems, small holds open-handed, still no full crimps or campusing',
          'Check grip pressure every few balls',
          'Stop at the first sharp pain',
        ],
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
        cues: ['Hold a hammer by the handle, elbow at 90°', 'Rotate palm up, then palm down', 'To make it easier, hold the handle nearer the metal end'],
      },
      {
        kind: 'Strength',
        name: 'Heavy slow wrist extension',
        img: 'wrist-extension.jpg',
        mode: 'tempo',
        sets: 2,
        reps: 8,
        tempo: [3, 3],
        cues: ['Pick a weight where 8 reps is hard', '3 seconds up, 3 seconds down', 'Continue this 2–3 times a week after rehab'],
        medial: {
          name: 'Heavy slow wrist flexion',
          img: 'wrist-curls.jpg',
          cues: ['Forearm supported, palm up', 'Pick a weight where 8 reps is hard', '3 seconds up, 3 seconds down', 'Continue this 2–3 times a week after rehab'],
        },
      },
      {
        kind: 'Strength',
        name: 'Firm grip, elbow straight',
        mode: 'hold',
        sets: 3,
        secs: 10,
        cues: [
          'Arm straight out in front, palm down',
          'Squeeze a firm ball or hand gripper, about 60–70% effort',
          'Climbers: hang from big jugs, arms straight, feet on the floor taking some weight',
          'Pain up to 3/10 is OK',
        ],
      },
      {
        kind: 'Shoulder',
        name: 'Band row',
        img: 'band-row.jpg',
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
        cues: ['Start with 5–10 minutes at an easy level', 'Build to full intensity over the session', 'Keep doing strength work 2–3 times a week'],
      },
    ],
  },
];

// Wrist stability for lax wrists (both sides, click in the middle of the back of the wrist).
// Muscle control and strength stabilize the carpal bones; ligaments don't tighten with training.
// Order: feel and hold (proprioception), stabilizers (dart-thrower plane, ECU/FCU), mid-range strength, reaction, climbing.
// No passive stretching: lax wrists need control, not more range. The first exercise is gentle mid-range movement,
// because red days and the stretch break use it.
const BOTH = 'Both wrists, one after the other';
const MID = 'Stay in the middle of the range: never force the wrist fully bent or fully back';
const CIRCLES = {
  kind: 'Warm-up',
  name: 'Slow wrist circles, mid-range',
  mode: 'hold',
  move: true,
  sets: 2,
  secs: 30,
  cues: [BOTH, 'Elbow bent, forearm still', 'Draw small, slow circles with the hand, both directions', MID, 'A soft click with no pain is OK. Make the circle smaller if it clicks with pain'],
};
const WRIST_PHASES = [
  {
    name: 'Feel and Hold',
    goal: 'Teach the wrist muscles to feel and hold the joint. Use light effort and full attention.',
    exercises: [
      CIRCLES,
      {
        kind: 'Control',
        name: 'Wrist position matching, eyes closed',
        mode: 'tempo',
        sets: 2,
        reps: 8,
        tempo: [3, 3],
        cues: [
          BOTH,
          'Forearm on a table, hand off the edge',
          'Eyes closed: move the wrist to a target (for example, halfway back), and hold it',
          'Open your eyes and check. Then return to straight',
          'Change the target each rep: back, forward, thumb side, little-finger side',
        ],
      },
      {
        kind: 'Strength',
        name: 'Isometric holds, 4 directions',
        mode: 'hold',
        sets: 4,
        secs: 30,
        cues: [
          BOTH,
          'Wrist straight. Push into your other hand, no movement',
          'One set per direction: back of hand, palm, thumb side, little-finger side',
          'About 30–40% effort',
          'Pain up to 3/10 is OK',
        ],
      },
      {
        kind: 'Control',
        name: 'Ball roll on a wall',
        mode: 'hold',
        move: true,
        sets: 2,
        secs: 30,
        cues: [BOTH, 'Press a ball against a wall with the palm, arm straight at shoulder height', 'Roll small circles and lines, wrist steady', 'Light pressure. Push harder as it gets easy'],
      },
    ],
  },
  {
    name: 'Stabilizers',
    goal: 'Strengthen the muscles that hold the small wrist bones in place.',
    exercises: [
      CIRCLES,
      {
        kind: 'Strength',
        name: "Dart thrower's motion with a band",
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [2, 3],
        cues: [
          BOTH,
          'Hold a light band, forearm on a table, thumb up',
          'Move the hand diagonally: from back-and-thumb side to forward-and-little-finger side, like throwing a dart',
          'This is the most stable path of the wrist',
          MID,
        ],
      },
      {
        kind: 'Strength',
        name: 'Side wrist lifts (1 kg)',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [2, 3],
        cues: [
          BOTH,
          'Stand with the arm at your side. Hold the dumbbell at one end, like a hammer',
          'Thumb side: the weight is in front of the hand. Raise it toward the ceiling',
          'Little-finger side: hold the weight behind the hand. Raise it toward the ceiling',
          'Lower slowly',
          MID,
        ],
      },
      {
        kind: 'Strength',
        name: 'Forearm rotation (1 kg, short lever)',
        img: 'forearm-rotation.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: [BOTH, 'Elbow at 90° by your side, hold the dumbbell at one end', 'Rotate palm up, then palm down, slowly', 'Keep the wrist straight. Turn the forearm, not the wrist'],
      },
    ],
  },
  {
    name: 'Mid-Range Strength',
    goal: 'Build strength in all four directions, without the end of the range.',
    exercises: [
      CIRCLES,
      {
        kind: 'Strength',
        name: 'Slow wrist extension',
        img: 'wrist-extension.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: [BOTH, 'Forearm supported, palm down', 'Start with 1 kg. Use a heavier weight when 10 reps are easy', 'Lower only to a little below straight', MID],
      },
      {
        kind: 'Strength',
        name: 'Slow wrist flexion',
        img: 'wrist-curls.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: [BOTH, 'Forearm supported, palm up', 'Start with 1 kg. Use a heavier weight when 10 reps are easy', 'Lower only to a little below straight', MID],
      },
      {
        kind: 'Strength',
        name: 'Side wrist lifts (1 kg)',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [3, 3],
        cues: [
          BOTH,
          'Hold the dumbbell at one end, like a hammer',
          'One set toward the thumb side, one set toward the little-finger side',
          'To make it harder, hold the handle further from the weight',
          MID,
        ],
      },
      {
        kind: 'Strength',
        name: 'Bar twist (FlexBar)',
        mode: 'tempo',
        sets: 2,
        reps: 12,
        tempo: [2, 3],
        cues: [
          'Hold the bar in front of you with both hands, wrists straight',
          'Twist the bar as if you wring a wet towel',
          'Let it untwist slowly',
          'Change the direction each set',
          'Keep the wrists straight. Turn the forearms, not the wrists',
        ],
      },
    ],
  },
  {
    name: 'Reaction',
    goal: 'Teach the wrist to stabilize fast, like when your weight shifts on a hold.',
    exercises: [
      CIRCLES,
      {
        kind: 'Control',
        name: 'Bottoms-up kettlebell hold',
        mode: 'hold',
        sets: 3,
        secs: 20,
        cues: [
          BOTH,
          'Use your lightest kettlebell. Hold it by the handle, bell up, elbow at 90°',
          'Squeeze the handle and keep the wrist straight',
          'The bell tries to fall over. Keep it upright with small corrections',
          'Too hard? Hold it bell down, by the handle',
        ],
      },
      {
        kind: 'Control',
        name: 'FlexBar shake',
        mode: 'hold',
        move: true,
        sets: 3,
        secs: 20,
        cues: [BOTH, 'Hold the bar in the middle, arm out in front', 'Shake it fast so the ends move up and down', 'The wrist stays straight and still. Only the bar moves'],
      },
      {
        kind: 'Control',
        name: 'Kneeling weight shifts on the hands',
        mode: 'hold',
        move: true,
        sets: 3,
        secs: 30,
        cues: [
          'On hands and knees, hands under the shoulders',
          'Slowly shift your weight forward, back and side to side',
          'Grip the floor with the fingertips',
          'If the back of the wrist pinches, do it on your fists',
        ],
      },
      {
        kind: 'Strength',
        name: 'Slow wrist extension',
        img: 'wrist-extension.jpg',
        mode: 'tempo',
        sets: 2,
        reps: 10,
        tempo: [3, 3],
        cues: [BOTH, 'Forearm supported, palm down', 'Use the weight from the last stage, or a heavier one', MID],
      },
    ],
  },
  {
    name: 'Climbing Transfer',
    goal: 'Hold the wrist steady on the grips that make it shift. Continue the strength work after you finish the plan.',
    exercises: [
      CIRCLES,
      {
        kind: 'Control',
        name: 'Bottoms-up kettlebell hold',
        mode: 'hold',
        sets: 3,
        secs: 30,
        cues: [BOTH, 'Bell up, elbow at 90°, wrist straight', 'Make it harder: slowly push it overhead, then lower it', 'Continue this exercise 2–3 times a week after you finish the plan'],
      },
      {
        kind: 'Climbing',
        name: 'Pinch hold, feet on',
        mode: 'hold',
        sets: 4,
        secs: 10,
        cues: [
          BOTH,
          'Pinch a wide hold or a pinch block',
          'Keep your feet on the floor to take some of the weight',
          'Lock the wrist straight before you load it',
          'Add weight only when the wrist stays still',
        ],
      },
      {
        kind: 'Climbing',
        name: 'Sloper hang, feet on',
        mode: 'hold',
        sets: 4,
        secs: 10,
        cues: [
          BOTH,
          'Put an open hand on a sloper. Keep your feet on the floor or on a low step',
          'Keep the wrist straight or a little bent forward, never bent back',
          'Stop the set if it clicks with pain',
        ],
      },
      {
        kind: 'Strength',
        name: 'Forearm rotation (longer lever)',
        img: 'forearm-rotation.jpg',
        mode: 'tempo',
        sets: 2,
        reps: 10,
        tempo: [3, 3],
        cues: [BOTH, 'Elbow at 90°. Hold a dumbbell or a hammer at the end, far from the weight', 'Rotate palm up, then palm down, slowly', 'Keep the wrist straight'],
      },
      {
        kind: 'Activity',
        name: 'Bouldering session',
        mode: 'time',
        sets: 1,
        mins: 30,
        cues: [
          'Start with 10 minutes of easy climbing',
          'On slopers, pinches and side pulls, lock the wrist before you pull',
          'If a move clicks with pain, try it again with a straighter wrist, or skip it today',
        ],
      },
    ],
  },
];
const PLANS = { elbow: PHASES, wrist: WRIST_PHASES };

// Pain right after an exercise, judged on the spot against the 3/10 limit in the cues: 0 = fine, 1 = sore, 2 = much worse.
const PAIN = ['Fine (pain 3/10 or less)', 'Sore, above 3/10', 'Much worse (sharp pain)'];

// Morning stiffness 0–10 plus yesterday's result gives today's light.
function trafficLight(stiffness, lastEntry) {
  let light = stiffness <= 2 ? 'green' : stiffness <= 5 ? 'amber' : 'red';
  const flared = lastEntry?.results?.includes(2);
  if (flared && light === 'green') light = 'amber';
  return light;
}

// side: 'lateral' (outer elbow, wrist extensors) or 'medial' (inner elbow, wrist flexors).
// Medial swaps in an exercise's `medial` name and cues; exercises without one suit both sides.
// plan: key of PLANS. The wrist plan has no medial overrides.
function exercises(phase, side = 'lateral', plan = 'elbow') {
  return PLANS[plan][phase].exercises.map(({ medial, ...e }) => (side === 'medial' && medial ? { ...e, ...medial } : e));
}

// green = full dose, amber = one set less, red = only the stretch
function todaysPlan(phase, light, side, plan) {
  const ex = exercises(phase, side, plan);
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
  if (s.games >= GAMES_TO_WIN_SET && s.phase < PLANS[s.plan || 'elbow'].length - 1) {
    s.phase += 1;
    s.games = 0;
    entry.setWon = true;
  }
  return s;
}

// Rebuilds stage and good days from a log, e.g. to redo today without its entry.
function replay(state, log) {
  return log.reduce(finishSession, { ...state, phase: 0, games: 0, log: [] });
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
    if (ex.mode === 'hold') out.push({ label: `${tag}${ex.move ? 'Move' : 'Hold'}`, secs: ex.secs });
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
  if (ex.mode === 'hold') return `${ex.sets} × ${ex.secs} s${ex.move ? '' : ' hold'}`;
  if (ex.mode === 'time') return `${ex.mins} min`;
  return `${ex.sets} × ${ex.reps} · tempo ${ex.tempo[0]} s up / ${ex.tempo[1]} s down`;
}

if (typeof module !== 'undefined') module.exports = { PHASES, PLANS, IMAGES, PAIN, GAMES_TO_WIN_SET, trafficLight, exercises, todaysPlan, finishSession, replay, gripDue, steps, dose };
