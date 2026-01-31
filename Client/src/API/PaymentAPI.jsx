import BaseAPI from "./BaseAPI";

export const getPayments = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await BaseAPI.get(
      `/payments?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createPayment = async (payment) => {
  try {
    const response = await BaseAPI.post("/payments", payment);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await BaseAPI.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
