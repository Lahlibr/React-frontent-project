import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const admin = sessionStorage.getItem("admin");

  return admin ? children : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
