import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getMyProfile, updateProfile, updateLocation } from '../../api/userApi';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '' });
  const [locationData, setLocationData] = useState({ latitude: '', longitude: '' });
  const [message, setMessage] = useState('');

  const loadProfile = async () => {
    const response = await getMyProfile();
    setProfile(response.data);
    setFormData({ fullName: response.data.fullName, phoneNumber: response.data.phoneNumber || '' });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully');
      loadProfile();
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLocation({
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude),
      });
      setMessage('Location updated successfully');
    } catch (err) {
      setMessage('Failed to update location');
    }
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocationData({
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
      });
    });
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {message && <p className="mb-4 text-green-700 text-sm">{message}</p>}

        <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-bold mb-4">Basic Info</h3>
          <p className="text-sm text-gray-500 mb-3">Email: {profile.email} (cannot be changed)</p>
          <input value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Full Name" className="w-full mb-3 p-2 border rounded" required />
          <input value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="Phone Number" className="w-full mb-3 p-2 border rounded" />
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Save
          </button>
        </form>

        {(profile.role === 'FARMER' || profile.role === 'TRADER') && (
          <form onSubmit={handleLocationSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-4">Location (for Nearby Traders search)</h3>
            <div className="flex gap-2 mb-3">
              <input value={locationData.latitude}
                onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                placeholder="Latitude" className="p-2 border rounded flex-1" required />
              <input value={locationData.longitude}
                onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                placeholder="Longitude" className="p-2 border rounded flex-1" required />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={useCurrentLocation}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">
                Use Current Location
              </button>
              <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                Save Location
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;