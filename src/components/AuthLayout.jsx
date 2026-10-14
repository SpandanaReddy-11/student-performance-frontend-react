import { Link } from 'react-router-dom';

// Split screen used by the login and registration pages
export default function AuthLayout({ heading, text, points, children }) {
  return (
    <div className="auth-split">
      <aside className="auth-panel">
        <Link className="logo" to="/"><img src="/logo.svg" alt="" />Student Performance Analysis</Link>
        <div>
          <h2>{heading}</h2>
          <p>{text}</p>
          <ul className="checks">{points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <span />
      </aside>
      <section className="auth-main">
        <div className="auth-top"><Link to="/">Back to home</Link></div>
        <div className="auth-body">{children}</div>
      </section>
    </div>
  );
}
