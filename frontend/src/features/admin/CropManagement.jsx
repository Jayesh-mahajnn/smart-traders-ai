import { useState, useEffect } from 'react';
import { getAllCropsAdmin, deleteCropAdmin } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

function CropManagement() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllCropsAdmin();
      setCrops(res.data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load crops'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await deleteCropAdmin(deleteId);
      showToast('Crop removed', 'success');
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to delete crop'), 'error');
      setDeleteId(null);
    }
  };

  if (loading) return <Spinner />;
  if (crops.length === 0) return <EmptyState message="No crops on the platform yet" icon="🌾" />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
      <table className="w-full text-sm text-left min-w-[600px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Crop</th>
            <th className="p-3">Farmer</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Price</th>
            <th className="p-3">Listed</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3 font-medium">{c.cropName}</td>
              <td className="p-3">{c.farmerName}</td>
              <td className="p-3">{c.quantity} {c.unit}</td>
              <td className="p-3">₹{c.pricePerUnit}</td>
              <td className="p-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button onClick={() => setDeleteId(c.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Crop"
        message="This will permanently remove this crop listing from the platform."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default CropManagement;