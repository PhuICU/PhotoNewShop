import api from "./instanApi";

export const getCloudinaryImageById = async (id) =>
  api.get(`/cloudinary/${id}`);

export const uploadCloudinarySingleImage = async (data) =>
  api
    .post("/upload/single-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const uploadCloudinaryMultipleImages = async (data) =>
  api
    .post("/upload/multiple-images", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const destroyImages = async (data) =>
  api
    .post("/upload/destroy", data)
    .then((res) => res.data)
    .catch((err) => err.response.data);
