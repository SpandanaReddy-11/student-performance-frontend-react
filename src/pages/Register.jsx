import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const f = Object.fromEntries(new FormData(e.target));
    if (f.password !== f.confirm) {
      setError('The two passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await register(f.name, f.email, f.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      heading="See how you are doing, any day."
      text="Create your student account to view your results and attendance."
      points={['Marks and grades for every subject', 'Your attendance rate', 'Your score trend over time']}
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p>Use the email your teacher added for you, so we can find your record.</p>
        <label>Full name <input name="name" required autoComplete="name" /></label>
        <label>Email <input type="email" name="email" required autoComplete="username" /></label>
        <label>Password (6+ characters) <input type="password" name="password" minLength={6} required autoComplete="new-password" /></label>
        <label>Confirm password <input type="password" name="confirm" minLength={6} required autoComplete="new-password" /></label>
        <div className="error" role="alert">{error}</div>
        <button className="primary" type="submit" disabled={busy}>Create account</button>
        <p className="switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </AuthLayout>
  );
}
