import api from "./instanApi";

export const createComment = async (data) => api.post("/comments/create", data);

export const getComments = async () => api.get(`/comments/all`);
export const getCommentsOfPostId = async (postId) =>
  api.get(`/comments/${postId}`);
export const updateComment = async (id, data) =>
  api.put(`/comments/update/${id}`, data);

export const deleteComment = async (id) => api.delete(`/comments/delete/${id}`);
export const deleteAllCommentsOfPostID = async (postId) =>
  api.delete(`/comments/${postId}`);
