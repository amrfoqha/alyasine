import React, { useContext } from "react";
import { Auth } from "./Auth";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Auth);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
