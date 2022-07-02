import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component }) => {
  const { user } = useContext(AuthContext);

  if (user != null) {
    return component;
  }

  return <Navigate to='/login' replace />;

};

export default PrivateRoute;