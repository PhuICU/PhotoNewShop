import api from "./instanApi";

export const getPhotoNews = async () => {
  try {
    const response = await api.get("/photo-news");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createPhotoNew = async (data) => {
  try {
    const response = await api.post("/photo-news/create", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPhotoNewsById = async (id) => {
  try {
    const response = await api.get(`/photo-news/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updatePhotoNew = async (id, data) => {
  try {
    const response = await api.put(`/photo-news/${id}`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deletePhotoNew = async (id) => {
  try {
    const response = await api.delete(`/photo-news/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteManyPhotoNews = async (data) => {
  try {
    const response = await api.post(`/photo-news/delete-many`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPhotoNewsByUserId = async (id) => {
  try {
    const response = await api.get(`/photo-news/user/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPhotoNewsByStatus = async (status) => {
  try {
    const response = await api.get(`/photo-news/status/${status}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updatePostStatus = async (id, status) => {
  try {
    const response = await api.put(`/photo-news/update-status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await api.get("/photo-news");
    return response.data;
  } catch (error) {
    return error;
  }
};
