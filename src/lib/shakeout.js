// The Great Washington ShakeOut drill is held on the third Thursday of
// October each year (Washington Emergency Management Division).

const OCTOBER = 9; // JavaScript months are zero-based
const THURSDAY = 4;

export function thirdThursdayOfOctober(year) {
  const first = new Date(year, OCTOBER, 1);
  const daysUntilThursday = (THURSDAY - first.getDay() + 7) % 7;
  return new Date(year, OCTOBER, 1 + daysUntilThursday + 14);
}

/** The next drill on or after the given date. */
export function nextShakeOut(today = new Date()) {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisYear = thirdThursdayOfOctober(today.getFullYear());
  return thisYear >= startOfToday ? thisYear : thirdThursdayOfOctober(today.getFullYear() + 1);
}

export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
