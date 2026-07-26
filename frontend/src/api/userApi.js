import axiosInstance from './axiosInstance';

export const getMyProfile = () => axiosInstance.get('/users/me');
export const updateProfile = (data) => axiosInstance.put('/users/me', data);
export const updateLocation = (data) => axiosInstance.put('/users/location', data);