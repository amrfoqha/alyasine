import React, { useState, useEffect } from "react";
import { Auth } from "./Auth";
import {
  LoginAPI,
  RegisterAPI,
  LogoutAPI,
  refreshAccessToken,
} from "../API/AuthAPI.jsx";
import BaseAPI from "../API/BaseAPI";
import toast from "react-hot-toast";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved && saved !== "undefined" ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || "",
  );
  const [loading, setLoading] = useState(true);

  const saveAuthData = (userData, accessToken, refreshData) => {
    setUser(userData);
    setToken(accessToken);
    setRefreshToken(refreshData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshData);
    BaseAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  const login = async (name, password) => {
    try {
      const response = await LoginAPI(name, password);
      saveAuthData(response.user, response.accessToken, response.refreshToken);
      return { success: true };
    } catch (error) {
      toast.error(error.message || "فشل تسجيل الدخول");
      return {
        success: false,
        message: error.message || "فشل تسجيل الدخول",
      };
    }
  };
  const register = async (name, password, confirmPassword) => {
    try {
      const response = await RegisterAPI(name, password, confirmPassword);
      const { accessToken, refreshToken, user } = response;
      saveAuthData(user, accessToken, refreshToken);
      return { success: true };
    } catch (error) {
      toast.error(error.message || "فشل إنشاء الحساب");
      return { success: false, message: error?.message || "فشل إنشاء الحساب" };
    }
  };

  const logout = async () => {
    try {
      await LogoutAPI(user);
    } catch (error) {
      toast.error(error.message || "فشل تسجيل الخروج");
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.clear();
      delete BaseAPI.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedRefresh = localStorage.getItem("refreshToken");

      if (!storedToken || !storedRefresh) {
        setLoading(false);
        return;
      }

      try {
        const data = await refreshAccessToken(storedRefresh);
        saveAuthData(
          user,
          data.accessToken,
          data.refreshToken || storedRefresh,
        );
      } catch (err) {
        console.log("Session expired");
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <Auth.Provider
      value={{
        user,
        login,
        register,
        logout,
        token,
        loading,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </Auth.Provider>
  );
};

export { UserProvider };
