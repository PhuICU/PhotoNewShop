import api from "./instanApi";

export const createPayment = async (data) => api.post("/payments/create", data);

export const confirmPayment = async (id) => api.put(`/payments/confirm/${id}`);

export const getAllPayments = async () => api.get("/payments/");

export const getById = async (id) => api.get(`/payments/${id}`);

export const getPaymentByUserId = async (userId) =>
  api.get(`/payments/user/${userId}`);

export const updatePayment = async (id, data) =>
  api.put(`/payments/${id}`, data);

export const deletePaymentId = async (id) => api.delete(`/payments/${id}`);
