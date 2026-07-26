import axiosInstance from './axiosInstance';

export const getMyProducts = () => axiosInstance.get('/products/my-products');
export const createProduct = (data) => axiosInstance.post('/products', data);
export const getAllProducts = () => axiosInstance.get('/products');