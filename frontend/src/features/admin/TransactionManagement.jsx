import { useState, useEffect } from 'react';
import { getAllTransactionsAdmin } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { STATUS_COLORS } from '../../utils/constants';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getAllTransactionsAdmin()
      .then((res) => setTransactions(res.data))
      .catch((err) => showToast(extractErrorMessage(err, 'Failed to load transactions'), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (transactions.length === 0) return <EmptyState message="No transactions on the platform yet" icon="💳" />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
      <table className="w-full text-sm text-left min-w-[700px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Crop</th>
            <th className="p-3">Farmer</th>
            <th className="p-3">Buyer</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3 font-medium">{t.cropName}</td>
              <td className="p-3">{t.farmerName}</td>
              <td className="p-3">{t.buyerName}</td>
              <td className="p-3">{t.quantity}</td>
              <td className="p-3">₹{t.totalPrice}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[t.status]}`}>
                  {t.status}
                </span>
              </td>
              <td className="p-3 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionManagement;