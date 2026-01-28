import BaseAPI from "./BaseAPI";

export const createCustomer = async (customer) => {
  try {
    const response = await BaseAPI.post("/customers", customer);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getCustomers = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await BaseAPI.get(
      `/customers?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateCustomer = async (id, customer) => {
  try {
    console.log(id);
    const response = await BaseAPI.put(`/customers/${id}`, customer);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await BaseAPI.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await BaseAPI.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getCustomersNames = async () => {
  try {
    const response = await BaseAPI.get("/customers/names");
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await BaseAPI.get("/customers/all");
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
export const getCustomerStatement = async (
  id,
  startDate = "",
  endDate = "",
) => {
  try {
    const response = await BaseAPI.get(
      `/customers/${id}/statement?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
