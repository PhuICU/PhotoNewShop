import api from "./instanApi";

export const createNews = (news) => api.post("/news/create", news);

export const getNews = () => api.get("/news");

export const getNewsById = (id) => api.get(`/news/${id}`);

export const updateNewsById = (id, news) => api.put(`/news/${id}`, news);

export const deleteNewsById = (id) => api.delete(`/news/${id}`);

export const deleteManyNews = (news) => api.delete(`/news`, news);

export const deleteAllNews = () => api.delete(`/news`);
