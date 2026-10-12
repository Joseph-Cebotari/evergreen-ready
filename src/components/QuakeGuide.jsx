import SourceLinks from './SourceLinks.jsx';
import { resolveSources } from '../data/sources.js';
import { formatDate, nextShakeOut } from '../lib/shakeout.js';

function StepList({ steps, className }) {
  return (
    <ol className={className}>
      {steps.map((step) => (
        <li key={step.id}>
          <h4>{step.name}</h4>
          <p>{step.detail}</p>
          <SourceLinks sources={step.sources} />
        </li>
      ))}
    </ol>
  );
}

export default function QuakeGuide({ guide }) {
  return (
    <>
      <div className="panel-intro">
        <h2>When it shakes</h2>
        <p>
          You will have seconds, not minutes. Read this now so nobody has to think about it later. An earthquake
          alert on your phone means the same thing as feeling the ground move: act right away.
        </p>
      </div>

      <section aria-labelledby="during-title">
        <h3 id="during-title" className="category-title">
          During the shaking
        </h3>
        <StepList steps={guide.during} className="dch" />

        <ul className="variations">
          {guide.variations.map((variation) => (
            <li key={variation.id}>
              <h4>{variation.name}</h4>
              <p>{variation.detail}</p>
              <SourceLinks sources={variation.sources} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="after-title">
        <h3 id="after-title" className="category-title">
          When the shaking stops
        </h3>
        <StepList steps={guide.after} className="after-steps" />
      </section>

      <aside className="callout" aria-labelledby="shakeout-title">
        <h3 id="shakeout-title">Practice it</h3>
        <p>
          The next Great Washington ShakeOut drill is on <strong>{formatDate(nextShakeOut())}</strong>. Practice
          Drop, Cover, and Hold On with everyone in your household that day.
        </p>
        <SourceLinks sources={resolveSources(['waemd-earthquake'])} />
      </aside>
    </>
  );
}
