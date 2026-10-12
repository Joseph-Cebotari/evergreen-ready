import { useEffect, useRef, useState } from 'react';
import NumberStepper from './NumberStepper.jsx';
import { peopleCount } from '../lib/household.js';

const STEPS = [
  { id: 'people', title: 'Who lives in your home?' },
  { id: 'pets', title: 'Any pets?' },
  { id: 'needs', title: 'Does anyone have these needs?' },
  { id: 'home', title: 'What is your home like?' },
];

const NEED_OPTIONS = [
  ['prescriptions', 'Takes prescription medication'],
  ['poweredDevice', 'Relies on a medical device that needs electricity'],
  ['mobility', 'Uses a wheelchair, walker, or cane'],
  ['vision', 'Wears glasses or contact lenses'],
  ['hearing', 'Uses hearing aids'],
];

function RadioGroup({ legend, name, value, options, onChange }) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choices">
        {options.map(([optionValue, label]) => (
          <label key={optionValue} className="choice">
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label className="choice">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

export default function Questionnaire({ initial, isEditing, onCancel, onFinish }) {
  const [draft, setDraft] = useState(initial);
  const [stepIndex, setStepIndex] = useState(0);
  const headingRef = useRef(null);
  const isFirstRender = useRef(true);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const nobodyHome = peopleCount(draft) === 0;

  // Moving between steps replaces the whole form, so focus goes to the new
  // heading. Keyboard and screen reader users land at the top of the step.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  const setCount = (field) => (value) => setDraft((d) => ({ ...d, [field]: value }));
  const setNeed = (key) => (value) => setDraft((d) => ({ ...d, needs: { ...d.needs, [key]: value } }));
  const setHome = (key) => (value) => setDraft((d) => ({ ...d, home: { ...d.home, [key]: value } }));

  function handleSubmit(event) {
    event.preventDefault();
    if (nobodyHome) return;
    if (isLast) onFinish(draft);
    else setStepIndex(stepIndex + 1);
  }

  return (
    <div className="wrap wrap-narrow questionnaire">
      <ol className="step-track" aria-label="Progress">
        {STEPS.map((s, index) => (
          <li
            key={s.id}
            className={index < stepIndex ? 'is-done' : index === stepIndex ? 'is-current' : undefined}
            aria-current={index === stepIndex ? 'step' : undefined}
          >
            <span className="visually-hidden">
              Step {index + 1}: {s.title}
              {index < stepIndex ? ' (done)' : ''}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        <p className="step-count">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="step-title">
          {step.title}
        </h1>

        {step.id === 'people' && (
          <div className="fields">
            <p className="step-intro">Count everyone who would be at home with you, including yourself.</p>
            <NumberStepper label="Adults" hint="Ages 18 to 64" value={draft.adults} onChange={setCount('adults')} />
            <NumberStepper
              label="Older adults"
              hint="Age 65 and up"
              value={draft.seniors}
              onChange={setCount('seniors')}
            />
            <NumberStepper
              label="Children"
              hint="Ages 2 to 17"
              value={draft.children}
              onChange={setCount('children')}
            />
            <NumberStepper label="Infants" hint="Under 2" value={draft.infants} onChange={setCount('infants')} />
            {nobodyHome && (
              <p className="field-error" role="alert">
                Add at least one person to build a plan.
              </p>
            )}
          </div>
        )}

        {step.id === 'pets' && (
          <div className="fields">
            <p className="step-intro">Pets need two weeks of supplies too. Leave these at zero if you have none.</p>
            <NumberStepper label="Dogs" value={draft.dogs} onChange={setCount('dogs')} />
            <NumberStepper label="Cats" value={draft.cats} onChange={setCount('cats')} />
            <NumberStepper
              label="Other pets"
              hint="Birds, rabbits, reptiles, fish, and so on"
              value={draft.otherPets}
              onChange={setCount('otherPets')}
            />
          </div>
        )}

        {step.id === 'needs' && (
          <fieldset className="choice-group">
            <legend>Check any that apply to someone in your home. Skip this step if none do.</legend>
            <div className="choices choices-stacked">
              {NEED_OPTIONS.map(([key, label]) => (
                <Checkbox key={key} checked={draft.needs[key]} onChange={setNeed(key)}>
                  {label}
                </Checkbox>
              ))}
            </div>
          </fieldset>
        )}

        {step.id === 'home' && (
          <div className="fields">
            <RadioGroup
              legend="What kind of home is it?"
              name="home-type"
              value={draft.home.type}
              onChange={setHome('type')}
              options={[
                ['house', 'House, townhouse, or mobile home'],
                ['apartment', 'Apartment or condo'],
              ]}
            />
            <RadioGroup
              legend="Do you own or rent?"
              name="home-tenure"
              value={draft.home.tenure}
              onChange={setHome('tenure')}
              options={[
                ['own', 'Own'],
                ['rent', 'Rent'],
              ]}
            />
            <RadioGroup
              legend="Does your home use natural gas?"
              name="home-gas"
              value={draft.home.gas}
              onChange={setHome('gas')}
              options={[
                ['yes', 'Yes'],
                ['no', 'No'],
                ['unsure', 'Not sure'],
              ]}
            />
            <fieldset className="choice-group">
              <legend>Anything else?</legend>
              <div className="choices choices-stacked">
                <Checkbox checked={draft.home.coastal} onChange={setHome('coastal')}>
                  We live or spend time near saltwater: the coast, the Strait, or Puget Sound
                </Checkbox>
                <Checkbox checked={draft.hasCar} onChange={(value) => setDraft((d) => ({ ...d, hasCar: value }))}>
                  We have a car
                </Checkbox>
              </div>
            </fieldset>
          </div>
        )}

        <div className="form-actions">
          {stepIndex > 0 ? (
            <button type="button" className="button button-quiet" onClick={() => setStepIndex(stepIndex - 1)}>
              Back
            </button>
          ) : (
            <button type="button" className="button button-quiet" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="button button-primary" disabled={nobodyHome}>
            {isLast ? (isEditing ? 'Update my plan' : 'Build my plan') : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
