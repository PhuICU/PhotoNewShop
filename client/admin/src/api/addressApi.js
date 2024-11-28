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
