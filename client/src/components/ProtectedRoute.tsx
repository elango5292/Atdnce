import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./firebase"; 

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!auth.currentUser; 

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; 
  }

  return children || <Outlet />; 
};

export default ProtectedRoute;
