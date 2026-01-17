import BaseAPI from "./BaseAPI";

export const createProductCategory = async (name) => {
  try {
    const response = await BaseAPI.post("/categories", { name });
    return response.data;
  } catch (error) {
    // console.log(error.response.data);
    throw error.response?.data;
  }
};

export const getAllProductCategory = async () => {
  try {
    const response = await BaseAPI.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getProductCategoryById = async (id) => {
  try {
    const response = await BaseAPI.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
