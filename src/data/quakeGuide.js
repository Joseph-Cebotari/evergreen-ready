// What to do during and right after an earthquake. Steps are ordered, and
// some only appear for households they apply to.

export const DURING_STEPS = [
  {
    id: 'drop',
    name: 'Drop',
    detail: 'Get down on your hands and knees before the shaking knocks you down.',
    appliesTo: () => true,
    sources: ['waemd-earthquake'],
  },
  {
    id: 'cover',
    name: 'Cover',
    detail:
      'Get under a sturdy table or desk. If there is none, cover your head and neck with your arms.',
    appliesTo: () => true,
    sources: ['waemd-earthquake', 'ready-earthquakes'],
  },
  {
    id: 'hold-on',
    name: 'Hold on',
    detail: 'Hold on to your cover until the shaking stops, and move with it if it shifts.',
    appliesTo: () => true,
    sources: ['waemd-earthquake'],
  },
];

export const DURING_VARIATIONS = [
  {
    id: 'wheelchair',
    name: 'If you use a wheelchair or walker',
    detail:
      'Lock your wheels and stay seated. Bend forward and cover your head and neck with your arms until the shaking stops.',
    appliesTo: (h) => h.needs.mobility,
    sources: ['redcross-earthquake', 'eca-protect'],
  },
  {
    id: 'bed',
    name: 'If you are in bed',
    detail: 'Stay there. Lie face down and cover your head and neck with a pillow.',
    appliesTo: () => true,
    sources: ['ready-earthquakes', 'eca-protect'],
  },
  {
    id: 'outdoors',
    name: 'If you are outdoors',
    detail:
      'Stay outside. Move to a clear area away from buildings, power lines, and trees, then drop, cover, and hold on.',
    appliesTo: () => true,
    sources: ['ready-earthquakes', 'eca-protect'],
  },
  {
    id: 'driving',
    name: 'If you are driving',
    detail:
      'Pull over away from buildings, trees, overpasses, and utility wires. Set the parking brake and stay in the car until the shaking stops.',
    appliesTo: (h) => h.hasCar,
    sources: ['ready-earthquakes', 'eca-protect'],
  },
  {
    id: 'shore',
    name: 'If you are near the water',
    detail:
      'As soon as you can stand, walk quickly to high ground or inland. A strong or long earthquake is your tsunami warning: do not wait for an official alert.',
    appliesTo: (h) => h.home.coastal,
    sources: ['waemd-tsunami', 'eca-protect'],
  },
];

export const AFTER_STEPS = [
  {
    id: 'tsunami',
    name: 'Get to high ground on foot',
    detail:
      'If the shaking was strong or long, or the water suddenly rises, drops, or roars, go now. Waves can reach the outer coast in as little as 10 to 20 minutes.',
    appliesTo: (h) => h.home.coastal,
    sources: ['waemd-tsunami'],
  },
  {
    id: 'injuries',
    name: 'Check yourself and others for injuries',
    detail: 'Use your first aid kit. Help may take a long time to arrive.',
    appliesTo: () => true,
    sources: ['waemd-kits', 'redcross-earthquake'],
  },
  {
    id: 'aftershocks',
    name: 'Expect aftershocks',
    detail: 'Drop, cover, and hold on every time you feel shaking.',
    appliesTo: () => true,
    sources: ['ready-earthquakes', 'redcross-earthquake'],
  },
  {
    id: 'gas',
    name: 'Check for gas leaks',
    detail:
      'Do not use matches, lighters, appliances, or light switches until you are sure there is no leak. Shut the gas off at the meter only if you smell, see, hear, or suspect escaping gas. Once it is off, leave it off: your gas utility has to turn it back on (Puget Sound Energy: 1-888-225-5773).',
    appliesTo: (h) => h.home.gas !== 'no',
    sources: ['redcross-earthquake', 'pse-gas'],
  },
  {
    id: 'building',
    name: 'Leave if the building is damaged',
    detail: 'Go outside, move away from the building, and do not go back in.',
    appliesTo: () => true,
    sources: ['ready-earthquakes'],
  },
  {
    id: 'text',
    name: 'Text, do not call',
    detail:
      'Save phone calls for emergencies so the lines stay open. Text your out-of-area contact to say you are safe.',
    appliesTo: () => true,
    sources: ['ready-earthquakes', 'redcross-plan'],
  },
  {
    id: 'radio',
    name: 'Turn on your radio',
    detail: 'Listen for official instructions and updates.',
    appliesTo: () => true,
    sources: ['ready-kit'],
  },
];
