import axiosInstance from './axiosInstance';

export const sendChatMessage = (message) => axiosInstance.post('/chat', { message });
export const getChatHistory = () => axiosInstance.get('/chat/history');
export const clearChatHistory = () => axiosInstance.delete('/chat/history');