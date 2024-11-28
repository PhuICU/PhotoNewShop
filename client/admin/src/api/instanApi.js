import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5010",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.config.url === "login") {
      const accessToken = "Bearer " + response.data.data.access_token;
      const refreshToken = response.data.data.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem("refreshToken");
        const response = await instance.post("/users/refresh-access-token", {
          refresh_token,
        });
        if (response.status === 200) {
          const newAccessToken = response.data.data.access_token;
          const newRefreshToken = response.data.data.refresh_token;

          // Update the local storage with new tokens
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update the authorization header in the original request with the new access token
          originalRequest.headers.Authorization = newAccessToken;

          return instance(originalRequest);
        }
      } catch (error) {
        // Handle the case where refresh token request fails
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
