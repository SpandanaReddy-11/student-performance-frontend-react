import { Link } from 'react-router-dom';

const FEATURES = [
  { title: 'Marks and grades', text: 'Enter scores by subject and exam. Averages and an overall grade update straight away.',
    icon: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3" /> },
  { title: 'Daily attendance', text: 'Mark a whole class in one go. Present, late and absent days roll up into an attendance rate.',
    icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" /></> },
  { title: 'Early warnings', text: 'Low marks or low attendance move a student to Needs attention or At risk before results slip.',
    icon: <path d="M12 3l10 18H2L12 3zM12 10v5M12 18h.01" /> },
  { title: 'Student profiles', text: "Keep contact details, guardian, class and date of birth next to each student's results.",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></> },
  { title: 'Charts and trends', text: 'See subject averages, score trends over time and attendance splits without building a report.',
    icon: <path d="M3 17l6-6 4 4 8-9M15 6h6v6" /> },
  { title: 'Secure access', text: 'Every user logs in. Teachers manage records, and students can only see their own.',
    icon: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></> },
];

const BARS = [['A+', 22], ['A', 52], ['B', 84], ['C', 64], ['D', 34], ['F', 14]];

export default function Home() {
  return (
    <>
      <header className="site-head">
        <div className="wrap">
          <Link className="logo" to="/"><img src="/logo.svg" alt="" />Student Performance Analysis</Link>
          <nav aria-label="Main">
            <a href="#features">Features</a>
            <a href="#roles">Who it's for</a>
            <a href="#how">How it works</a>
            <Link to="/login" className="login">Log in</Link>
            <Link to="/register" className="cta">Student sign up</Link>
          </nav>
        </div>
      </header>

      <main style={{ padding: 0, maxWidth: 'none' }}>
        <section className="hero-bg">
          <div className="wrap hero">
            <div>
              <h1>Student performance, clear at a glance.</h1>
              <p className="lead">Record marks and daily attendance in one place. Grades, trends and attendance rates are calculated for you, and students who need support are flagged early.</p>
              <div className="btns">
                <Link className="btn primary" to="/login">Log in</Link>
                <Link className="btn outline" to="/register">Student sign up</Link>
              </div>
              <p className="assure">Teachers log in with the account they were given. Students sign up with the email their teacher added.</p>
            </div>

            <div className="preview" role="img" aria-label="Sample class overview dashboard">
              <div className="pv-bar"><span className="dots"><i /><i /><i /></span><span>Class overview</span><span className="tag">Sample data</span></div>
              <div className="pv-body">
                <div className="pv-tiles">
                  <div className="tile"><div className="num">42</div><div className="lbl">Students</div></div>
                  <div className="tile good"><div className="num">74.3%</div><div className="lbl">Average score</div></div>
                  <div className="tile"><div className="num">91%</div><div className="lbl">Attendance</div></div>
                  <div className="tile bad"><div className="num">3</div><div className="lbl">At risk</div></div>
                </div>
                <div className="pv-grid">
                  <div className="pv-card">
                    <h4>Grade distribution</h4>
                    <div className="bars">
                      {BARS.map(([label, h]) => (
                        <div className="bar" key={label}><span style={{ height: h }} /><em>{label}</em></div>
                      ))}
                    </div>
                  </div>
                  <div className="pv-card">
                    <h4>Needs support</h4>
                    <ul className="pv-list">
                      <li>Kiran Das <span className="badge risk">At risk</span></li>
                      <li>Meena Iyer <span className="badge attn">Attention</span></li>
                      <li>Rohit Nair <span className="badge attn">Attention</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="wrap">
            <h2 className="section-title">Everything a class record needs</h2>
            <p className="section-sub">Replace scattered spreadsheets and paper registers with one record for each student.</p>
            <div className="features">
              {FEATURES.map((f) => (
                <div className="feature" key={f.title}>
                  <div className="ico"><svg viewBox="0 0 24 24" aria-hidden="true">{f.icon}</svg></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section tint" id="roles">
          <div className="wrap">
            <h2 className="section-title">Built for teachers and students</h2>
            <p className="section-sub">Each person sees what they need, and nothing they should not.</p>
            <div className="roles">
              <div className="role">
                <h3>For teachers</h3>
                <p>Run the whole class from one dashboard.</p>
                <ul className="checks">
                  <li>Add, edit and remove students</li>
                  <li>Record marks for any subject and exam</li>
                  <li>Take attendance for the whole class at once</li>
                  <li>Spot students who need support from the class overview</li>
                </ul>
              </div>
              <div className="role">
                <h3>For students</h3>
                <p>Know where you stand, any day of the term.</p>
                <ul className="checks">
                  <li>See marks and grades for every subject</li>
                  <li>Track your attendance rate</li>
                  <li>View your score trend over time</li>
                  <li>Check your standing without waiting for a report</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="wrap">
            <h2 className="section-title">How it works</h2>
            <p className="section-sub">Three steps from an empty register to a full picture of the class.</p>
            <ol className="steps">
              <li><h3>Teacher adds students</h3><p>Log in as a teacher and add each student with their class and guardian details.</p></li>
              <li><h3>Record marks and attendance</h3><p>Add test scores and take attendance each day. Charts and grades build themselves.</p></li>
              <li><h3>Students check progress</h3><p>Students sign up with the email their teacher used and see their own results.</p></li>
            </ol>
          </div>
        </section>

        <section className="cta-band">
          <div className="wrap">
            <div><h2>Open your dashboard</h2><p>Log in to continue, or create a student account.</p></div>
            <div className="btns">
              <Link className="btn primary" to="/login">Log in</Link>
              <Link className="btn outline" to="/register">Student sign up</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <Link className="logo" to="/"><img src="/logo.svg" alt="" />Student Performance Analysis</Link>
              <p>A student performance analysis system for marks, attendance and progress.</p>
            </div>
            <div><h4>Explore</h4><a href="#features">Features</a><a href="#roles">Who it's for</a><a href="#how">How it works</a></div>
            <div><h4>Account</h4><Link to="/login">Log in</Link><Link to="/register">Student sign up</Link></div>
          </div>
          <div className="copy">Student Performance Analysis</div>
        </div>
      </footer>
    </>
  );
}
