import SeismoTrace from './SeismoTrace.jsx';
import SourceLinks from './SourceLinks.jsx';
import { TIMELINE, WHY_TWO_WEEKS } from '../data/facts.js';
import { resolveSources } from '../data/sources.js';

export default function Home({ hasPlan, onStart }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap">
          <h1 id="hero-title" className="hero-title">
            After a big earthquake, help could be two weeks away.
          </h1>
          <p className="hero-lede">{WHY_TWO_WEEKS.text}</p>
          <div className="hero-actions">
            <button type="button" className="button button-signal" onClick={onStart}>
              {hasPlan ? 'Open my plan' : 'Build my household plan'}
            </button>
            <p className="hero-note">Four short questions. No account, and nothing leaves your browser.</p>
          </div>
          <SourceLinks sources={resolveSources(WHY_TWO_WEEKS.sources)} />
        </div>

        <div className="wrap timeline-wrap">
          <h2 className="visually-hidden">Washington&apos;s earthquake record</h2>
          <SeismoTrace />
          <ol className="timeline">
            {TIMELINE.map((entry) => (
              <li key={entry.id} className="timeline-entry">
                <p className="timeline-when">{entry.when}</p>
                <h3 className="timeline-headline">{entry.headline}</h3>
                <p className="timeline-detail">{entry.detail}</p>
                <SourceLinks sources={resolveSources(entry.sources)} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap offer" aria-labelledby="offer-title">
        <h2 id="offer-title">What you get</h2>
        <dl className="offer-list">
          <div>
            <dt>A kit list sized to your household</dt>
            <dd>
              Tell it who lives with you, pets included, and it works out how much water, food, and medicine two
              weeks takes.
            </dd>
          </div>
          <div>
            <dt>Home fixes that cost little or nothing</dt>
            <dd>Simple jobs that make your home safer, matched to whether you rent or own.</dd>
          </div>
          <div>
            <dt>A family plan you can print</dt>
            <dd>Who to text, where to meet, and what to do when the shaking starts and stops.</dd>
          </div>
        </dl>
        <button type="button" className="button button-primary" onClick={onStart}>
          {hasPlan ? 'Open my plan' : 'Build my household plan'}
        </button>
      </section>
    </>
  );
}
