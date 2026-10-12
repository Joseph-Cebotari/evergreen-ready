import { describe, expect, it } from 'vitest';
import { generatePlan, kitKeys } from './generatePlan.js';
import { buildShoppingList } from './shoppingList.js';

describe('buildShoppingList', () => {
  const plan = generatePlan({ adults: 2, dogs: 1 });

  it('lists unchecked items with quantities under their category', () => {
    const text = buildShoppingList(plan, {});
    expect(text).toContain('Household: 2 adults, 1 dog');
    expect(text).toContain('Water\n- Drinking water: 42 gallons');
    expect(text).toContain('- Whistle');
  });

  it('leaves out items that are already checked', () => {
    const text = buildShoppingList(plan, { 'kit:water': true });
    expect(text).not.toContain('Drinking water');
    expect(text).toContain('A way to make more water safe');
  });

  it('drops a category once everything in it is checked', () => {
    const checked = { 'kit:pet-food': true, 'kit:pet-restraint': true, 'kit:pet-records': true, 'kit:pet-meds': true };
    expect(buildShoppingList(plan, checked)).not.toContain('Pets\n');
  });

  it('says so when nothing is left to buy', () => {
    const all = Object.fromEntries(kitKeys(plan).map((key) => [key, true]));
    expect(buildShoppingList(plan, all)).toMatch(/kit is complete/);
  });
});
