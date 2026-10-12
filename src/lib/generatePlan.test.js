import { describe, expect, it } from 'vitest';
import {
  buildKit,
  generatePlan,
  kitKey,
  kitKeys,
  progressFor,
  taskKey,
  taskKeys,
} from './generatePlan.js';
import { normalizeHousehold } from './household.js';

const kitItem = (plan, id) => plan.kit.flatMap((category) => category.items).find((item) => item.id === id);
const kitIds = (plan) => plan.kit.flatMap((category) => category.items.map((item) => item.id));
const taskIds = (plan) => plan.homeTasks.map((task) => task.id);

describe('water', () => {
  it('is 1 gallon per person per day for 14 days', () => {
    expect(kitItem(generatePlan({ adults: 1 }), 'water').quantity).toBe('14 gallons');
    expect(kitItem(generatePlan({ adults: 2, children: 2 }), 'water').quantity).toBe('56 gallons');
  });

  it('counts infants and older adults as people', () => {
    const plan = generatePlan({ adults: 1, seniors: 1, infants: 1 });
    expect(kitItem(plan, 'water').quantity).toBe('42 gallons');
  });

  it('adds 14 gallons for each dog and cat', () => {
    const plan = generatePlan({ adults: 1, dogs: 1, cats: 1 });
    expect(kitItem(plan, 'water').quantity).toBe('42 gallons');
  });

  it('does not use the per-pet rule for other pets, and lists their water separately', () => {
    const plan = generatePlan({ adults: 1, otherPets: 2 });
    expect(kitItem(plan, 'water').quantity).toBe('14 gallons');
    expect(kitItem(plan, 'pet-water-other')).toBeDefined();
  });
});

describe('personalization', () => {
  it('gives a single adult only the general items', () => {
    const plan = generatePlan({ adults: 1, hasCar: false });
    const categories = plan.kit.map((category) => category.id);
    expect(categories).not.toContain('baby');
    expect(categories).not.toContain('kids');
    expect(categories).not.toContain('pets');
    expect(categories).not.toContain('medical');
    expect(categories).not.toContain('car');
  });

  it('adds infant supplies sized to the number of infants', () => {
    const plan = generatePlan({ adults: 2, infants: 2 });
    expect(kitItem(plan, 'formula').quantity).toBe('14 days for 2 infants');
    expect(kitItem(plan, 'diapers')).toBeDefined();
  });

  it('adds one contact card and comfort item per child', () => {
    const plan = generatePlan({ adults: 1, children: 3 });
    expect(kitItem(plan, 'kids-contact-card').quantity).toBe('3');
    expect(kitItem(plan, 'kids-comfort').quantity).toBe('3');
  });

  it('adds pet supplies for any kind of pet', () => {
    expect(kitItem(generatePlan({ adults: 1, otherPets: 1 }), 'pet-food').quantity).toBe('14 days for 1 pet');
    expect(kitItem(generatePlan({ adults: 1, dogs: 2, cats: 1 }), 'pet-restraint').quantity).toBe(
      '3 (one set per pet)'
    );
  });

  it('adds prescription and medical items only when asked for', () => {
    const without = generatePlan({ adults: 1 });
    expect(kitItem(without, 'prescriptions')).toBeUndefined();

    const withNeeds = generatePlan({
      adults: 1,
      needs: { prescriptions: true, poweredDevice: true, mobility: true, vision: true, hearing: true },
    });
    for (const id of ['prescriptions', 'device-power', 'medical-supplies', 'mobility', 'glasses', 'hearing']) {
      expect(kitItem(withNeeds, id), id).toBeDefined();
    }
  });

  it('adds insurance card copies for older adults', () => {
    expect(kitItem(generatePlan({ adults: 0, seniors: 1 }), 'insurance-cards')).toBeDefined();
    expect(kitItem(generatePlan({ adults: 1 }), 'insurance-cards')).toBeUndefined();
  });

  it('adds a car kit only for households with a car', () => {
    expect(kitItem(generatePlan({ adults: 1, hasCar: true }), 'car-kit')).toBeDefined();
    expect(kitItem(generatePlan({ adults: 1, hasCar: false }), 'car-kit')).toBeUndefined();
  });

  it('counts one go-bag per person and per pet', () => {
    const plan = generatePlan({ adults: 2, children: 1, dogs: 1, otherPets: 1 });
    expect(kitItem(plan, 'go-bags').quantity).toBe('5');
  });

  it('scales per-person items with household size', () => {
    const plan = generatePlan({ adults: 2, children: 2 });
    expect(kitItem(plan, 'bedding').quantity).toBe('4 (one per person)');
    expect(kitItem(plan, 'food').quantity).toBe('14 days for 4 people');
    expect(kitItem(generatePlan({ adults: 1 }), 'food').quantity).toBe('14 days for 1 person');
  });
});

