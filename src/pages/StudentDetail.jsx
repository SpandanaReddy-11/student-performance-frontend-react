import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { api, fmtPct, todayStr } from '../api';
import { useApi } from '../useApi';
import { useAuth } from '../AuthContext';
import FormModal from '../components/FormModal';
import { useToast } from '../components/Toast';

const pct = (m) => Math.round((m.score / m.maxScore) * 1000) / 10;
const TONES = { 'On track': 'good', 'Needs attention': 'warn', 'At risk': 'bad' };

// Used for the teacher (/students/:id) and for the student's own page (mine)
export default function StudentDetail({ mine = false }) {
  const { id } = useParams();
  const { user } = useAuth();
  const canEdit = user.role === 'admin';
  const { data: s, error, reload } = useApi(mine ? '/students/me' : `/students/${id}`);
  const [modal, setModal] = useState(null); // 'mark' | 'attendance' | null
  const toast = useToast();

  if (error) return <div className="panel"><p className="error">{error}</p></div>;
  if (!s) return <p className="sr-loading">Loading...</p>;

  const st = s.stats;
  const att = st.attendance;
  const noLegend = { legend: { display: false } };

  async function save(path, values, message) {
    await api(`/students/${s.id}/${path}`, { method: 'POST', body: values });
    toast(message);
    reload();
  }

  async function remove(path, question) {
    if (!window.confirm(question)) return;
    try {
      await api(`/students/${s.id}/${path}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      toast(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          {canEdit && <Link className="link" to="/dashboard/students">Back to students</Link>}
          <h2>{s.name}</h2>
          <p>Roll no. {s.rollNo} &middot; {s.className || 'No class set'}</p>
        </div>
        {canEdit && (
          <div className="toolbar">
            <button className="ghost" onClick={() => setModal('mark')}>Add marks</button>
            <button className="primary" onClick={() => setModal('attendance')}>Mark attendance</button>
          </div>
        )}
      </div>

      <div className="grid cols-4">
        <div className="tile"><div className="num">{fmtPct(st.average)}</div><div className="lbl">Average score</div></div>
        <div className="tile"><div className="num">{st.grade}</div><div className="lbl">Overall grade</div></div>
        <div className="tile"><div className="num">{fmtPct(att.percentage)}</div><div className="lbl">Attendance ({att.present + att.late} of {att.total} days)</div></div>
        <div className={'tile ' + (TONES[st.status] || '')}><div className="num" style={{ fontSize: 22, padding: '6px 0' }}>{st.status}</div><div className="lbl">Standing</div></div>
      </div>

      <div className="panel stack">
        <h3>Student details</h3>
        <dl className="profile">
          <div><dt>Email</dt><dd>{s.email}</dd></div>
          <div><dt>Phone</dt><dd>{s.phone || '-'}</dd></div>
          <div><dt>Guardian</dt><dd>{s.guardian || '-'}</dd></div>
          <div><dt>Date of birth</dt><dd>{s.dob || '-'}</dd></div>
        </dl>
      </div>

      <div className="grid cols-3 stack">
        <div className="panel">
          <h3>Subject averages</h3>
          <div className="chart-box">
            <Bar
              data={{ labels: st.subjects.map((x) => x.subject), datasets: [{ data: st.subjects.map((x) => x.average), backgroundColor: '#2447a8', borderRadius: 6 }] }}
              options={{ maintainAspectRatio: false, plugins: noLegend, scales: { y: { beginAtZero: true, max: 100 } } }}
            />
          </div>
        </div>
        <div className="panel">
          <h3>Score trend</h3>
          <div className="chart-box">
            <Line
              data={{ labels: s.marks.map((m) => m.date), datasets: [{ data: s.marks.map(pct), borderColor: '#1f8a5b', backgroundColor: '#1f8a5b', tension: 0.3 }] }}
              options={{ maintainAspectRatio: false, plugins: noLegend, scales: { y: { beginAtZero: true, max: 100 } } }}
            />
          </div>
        </div>
        <div className="panel">
          <h3>Attendance split</h3>
          <div className="chart-box">
            <Doughnut
              data={{ labels: ['Present', 'Late', 'Absent'], datasets: [{ data: [att.present, att.late, att.absent], backgroundColor: ['#1f8a5b', '#b7791f', '#c43d4b'] }] }}
              options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </div>
      </div>

      <div className="grid cols-2 stack">
        <div className="panel">
          <div className="section-head"><h3>Marks</h3></div>
          {s.marks.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Subject</th><th>Exam</th><th>Score</th><th>%</th>{canEdit && <th />}</tr></thead>
                <tbody>
                  {[...s.marks].reverse().map((m) => (
                    <tr key={m.id}>
                      <td>{m.date}</td><td>{m.subject}</td><td>{m.exam}</td>
                      <td className="num-col">{m.score}/{m.maxScore}</td>
                      <td className="num-col">{pct(m)}%</td>
                      {canEdit && <td><button className="link bad" onClick={() => remove(`marks/${m.id}`, 'Remove this mark?')}>Remove</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">No marks recorded yet.</p>}
        </div>

        <div className="panel">
          <div className="section-head"><h3>Attendance log</h3></div>
          {s.attendance.length ? (
            <div className="table-wrap" style={{ maxHeight: 360, overflowY: 'auto' }}>
              <table>
                <thead><tr><th>Date</th><th>Status</th>{canEdit && <th />}</tr></thead>
                <tbody>
                  {[...s.attendance].reverse().map((a) => (
                    <tr key={a.date}>
                      <td>{a.date}</td>
                      <td className={a.status}>{a.status[0].toUpperCase() + a.status.slice(1)}</td>
                      {canEdit && <td><button className="link bad" onClick={() => remove(`attendance/${a.date}`, 'Remove this attendance entry?')}>Remove</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">No attendance recorded yet.</p>}
        </div>
      </div>

      {modal === 'mark' && (
        <FormModal
          title={'Add marks for ' + s.name}
          fields={[
            { name: 'subject', label: 'Subject', required: true },
            { name: 'exam', label: 'Exam (e.g. Unit test 1)', value: 'Unit test' },
            { name: 'score', label: 'Score', type: 'number', required: true, min: 0, step: 'any' },
            { name: 'maxScore', label: 'Out of', type: 'number', required: true, min: 1, step: 'any', value: 100 },
            { name: 'date', label: 'Date', type: 'date', value: todayStr() },
          ]}
          onSubmit={(v) => save('marks', v, 'Marks added')}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'attendance' && (
        <FormModal
          title={'Mark attendance for ' + s.name}
          fields={[
            { name: 'date', label: 'Date', type: 'date', value: todayStr(), required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['present', 'late', 'absent'], value: 'present' },
          ]}
          onSubmit={(v) => save('attendance', v, 'Attendance saved')}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
