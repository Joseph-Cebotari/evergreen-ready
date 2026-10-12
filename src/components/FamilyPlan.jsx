import SourceLinks from './SourceLinks.jsx';

export default function FamilyPlan({ fields, values, onChange }) {
  const filled = fields.filter((field) => String(values[field.id] || '').trim() !== '').length;

  function update(id, value) {
    onChange((current) => ({ ...current, [id]: value }));
  }

  return (
    <>
      <div className="panel-intro">
        <h2>Your family plan</h2>
        <p>
          Phones and internet may be down, and you may not be together when it happens. Fill this in, print it, and
          give everyone a copy. What you type is saved in this browser only.
        </p>
        <p className="progress-detail no-print">
          {filled} of {fields.length} filled in
        </p>
      </div>

      <form className="plan-form" onSubmit={(event) => event.preventDefault()}>
        {fields.map((field) => {
          const inputId = `family-${field.id}`;
          const hintId = `${inputId}-hint`;
          const shared = {
            id: inputId,
            value: values[field.id] || '',
            onChange: (event) => update(field.id, event.target.value),
            'aria-describedby': hintId,
            autoComplete: field.autoComplete || 'off',
          };
          return (
            <div key={field.id} className="plan-field">
              <label htmlFor={inputId}>{field.label}</label>
              <p id={hintId} className="hint">
                {field.hint}
              </p>
              {field.multiline ? <textarea rows={3} {...shared} /> : <input type={field.type || 'text'} {...shared} />}
              <SourceLinks sources={field.sources} />
            </div>
          );
        })}
      </form>
    </>
  );
}
