import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import FarmerDashboard from './features/farmer/FarmerDashboard';
import TraderDashboard from './features/trader/TraderDashboard';
import VendorDashboard from './features/vendor/VendorDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import ProfilePage from './features/profile/ProfilePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trader"
          element={
            <ProtectedRoute allowedRoles={['TRADER']}>
              <TraderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;