import { Axios } from "axios";
import BaseAPI from "./BaseAPI";

export const LoginAPI = async (name, password) => {
  try {
    const response = await BaseAPI.post("/auth/login", {
      name: name,
      password: password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const RegisterAPI = async (name, password, confirmPassword) => {
  try {
    const response = await BaseAPI.post("/auth/register", {
      name,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
export const LogoutAPI = async (user) => {
  try {
    const response = await BaseAPI.post("/auth/logout", {
      user,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await BaseAPI.post("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

// export const refreshAccessToken = async (refreshToken) => {
//   console.log("إرسال طلب التجديد الآن...");
//   try {
//     const response = await Axios.post(
//       "http://localhost:8000/api/auth/refresh",
//       {
//         refreshToken: refreshToken,
//       },
//     );
//     console.log("وصل الرد من السيرفر!");
//     return response.data;
//   } catch (error) {
//     console.error("فشل الطلب تماماً:", error);
//     throw error;
//   }
// };
