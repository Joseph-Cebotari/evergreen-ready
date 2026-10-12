import { useState } from 'react';
import SourceLinks from './SourceLinks.jsx';
import { PRIORITIES } from '../data/kitItems.js';
import { kitKey } from '../lib/generatePlan.js';

function KitItem({ item, isChecked, onToggle }) {
  const inputId = `kit-${item.id}`;
  return (
    <li className={`check-item${isChecked ? ' is-checked' : ''}`}>
      <input id={inputId} type="checkbox" checked={isChecked} onChange={() => onToggle(kitKey(item.id))} />
      <div className="check-body">
        <label htmlFor={inputId} className="check-label">
          <span className="check-name">{item.name}</span>
          {item.quantity && <span className="quantity">{item.quantity}</span>}
        </label>
        <p className="check-detail">{item.detail}</p>
        <p className={`priority priority-${item.priority}`}>{PRIORITIES[item.priority]}</p>
        <SourceLinks sources={item.sources} />
      </div>
    </li>
  );
}

export default function KitChecklist({ kit, checked, onToggle }) {
  const [onlyRemaining, setOnlyRemaining] = useState(false);

  const visible = kit
    .map((category) => ({
      ...category,
      done: category.items.filter((item) => checked[kitKey(item.id)]).length,
      shown: [...category.items]
        .sort((a, b) => a.priority - b.priority)
        .filter((item) => !onlyRemaining || !checked[kitKey(item.id)]),
    }))
    .filter((category) => category.shown.length > 0);

  return (
    <>
      <div className="panel-intro">
        <h2>Your kit</h2>
        <p>
          Quantities are worked out for your household and for 14 days. You do not have to buy it all at once: start
          with the items marked &ldquo;Start here&rdquo; and add a little each week.
        </p>
        <label className="choice choice-inline no-print">
          <input type="checkbox" checked={onlyRemaining} onChange={(event) => setOnlyRemaining(event.target.checked)} />
          <span>Show only what I still need</span>
        </label>
      </div>

      {visible.length === 0 && (
        <p className="empty">Your kit is complete. Check it every six months and swap out anything that has expired.</p>
      )}

      {visible.map((category) => (
        <section key={category.id} className="category" aria-labelledby={`category-${category.id}`}>
          <h3 id={`category-${category.id}`} className="category-title">
            {category.name}
            <span className="category-count">
              {category.done} of {category.items.length}
            </span>
          </h3>
          <ul className="check-list">
            {category.shown.map((item) => (
              <KitItem key={item.id} item={item} isChecked={Boolean(checked[kitKey(item.id)])} onToggle={onToggle} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
