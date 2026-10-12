import SourceLinks from './SourceLinks.jsx';
import { taskKey } from '../lib/generatePlan.js';

export default function HomeTasks({ tasks, checked, onToggle }) {
  return (
    <>
      <div className="panel-intro">
        <h2>Make your home safer</h2>
        <p>
          Most of these are one-time jobs that cost little or nothing. They are picked for your home, so the list
          changes if you rent, have natural gas, or live near the water.
        </p>
      </div>

      <ul className="check-list">
        {tasks.map((task) => {
          const inputId = `home-${task.id}`;
          const isChecked = Boolean(checked[taskKey(task.id)]);
          return (
            <li key={task.id} className={`check-item${isChecked ? ' is-checked' : ''}`}>
              <input id={inputId} type="checkbox" checked={isChecked} onChange={() => onToggle(taskKey(task.id))} />
              <div className="check-body">
                <label htmlFor={inputId} className="check-label">
                  <span className="check-name">{task.name}</span>
                </label>
                <p className="check-detail">{task.detail}</p>
                <SourceLinks sources={task.sources} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
