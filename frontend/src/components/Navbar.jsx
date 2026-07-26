import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
      <span className="font-bold text-lg">Smart Traders AI</span>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.fullName} ({user.role})</span>
          <button onClick={handleLogout} className="bg-green-900 px-3 py-1 rounded text-sm hover:bg-green-950">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;