import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CropForm from './CropForm';
import CropCard from './CropCard';
import MySales from './MySales';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { getMyCrops, createCrop, updateCrop, deleteCrop } from '../../api/cropApi';

function FarmerDashboard() {
  const [tab, setTab] = useState('crops');
  const [crops, setCrops] = useState([]);
  const [editingCrop, setEditingCrop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const loadCrops = async () => {
    setLoading(true);
    try {
      const response = await getMyCrops();
      setCrops(response.data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load crops'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'crops') loadCrops();
  }, [tab]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingCrop) {
        await updateCrop(editingCrop.id, data);
        showToast('Crop updated successfully', 'success');
      } else {
        await createCrop(data);
        showToast('Crop created successfully', 'success');
      }
      setShowForm(false);
      setEditingCrop(null);
      loadCrops();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to save crop'), 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCrop(deleteId);
      showToast('Crop deleted', 'success');
      setDeleteId(null);
      loadCrops();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to delete crop'), 'error');
      setDeleteId(null);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setTab('crops')}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${tab === 'crops' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
          >
            My Crops
          </button>
          <button
            onClick={() => setTab('sales')}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${tab === 'sales' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
          >
            My Sales
          </button>
        </div>

        {tab === 'crops' && (
          <>
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
              <Spinner />
            ) : crops.length === 0 ? (
              <EmptyState message="No crops yet. Add your first crop above." icon="🌱" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {crops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteId(id)}
                    onImageUploaded={loadCrops}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'sales' && <MySales />}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Crop"
        message="Are you sure you want to delete this crop? This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default FarmerDashboard;