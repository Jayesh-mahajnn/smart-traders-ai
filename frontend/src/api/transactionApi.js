import axiosInstance from './axiosInstance';

export const createTransaction = (data) => axiosInstance.post('/transactions', data);
export const getMyPurchases = () => axiosInstance.get('/transactions/my-purchases');
export const getMySales = () => axiosInstance.get('/transactions/my-sales');
export const updateTransactionStatus = (id, status) =>
  axiosInstance.patch(`/transactions/${id}/status?status=${status}`);