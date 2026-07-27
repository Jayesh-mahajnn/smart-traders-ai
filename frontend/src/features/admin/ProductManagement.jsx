import { useState, useEffect } from 'react';
import { getAllProductsAdmin, deleteProductAdmin } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllProductsAdmin();
      setProducts(res.data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load products'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await deleteProductAdmin(deleteId);
      showToast('Product removed', 'success');
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to delete product'), 'error');
      setDeleteId(null);
    }
  };

  if (loading) return <Spinner />;
  if (products.length === 0) return <EmptyState message="No product requests on the platform yet" icon="📦" />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
      <table className="w-full text-sm text-left min-w-[600px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Trader</th>
            <th className="p-3">Qty Needed</th>
            <th className="p-3">Max Price</th>
            <th className="p-3">Listed</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3 font-medium">{p.productName}</td>
              <td className="p-3">{p.traderName}</td>
              <td className="p-3">{p.quantityNeeded} {p.unit}</td>
              <td className="p-3">₹{p.maxPricePerUnit}</td>
              <td className="p-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button onClick={() => setDeleteId(p.id)}
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
        title="Remove Product Request"
        message="This will permanently remove this product request from the platform."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default ProductManagement;