import { describe, expect, it } from 'vitest';
import {
  DEFAULT_HOUSEHOLD,
  MAX_COUNT,
  describeHousehold,
  dogCatCount,
  normalizeHousehold,
  peopleCount,
  petCount,
} from './household.js';

describe('normalizeHousehold', () => {
  it('returns the defaults for missing or invalid input', () => {
    expect(normalizeHousehold(undefined)).toEqual(DEFAULT_HOUSEHOLD);
    expect(normalizeHousehold(null)).toEqual(DEFAULT_HOUSEHOLD);
    expect(normalizeHousehold('not an object')).toEqual(DEFAULT_HOUSEHOLD);
  });

  it('clamps counts to whole numbers between 0 and the maximum', () => {
    const h = normalizeHousehold({ adults: 2.9, children: -3, dogs: 500, cats: 'two' });
    expect(h.adults).toBe(2);
    expect(h.children).toBe(0);
    expect(h.dogs).toBe(MAX_COUNT);
    expect(h.cats).toBe(0);
  });

  it('never returns a household with nobody in it', () => {
    const h = normalizeHousehold({ adults: 0, seniors: 0, children: 0, infants: 0 });
    expect(peopleCount(h)).toBe(1);
  });

  it('keeps a household made up only of older adults', () => {
    const h = normalizeHousehold({ adults: 0, seniors: 2 });
    expect(h.adults).toBe(0);
    expect(h.seniors).toBe(2);
  });

  it('falls back to defaults for unknown home options and drops unknown fields', () => {
    const h = normalizeHousehold({ home: { type: 'castle', tenure: 'squat', gas: 'maybe' }, hacked: true });
    expect(h.home).toEqual({ type: 'house', tenure: 'own', gas: 'unsure', coastal: false });
    expect(h).not.toHaveProperty('hacked');
  });

  it('turns need flags into booleans', () => {
    const h = normalizeHousehold({ needs: { prescriptions: 1, mobility: 'yes', bogus: true } });
    expect(h.needs).toEqual({
      prescriptions: true,
      poweredDevice: false,
      mobility: true,
      vision: false,
      hearing: false,
    });
  });
});

describe('counts', () => {
  const h = normalizeHousehold({ adults: 2, seniors: 1, children: 2, infants: 1, dogs: 1, cats: 2, otherPets: 3 });

  it('counts people of every age', () => {
    expect(peopleCount(h)).toBe(6);
  });

  it('counts dogs and cats separately from other pets', () => {
    expect(dogCatCount(h)).toBe(3);
    expect(petCount(h)).toBe(6);
  });
});

describe('describeHousehold', () => {
  it('uses singular and plural words and skips zeros', () => {
    const h = normalizeHousehold({ adults: 1, children: 2, dogs: 1 });
    expect(describeHousehold(h)).toBe('1 adult, 2 children, 1 dog');
  });
});
