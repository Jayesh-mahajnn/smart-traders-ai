import { useState, useEffect } from 'react';
import { getMyProducts, createProduct } from '../../api/productApi';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '', quantityNeeded: '', unit: '', maxPricePerUnit: '', description: '',
  });

  const loadProducts = async () => {
    const response = await getMyProducts();
    setProducts(response.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...formData,
        quantityNeeded: parseFloat(formData.quantityNeeded),
        maxPricePerUnit: parseFloat(formData.maxPricePerUnit),
      });
      setFormData({ productName: '', quantityNeeded: '', unit: '', maxPricePerUnit: '', description: '' });
      setShowForm(false);
      loadProducts();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.messages?.join(', ') || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Product Requests</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          {showForm ? 'Close' : '+ New Request'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input name="productName" placeholder="Product Name" value={formData.productName}
              onChange={handleChange} className="p-2 border rounded" required />
            <input name="unit" placeholder="Unit" value={formData.unit}
              onChange={handleChange} className="p-2 border rounded" required />
            <input name="quantityNeeded" type="number" step="0.01" placeholder="Quantity Needed"
              value={formData.quantityNeeded} onChange={handleChange} className="p-2 border rounded" required />
            <input name="maxPricePerUnit" type="number" step="0.01" placeholder="Max Price"
              value={formData.maxPricePerUnit} onChange={handleChange} className="p-2 border rounded" required />
          </div>
          <textarea name="description" placeholder="Description" value={formData.description}
            onChange={handleChange} className="w-full mt-3 p-2 border rounded" rows="2" />
          <button type="submit" className="mt-3 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Submit
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold">{p.productName}</h3>
            <p className="text-sm">{p.quantityNeeded} {p.unit} needed</p>
            <p className="text-green-700 font-semibold">Max ₹{p.maxPricePerUnit} / {p.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProducts;