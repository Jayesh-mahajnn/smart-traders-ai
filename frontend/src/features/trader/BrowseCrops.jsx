import { useState, useEffect } from 'react';
import { searchCrops } from '../../api/cropApi';
import { createTransaction } from '../../api/transactionApi';

function BrowseCrops() {
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({ cropName: '', minPrice: '', maxPrice: '' });
  const [buyingCropId, setBuyingCropId] = useState(null);
  const [quantity, setQuantity] = useState('');

  const loadCrops = async () => {
    const params = {};
    if (filters.cropName) params.cropName = filters.cropName;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    const response = await searchCrops(params);
    setCrops(response.data);
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleBuy = async (cropId) => {
    try {
      await createTransaction({ cropId, quantity: parseFloat(quantity) });
      alert('Purchase request sent!');
      setBuyingCropId(null);
      setQuantity('');
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.messages?.join(', ') || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Browse Crops</h2>

      <div className="flex gap-2 mb-4">
        <input name="cropName" placeholder="Search by name" value={filters.cropName}
          onChange={handleFilterChange} className="p-2 border rounded flex-1" />
        <input name="minPrice" type="number" placeholder="Min Price" value={filters.minPrice}
          onChange={handleFilterChange} className="p-2 border rounded w-32" />
        <input name="maxPrice" type="number" placeholder="Max Price" value={filters.maxPrice}
          onChange={handleFilterChange} className="p-2 border rounded w-32" />
        <button onClick={loadCrops} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-lg shadow-md p-4">
            {crop.imageUrl && (
              <img src={`http://localhost:8080${crop.imageUrl}`} alt={crop.cropName}
                className="w-full h-32 object-cover rounded mb-2" />
            )}
            <h3 className="font-bold">{crop.cropName}</h3>
            <p className="text-sm text-gray-600">by {crop.farmerName}</p>
            <p className="text-sm">{crop.quantity} {crop.unit} available</p>
            <p className="text-green-700 font-semibold">₹{crop.pricePerUnit} / {crop.unit}</p>

            {buyingCropId === crop.id ? (
              <div className="mt-2 flex gap-2">
                <input type="number" placeholder="Qty" value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="p-1 border rounded w-20 text-sm" />
                <button onClick={() => handleBuy(crop.id)}
                  className="bg-green-700 text-white px-2 py-1 rounded text-sm">Confirm</button>
                <button onClick={() => setBuyingCropId(null)}
                  className="bg-gray-300 px-2 py-1 rounded text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setBuyingCropId(crop.id)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Buy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseCrops;