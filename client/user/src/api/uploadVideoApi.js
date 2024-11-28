import api from "./instanApi";

export const createVideo = async (data) =>
  api.post("/upload-video/create", data);

export const uploadMutipleVideos = async (data) =>
  api.post("/upload-video/multiple", data);
