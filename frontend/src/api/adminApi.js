import axiosInstance from './axiosInstance';

export const getStats = () => axiosInstance.get('/admin/stats');
export const getAuditLogs = () => axiosInstance.get('/admin/audit-logs');
export const getAllUsers = () => axiosInstance.get('/users');
export const getAllCropsAdmin = () => axiosInstance.get('/admin/crops');
export const deleteCropAdmin = (id) => axiosInstance.delete(`/admin/crops/${id}`);
export const getAllProductsAdmin = () => axiosInstance.get('/admin/products');
export const deleteProductAdmin = (id) => axiosInstance.delete(`/admin/products/${id}`);
export const getAllTransactionsAdmin = () => axiosInstance.get('/admin/transactions');
export const getAllNotificationsAdmin = () => axiosInstance.get('/admin/notifications');