import axios from "axios";

export const getProvinces = async () => {
  try {
    const response = await axios.get(" http://localhost:8000/province");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getDistricts = async (provinceId) => {
  try {
    const response = await axios.get(`http://localhost:8000/district`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getWards = async (districtId) => {
  try {
    const response = await axios.get(`http://localhost:8000/commune`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getNearbyProvinces = async (province) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: "json",
          q: province,
          addressdetails: 1,
        },
      }
    );
    const { lat, lon } = response.data[0]; // Lấy tọa độ tỉnh
    const nearbyResponse = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          format: "json",
          lat,
          lon,
          zoom: 6, // Zoom cho khu vực tỉnh lân cận
        },
      }
    );
    return nearbyResponse.data;
  } catch (error) {
    return error;
  }
  // const response = await axios.get(
  //   `https://nominatim.openstreetmap.org/search`,
  //   {
  //     params: {
  //       format: "json",
  //       q: province,
  //       addressdetails: 1,
  //     },
  //   }
  // );
  // const { lat, lon } = response.data[0]; // Lấy tọa độ tỉnh
  // const nearbyResponse = await axios.get(
  //   `https://nominatim.openstreetmap.org/reverse`,
  //   {
  //     params: {
  //       format: "json",
  //       lat,
  //       lon,
  //       zoom: 6, // Zoom cho khu vực tỉnh lân cận
  //     },
  //   }
  // );
};
