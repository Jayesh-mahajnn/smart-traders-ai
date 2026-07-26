import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold text-green-800 mb-2">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Link to="/login" className="text-green-700 font-semibold hover:underline">
        Back to Login
      </Link>
    </div>
  );
}

export default NotFound;