import api from "./instanApi";

export const register = async (user) => api.post("/users/register", user);
export const login = async (user) => api.post("/users/login", user);
export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/users/refresh-token");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const logout = async () => api.post("/users/logout");

export const verifyEmail = async (token) =>
  api.get(`/users/verify-email?token=${token}`);

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/users/forgot-password", email);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/users/reset-password", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const resendEmailVerification = async (user_id) =>
  api.get("/users/resend-email-verification", { params: { user_id } });

export const changePassword = async (data) => {
  try {
    const response = await api.post("/users/change-password", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getProfile = async () => api.get("/users/profile");

export const updateProfile = async (data) => api.put("/users/profile", data);

export const lockPost = async (id) => api.put(`/posts/lock/${id}`);

export const unlockPost = async (id) => api.put(`/posts/unlock/${id}`);

export const getLockPosts = async () => api.get("/posts/lock");

export const getAllUsers = async () => api.get("/users");

export const requestLockAccount = async (id) =>
  api.put(`/users/request-lock-account`);

export const requestUnlockAccount = async (id) =>
  api.put(`/users/request-unlock-account`);

export const lockAccount = async (user_id) =>
  api.put(`/users/lock-account/${user_id}`);

export const unlockAccount = async (user_id) =>
  api.put(`/users/unlock-account/${user_id}`);
