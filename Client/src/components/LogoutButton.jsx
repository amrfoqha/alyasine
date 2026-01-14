import React from "react";
import { useContext } from "react";
import { Auth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
const LogoutButton = ({ className }) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useContext(Auth);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    isAuthenticated && (
      <button
        onClick={handleLogout}
        className={`border border-red-500 p-2 rounded bg-red-500 text-white hover:bg-white hover:text-red-500 cursor-pointer ${className}`}
      >
        Logout
      </button>
    )
  );
};

export default LogoutButton;
