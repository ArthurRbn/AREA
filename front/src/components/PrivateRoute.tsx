import React from "react";
import { Navigate } from 'react-router';
import {isAuthenticated} from "../api/auth";

function PrivateRoute({ children }: { children: JSX.Element }) {
  if (isAuthenticated()) {
    return children;
  } else {
    return <Navigate to="/auth"/>;
  }
}

export default PrivateRoute;