import axiosInstance from './axiosInstance';

export const getStats = () => axiosInstance.get('/admin/stats');
export const getAuditLogs = () => axiosInstance.get('/admin/audit-logs');
export const getAllUsers = () => axiosInstance.get('/users');