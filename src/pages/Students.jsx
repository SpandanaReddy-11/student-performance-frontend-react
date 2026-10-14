import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fmtPct } from '../api';
import { useApi } from '../useApi';
import Badge from '../components/Badge';
import FormModal from '../components/FormModal';
import { useToast } from '../components/Toast';

const STUDENT_FIELDS = [
  { name: 'rollNo', label: 'Roll number', required: true },
  { name: 'name', label: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'className', label: 'Class (e.g. 10-A)' },
  { name: 'guardian', label: 'Guardian name' },
  { name: 'phone', label: 'Phone' },
  { name: 'dob', label: 'Date of birth', type: 'date' },
  { name: 'password', label: 'Login password (optional, 6+ characters)', type: 'password', minLength: 6 },
];

export default function Students() {
  const { data: students, error, reload } = useApi('/students');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const toast = useToast();

  if (error) return <div className="panel"><p className="error">{error}</p></div>;
  if (!students) return <p className="sr-loading">Loading...</p>;

  const list = students.filter((s) => (s.name + s.rollNo + s.className).toLowerCase().includes(query.toLowerCase()));

  async function addStudent(values) {
    if (!values.password) delete values.password;
    await api('/students', { method: 'POST', body: values });
    toast('Student added');
    reload();
  }

  async function remove(s) {
    if (!window.confirm(`Delete ${s.name} and their login? This cannot be undone.`)) return;
    try {
      await api('/students/' + s.id, { method: 'DELETE' });
      toast('Student deleted');
      reload();
    } catch (err) {
      toast(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div><h2>Students</h2><p>{students.length} on the register.</p></div>
        <button className="primary" onClick={() => setAdding(true)}>Add student</button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <input type="search" placeholder="Search by name, roll number or class" aria-label="Search students" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Roll no.</th><th>Name</th><th>Class</th><th>Average</th><th>Grade</th><th>Attendance</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {list.length ? list.map((s) => (
                <tr key={s.id}>
                  <td className="num-col">{s.rollNo}</td>
                  <td><Link className="link" to={`/dashboard/students/${s.id}`}>{s.name}</Link></td>
                  <td>{s.className || '-'}</td>
                  <td className="num-col">{fmtPct(s.stats.average)}</td>
                  <td>{s.stats.grade}</td>
                  <td className="num-col">{fmtPct(s.stats.attendance.percentage)}</td>
                  <td><Badge status={s.stats.status} /></td>
                  <td>
                    <div className="row-actions">
                      <Link className="link" to={`/dashboard/students/${s.id}`}>View</Link>
                      <button className="link bad" onClick={() => remove(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="8" className="empty">No students match. Add one to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {adding && (
        <FormModal title="Add student" submitLabel="Add student" fields={STUDENT_FIELDS} onSubmit={addStudent} onClose={() => setAdding(false)} />
      )}
    </>
  );
}
