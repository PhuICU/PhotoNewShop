import api from "./instanApi";

export const createMessage = async (data) => api.post("/messages/create", data);

export const getMessages = async (chatId) => api.get(`/messages/${chatId}`);

export const findMessageById = async (firstId, secondId) =>
  api.get(`/messages/${firstId}/${secondId}`);
