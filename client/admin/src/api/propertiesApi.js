import api from "./instanApi";

export const createProperty = async (data) =>
  api.post("/properties/create", data);

export const getProperties = async () => api.get("/properties");

export const editProperty = async (id, data) =>
  api.put(`/properties/${id}`, data);

export const deleteOne = async (id) => api.delete(`/properties/${id}`);

export const deleteMany = async (ids) =>
  api.delete("/properties", { data: { ids } });

export const deleteAll = async () => api.delete("/properties/all");
