import api from "./instanApi";

export const createFavorite = async (data) =>
  api.post("/favorites/create", data);

export const getFavoritesByUserIdAndPostId = async (userId, postId) =>
  api.get(`/favorites`);

export const unFavorite = async (id) => api.delete(`/favorites/delete/${id}`);

export const getAllFavoritesOfUser = async (userId) =>
  api.get(`/favorites/user`);

export const getAllFavoritePosts = async () => api.get(`/favorites/all-posts`);
