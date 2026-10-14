import { useEffect, useState } from 'react';
import { api, todayStr } from '../api';
import { useApi } from '../useApi';
import { useToast } from '../components/Toast';

const OPTIONS = ['present', 'late', 'absent'];

export default function Attendance() {
  const { data: students, error, reload } = useApi('/students');
  const [date, setDate] = useState(todayStr());
  const [status, setStatus] = useState({});
  const toast = useToast();

  // Fill the sheet with what is already saved for the chosen date (default: present)
  useEffect(() => {
    if (!students) return;
    const next = {};
    students.forEach((s) => {
      const record = s.attendance.find((a) => a.date === date);
      next[s.id] = record ? record.status : 'present';
    });
    setStatus(next);
  }, [students, date]);

  if (error) return <div className="panel"><p className="error">{error}</p></div>;
  if (!students) return <p className="sr-loading">Loading...</p>;

  function markAllPresent() {
    setStatus(Object.fromEntries(students.map((s) => [s.id, 'present'])));
  }

  async function save() {
    if (!date) return toast('Pick a date first');
    const records = students.map((s) => ({ studentId: s.id, status: status[s.id] || 'present' }));
    try {
      const r = await api('/students/attendance/bulk', { method: 'POST', body: { date, records } });
      toast(`Attendance saved for ${r.saved} students`);
      reload();
    } catch (err) {
      toast(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div><h2>Daily attendance</h2><p>Pick a date, set each student's status, then save.</p></div>
        <div className="toolbar">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Attendance date" />
          <button className="ghost" onClick={markAllPresent}>Mark all present</button>
          <button className="primary" onClick={save}>Save attendance</button>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Roll no.</th><th>Name</th><th>Class</th><th>Status</th></tr></thead>
            <tbody>
              {students.length ? students.map((s) => (
                <tr key={s.id}>
                  <td className="num-col">{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.className || '-'}</td>
                  <td>
                    <select className="att-select" aria-label={'Status for ' + s.name} value={status[s.id] || 'present'} onChange={(e) => setStatus({ ...status, [s.id]: e.target.value })}>
                      {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" className="empty">No students yet. Add students first.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