describe('home tasks', () => {
  it('tells owners to strap the water heater and renters to ask the landlord', () => {
    const owner = taskIds(generatePlan({ home: { tenure: 'own' } }));
    expect(owner).toContain('water-heater');
    expect(owner).not.toContain('water-heater-renter');

    const renter = taskIds(generatePlan({ home: { tenure: 'rent' } }));
    expect(renter).toContain('water-heater-renter');
    expect(renter).not.toContain('water-heater');
  });

  it('shows exactly one gas task, matched to the answer and the home type', () => {
    const gasTasks = (home) => taskIds(generatePlan({ home })).filter((id) => id.startsWith('gas-'));
    expect(gasTasks({ gas: 'yes', type: 'house' })).toEqual(['gas-shutoff']);
    expect(gasTasks({ gas: 'yes', type: 'apartment' })).toEqual(['gas-shutoff-apartment']);
    expect(gasTasks({ gas: 'unsure' })).toEqual(['gas-unsure']);
    expect(gasTasks({ gas: 'no' })).toEqual([]);
  });

  it('adds tsunami tasks only near the water', () => {
    expect(taskIds(generatePlan({ home: { coastal: true } }))).toEqual(
      expect.arrayContaining(['tsunami-route', 'tsunami-alerts'])
    );
    expect(taskIds(generatePlan({ home: { coastal: false } }))).not.toContain('tsunami-route');
  });

  it('suggests a support network for older adults and people with mobility or device needs', () => {
    expect(taskIds(generatePlan({ adults: 1 }))).not.toContain('support-network');
    expect(taskIds(generatePlan({ adults: 0, seniors: 1 }))).toContain('support-network');
    expect(taskIds(generatePlan({ needs: { mobility: true } }))).toContain('support-network');
  });
});

describe('earthquake guide', () => {
  it('always starts with drop, cover, hold on, in that order', () => {
    const { during } = generatePlan({}).guide;
    expect(during.map((step) => step.id)).toEqual(['drop', 'cover', 'hold-on']);
  });

  it('puts tsunami evacuation first after the shaking for coastal households', () => {
    const coastal = generatePlan({ home: { coastal: true } }).guide;
    expect(coastal.after[0].id).toBe('tsunami');
    expect(coastal.variations.map((v) => v.id)).toContain('shore');

    const inland = generatePlan({ home: { coastal: false } }).guide;
    expect(inland.after.map((step) => step.id)).not.toContain('tsunami');
  });

  it('shows wheelchair guidance only when someone uses a mobility device', () => {
    const ids = (input) => generatePlan(input).guide.variations.map((v) => v.id);
    expect(ids({ needs: { mobility: true } })).toContain('wheelchair');
    expect(ids({})).not.toContain('wheelchair');
  });

  it('leaves out the gas step for homes without gas', () => {
    const afterIds = (gas) => generatePlan({ home: { gas } }).guide.after.map((step) => step.id);
    expect(afterIds('no')).not.toContain('gas');
    expect(afterIds('yes')).toContain('gas');
    expect(afterIds('unsure')).toContain('gas');
  });
});

