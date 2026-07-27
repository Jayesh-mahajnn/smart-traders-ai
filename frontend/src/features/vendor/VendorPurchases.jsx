import { useState, useEffect } from 'react';
import { getMyPurchases } from '../../api/transactionApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { STATUS_COLORS } from '../../utils/constants';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

function VendorPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getMyPurchases()
      .then((res) => setPurchases(res.data))
      .catch((err) => showToast(extractErrorMessage(err, 'Failed to load purchases'), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Purchases</h2>
      {purchases.length === 0 ? (
        <EmptyState message="No purchases yet" icon="🛒" />
      ) : (
        <div className="space-y-2">
          {purchases.map((t) => (
            <div key={t.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center flex-wrap gap-2">
              <div>
                <p className="font-semibold">{t.cropName} from {t.farmerName}</p>
                <p className="text-sm text-gray-600">{t.quantity} units — ₹{t.totalPrice}</p>
                <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[t.status]}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorPurchases;