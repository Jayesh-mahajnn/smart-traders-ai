import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { getCropById } from '../api/cropApi';
import { createTransaction } from '../api/transactionApi';
import { useToast } from '../context/ToastContext';
import { extractErrorMessage } from '../utils/errorHandler';
import { getImageUrl } from '../utils/imageUrl';

function CropDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quantityError, setQuantityError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    getCropById(id)
      .then((res) => setCrop(res.data))
      .catch((err) => showToast(extractErrorMessage(err, 'Crop not found'), 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const validateQuantity = () => {
    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setQuantityError('Enter a valid quantity greater than zero');
      return false;
    }
    if (crop && qty > crop.quantity) {
      setQuantityError(`Only ${crop.quantity} ${crop.unit} available`);
      return false;
    }
    setQuantityError('');
    return true;
  };

  const handleBuyClick = () => {
    if (validateQuantity()) setConfirmOpen(true);
  };

  const confirmPurchase = async () => {
    try {
      await createTransaction({ cropId: crop.id, quantity: parseFloat(quantity) });
      showToast('Purchase request sent successfully!', 'success');
      setConfirmOpen(false);
      navigate(-1);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Purchase failed'), 'error');
      setConfirmOpen(false);
    }
  };

  if (loading) return (<div><Navbar /><Spinner /></div>);
  if (!crop) return (<div><Navbar /><p className="p-6 text-gray-500">Crop not found.</p></div>);

  const estimatedTotal = quantity && !isNaN(parseFloat(quantity))
    ? (parseFloat(quantity) * crop.pricePerUnit).toFixed(2)
    : '0.00';

  return (
    <div>
      <Navbar />
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-green-700 mb-4 hover:underline">
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {crop.imageUrl ? (
            <img src={getImageUrl(crop.imageUrl)} alt={crop.cropName} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold">{crop.cropName}</h1>
            <p className="text-gray-500 mb-3">Sold by {crop.farmerName}</p>

            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-xl font-bold text-green-700">₹{crop.pricePerUnit} / {crop.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-xl font-bold">{crop.quantity} {crop.unit}</p>
              </div>
            </div>

            {crop.description && <p className="text-gray-600 mb-4">{crop.description}</p>}

            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-semibold mb-1">Quantity to buy ({crop.unit})</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setQuantityError(''); }}
                className="p-2 border rounded w-full sm:w-48"
                placeholder={`Max ${crop.quantity}`}
              />
              {quantityError && <p className="text-red-600 text-xs mt-1">{quantityError}</p>}

              <p className="text-sm text-gray-600 mt-2">Estimated total: <span className="font-semibold">₹{estimatedTotal}</span></p>

              <button
                onClick={handleBuyClick}
                className="mt-3 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Purchase"
        message={`Buy ${quantity} ${crop.unit} of ${crop.cropName} for an estimated ₹${estimatedTotal}?`}
        confirmLabel="Confirm Purchase"
        onConfirm={confirmPurchase}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default CropDetail;