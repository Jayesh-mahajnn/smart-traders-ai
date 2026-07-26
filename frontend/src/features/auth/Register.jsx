import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authApi';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'FARMER',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      const messages = err.response?.data?.messages;
      setError(messages ? messages.join(', ') : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-800">Register</h2>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
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
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="FARMER">Farmer</option>
          <option value="TRADER">Trader</option>
          <option value="VENDOR">Vendor</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800">
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-green-700 font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;