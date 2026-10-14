import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user.role === 'admin';

  const links = isAdmin
    ? [['overview', 'Overview'], ['students', 'Students'], ['attendance', 'Attendance']]
    : [['me', 'My performance']];

  return (
    <>
      <header className="top">
        <div className="brand"><img src="/logo.svg" alt="" />Student Performance Analysis</div>
        <nav id="nav" aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
          ))}
        </nav>
        <div className="who">
          <span>{user.name}{isAdmin ? ' (teacher)' : ''}</span>
          <button className="ghost" onClick={() => { logout(); navigate('/'); }}>Log out</button>
        </div>
      </header>
      <main><Outlet /></main>
    </>
  );
}
