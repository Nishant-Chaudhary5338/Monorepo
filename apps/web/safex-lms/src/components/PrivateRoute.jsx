import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the import path

function PrivateRoute({ element, ...props }) {
  const { user } = useAuth();

  return (
    <Route {...props} element={user ? element : <Navigate to='/login' />} />
  );
}

export default PrivateRoute;
