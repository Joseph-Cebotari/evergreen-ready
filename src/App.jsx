import { useEffect, useMemo, useRef } from 'react';
import Home from './components/Home.jsx';
import Questionnaire from './components/Questionnaire.jsx';
import PlanView from './components/PlanView.jsx';
import { generatePlan } from './lib/generatePlan.js';
import { DEFAULT_HOUSEHOLD, normalizeHousehold } from './lib/household.js';
import { clearStored, useStoredState } from './lib/storage.js';
import { useHashRoute } from './lib/useHashRoute.js';

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

export default function App() {
  const [route, navigate] = useHashRoute();
  const [household, setHousehold] = useStoredState('household', DEFAULT_HOUSEHOLD, normalizeHousehold);
  const [hasPlan, setHasPlan] = useStoredState('hasPlan', false, Boolean);
  const [checked, setChecked] = useStoredState('checked', {}, asObject);
  const [familyPlan, setFamilyPlan] = useStoredState('familyPlan', {}, asObject);

  const plan = useMemo(() => generatePlan(household), [household]);

  // Someone who opens a link to the plan before answering the questions
  // is sent to the questions instead of seeing a plan for a default household.
  const screen = route === 'plan' && !hasPlan ? 'household' : route;

  // Changing screens replaces the page content, so focus moves to the top of
  // the new screen instead of being left on a button that no longer exists.
  const mainRef = useRef(null);
  const isFirstScreen = useRef(true);
  useEffect(() => {
    if (isFirstScreen.current) {
      isFirstScreen.current = false;
      return;
    }
    // preventScroll keeps the browser from scrolling the header out of view.
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [screen]);

  function finishQuestions(nextHousehold) {
    setHousehold(normalizeHousehold(nextHousehold));
    setHasPlan(true);
    navigate('plan');
  }

  function startOver() {
    clearStored(['household', 'hasPlan', 'checked', 'familyPlan']);
    setHousehold(DEFAULT_HOUSEHOLD);
    setHasPlan(false);
    setChecked({});
    setFamilyPlan({});
    navigate('home');
  }

  function toggleChecked(id) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="wordmark" href="#/home">
          QuakeReady <span className="wordmark-state">WA</span>
        </a>
        <nav aria-label="Main">
          {hasPlan ? (
            <a className="nav-link" href="#/plan" aria-current={screen === 'plan' ? 'page' : undefined}>
              My plan
            </a>
          ) : (
            <a className="nav-link" href="#/household" aria-current={screen === 'household' ? 'page' : undefined}>
              Build my plan
            </a>
          )}
        </nav>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1}>
        {screen === 'home' && <Home hasPlan={hasPlan} onStart={() => navigate(hasPlan ? 'plan' : 'household')} />}
        {screen === 'household' && (
          <Questionnaire
            initial={household}
            isEditing={hasPlan}
            onCancel={() => navigate(hasPlan ? 'plan' : 'home')}
            onFinish={finishQuestions}
          />
        )}
        {screen === 'plan' && (
          <PlanView
            plan={plan}
            checked={checked}
            onToggle={toggleChecked}
            familyPlan={familyPlan}
            onFamilyPlanChange={setFamilyPlan}
            onEdit={() => navigate('household')}
            onStartOver={startOver}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>
          QuakeReady WA is a student project and is not affiliated with any government agency. Its guidance is
          summarized from the official sources linked beside each item. In an emergency, call 911.
        </p>
        <p>Your answers stay in this browser. Nothing you enter is sent anywhere.</p>
      </footer>
    </>
  );
}
