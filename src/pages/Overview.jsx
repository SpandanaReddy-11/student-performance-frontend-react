import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { fmtPct } from '../api';
import { useApi } from '../useApi';
import Badge from '../components/Badge';

export default function Overview() {
  const { data: s, error } = useApi('/students/analytics/summary');

  if (error) return <div className="panel"><p className="error">{error}</p></div>;
  if (!s) return <p className="sr-loading">Loading...</p>;

  return (
    <>
      <div className="page-head"><div><h2>Class overview</h2><p>How the whole class is doing right now.</p></div></div>

      <div className="grid cols-4">
        <div className="tile"><div className="num">{s.total}</div><div className="lbl">Students</div></div>
        <div className="tile good"><div className="num">{fmtPct(s.averageScore)}</div><div className="lbl">Average score</div></div>
        <div className="tile"><div className="num">{fmtPct(s.averageAttendance)}</div><div className="lbl">Average attendance</div></div>
        <div className="tile bad"><div className="num">{s.atRiskCount}</div><div className="lbl">Students at risk</div></div>
      </div>

      <div className="grid cols-2 stack">
        <div className="panel">
          <h3>Grade distribution</h3>
          <div className="chart-box">
            <Bar
              data={{ labels: Object.keys(s.gradeDistribution), datasets: [{ label: 'Students', data: Object.values(s.gradeDistribution), backgroundColor: '#2447a8', borderRadius: 6 }] }}
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }}
            />
          </div>
        </div>
        <div className="panel">
          <h3>Top performers</h3>
          {s.topPerformers.length ? (
            <ul className="mini-list">
              {s.topPerformers.map((t) => (
                <li key={t.id}><Link to={`/dashboard/students/${t.id}`}>{t.name}</Link><span>{t.average}%</span></li>
              ))}
            </ul>
          ) : <p className="empty">Add marks to see top performers.</p>}
        </div>
      </div>

      <div className="panel stack">
        <h3>Students who need support</h3>
        {s.needSupport.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Average</th><th>Attendance</th><th>Status</th></tr></thead>
              <tbody>
                {s.needSupport.map((t) => (
                  <tr key={t.id}>
                    <td><Link className="link" to={`/dashboard/students/${t.id}`}>{t.name}</Link> <small>{t.rollNo}</small></td>
                    <td>{fmtPct(t.average)}</td>
                    <td>{fmtPct(t.attendance)}</td>
                    <td><Badge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="empty">Nobody is flagged right now.</p>}
      </div>
    </>
  );
}
