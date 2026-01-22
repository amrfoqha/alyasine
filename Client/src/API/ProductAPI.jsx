import BaseAPI from "./BaseAPI";

export const createProduct = async (product) => {
  try {
    const response = await BaseAPI.post("/products", product);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getAllProductsByCategoryByPage = async (
  id,
  page,
  limit,
  search,
) => {
  try {
    const response = await BaseAPI.get(
      `/products/category/${id}?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await BaseAPI.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await BaseAPI.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await BaseAPI.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getProductsName = async () => {
  try {
    const response = await BaseAPI.get("/products/names");
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getProducts = async () => {
  try {
    const response = await BaseAPI.get("/products");
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

