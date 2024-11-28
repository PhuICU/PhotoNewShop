import api from "./instanApi";

export const createChat = async (data) => api.post("/chat/create", data);

export const getChats = async (firstId, secondId) =>
  api.get(`/chat/all/${firstId}/${secondId}`);

export const getChatsOfUser = async (chatId) => api.get(`/chat/${chatId}`);

export const getChatById = async (id) => api.get(`/chat/chat/${id}`);
