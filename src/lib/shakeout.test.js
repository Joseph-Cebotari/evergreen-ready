import { describe, expect, it } from 'vitest';
import { nextShakeOut, thirdThursdayOfOctober } from './shakeout.js';

const ymd = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()];

describe('thirdThursdayOfOctober', () => {
  it('matches known ShakeOut dates', () => {
    expect(ymd(thirdThursdayOfOctober(2024))).toEqual([2024, 10, 17]);
    expect(ymd(thirdThursdayOfOctober(2025))).toEqual([2025, 10, 16]);
    expect(ymd(thirdThursdayOfOctober(2026))).toEqual([2026, 10, 15]);
  });

  it('always lands on a Thursday between the 15th and the 21st', () => {
    for (let year = 2020; year <= 2040; year += 1) {
      const date = thirdThursdayOfOctober(year);
      expect(date.getDay()).toBe(4);
      expect(date.getDate()).toBeGreaterThanOrEqual(15);
      expect(date.getDate()).toBeLessThanOrEqual(21);
    }
  });
});

describe('nextShakeOut', () => {
  it('returns this year\'s drill before and on the day', () => {
    expect(ymd(nextShakeOut(new Date(2026, 9, 1)))).toEqual([2026, 10, 15]);
    expect(ymd(nextShakeOut(new Date(2026, 9, 15, 23, 30)))).toEqual([2026, 10, 15]);
  });

  it('rolls over to next year once the drill has passed', () => {
    expect(ymd(nextShakeOut(new Date(2026, 9, 16)))).toEqual([2027, 10, 21]);
    expect(ymd(nextShakeOut(new Date(2026, 11, 31)))).toEqual([2027, 10, 21]);
  });
});
