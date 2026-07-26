import { useState } from 'react';
import { uploadCropImage } from '../../api/cropApi';
import { getImageUrl } from '../../utils/imageUrl';

function CropCard({ crop, onEdit, onDelete, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadCropImage(crop.id, file);
      onImageUploaded();
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {crop.imageUrl ? (
        <img src={getImageUrl(crop.imageUrl)} alt={crop.cropName} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg">{crop.cropName}</h3>
        <p className="text-sm text-gray-600">{crop.quantity} {crop.unit} available</p>
        <p className="text-green-700 font-semibold">₹{crop.pricePerUnit} / {crop.unit}</p>
        {crop.description && <p className="text-sm text-gray-500 mt-1">{crop.description}</p>}

        <label className="block mt-2 text-xs text-blue-600 cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        <div className="flex gap-2 mt-3">
          <button onClick={() => onEdit(crop)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            Edit
          </button>
          <button onClick={() => onDelete(crop.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default CropCard;