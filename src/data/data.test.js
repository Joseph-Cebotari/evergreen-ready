// Guards against typos in the data files: a misspelled source id or a
// duplicate item id would otherwise fail silently in the browser.

import { describe, expect, it } from 'vitest';
import { CATEGORIES, KIT_ITEMS, PRIORITIES } from './kitItems.js';
import { HOME_TASKS } from './homeTasks.js';
import { AFTER_STEPS, DURING_STEPS, DURING_VARIATIONS } from './quakeGuide.js';
import { FAMILY_PLAN_FIELDS } from './familyPlanFields.js';
import { TIMELINE, WHY_TWO_WEEKS } from './facts.js';
import { SOURCES, resolveSources } from './sources.js';

const LISTS = {
  KIT_ITEMS,
  HOME_TASKS,
  DURING_STEPS,
  DURING_VARIATIONS,
  AFTER_STEPS,
  FAMILY_PLAN_FIELDS,
  TIMELINE,
};

describe.each(Object.entries(LISTS))('%s', (_name, list) => {
  it('has unique ids', () => {
    const ids = list.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cites only registered sources, and at least one each', () => {
    for (const entry of list) {
      expect(entry.sources.length, entry.id).toBeGreaterThan(0);
      for (const id of entry.sources) {
        expect(SOURCES[id], `${entry.id} cites unknown source "${id}"`).toBeDefined();
      }
    }
  });
});

describe('kit items', () => {
  it('belong to a known category and priority', () => {
    const categoryIds = CATEGORIES.map((category) => category.id);
    for (const item of KIT_ITEMS) {
      expect(categoryIds, item.id).toContain(item.category);
      expect(PRIORITIES[item.priority], item.id).toBeDefined();
    }
  });

  it('use every category at least once', () => {
    for (const category of CATEGORIES) {
      expect(KIT_ITEMS.some((item) => item.category === category.id), category.id).toBe(true);
    }
  });
});

describe('sources', () => {
  it('all have an organization, a title, and an https link', () => {
    for (const [id, source] of Object.entries(SOURCES)) {
      expect(source.org, id).toBeTruthy();
      expect(source.title, id).toBeTruthy();
      expect(source.url, id).toMatch(/^https:\/\//);
    }
  });

  it('are all used somewhere, so the registry has no dead entries', () => {
    const used = new Set([
      ...Object.values(LISTS).flatMap((list) => list.flatMap((entry) => entry.sources)),
      ...WHY_TWO_WEEKS.sources,
    ]);
    for (const id of Object.keys(SOURCES)) {
      expect(used.has(id), `source "${id}" is never cited`).toBe(true);
    }
  });

  it('skips unknown ids instead of throwing', () => {
    expect(resolveSources(['ready-kit', 'does-not-exist'])).toHaveLength(1);
    expect(resolveSources()).toEqual([]);
  });
});
