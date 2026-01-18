import BaseAPI from "./BaseAPI";

export const stockIn = async (stockData) => {
  try {
    const response = await BaseAPI.post("/stock/stockIn", stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const stockOut = async (stockData) => {
  try {
    const response = await BaseAPI.post("/stock/stockOut", stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
