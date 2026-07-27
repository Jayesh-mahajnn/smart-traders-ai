import { useState, useEffect } from 'react';
import { getMySales, updateTransactionStatus } from '../../api/transactionApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { STATUS_COLORS, TRANSACTION_STATUS } from '../../utils/constants';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

function MySales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');
  const [confirmAction, setConfirmAction] = useState(null); // { id, status }
  const { showToast } = useToast();

  const loadSales = async () => {
    setLoading(true);
    try {
      const response = await getMySales();
      setSales(response.data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load sales'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filteredSales = tab === 'ALL' ? sales : sales.filter((s) => s.status === tab);

  const revenueStats = {
    total: sales.reduce((sum, s) => sum + (s.status === 'COMPLETED' ? s.totalPrice : 0), 0),
    pending: sales.filter((s) => s.status === 'PENDING').length,
    accepted: sales.filter((s) => s.status === 'ACCEPTED').length,
    completed: sales.filter((s) => s.status === 'COMPLETED').length,
  };

  const handleStatusChange = (id, status) => {
    setConfirmAction({ id, status });
  };

  const confirmStatusChange = async () => {
    const { id, status } = confirmAction;
    try {
      await updateTransactionStatus(id, status);
      showToast(`Transaction marked as ${status}`, 'success');
      setConfirmAction(null);
      loadSales();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to update status'), 'error');
      setConfirmAction(null);
    }
  };

  const tabs = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Sales</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-green-700">₹{revenueStats.total.toFixed(2)}</p>
          <p className="text-xs text-gray-600">Completed Revenue</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{revenueStats.pending}</p>
          <p className="text-xs text-gray-600">Pending Requests</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{revenueStats.accepted}</p>
          <p className="text-xs text-gray-600">Accepted</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{revenueStats.completed}</p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              tab === t ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : filteredSales.length === 0 ? (
        <EmptyState message="No sales in this category yet" icon="🌾" />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Crop</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.cropName}</td>
                  <td className="p-3">{s.buyerName}</td>
                  <td className="p-3">{s.quantity}</td>
                  <td className="p-3">₹{s.totalPrice}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {s.status === TRANSACTION_STATUS.PENDING && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStatusChange(s.id, 'ACCEPTED')}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'REJECTED')}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {s.status === TRANSACTION_STATUS.ACCEPTED && (
                      <button
                        onClick={() => handleStatusChange(s.id, 'COMPLETED')}
                        className="bg-green-700 text-white px-2 py-1 rounded text-xs hover:bg-green-800"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title="Update Transaction"
        message={`Mark this transaction as ${confirmAction?.status}?`}
        confirmLabel="Yes, Update"
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}

export default MySales;