import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Toast from './components/Layout/Toast';
import Login from './pages/Login';

// Pages
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import AppointmentDetails from './pages/AppointmentDetails';
import Pets from './pages/Pets';
import PetForm from './pages/PetForm';
import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/Auth/AdminProtectedRoute';
import AdminAppointment from './pages/admin/AdminAppointment';
import AdminVeterinarian from './pages/admin/AdminVeterinarian';
import AdminUser from './pages/admin/AdminUser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <AdminProtectedRoute>
                <AdminAppointment />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/veterinarians"
            element={
              <AdminProtectedRoute>
                <AdminVeterinarian />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUser />
              </AdminProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id"
            element={
              <ProtectedRoute>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <Pets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/new"
            element={
              <ProtectedRoute>
                <PetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/edit/:id"
            element={
              <ProtectedRoute>
                <PetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
