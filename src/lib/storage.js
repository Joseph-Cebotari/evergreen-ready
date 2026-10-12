// A small useState replacement that also saves to localStorage, so a plan
// survives closing the tab. Storage can be unavailable (private browsing,
// blocked site data), so every access is wrapped: the app must still work
// when nothing can be saved.

import { useEffect, useState } from 'react';

const PREFIX = 'evergreen-ready:';

export function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStored(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearStored(keys) {
  try {
    for (const key of keys) window.localStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

/**
 * @param {string} key storage key
 * @param {*} fallback value used when nothing is saved
 * @param {(value: any) => any} [sanitize] cleans up saved data before use
 */
export function useStoredState(key, fallback, sanitize = (value) => value) {
  const [value, setValue] = useState(() => sanitize(readStored(key, fallback)));

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
}
