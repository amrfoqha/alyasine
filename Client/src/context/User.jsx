import React, { useState } from "react";
import { Auth } from "./Auth";
import { LoginAPI, RegisterAPI, LogoutAPI } from "../API/AuthAPI";
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );
  const login = async (name, password) => {
    try {
      const response = await LoginAPI(name, password);
      const { accessToken, refreshToken, user } = response;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user || ""));
      setToken(accessToken || "");
      localStorage.setItem("token", accessToken || "");
      setRefreshToken(refreshToken || "");
      localStorage.setItem("refreshToken", refreshToken || "");
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };

  const register = async (name, password, confirmPassword) => {
    try {
      const response = await RegisterAPI(name, password, confirmPassword);
      const { accessToken, refreshToken, user } = response;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user || ""));
      setToken(accessToken || "");
      localStorage.setItem("token", accessToken || "");
      setRefreshToken(refreshToken || "");
      localStorage.setItem("refreshToken", refreshToken || "");
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      const response = await LogoutAPI(user);
      console.log(response);
      setUser(null);
      localStorage.removeItem("user");
      setToken(null);
      localStorage.removeItem("token");
      setRefreshToken(null);
      localStorage.removeItem("refreshToken");
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };
  const isAuthenticated = !!token && !!user;
  return (
    <Auth.Provider
      value={{
        user,
        login,
        logout,
        token,
        refreshToken,
        register,
        isAuthenticated,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export { UserProvider };
