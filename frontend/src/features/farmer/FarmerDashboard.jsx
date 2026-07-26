import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CropForm from './CropForm';
import CropCard from './CropCard';
import { getMyCrops, createCrop, updateCrop, deleteCrop } from '../../api/cropApi';

function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [editingCrop, setEditingCrop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCrops = async () => {
    try {
      const response = await getMyCrops();
      setCrops(response.data);
    } catch (err) {
      console.error('Failed to load crops', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingCrop) {
        await updateCrop(editingCrop.id, data);
      } else {
        await createCrop(data);
      }
      setShowForm(false);
      setEditingCrop(null);
      loadCrops();
    } catch (err) {
      alert('Failed to save crop: ' + (err.response?.data?.messages?.join(', ') || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop?')) return;
    try {
      await deleteCrop(id);
      loadCrops();
    } catch (err) {
      alert('Failed to delete crop');
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Crops</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditingCrop(null); }}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            {showForm ? 'Close' : '+ Add Crop'}
          </button>
        </div>

        {showForm && (
          <CropForm
            initialData={editingCrop}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setShowForm(false); setEditingCrop(null); }}
          />
        )}

        {loading ? (
          <p>Loading...</p>
        ) : crops.length === 0 ? (
          <p className="text-gray-500">No crops yet. Add your first crop above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onImageUploaded={loadCrops}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmerDashboard;