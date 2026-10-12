import { useRef, useState } from 'react';
import KitChecklist from './KitChecklist.jsx';
import HomeTasks from './HomeTasks.jsx';
import FamilyPlan from './FamilyPlan.jsx';
import QuakeGuide from './QuakeGuide.jsx';
import { describeHousehold } from '../lib/household.js';
import { kitKeys, taskKeys, progressFor } from '../lib/generatePlan.js';
import { buildShoppingList } from '../lib/shoppingList.js';
import { useStoredState } from '../lib/storage.js';

const TABS = [
  { id: 'kit', label: 'Kit' },
  { id: 'home', label: 'Home' },
  { id: 'family', label: 'Family plan' },
  { id: 'guide', label: 'When it shakes' },
];
const TAB_IDS = TABS.map((tab) => tab.id);

export default function PlanView({ plan, checked, onToggle, familyPlan, onFamilyPlanChange, onEdit, onStartOver }) {
  const [activeTab, setActiveTab] = useStoredState('tab', 'kit', (value) =>
    TAB_IDS.includes(value) ? value : 'kit'
  );
  const [copyStatus, setCopyStatus] = useState('');
  const [manualCopyText, setManualCopyText] = useState('');
  const [confirmingReset, setConfirmingReset] = useState(false);
  const tabRefs = useRef({});

  const kitProgress = progressFor(kitKeys(plan), checked);
  const taskProgress = progressFor(taskKeys(plan), checked);
  const overall = progressFor([...kitKeys(plan), ...taskKeys(plan)], checked);

  // Arrow keys move between tabs, as the ARIA tabs pattern expects.
  function onTabKeyDown(event) {
    const index = TAB_IDS.indexOf(activeTab);
    const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TAB_IDS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = TAB_IDS[(moves[event.key] + TAB_IDS.length) % TAB_IDS.length];
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  }

  async function copyShoppingList() {
    const text = buildShoppingList(plan, checked);
    try {
      await navigator.clipboard.writeText(text);
      setManualCopyText('');
      setCopyStatus('Shopping list copied. Paste it into a note or a message.');
    } catch {
      // Clipboard access can be blocked, so fall back to text the person can select.
      setManualCopyText(text);
      setCopyStatus('Copying is blocked in this browser. Select the list below and copy it.');
    }
  }

  return (
    <div className="wrap plan">
      <header className="plan-header">
        <div>
          <h1 className="plan-title">Your two-week plan</h1>
          <p className="plan-household">
            For {describeHousehold(plan.household)}.{' '}
            <button type="button" className="link-button no-print" onClick={onEdit}>
              Change household
            </button>
          </p>
        </div>

        <div className="progress-block">
          <label htmlFor="overall-progress">
            <strong>{overall.percent}%</strong> ready
          </label>
          <progress id="overall-progress" value={overall.done} max={overall.total || 1}>
            {overall.percent}%
          </progress>
          <p className="progress-detail">
            {kitProgress.done} of {kitProgress.total} kit items, {taskProgress.done} of {taskProgress.total} home
            jobs
          </p>
        </div>
      </header>

      <div className="plan-actions no-print">
        <button type="button" className="button button-primary" onClick={() => window.print()}>
          Print my plan
        </button>
        <button type="button" className="button button-outline" onClick={copyShoppingList}>
          Copy shopping list
        </button>
        <p className="status" role="status">
          {copyStatus}
        </p>
      </div>
      {manualCopyText && (
        <textarea
          className="manual-copy no-print"
          readOnly
          rows={10}
          value={manualCopyText}
          aria-label="Shopping list"
          onFocus={(event) => event.target.select()}
        />
      )}

      <div className="tabs no-print" role="tablist" aria-label="Plan sections" onKeyDown={onTabKeyDown}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className="tab"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Every panel stays in the page so printing includes the whole plan. */}
      <section role="tabpanel" id="panel-kit" aria-labelledby="tab-kit" className="panel" hidden={activeTab !== 'kit'}>
        <KitChecklist kit={plan.kit} checked={checked} onToggle={onToggle} />
      </section>
      <section role="tabpanel" id="panel-home" aria-labelledby="tab-home" className="panel" hidden={activeTab !== 'home'}>
        <HomeTasks tasks={plan.homeTasks} checked={checked} onToggle={onToggle} />
      </section>
      <section
        role="tabpanel"
        id="panel-family"
        aria-labelledby="tab-family"
        className="panel"
        hidden={activeTab !== 'family'}
      >
        <FamilyPlan fields={plan.familyFields} values={familyPlan} onChange={onFamilyPlanChange} />
      </section>
      <section
        role="tabpanel"
        id="panel-guide"
        aria-labelledby="tab-guide"
        className="panel"
        hidden={activeTab !== 'guide'}
      >
        <QuakeGuide guide={plan.guide} />
      </section>

      <p className="print-only print-note">
        Printed from QuakeReady WA. The reason and official source for every item are in the online plan.
      </p>

      <div className="reset no-print">
        {confirmingReset ? (
          <div className="reset-confirm" role="group" aria-label="Confirm start over">
            <p>This erases your household, checkmarks, and family plan from this browser.</p>
            <button type="button" className="button button-danger" onClick={onStartOver}>
              Erase and start over
            </button>
            <button type="button" className="button button-quiet" onClick={() => setConfirmingReset(false)}>
              Keep my plan
            </button>
          </div>
        ) : (
          <button type="button" className="link-button" onClick={() => setConfirmingReset(true)}>
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
