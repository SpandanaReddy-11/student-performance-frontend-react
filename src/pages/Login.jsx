import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(e.target);
    try {
      await login(form.get('email'), form.get('password'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      heading="Welcome back to your class record."
      text="Log in to see marks, attendance and progress."
      points={['Subject averages and grades', 'Attendance rates with late and absent days', 'Early flags for students who need support']}
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <p>Enter your email and password to open your dashboard.</p>
        <label>Email <input type="email" name="email" required autoComplete="username" /></label>
        <label>Password <input type="password" name="password" required autoComplete="current-password" /></label>
        <div className="error" role="alert">{error}</div>
        <button className="primary" type="submit" disabled={busy}>Log in</button>
        <p className="switch">New student? <Link to="/register">Create an account</Link></p>
        <div className="hint">Teacher demo: admin@school.com / admin123</div>
      </form>
    </AuthLayout>
  );
}
