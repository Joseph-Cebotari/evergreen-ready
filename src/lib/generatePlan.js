// Pure functions that turn a household into a personalized plan.
// No React and no browser APIs in here, so everything is easy to unit test.

import { KIT_ITEMS, CATEGORIES } from '../data/kitItems.js';
import { HOME_TASKS } from '../data/homeTasks.js';
import { DURING_STEPS, DURING_VARIATIONS, AFTER_STEPS } from '../data/quakeGuide.js';
import { FAMILY_PLAN_FIELDS } from '../data/familyPlanFields.js';
import { resolveSources } from '../data/sources.js';
import { normalizeHousehold } from './household.js';

function applyRules(rules, household) {
  return rules
    .filter((rule) => rule.appliesTo(household))
    .map(({ appliesTo, quantity, sources, ...rest }) => ({
      ...rest,
      quantity: quantity ? quantity(household) : null,
      sources: resolveSources(sources),
    }));
}

/** Kit items for this household, grouped by category in display order. */
export function buildKit(household) {
  const items = applyRules(KIT_ITEMS, household);
  return CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((item) => item.category === category.id),
  })).filter((category) => category.items.length > 0);
}

export function buildHomeTasks(household) {
  return applyRules(HOME_TASKS, household);
}

export function buildFamilyPlanFields(household) {
  return applyRules(FAMILY_PLAN_FIELDS, household).map(({ quantity, ...field }) => field);
}

export function buildQuakeGuide(household) {
  return {
    during: applyRules(DURING_STEPS, household),
    variations: applyRules(DURING_VARIATIONS, household),
    after: applyRules(AFTER_STEPS, household),
  };
}

/** The whole plan. Accepts partial or saved input and validates it first. */
export function generatePlan(input) {
  const household = normalizeHousehold(input);
  return {
    household,
    kit: buildKit(household),
    homeTasks: buildHomeTasks(household),
    familyFields: buildFamilyPlanFields(household),
    guide: buildQuakeGuide(household),
  };
}

/**
 * Kit items and home tasks are both checkable, and their ids come from
 * separate lists, so the saved key includes which list it belongs to.
 */
export const kitKey = (id) => `kit:${id}`;
export const taskKey = (id) => `home:${id}`;

export function kitKeys(plan) {
  return plan.kit.flatMap((category) => category.items.map((item) => kitKey(item.id)));
}

export function taskKeys(plan) {
  return plan.homeTasks.map((task) => taskKey(task.id));
}

/**
 * Progress through a list of ids. Checked ids that are no longer in the plan
 * (because the household changed) are ignored, so progress never exceeds 100%.
 */
export function progressFor(ids, checked) {
  const total = ids.length;
  const done = ids.filter((id) => checked[id]).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}
