import api from "./instanApi";

export const creatReport = async (report) =>
  api.post("/reports-interaction/create", report);

export const updateReportStatus = async (report) =>
  api.put(`/reports-interaction/update-status`, report);

export const getReportById = async (reportId) =>
  api.get(`/reports-interaction/get-report/${reportId}`);

export const getReports = async () => api.get("/reports-interaction/get-all");

export const deleteReport = async (reportId) =>
  api.delete(`/reports-interaction/${reportId}`);

export const getReportsByReporterId = async (reporterId) =>
  api.get(`/reports-interaction/get-all-by-user`);

export const getReportsByType = async (type) =>
  api.get(`/reports-interaction/`);
