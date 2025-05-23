import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated) navigate("/");
  // }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
