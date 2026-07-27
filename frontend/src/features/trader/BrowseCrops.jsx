import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchCropsPaginated } from '../../api/cropApi';
import { getImageUrl } from '../../utils/imageUrl';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

function BrowseCrops() {
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({ cropName: '', minPrice: '', maxPrice: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadCrops = async (pageNum = 0) => {
    setLoading(true);
    const params = { page: pageNum, size: 6 };
    if (filters.cropName) params.cropName = filters.cropName;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    try {
      const response = await searchCropsPaginated(params);
      setCrops(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load crops'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops(0);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => loadCrops(0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Browse Crops</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input name="cropName" placeholder="Search by name" value={filters.cropName}
          onChange={handleFilterChange} className="p-2 border rounded flex-1" />
        <input name="minPrice" type="number" placeholder="Min Price" value={filters.minPrice}
          onChange={handleFilterChange} className="p-2 border rounded sm:w-32" />
        <input name="maxPrice" type="number" placeholder="Max Price" value={filters.maxPrice}
          onChange={handleFilterChange} className="p-2 border rounded sm:w-32" />
        <button onClick={handleSearch} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          Search
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : crops.length === 0 ? (
        <EmptyState message="No crops found matching your filters" icon="🔍" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {crops.map((crop) => (
              <Link
                to={`/crops/${crop.id}`}
                key={crop.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow block"
              >
                {crop.imageUrl && (
                  <img src={getImageUrl(crop.imageUrl)} alt={crop.cropName}
                    className="w-full h-32 object-cover rounded mb-2" />
                )}
                <h3 className="font-bold">{crop.cropName}</h3>
                <p className="text-sm text-gray-600">by {crop.farmerName}</p>
                <p className="text-sm">{crop.quantity} {crop.unit} available</p>
                <p className="text-green-700 font-semibold">₹{crop.pricePerUnit} / {crop.unit}</p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 0} onClick={() => loadCrops(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
              <span className="px-3 py-1">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => loadCrops(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BrowseCrops;