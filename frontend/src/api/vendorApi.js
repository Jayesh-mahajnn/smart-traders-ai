import axiosInstance from './axiosInstance';

export const getMyListings = () => axiosInstance.get('/vendor-listings/my-listings');
export const createListing = (data) => axiosInstance.post('/vendor-listings', data);
export const updateListing = (id, data) => axiosInstance.put(`/vendor-listings/${id}`, data);
export const deleteListing = (id) => axiosInstance.delete(`/vendor-listings/${id}`);
export const getAllListings = () => axiosInstance.get('/vendor-listings');