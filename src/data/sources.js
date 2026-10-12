// Every recommendation in the app points back to one of these official sources.
// Keeping them in one registry means a link only ever has to be fixed in one place.

export const SOURCES = {
  'waemd-kits': {
    org: 'Washington Emergency Management Division',
    title: 'Build Emergency Kits',
    url: 'https://mil.wa.gov/kits',
  },
  'waemd-earthquake': {
    org: 'Washington Emergency Management Division',
    title: 'Earthquake',
    url: 'https://mil.wa.gov/earthquake',
  },
  'waemd-brochure': {
    org: 'Washington Emergency Management Division',
    title: '2 Weeks Ready brochure',
    url: 'https://mil.wa.gov/asset/6866e0b1009ac/2-Weeks-Ready-Individual-Family-Brochure-02-Press-ENGLISH.pdf',
  },
  'waemd-tsunami': {
    org: 'Washington Emergency Management Division',
    title: 'Tsunami',
    url: 'https://mil.wa.gov/tsunami',
  },
  'waemd-alerts': {
    org: 'Washington Emergency Management Division',
    title: 'Alerts',
    url: 'https://mil.wa.gov/alerts',
  },
  'ready-kit': {
    org: 'Ready.gov (FEMA)',
    title: 'Build a Kit',
    url: 'https://www.ready.gov/kit',
  },
  'ready-earthquakes': {
    org: 'Ready.gov (FEMA)',
    title: 'Earthquakes',
    url: 'https://www.ready.gov/earthquakes',
  },
  'ready-older-adults': {
    org: 'Ready.gov (FEMA)',
    title: 'Older Adults',
    url: 'https://www.ready.gov/older-adults',
  },
  'ready-car': {
    org: 'Ready.gov (FEMA)',
    title: 'Car Safety',
    url: 'https://www.ready.gov/car',
  },
  'redcross-kit': {
    org: 'American Red Cross',
    title: 'Survival Kit Supplies',
    url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html',
  },
  'redcross-earthquake': {
    org: 'American Red Cross',
    title: 'Earthquake Safety',
    url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/earthquake.html',
  },
  'redcross-plan': {
    org: 'American Red Cross',
    title: 'Make a Plan',
    url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/make-a-plan.html',
  },
  'cdc-water-storage': {
    org: 'CDC',
    title: 'How to Create and Store an Emergency Water Supply',
    url: 'https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html',
  },
  'cdc-water-safe': {
    org: 'CDC',
    title: 'How to Make Water Safe in an Emergency',
    url: 'https://www.cdc.gov/water-emergency/about/index.html',
  },
  'pse-gas': {
    org: 'Puget Sound Energy',
    title: 'Gas shut off',
    url: 'https://www.pse.com/en/safety/natural-gas-safety/gas-shut-off',
  },
  'seattle-oem': {
    org: 'Seattle Office of Emergency Management',
    title: 'Prepare Yourself',
    url: 'https://www.seattle.gov/emergency-management/prepare/prepare-yourself',
  },
  'eca-protect': {
    org: 'Earthquake Country Alliance',
    title: 'Step 5: Drop, Cover, and Hold On',
    url: 'https://www.earthquakecountry.org/step5/',
  },
  'usgs-probabilities': {
    org: 'U.S. Geological Survey',
    title: 'Earthquake Probabilities and Hazards in the U.S. Pacific Northwest (Fact Sheet 2025-3050)',
    url: 'https://pubs.usgs.gov/publication/fs20253050',
  },
  'pnsn-cascadia': {
    org: 'Pacific Northwest Seismic Network',
    title: 'What is the Cascadia Subduction Zone?',
    url: 'https://pnsn.org/blog/what-is-the-cascadia-subduction-zone-and-when-is-the-next-big-one-going-to-hit',
  },
  'dnr-nisqually': {
    org: 'Washington Department of Natural Resources',
    title: 'Nisqually Earthquake fact sheet',
    url: 'https://dnr.wa.gov/sites/default/files/2026-02/ger_nisqually_earthquake_fs.pdf',
  },
};

/** Look up source records for a list of ids, skipping any id that is not registered. */
export function resolveSources(ids = []) {
  return ids.filter((id) => SOURCES[id]).map((id) => ({ id, ...SOURCES[id] }));
}
