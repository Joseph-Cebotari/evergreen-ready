// Builds a plain-text shopping list of everything still unchecked, for
// pasting into a notes app or a message to whoever is doing the shopping.

import { describeHousehold } from './household.js';
import { kitKey } from './generatePlan.js';

export function buildShoppingList(plan, checked = {}) {
  const lines = ['Evergreen Ready - still needed', `Household: ${describeHousehold(plan.household)}`, ''];
  let count = 0;

  for (const category of plan.kit) {
    const remaining = category.items.filter((item) => !checked[kitKey(item.id)]);
    if (remaining.length === 0) continue;

    lines.push(category.name);
    for (const item of remaining) {
      lines.push(item.quantity ? `- ${item.name}: ${item.quantity}` : `- ${item.name}`);
      count += 1;
    }
    lines.push('');
  }

  if (count === 0) {
    return 'Evergreen Ready - your kit is complete. Nothing left to buy.';
  }
  return lines.join('\n').trimEnd();
}
