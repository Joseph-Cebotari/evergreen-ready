// The household is the single input to the whole app. Everything the plan shows
// is derived from this object, so it is validated in one place.

export const DAYS = 14; // "2 Weeks Ready" - Washington Emergency Management Division

export const MAX_COUNT = 20;

export const HOME_TYPES = ['house', 'apartment'];
export const TENURES = ['own', 'rent'];
export const GAS_OPTIONS = ['yes', 'no', 'unsure'];

export const DEFAULT_HOUSEHOLD = Object.freeze({
  adults: 1,
  seniors: 0,
  children: 0,
  infants: 0,
  dogs: 0,
  cats: 0,
  otherPets: 0,
  needs: Object.freeze({
    prescriptions: false,
    poweredDevice: false,
    mobility: false,
    vision: false,
    hearing: false,
  }),
  home: Object.freeze({
    type: 'house',
    tenure: 'own',
    gas: 'unsure',
    coastal: false,
  }),
  hasCar: true,
});

const COUNT_FIELDS = ['adults', 'seniors', 'children', 'infants', 'dogs', 'cats', 'otherPets'];

function clampCount(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, MAX_COUNT);
}

function oneOf(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

/**
 * Turn any saved or partial object into a complete, valid household.
 * Saved data comes from localStorage, so it is treated as untrusted input:
 * unknown fields are dropped and bad values fall back to the defaults.
 */
export function normalizeHousehold(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const needs = raw.needs && typeof raw.needs === 'object' ? raw.needs : {};
  const home = raw.home && typeof raw.home === 'object' ? raw.home : {};

  const result = {};
  for (const field of COUNT_FIELDS) {
    result[field] = field in raw ? clampCount(raw[field]) : DEFAULT_HOUSEHOLD[field];
  }

  // A household with nobody in it has nothing to plan for.
  if (peopleCount(result) === 0) result.adults = 1;

  result.needs = {};
  for (const key of Object.keys(DEFAULT_HOUSEHOLD.needs)) {
    result.needs[key] = Boolean(needs[key]);
  }

  result.home = {
    type: oneOf(home.type, HOME_TYPES, DEFAULT_HOUSEHOLD.home.type),
    tenure: oneOf(home.tenure, TENURES, DEFAULT_HOUSEHOLD.home.tenure),
    gas: oneOf(home.gas, GAS_OPTIONS, DEFAULT_HOUSEHOLD.home.gas),
    coastal: Boolean(home.coastal),
  };

  result.hasCar = 'hasCar' in raw ? Boolean(raw.hasCar) : DEFAULT_HOUSEHOLD.hasCar;
  return result;
}

export function peopleCount(h) {
  return h.adults + h.seniors + h.children + h.infants;
}

/** Dogs and cats. Other pets vary too much in size to share one rule. */
export function dogCatCount(h) {
  return h.dogs + h.cats;
}

export function petCount(h) {
  return h.dogs + h.cats + h.otherPets;
}

export function hasAnyNeed(h) {
  return Object.values(h.needs).some(Boolean);
}

/** "1 adult, 2 children, 1 dog" - used in headings and the printed plan. */
export function describeHousehold(h) {
  const parts = [
    [h.adults, 'adult', 'adults'],
    [h.seniors, 'older adult', 'older adults'],
    [h.children, 'child', 'children'],
    [h.infants, 'infant', 'infants'],
    [h.dogs, 'dog', 'dogs'],
    [h.cats, 'cat', 'cats'],
    [h.otherPets, 'other pet', 'other pets'],
  ];
  return parts
    .filter(([count]) => count > 0)
    .map(([count, one, many]) => `${count} ${count === 1 ? one : many}`)
    .join(', ');
}
