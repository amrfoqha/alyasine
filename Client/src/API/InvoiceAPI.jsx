import BaseAPI from "./BaseAPI";

export const getInvoices = async (page, limit, search) => {
  try {
    const response = await BaseAPI.get(
      `/invoices?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createInvoice = async (invoice) => {
  try {
    const response = await BaseAPI.post("/invoices", invoice);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await BaseAPI.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateInvoice = async (id, invoice) => {
  try {
    const response = await BaseAPI.put(`/invoices/${id}`, invoice);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await BaseAPI.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
