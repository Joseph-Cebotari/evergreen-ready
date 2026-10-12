// @vitest-environment jsdom
// Walks through the app the way a person would: answer the questions,
// get a plan, check things off, and come back later.

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = '';
  window.scrollTo = vi.fn();
});

afterEach(cleanup);

async function answerQuestions(user) {
  await user.click(screen.getAllByRole('button', { name: 'Build my household plan' })[0]);

  // Step 1: one adult by default, add two children.
  await user.click(screen.getByRole('button', { name: 'One more: Children' }));
  await user.click(screen.getByRole('button', { name: 'One more: Children' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 2: one dog.
  await user.click(screen.getByRole('button', { name: 'One more: Dogs' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 3: prescriptions.
  await user.click(screen.getByLabelText('Takes prescription medication'));
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 4: renting, near the water.
  await user.click(screen.getByLabelText('Rent'));
  await user.click(screen.getByLabelText(/near saltwater/));
  await user.click(screen.getByRole('button', { name: 'Build my plan' }));
}

describe('QuakeReady WA', () => {
  it('opens on the home screen with the case for preparing', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /two weeks away/i })).toBeInTheDocument();
    expect(screen.getByText(/85 percent chance/i)).toBeInTheDocument();
  });

  it('builds a plan sized to the household', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerQuestions(user);

    expect(screen.getByRole('heading', { level: 1, name: 'Your two-week plan' })).toBeInTheDocument();
    expect(screen.getByText(/For 1 adult, 2 children, 1 dog\./)).toBeInTheDocument();

    // 3 people + 1 dog = 4 x 14 gallons.
    const water = screen.getByLabelText(/^Drinking water/);
    expect(within(water.closest('li')).getByText('56 gallons')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Prescription medications/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Infant formula/)).not.toBeInTheDocument();
  });

  it('moves focus to the heading of each new step', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: 'Build my household plan' })[0]);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Any pets?' })).toHaveFocus();
  });

  it('will not continue with nobody in the household', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: 'Build my household plan' })[0]);
    await user.click(screen.getByRole('button', { name: 'One fewer: Adults' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Add at least one person');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('tracks progress as items are checked off', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerQuestions(user);

    expect(screen.getByText(/^0 of \d+ kit items/)).toBeInTheDocument();
    await user.click(screen.getByLabelText(/^Drinking water/));
    expect(screen.getByText(/^1 of \d+ kit items/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Drinking water/)).toBeChecked();
  });

  it('can hide items that are already done', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerQuestions(user);

    await user.click(screen.getByLabelText(/^Drinking water/));
    await user.click(screen.getByLabelText('Show only what I still need'));
    expect(screen.queryByLabelText(/^Drinking water/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^Non-perishable food/)).toBeInTheDocument();
  });

  it('switches sections with the tabs, by click and by arrow key', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerQuestions(user);

    await user.click(screen.getByRole('tab', { name: 'Home' }));
    expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Home' })).toBeVisible();
    // Renters are told to ask the landlord, and coastal homes get a tsunami route.
    expect(screen.getByLabelText(/Ask your landlord/)).toBeInTheDocument();
    expect(screen.getByLabelText(/tsunami evacuation route/)).toBeInTheDocument();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Family plan' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Family plan' })).toHaveFocus();
  });

  it('remembers the plan, checkmarks, and family plan after a reload', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await answerQuestions(user);
    await user.click(screen.getByLabelText(/^Drinking water/));
    await user.click(screen.getByRole('tab', { name: 'Family plan' }));
    await user.type(screen.getByLabelText('Out-of-area contact'), 'Aunt Rosa');
    first.unmount();

    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Your two-week plan' })).toBeInTheDocument();
    expect(screen.getByLabelText('Out-of-area contact')).toHaveValue('Aunt Rosa');
    await user.click(screen.getByRole('tab', { name: 'Kit' }));
    expect(screen.getByLabelText(/^Drinking water/)).toBeChecked();
  });

  it('updates the plan when the household changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerQuestions(user);

    await user.click(screen.getByRole('button', { name: 'Change household' }));
    await user.click(screen.getByRole('button', { name: 'One more: Infants' }));
    for (let i = 0; i < 3; i += 1) await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Update my plan' }));

    expect(screen.getByLabelText(/^Infant formula/)).toBeInTheDocument();
    const water = screen.getByLabelText(/^Drinking water/);
    expect(within(water.closest('li')).getByText('70 gallons')).toBeInTheDocument();
  });

  it('copies a shopping list of what is still needed', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    render(<App />);
    await answerQuestions(user);

    await user.click(screen.getByLabelText(/^Drinking water/));
    await user.click(screen.getByRole('button', { name: 'Copy shopping list' }));

    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0];
    expect(text).toContain('Non-perishable food: 14 days for 3 people');
    expect(text).not.toContain('Drinking water');
    expect(screen.getByRole('status')).toHaveTextContent('Shopping list copied');
  });

  it('shows the list for manual copying when the clipboard is blocked', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('blocked'));
    render(<App />);
    await answerQuestions(user);

    await user.click(screen.getByRole('button', { name: 'Copy shopping list' }));
    expect(screen.getByRole('textbox', { name: 'Shopping list' }).value).toContain('Drinking water: 56 gallons');
  });

  it('asks before erasing, then starts over', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerQuestions(user);

    await user.click(screen.getByRole('button', { name: 'Start over' }));
    await user.click(screen.getByRole('button', { name: 'Keep my plan' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Your two-week plan' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Start over' }));
    await user.click(screen.getByRole('button', { name: 'Erase and start over' }));
    expect(screen.getByRole('heading', { level: 1, name: /two weeks away/i })).toBeInTheDocument();
    expect(window.localStorage.getItem('quakeready:checked')).toBe('{}');
  });

  it('sends a direct link to the plan back to the questions when there is no plan yet', () => {
    window.location.hash = '#/plan';
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Who lives in your home?' })).toBeInTheDocument();
  });

  it('survives corrupted saved data', () => {
    window.localStorage.setItem('quakeready:household', '{not json');
    window.localStorage.setItem('quakeready:checked', '"oops"');
    window.localStorage.setItem('quakeready:hasPlan', 'true');
    window.location.hash = '#/plan';
    render(<App />);
    expect(screen.getByText(/For 1 adult\./)).toBeInTheDocument();
  });
});
