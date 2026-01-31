import BaseAPI from "./BaseAPI";

export const getChecks = async (
  page = 1,
  limit = 5,
  searchQuery = "",
  checkStatus = "",
) => {
  try {
    const response = await BaseAPI.get(
      `/checks?page=${page}&limit=${limit}&searchQuery=${searchQuery}&checkStatus=${checkStatus}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateCheckStatus = async (id, status) => {
  try {
    const response = await BaseAPI.patch(`/checks/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
