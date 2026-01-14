import BaseAPI from "./BaseAPI";

export const LoginAPI = async (name, password) => {
  try {
    const response = await BaseAPI.post("/auth/login", {
      name: name,
      password: password,
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const RegisterAPI = async (name, password, confirmPassword) => {
  try {
    const response = await BaseAPI.post("/auth/register", {
      name,
      password,
      confirmPassword,
    });
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};
export const LogoutAPI = async (user) => {
  try {
    const response = await BaseAPI.post("/auth/logout", {
      user,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
};
