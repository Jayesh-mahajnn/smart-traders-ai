import axiosInstance from './axiosInstance';

export const getMyCrops = () => axiosInstance.get('/crops/my-crops');
export const createCrop = (data) => axiosInstance.post('/crops', data);
export const updateCrop = (id, data) => axiosInstance.put(`/crops/${id}`, data);
export const deleteCrop = (id) => axiosInstance.delete(`/crops/${id}`);
export const uploadCropImage = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post(`/crops/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const searchCrops = (params) => axiosInstance.get('/crops/search', { params });
export const searchCropsPaginated = (params) => axiosInstance.get('/crops/search/paginated', { params });
export const getCropById = (id) => axiosInstance.get(`/crops/${id}`);