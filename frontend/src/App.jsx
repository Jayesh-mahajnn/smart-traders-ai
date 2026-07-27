import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import FarmerDashboard from './features/farmer/FarmerDashboard';
import TraderDashboard from './features/trader/TraderDashboard';
import VendorDashboard from './features/vendor/VendorDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import ProfilePage from './features/profile/ProfilePage';
import CropDetail from './pages/CropDetail';
import NotFound from './pages/NotFound';
import ChatWidget from './components/ChatWidget';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/farmer" element={
          <ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>
        } />
        <Route path="/trader" element={
          <ProtectedRoute allowedRoles={['TRADER']}><TraderDashboard /></ProtectedRoute>
        } />
        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={['VENDOR']}><VendorDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/crops/:id" element={
          <ProtectedRoute><CropDetail /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {user && <ChatWidget />}
    </BrowserRouter>
  );
}

export default App;