import { useState, useEffect } from 'react';

function CropForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cropName: initialData.cropName,
        quantity: initialData.quantity,
        unit: initialData.unit,
        pricePerUnit: initialData.pricePerUnit,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4">{initialData ? 'Edit Crop' : 'Add New Crop'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <input name="cropName" placeholder="Crop Name" value={formData.cropName}
          onChange={handleChange} className="p-2 border rounded" required />
        <input name="unit" placeholder="Unit (kg, quintal)" value={formData.unit}
          onChange={handleChange} className="p-2 border rounded" required />
        <input name="quantity" type="number" step="0.01" placeholder="Quantity" value={formData.quantity}
          onChange={handleChange} className="p-2 border rounded" required />
        <input name="pricePerUnit" type="number" step="0.01" placeholder="Price per Unit" value={formData.pricePerUnit}
          onChange={handleChange} className="p-2 border rounded" required />
      </div>
      <textarea name="description" placeholder="Description (optional)" value={formData.description}
        onChange={handleChange} className="w-full mt-3 p-2 border rounded" rows="2" />
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          {initialData ? 'Update' : 'Create'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CropForm;