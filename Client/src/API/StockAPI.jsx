import BaseAPI from "./BaseAPI";

export const stockIn = async (stockData) => {
  try {
    const response = await BaseAPI.post("/stock/stockin", stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const stockOut = async (stockData) => {
  try {
    const response = await BaseAPI.post("/stock/stockout", stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getStockIn = async (page = 1, limit = 5, search = "") => {
  try {
    const response = await BaseAPI.get(
      `/stock/stockin?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getStockOut = async (page = 1, limit = 5, search = "") => {
  try {
    const response = await BaseAPI.get(
      `/stock/stockout?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