describe('family plan fields', () => {
  const fieldIds = (input) => generatePlan(input).familyFields.map((field) => field.id);

  it('always asks for a contact and two meeting places', () => {
    expect(fieldIds({})).toEqual(expect.arrayContaining(['contactName', 'contactPhone', 'meetNear', 'meetFar']));
  });

  it('adds fields for children, pets, and high ground when they apply', () => {
    expect(fieldIds({})).not.toEqual(expect.arrayContaining(['children']));
    expect(fieldIds({ children: 1 })).toContain('children');
    expect(fieldIds({ infants: 1 })).toContain('children');
    expect(fieldIds({ cats: 1 })).toContain('pets');
    expect(fieldIds({ home: { coastal: true } })).toContain('highGround');
  });
});

describe('plan structure', () => {
  it('validates its input, so bad saved data cannot break the plan', () => {
    const plan = generatePlan({ adults: 'lots', dogs: -1, home: 'nope' });
    expect(plan.household.adults).toBe(1);
    expect(kitItem(plan, 'water').quantity).toBe('14 gallons');
  });

  it('keeps categories in display order and drops empty ones', () => {
    const kit = buildKit(normalizeHousehold({ adults: 1 }));
    expect(kit[0].id).toBe('water');
    expect(kit[1].id).toBe('food');
    expect(kit.every((category) => category.items.length > 0)).toBe(true);
  });

  it('attaches at least one resolved source to every item, task, and step', () => {
    const plan = generatePlan({
      adults: 1, seniors: 1, children: 1, infants: 1, dogs: 1, cats: 1, otherPets: 1,
      needs: { prescriptions: true, poweredDevice: true, mobility: true, vision: true, hearing: true },
      home: { type: 'house', tenure: 'rent', gas: 'yes', coastal: true },
      hasCar: true,
    });
    const everything = [
      ...plan.kit.flatMap((category) => category.items),
      ...plan.homeTasks,
      ...plan.familyFields,
      ...plan.guide.during,
      ...plan.guide.variations,
      ...plan.guide.after,
    ];
    for (const entry of everything) {
      expect(entry.sources.length, entry.id).toBeGreaterThan(0);
      for (const source of entry.sources) {
        expect(source.url, entry.id).toMatch(/^https:\/\//);
      }
    }
  });

  it('never leaks rule functions into the plan', () => {
    const plan = generatePlan({});
    expect(kitItem(plan, 'water')).not.toHaveProperty('appliesTo');
    expect(typeof kitItem(plan, 'water').quantity).toBe('string');
  });
});

describe('progress', () => {
  const plan = generatePlan({ adults: 1 });

  it('uses separate keys for kit items and home tasks', () => {
    expect(kitKey('radio')).not.toBe(taskKey('radio'));
    expect(kitKeys(plan)).toContain('kit:water');
    expect(taskKeys(plan)).toContain('home:secure-tall');
  });

  it('starts at zero and reaches 100 percent', () => {
    const keys = kitKeys(plan);
    expect(progressFor(keys, {})).toEqual({ done: 0, total: keys.length, percent: 0 });
    const all = Object.fromEntries(keys.map((key) => [key, true]));
    expect(progressFor(keys, all).percent).toBe(100);
  });

  it('ignores checkmarks for items that are no longer in the plan', () => {
    const keys = kitKeys(plan);
    const result = progressFor(keys, { 'kit:formula': true, 'kit:water': true });
    expect(result.done).toBe(1);
  });

  it('treats unchecked (false) entries as not done and handles an empty list', () => {
    expect(progressFor(['kit:water'], { 'kit:water': false }).done).toBe(0);
    expect(progressFor([], {})).toEqual({ done: 0, total: 0, percent: 0 });
  });
});

describe('kit ids', () => {
  it('are unique', () => {
    const plan = generatePlan({
      adults: 1, seniors: 1, children: 1, infants: 1, dogs: 1, otherPets: 1,
      needs: { prescriptions: true, poweredDevice: true, mobility: true, vision: true, hearing: true },
    });
    const ids = kitIds(plan);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
