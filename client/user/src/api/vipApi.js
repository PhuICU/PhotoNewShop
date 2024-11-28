import api from "./instanApi";

export const createVip = async (vip) => api.post("/vip-packages/create", vip);

export const getVips = async () => api.get("/vip-packages");

export const getVipById = async (vipId) => api.get(`/vip-packages/${vipId}`);

export const updateVip = async (vipId, vip) =>
  api.put(`/vip-packages/${vipId}`, vip);

export const deleteVipById = async (vipId) =>
  api.delete(`/vip-packages/${vipId}`);

export const deleteAllVips = async () => api.delete("/vip-packages/delete-all");

export const getActiveVipPackages = async () => api.get("/vip-packages/active");

export const getInactiveVipPackages = async () =>
  api.get("/vip-packages/inactive");

export const getAllUserVipDetails = async () => api.get(`/user-vips`);

export const getVipUserHistoryByUserId = async (userId) =>
  api.get(`/user-vips/history`);

export const getCurrentActiveVip = async () =>
  api.get(`/user-vips/current-active`);

export const getAllVipUserDetails = async () =>
  api.get(`/user-vips/all-details`);
