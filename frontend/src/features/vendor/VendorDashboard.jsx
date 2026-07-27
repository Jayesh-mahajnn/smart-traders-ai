import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import BrowseCrops from '../trader/BrowseCrops';
import VendorPurchases from './VendorPurchases';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { getMyListings, createListing, updateListing, deleteListing } from '../../api/vendorApi';

function VendorDashboard() {
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '', category: '', pricePerUnit: '', unit: '', description: '',
  });
  const { showToast } = useToast();

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await getMyListings();
      setListings(response.data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load listings'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'listings') loadListings();
  }, [tab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ itemName: '', category: '', pricePerUnit: '', unit: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, pricePerUnit: parseFloat(formData.pricePerUnit) };
    try {
      if (editingId) {
        await updateListing(editingId, payload);
        showToast('Listing updated', 'success');
      } else {
        await createListing(payload);
        showToast('Listing created', 'success');
      }
      resetForm();
      loadListings();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to save listing'), 'error');
    }
  };

  const handleEdit = (listing) => {
    setFormData({
      itemName: listing.itemName,
      category: listing.category,
      pricePerUnit: listing.pricePerUnit,
      unit: listing.unit,
      description: listing.description || '',
    });
    setEditingId(listing.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteListing(deleteId);
      showToast('Listing deleted', 'success');
      setDeleteId(null);
      loadListings();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to delete listing'), 'error');
      setDeleteId(null);
    }
  };

  const tabs = [
    { key: 'listings', label: 'My Listings' },
    { key: 'buy', label: 'Buy Crops' },
    { key: 'purchases', label: 'My Purchases' },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                tab === t.key ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'listings' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Vendor Listings</h1>
              <button onClick={() => { showForm ? resetForm() : setShowForm(true); }}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                {showForm ? 'Close' : '+ Add Listing'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="itemName" placeholder="Item Name" value={formData.itemName}
                    onChange={handleChange} className="p-2 border rounded" required />
                  <input name="category" placeholder="Category (Seeds, Fertilizer...)" value={formData.category}
                    onChange={handleChange} className="p-2 border rounded" required />
                  <input name="pricePerUnit" type="number" step="0.01" placeholder="Price per Unit"
                    value={formData.pricePerUnit} onChange={handleChange} className="p-2 border rounded" required />
                  <input name="unit" placeholder="Unit" value={formData.unit}
                    onChange={handleChange} className="p-2 border rounded" required />
                </div>
                <textarea name="description" placeholder="Description" value={formData.description}
                  onChange={handleChange} className="w-full mt-3 p-2 border rounded" rows="2" />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <Spinner />
            ) : listings.length === 0 ? (
              <EmptyState message="No listings yet. Add your first one above." icon="🏪" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {listings.map((l) => (
                  <div key={l.id} className="bg-white rounded-lg shadow-md p-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{l.category}</span>
                    <h3 className="font-bold mt-2">{l.itemName}</h3>
                    <p className="text-green-700 font-semibold">₹{l.pricePerUnit} / {l.unit}</p>
                    {l.description && <p className="text-sm text-gray-500 mt-1">{l.description}</p>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEdit(l)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Edit</button>
                      <button onClick={() => setDeleteId(l.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'buy' && <BrowseCrops />}
        {tab === 'purchases' && <VendorPurchases />}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Listing"
        message="Are you sure you want to delete this listing?"
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default VendorDashboard;