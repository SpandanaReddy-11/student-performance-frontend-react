import { useEffect, useRef, useState } from 'react';

// A pop-up form. fields = [{ name, label, type, required, options, value, min, step }]
export default function FormModal({ title, fields, submitLabel = 'Save', onSubmit, onClose }) {
  const dialogRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSubmit(Object.fromEntries(new FormData(e.target)));
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h3>{title}</h3>
        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            {f.type === 'select' ? (
              <select name={f.name} defaultValue={f.value}>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type || 'text'}
                defaultValue={f.value ?? ''}
                required={f.required}
                min={f.min}
                step={f.step}
                minLength={f.minLength}
              />
            )}
          </label>
        ))}
        <div className="error" role="alert">{error}</div>
        <div className="actions">
          <button type="button" className="ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={busy}>{submitLabel}</button>
        </div>
      </form>
    </dialog>
  );
}
