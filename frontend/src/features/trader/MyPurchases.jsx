import { useState, useEffect } from 'react';
import { getMyPurchases } from '../../api/transactionApi';

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    getMyPurchases().then((res) => setPurchases(res.data));
  }, []);

  const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Purchases</h2>
      <div className="space-y-2">
        {purchases.map((t) => (
          <div key={t.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{t.cropName} from {t.farmerName}</p>
              <p className="text-sm text-gray-600">{t.quantity} units — ₹{t.totalPrice}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[t.status]}`}>
              {t.status}
            </span>
          </div>
        ))}
        {purchases.length === 0 && <p className="text-gray-500">No purchases yet.</p>}
      </div>
    </div>
  );
}

export default MyPurchases;