import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(formData);
      const { token, id, fullName, email, role } = response.data;
      login({ id, fullName, email, role }, token);

      if (role === 'FARMER') navigate('/farmer');
      else if (role === 'TRADER') navigate('/trader');
      else if (role === 'VENDOR') navigate('/vendor');
      else if (role === 'ADMIN') navigate('/admin');
    } catch (err) {
      const messages = err.response?.data?.messages;
      setError(messages ? messages.join(', ') : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-800">Login</h2>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800">
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          No account? <Link to="/register" className="text-green-700 font-semibold">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;