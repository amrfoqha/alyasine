import BaseAPI from "./BaseAPI";

export const getDashboardStats = async () => {
  try {
    const response = await BaseAPI.get("/dashboard");
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
