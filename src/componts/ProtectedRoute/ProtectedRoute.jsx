import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Authcontext } from "../../Context/AuthContextProvider";

const ProtectedRoute = ({ children }) => {
  const auth = useContext(Authcontext);

  if (!auth?.token) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;