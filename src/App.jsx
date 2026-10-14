import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './components/Toast';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Overview';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Attendance from './pages/Attendance';

// Only logged-in users get in. Pass role="admin" or role="student" to limit a page.
function Protected({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

function DashboardHome() {
  const { user } = useAuth();
  return <Navigate to={user.role === 'admin' ? 'overview' : 'me'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
              <Route index element={<DashboardHome />} />
              <Route path="overview" element={<Protected role="admin"><Overview /></Protected>} />
              <Route path="students" element={<Protected role="admin"><Students /></Protected>} />
              <Route path="students/:id" element={<Protected role="admin"><StudentDetail /></Protected>} />
              <Route path="attendance" element={<Protected role="admin"><Attendance /></Protected>} />
              <Route path="me" element={<Protected role="student"><StudentDetail mine /></Protected>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
