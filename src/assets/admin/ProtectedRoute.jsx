import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const adminToken = JSON.parse(sessionStorage.getItem("adminToken"));

  // Check if token exists and is not expired (e.g., 8 hour expiry)
  const isAuthenticated = adminToken && 
      (new Date().getTime() - adminToken.loggedInAt) < (8 * 60 * 60 * 1000);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/admin-login") {
      toast.info("Session expired. Please login again.");
    }
  }, [isAuthenticated, location.pathname]);

  return isAuthenticated ? children : <Navigate to="/admin-login" state={{ from: location }} replace />;
};

export default ProtectedRoute;