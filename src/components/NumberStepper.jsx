// A number input with large plus and minus buttons. The buttons are easier
// to hit on a phone than a native number spinner, and the input itself still
// accepts typing and arrow keys.

import { useId } from 'react';
import { MAX_COUNT } from '../lib/household.js';

export default function NumberStepper({ label, hint, value, onChange, min = 0, max = MAX_COUNT }) {
  const id = useId();
  const hintId = `${id}-hint`;

  function set(next) {
    const n = Math.floor(Number(next));
    if (!Number.isFinite(n)) return onChange(min);
    onChange(Math.min(max, Math.max(min, n)));
  }

  return (
    <div className="stepper">
      <div className="stepper-text">
        <label htmlFor={id}>{label}</label>
        {hint && (
          <p id={hintId} className="hint">
            {hint}
          </p>
        )}
      </div>
      <div className="stepper-controls">
        <button
          type="button"
          className="stepper-button"
          onClick={() => set(value - 1)}
          disabled={value <= min}
          aria-label={`One fewer: ${label}`}
        >
          <span aria-hidden="true">&minus;</span>
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => set(event.target.value)}
          aria-describedby={hint ? hintId : undefined}
        />
        <button
          type="button"
          className="stepper-button"
          onClick={() => set(value + 1)}
          disabled={value >= max}
          aria-label={`One more: ${label}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
