// Rehab rules: phases, daily load, progression. No DOM here so test.js can run it in Node.

const GAMES_TO_WIN_SET = 6;

// Credits for img/ files (title, author, source, license). All are resized images of the originals.
// AI pictures have no source page or license, so the caption shows them without links.
const BRUCE_BLAUS = { by: 'BruceBlaus', byUrl: 'https://commons.wikimedia.org/wiki/User:BruceBlaus', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const IMAGES = {
  'extensor-stretch.jpg': { ...BRUCE_BLAUS, title: 'Exercise Wrist Extensor Stretch', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Wrist_Extensor_Stretch.png' },
  'flexor-stretch.jpg': { ...BRUCE_BLAUS, title: 'Exercise Wrist Flexor Stretch', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Wrist_Flexor_Stretch.png' },
  'wrist-curls.jpg': { ...BRUCE_BLAUS, title: 'Exercise Wrist Curls', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Wrist_Curls.png' },
  'forearm-rotation-db.jpg': { title: 'Forearm Rotation', by: 'Google Gemini (AI-generated)' },
  'forearm-rotation-pan.jpg': { title: 'Forearm Rotation (Cast-Iron Pan)', by: 'Google Gemini (AI-generated)' },
  'finger-extensions.jpg': { ...BRUCE_BLAUS, title: 'Exercise Finger Extensions', src: 'https://commons.wikimedia.org/wiki/File:Exercise_Finger_Extensions.png' },
  'wrist-extension.jpg': { title: 'Wrist Extension', by: 'Google Gemini (AI-generated)' },
  'firm-grip-straight.jpg': { title: 'Firm Grip, Elbow Straight', by: 'Google Gemini (AI-generated)' },
  'firm-grip-straight-gripper.jpg': { title: 'Firm Grip, Elbow Straight (Hand Gripper)', by: 'Google Gemini (AI-generated)' },
  'firm-grip-straight-hang.jpg': { title: 'Firm Grip, Elbow Straight (Jug Hang)', by: 'Google Gemini (AI-generated)' },
  'isometric-extension.jpg': { title: 'Isometric Wrist Extension', by: 'Google Gemini (AI-generated)' },
  'isometric-flexion.jpg': { title: 'Isometric Wrist Flexion', by: 'Google Gemini (AI-generated)' },
  'firm-grip.jpg': { title: 'Firm Grip', by: 'Google Gemini (AI-generated)' },
  'firm-grip-ball.jpg': { title: 'Firm Grip (Firm Ball)', by: 'Google Gemini (AI-generated)' },
  'gentle-grip.jpg': { title: 'Gentle Grip', by: 'Google Gemini (AI-generated)' },
  'gentle-grip-towel.jpg': { title: 'Gentle Grip (Rolled Towel)', by: 'Google Gemini (AI-generated)' },
  'pinch-book.jpg': { title: 'Pinch Hold', by: 'Google Gemini (AI-generated)' },
  'band-row.jpg': { title: 'Band Row', by: 'Google Gemini (AI-generated)' },
  'thumb-glides.jpg': { title: 'Gentle Thumb Glides', by: 'Google Gemini (AI-generated)' },
  'isometric-thumb-extension.jpg': { title: 'Isometric Thumb Extension', by: 'Google Gemini (AI-generated)' },
  'isometric-radial-lift.jpg': { title: 'Isometric Wrist Radial Lift', by: 'Google Gemini (AI-generated)' },
  'isometric-thumb-abduction.jpg': { title: 'Isometric Thumb Abduction', by: 'Google Gemini (AI-generated)' },
  'radial-lift.jpg': { title: 'Wrist Radial Lift', by: 'Google Gemini (AI-generated)' },
  'radial-lift-bottle.jpg': { title: 'Wrist Radial Lift (Water Bottle)', by: 'Google Gemini (AI-generated)' },
  'banded-thumb-lift.jpg': { title: 'Banded Thumb Lift', by: 'Google Gemini (AI-generated)' },
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
        id: 'gentle-grip',
        kind: 'Activity',
        name: 'Gentle grip, elbow bent',
        mode: 'hold',
        sets: 3,
        secs: 20,
        variants: [
          { id: 'ball', label: 'Soft ball', img: 'gentle-grip.jpg', cues: ['Squeeze a soft ball, elbow bent at 90°', 'Light effort, about 30%', 'Pain up to 3/10 is OK'] },
          { id: 'towel', label: 'Rolled towel', img: 'gentle-grip-towel.jpg', cues: ['Squeeze a rolled towel, elbow bent at 90°', 'Light effort, about 30%', 'Pain up to 3/10 is OK'] },
        ],
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
        id: 'firm-grip',
        kind: 'Strength',
        name: 'Firm grip, elbow bent',
        mode: 'hold',
        sets: 3,
        secs: 10,
        variants: [
          { id: 'gripper', label: 'Hand gripper', img: 'firm-grip.jpg', cues: ['Squeeze a hand gripper, elbow bent at 90°', 'Medium effort, about 60%', 'Pain up to 3/10 is OK'] },
          { id: 'ball', label: 'Firm ball', img: 'firm-grip-ball.jpg', cues: ['Squeeze a firm ball, elbow bent at 90°', 'Medium effort, about 60%', 'Pain up to 3/10 is OK'] },
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
        name: 'Your sport or task at 70%',
        mode: 'time',
        sets: 1,
        mins: 20,
        cues: [
          'Skip your hardest moves for now (small crimps, heavy lifts, slices)',
          'Climbing: moderate problems, small holds open-handed, still no full crimps or campusing',
          'Check your grip pressure every few minutes',
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
        id: 'forearm-rotation',
        kind: 'Strength',
        name: 'Forearm rotation',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        variants: [
          {
            id: 'dumbbell',
            label: 'Dumbbell',
            name: 'Forearm rotation (dumbbell)',
            img: 'forearm-rotation-db.jpg',
            cues: [
              'Forearm on a table or elbow at 90° by your side. Hold a 1–3 kg dumbbell at one end',
              'Rotate palm up, then palm down slowly',
              'To make it easier, hold the dumbbell closer to the middle',
            ],
          },
          {
            id: 'pan',
            label: 'Cast-iron pan',
            name: 'Forearm rotation (cast-iron pan)',
            img: 'forearm-rotation-pan.jpg',
            cues: [
              'Forearm on a table or elbow at 90° by your side. Hold a cast-iron pan by the handle',
              'Rotate palm up, then palm down slowly',
              'Slide your hand closer to the pan to make it easier, or toward the end of the handle to make it harder',
            ],
          },
        ],
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
        id: 'firm-grip-straight',
        kind: 'Strength',
        name: 'Firm grip, elbow straight',
        mode: 'hold',
        sets: 3,
        secs: 10,
        variants: [
          { id: 'ball', label: 'Firm ball', img: 'firm-grip-straight.jpg', cues: ['Arm straight out in front, palm down', 'Squeeze a firm ball, about 60–70% effort', 'Pain up to 3/10 is OK'] },
          {
            id: 'gripper',
            label: 'Hand gripper',
            img: 'firm-grip-straight-gripper.jpg',
            cues: ['Arm straight out in front, palm down', 'Squeeze a hand gripper, about 60–70% effort', 'Pain up to 3/10 is OK'],
          },
          {
            id: 'jug-hang',
            label: 'Jug hang',
            img: 'firm-grip-straight-hang.jpg',
            cues: ['Hang from big climbing jugs, arms straight', 'Keep feet on the floor taking some weight (about 60–70% effort)', 'Pain up to 3/10 is OK'],
          },
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

// De Quervain's tenosynovitis: irritation of the first dorsal compartment tendons (APL and EPB) on the thumb side of the wrist.
// Order: calm and glide (gentle glides + light isometrics), firmer isometrics and control, eccentric loading, strength and pinch, daily proofing.
// Evidence: multimodal care with splinting, activity modification and progressive tendon loading (Cavaleri et al. 2016, J Hand Ther;
// Challoumas et al. 2023, JAMA Netw Open). Isometric thumb extension dose (5x20 s daily, building from ~25% to ~60% effort) follows
// the randomized feasibility trial (McBain et al. 2023, Hand Therapy). Eccentric radial deviation and thumb loading rebuild tendon
// capacity once acute irritation settles (Rabin et al. 2015, JOSPT; Papa 2012).
// No passive Finkelstein stretching (tucking the thumb and bending toward the pinky compresses the irritated tendons in their tunnel).
// The first exercise is gentle active thumb glides, because red days and the glide break (/#stretch) use it.
const PAIN_OK = 'Pain up to 3/10 is OK';
const GLIDES = {
  kind: 'Warm-up',
  name: 'Gentle thumb glides',
  img: 'thumb-glides.jpg',
  mode: 'hold',
  move: true,
  sets: 2,
  secs: 30,
  cues: [
    'Rest the forearm on a table, palm flat, wrist straight',
    'Slowly lift the thumb straight up off the table, pause a second, then lower it',
    'Next, turn the palm up and gently touch the thumb tip to each fingertip in turn',
    'Keep the wrist straight and stay in the pain-free range. Never pull the thumb into the palm while bending the wrist toward the pinky',
  ],
};
const THUMB_PHASES = [
  {
    name: 'Calm & Glide',
    goal: 'Ease stiffness and calm the tendons at the base of the thumb. Gentle glides keep them moving; light isometrics load them without friction. After a steroid shot, stick to Glide break only for the first 2 weeks.',
    exercises: [
      GLIDES,
      {
        kind: 'Strength',
        name: 'Isometric thumb extension (light)',
        img: 'isometric-thumb-extension.jpg',
        mode: 'hold',
        sets: 5,
        secs: 20,
        cues: [
          'Rest the forearm on a table, thumb pointing up, wrist straight',
          'Place two fingers of your other hand against the back of the thumb',
          'Gently push the thumb back into your fingers, with no movement',
          'Start light, about 25% effort. Keep the wrist straight',
          PAIN_OK,
        ],
      },
      {
        kind: 'Strength',
        name: 'Isometric wrist radial lift (light)',
        img: 'isometric-radial-lift.jpg',
        mode: 'hold',
        sets: 3,
        secs: 20,
        cues: [
          'Forearm on a table, thumb pointing up, hand off the edge, wrist straight',
          'Place your other hand over the thumb side of the hand',
          'Gently push upward toward the ceiling into your other hand, no movement',
          'Light effort, about 25–30%. Keep the thumb relaxed',
          PAIN_OK,
        ],
      },
    ],
  },
  {
    name: 'Isometrics & Control',
    goal: 'Build steady load tolerance with firmer isometric holds and gentle band work.',
    exercises: [
      GLIDES,
      {
        kind: 'Strength',
        name: 'Isometric thumb extension (firm)',
        img: 'isometric-thumb-extension.jpg',
        mode: 'hold',
        sets: 5,
        secs: 20,
        cues: [
          'Forearm on a table, thumb pointing up, wrist straight',
          'Push the back of the thumb into two fingers of your other hand, no movement',
          'Build to a firm effort, about 50–60%, as long as pain stays 3/10 or less',
          'Keep the wrist straight and the shoulder relaxed',
        ],
      },
      {
        kind: 'Strength',
        name: 'Isometric thumb abduction',
        img: 'isometric-thumb-abduction.jpg',
        mode: 'hold',
        sets: 4,
        secs: 20,
        cues: [
          'Rest the hand palm up on a table, wrist straight',
          'Place your other hand over the thumb side of the thumb',
          'Push the thumb straight up toward the ceiling into your other hand, no movement',
          'Moderate effort, about 40–50%',
          PAIN_OK,
        ],
      },
      {
        kind: 'Strength',
        name: 'Finger and thumb spread (rubber band)',
        img: 'finger-extensions.jpg',
        mode: 'tempo',
        sets: 2,
        reps: 12,
        tempo: [1, 3],
        cues: ['Loop a light rubber band around the fingertips and thumb, wrist straight', 'Spread the fingers and thumb open, then close slowly over 3 seconds', 'Keep the movement smooth', PAIN_OK],
      },
    ],
  },
  {
    name: 'Eccentric Loading',
    goal: 'Load the thumb-side tendons as they lengthen slowly. Slow lowering builds tendon capacity.',
    exercises: [
      GLIDES,
      {
        id: 'eccentric-radial-lift',
        kind: 'Strength',
        name: 'Eccentric radial lift (0.5–1 kg)',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [1, 4],
        variants: [
          {
            id: 'dumbbell',
            label: 'Dumbbell',
            img: 'radial-lift.jpg',
            cues: [
              'Forearm on a table, thumb pointing up, hand off the edge',
              'Hold a light dumbbell (0.5–1 kg) in the middle',
              'Use your other hand to lift the thumb side up toward the ceiling',
              "Let go and lower slowly over 4 seconds, stopping at straight (don't drop all the way toward the pinky)",
              PAIN_OK,
            ],
          },
          {
            id: 'bottle',
            label: 'Water bottle',
            img: 'radial-lift-bottle.jpg',
            cues: [
              'Forearm on a table, thumb pointing up, hand off the edge',
              'Hold a small water bottle (0.5–1 L) in the middle',
              'Use your other hand to lift the thumb side up toward the ceiling',
              "Let go and lower slowly over 4 seconds, stopping at straight (don't drop all the way toward the pinky)",
              PAIN_OK,
            ],
          },
        ],
      },
      {
        kind: 'Strength',
        name: 'Eccentric thumb lift with a band',
        img: 'banded-thumb-lift.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [1, 4],
        cues: [
          'Forearm on a table, palm up, wrist straight. Loop a light band around the thumb and hold the other end down on the table',
          'Lift the thumb up and away from the palm (or anchor the band under a book and help with your other hand)',
          'Resist the band as the thumb returns slowly over 4 seconds',
          PAIN_OK,
        ],
      },
      {
        id: 'gentle-grip',
        kind: 'Strength',
        name: 'Gentle grip, elbow bent',
        mode: 'hold',
        sets: 3,
        secs: 15,
        variants: [
          {
            id: 'ball',
            label: 'Soft ball',
            img: 'gentle-grip.jpg',
            cues: ['Squeeze a soft ball, elbow bent at 90°, wrist straight', 'Light effort, about 30%. Keep the wrist from tilting toward the pinky', PAIN_OK],
          },
          {
            id: 'towel',
            label: 'Rolled towel',
            img: 'gentle-grip-towel.jpg',
            cues: ['Squeeze a rolled towel, elbow bent at 90°, wrist straight', 'Light effort, about 30%. Keep the wrist from tilting toward the pinky', PAIN_OK],
          },
        ],
      },
    ],
  },
  {
    name: 'Strength',
    goal: 'Build full thumb, wrist and pinch strength with slow, controlled resistance.',
    exercises: [
      GLIDES,
      {
        kind: 'Strength',
        name: 'Slow radial lift (1–2 kg)',
        img: 'radial-lift.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: [
          'Forearm on a table, thumb pointing up, hand off the edge',
          'Hold a light dumbbell (1–2 kg). Lift the thumb side up over 3 seconds, lower over 3 seconds',
          "Stay controlled near the bottom — don't drop sharply toward the pinky",
          'Raise the weight slightly when 10 reps feel easy',
        ],
      },
      {
        kind: 'Strength',
        name: 'Slow thumb spread (rubber band)',
        img: 'finger-extensions.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 12,
        tempo: [2, 3],
        cues: ['Loop a thicker rubber band (or two bands) around the fingers and thumb', 'Open wide over 2 seconds, close slowly over 3 seconds', 'Keep the wrist straight'],
      },
      {
        kind: 'Strength',
        name: 'Pinch hold with a book',
        img: 'pinch-book.jpg',
        mode: 'hold',
        sets: 3,
        secs: 15,
        cues: [
          'Stand with the arm at your side. Pinch a light-to-medium book between the flat pad of the thumb and the fingers',
          'Keep the thumb tip slightly bent (not collapsed flat) and the wrist straight',
          'Start with a light book; use a heavier one as 15 seconds gets easy',
        ],
      },
      {
        kind: 'Strength',
        name: 'Slow wrist extension (1–2 kg)',
        img: 'wrist-extension.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: ['Forearm on a table, palm down, wrist off the edge', 'Lift the back of the hand over 3 seconds, lower over 3 seconds', 'Keep the grip relaxed, not clamped tight'],
      },
    ],
  },
  {
    name: 'Daily Proofing',
    goal: 'Rebuild endurance for everyday lifting, gripping and pinching, and keep the tendons strong.',
    exercises: [
      GLIDES,
      {
        kind: 'Strength',
        name: 'Slow radial lift, longer lever',
        img: 'radial-lift.jpg',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        cues: [
          'Forearm on a table, thumb pointing up, hand off the edge',
          'Use a slightly heavier dumbbell held in the middle, or hold a lighter one closer to one end',
          '3 seconds up, 3 seconds down. Continue 2–3 times a week after you finish the plan',
        ],
      },
      {
        id: 'forearm-rotation',
        kind: 'Strength',
        name: 'Forearm rotation',
        mode: 'tempo',
        sets: 3,
        reps: 10,
        tempo: [3, 3],
        variants: [
          {
            id: 'dumbbell',
            label: 'Dumbbell',
            name: 'Forearm rotation (dumbbell)',
            img: 'forearm-rotation-db.jpg',
            cues: [
              'Forearm on a table or elbow at 90° by your side. Hold a light dumbbell (0.5–2 kg) at one end',
              'Rotate palm up, then palm down slowly',
              'To make it easier, hold the dumbbell closer to the middle',
            ],
          },
          {
            id: 'pan',
            label: 'Cast-iron pan',
            name: 'Forearm rotation (cast-iron pan)',
            img: 'forearm-rotation-pan.jpg',
            cues: [
              'Forearm on a table or elbow at 90° by your side. Hold a light frying or cast-iron pan by the handle',
              'Rotate palm up, then palm down slowly',
              'Slide your hand closer to the pan to make it easier, or toward the end of the handle to make it harder',
            ],
          },
        ],
      },
      {
        id: 'firm-grip',
        kind: 'Strength',
        name: 'Firm grip, elbow bent',
        mode: 'hold',
        sets: 3,
        secs: 10,
        variants: [
          {
            id: 'gripper',
            label: 'Hand gripper',
            img: 'firm-grip.jpg',
            cues: ['Squeeze a hand gripper, elbow bent at 90°, wrist straight', 'Medium effort, about 60%. Keep the wrist straight, not bent toward the pinky', PAIN_OK],
          },
          {
            id: 'ball',
            label: 'Firm ball',
            img: 'firm-grip-ball.jpg',
            cues: ['Squeeze a firm ball, elbow bent at 90°, wrist straight', 'Medium effort, about 60%. Keep the wrist straight, not bent toward the pinky', PAIN_OK],
          },
        ],
      },
      {
        kind: 'Activity',
        name: 'Everyday task practice',
        mode: 'time',
        sets: 1,
        mins: 15,
        cues: [
          'Practice the tasks that used to hurt — shaping dough, pouring a kettle, lifting or cooking — with straight wrists',
          'Press dough with flat palms or knuckles instead of pinching with the thumb, and lift heavy trays or peels with both hands, palms up',
          'Build back to full shifts in steps, take short shake-out breaks, and stop if you feel sharp pain at the base of the thumb',
        ],
      },
    ],
  },
];
const PLANS = { elbow: PHASES, thumb: THUMB_PHASES };

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
// plan: key of PLANS. The thumb plan has no medial overrides.
// choices: optional map of exercise id -> chosen variant id (defaults to the first variant).
function exercises(phase, side = 'lateral', plan = 'elbow', choices = {}) {
  return PLANS[plan][phase].exercises.map(({ medial, variants, ...e }) => {
    const base = side === 'medial' && medial ? { ...e, ...medial } : e;
    if (!variants) return base;
    const chosen = variants.find(v => v.id === choices?.[e.id]) || variants[0];
    const { id: variant, label: _, ...fields } = chosen;
    return { ...base, ...fields, img: chosen.img, variant, variants: variants.map(({ id, label }) => ({ id, label })) };
  });
}

// green = full dose, amber = one set less, red = only the stretch
function todaysPlan(phase, light, side, plan, choices) {
  const ex = exercises(phase, side, plan, choices);
  if (light === 'red') return [ex[0]];
  if (light === 'amber') return ex.map(e => ({ ...e, sets: Math.max(1, e.sets - 1) }));
  return ex;
}

// Returns a new state after a finished session.
function finishSession(state, entry) {
  const e = { ...entry };
  delete e.setWon;
  const s = { ...state, log: [...state.log, e] };
  const flare = e.results.includes(2);
  const clean = e.light === 'green' && e.results.every(r => r === 0);
  const lastPhase = PLANS[s.plan || 'elbow'].length - 1;
  if (flare) s.games = Math.max(0, s.games - 1);
  else if (clean) s.games = Math.min(GAMES_TO_WIN_SET, s.games + 1);
  if (s.games >= GAMES_TO_WIN_SET && s.phase < lastPhase) {
    s.phase += 1;
    s.games = 0;
    e.setWon = true;
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
