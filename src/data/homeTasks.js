// One-time jobs that make the home itself safer. Unlike the kit, these cost
// little or nothing, so they are a good place to start on a tight budget.

export const HOME_TASKS = [
  {
    id: 'secure-tall',
    name: 'Secure tall and heavy furniture',
    detail:
      'Strap bookcases, shelves, and refrigerators to the wall so they cannot tip. Straps, hooks, and latches are sold at hardware stores.',
    appliesTo: () => true,
    sources: ['redcross-earthquake', 'waemd-earthquake'],
  },
  {
    id: 'secure-tv',
    name: 'Secure TVs and things that hang on walls',
    detail: 'Mirrors and picture frames above beds and couches matter most.',
    appliesTo: () => true,
    sources: ['ready-earthquakes'],
  },
  {
    id: 'low-shelves',
    name: 'Move heavy and breakable things to low shelves',
    detail: 'This one costs nothing.',
    appliesTo: () => true,
    sources: ['ready-earthquakes'],
  },
  {
    id: 'water-heater',
    name: 'Strap the water heater',
    detail:
      'A strapped water heater stays upright, and the tank doubles as a source of stored water.',
    appliesTo: (h) => h.home.tenure === 'own',
    sources: ['redcross-earthquake', 'seattle-oem'],
  },
  {
    id: 'water-heater-renter',
    name: 'Ask your landlord whether the water heater is strapped',
    detail:
      'Also ask before drilling into walls to anchor furniture.',
    appliesTo: (h) => h.home.tenure === 'rent',
    sources: ['redcross-earthquake'],
  },
  {
    id: 'gas-shutoff',
    name: 'Find your gas shutoff valve',
    detail:
      'It is usually the first fitting on the pipe coming out of the ground next to the meter. Keep a wrench nearby. Only shut the gas off if you smell, see, hear, or suspect a leak.',
    appliesTo: (h) => h.home.gas === 'yes' && h.home.type !== 'apartment',
    sources: ['pse-gas'],
  },
  {
    id: 'gas-shutoff-apartment',
    name: 'Ask building management where the gas shutoff is',
    detail:
      'In apartments and condos the meter is often shared or locked. Find out who is responsible for shutting it off.',
    appliesTo: (h) => h.home.gas === 'yes' && h.home.type === 'apartment',
    sources: ['pse-gas'],
  },
  {
    id: 'gas-unsure',
    name: 'Find out whether your home uses natural gas',
    detail:
      'Check for a gas meter outside, a gas stove, or a gas line on your utility bill. If you have gas, learn where the shutoff valve is.',
    appliesTo: (h) => h.home.gas === 'unsure',
    sources: ['pse-gas', 'seattle-oem'],
  },
  {
    id: 'safe-spots',
    name: 'Pick a safe spot in every room',
    detail:
      'Under a sturdy table or desk, away from windows. Show everyone in the household.',
    appliesTo: () => true,
    sources: ['waemd-earthquake'],
  },
  {
    id: 'alerts',
    name: 'Turn on earthquake alerts on every phone',
    detail:
      'ShakeAlert can give you a few seconds of warning. Leave Wireless Emergency Alerts on; Android phones need location services on; the free MyShake app works on iPhone and Android.',
    appliesTo: () => true,
    sources: ['waemd-alerts', 'waemd-earthquake'],
  },
  {
    id: 'tsunami-route',
    name: 'Walk your tsunami evacuation route',
    detail:
      'Know the fastest way on foot to high ground from home, work, and school. On the outer coast, waves can arrive in as little as 10 to 20 minutes.',
    appliesTo: (h) => h.home.coastal,
    sources: ['waemd-tsunami'],
  },
  {
    id: 'tsunami-alerts',
    name: 'Set up tsunami alerts',
    detail:
      'A NOAA Weather Radio broadcasts tsunami warnings, and the NVS Tsunami Evacuation app shows hazard zones and pushes alerts to your phone.',
    appliesTo: (h) => h.home.coastal,
    sources: ['waemd-alerts'],
  },
  {
    id: 'support-network',
    name: 'Build a support network',
    detail:
      'Ask family, friends, or neighbors to check on you. Make sure at least one of them can get into your home, knows where your supplies are, and knows how to use your medical equipment or give your medicine.',
    appliesTo: (h) =>
      h.seniors > 0 || h.needs.poweredDevice || h.needs.mobility,
    sources: ['ready-older-adults'],
  },
  {
    id: 'practice',
    name: 'Practice Drop, Cover, and Hold On together',
    detail:
      'The Great Washington ShakeOut drill is held every year on the third Thursday of October.',
    appliesTo: () => true,
    sources: ['waemd-earthquake'],
  },
];
