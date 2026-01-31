import BaseAPI from "./BaseAPI";

export const getDashboardStats = async (startDate, endDate) => {
  try {
    let url = "/dashboard";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await BaseAPI.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getProductStockoutReport = async (
  productId,
  startDate,
  endDate,
) => {
  try {
    let url = `/dashboard/stockout/${productId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await BaseAPI.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
