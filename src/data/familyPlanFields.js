// The blanks a household fills in to make its emergency plan. Like kit
// items, some only appear for households they apply to.

import { petCount } from '../lib/household.js';

export const FAMILY_PLAN_FIELDS = [
  {
    id: 'contactName',
    label: 'Out-of-area contact',
    hint: 'Someone who lives outside the area. It may be easier to text or call long distance when local lines are overloaded.',
    autoComplete: 'off',
    appliesTo: () => true,
    sources: ['redcross-plan'],
  },
  {
    id: 'contactPhone',
    label: 'Their phone number',
    hint: 'Everyone in the household should carry it on paper and saved in their phone.',
    type: 'tel',
    autoComplete: 'off',
    appliesTo: () => true,
    sources: ['redcross-plan'],
  },
  {
    id: 'meetNear',
    label: 'Meeting place right outside your home',
    hint: 'For a sudden emergency, such as a fire.',
    appliesTo: () => true,
    sources: ['redcross-plan'],
  },
  {
    id: 'meetFar',
    label: 'Meeting place outside your neighborhood',
    hint: 'In case you cannot get home or are told to evacuate.',
    appliesTo: () => true,
    sources: ['redcross-plan'],
  },
  {
    id: 'highGround',
    label: 'Your high ground',
    hint: 'The nearest high ground or inland spot you can reach on foot from home.',
    appliesTo: (h) => h.home.coastal,
    sources: ['waemd-tsunami'],
  },
  {
    id: 'children',
    label: 'How you will reunite with your children',
    hint: 'Ask the school or daycare how pickup works after a disaster and who is allowed to pick up.',
    multiline: true,
    appliesTo: (h) => h.children + h.infants > 0,
    sources: ['waemd-brochure'],
  },
  {
    id: 'pets',
    label: 'Where your pets can go',
    hint: 'Pet-friendly hotels, animal shelters, or friends along your evacuation route. If it is not safe for you to stay home, it is not safe for them.',
    multiline: true,
    appliesTo: (h) => petCount(h) > 0,
    sources: ['redcross-plan'],
  },
  {
    id: 'support',
    label: 'Who will check on you',
    hint: 'People in your support network, and what each one knows: how to get in, where supplies are, how your equipment or medicine works.',
    multiline: true,
    appliesTo: (h) => h.seniors > 0 || h.needs.poweredDevice || h.needs.mobility,
    sources: ['ready-older-adults'],
  },
  {
    id: 'shutoffs',
    label: 'Where the utility shutoffs are',
    hint: 'Gas valve, water main, and electrical panel, so anyone in the household can find them.',
    multiline: true,
    appliesTo: () => true,
    sources: ['seattle-oem', 'pse-gas'],
  },
  {
    id: 'numbers',
    label: 'Other numbers to keep on paper',
    hint: 'Doctor, pharmacy, vet, school, work, and neighbors.',
    multiline: true,
    appliesTo: () => true,
    sources: ['redcross-plan'],
  },
];
