import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) return null;

  return isAuthenticated
    ? children
    : <Navigate to="/user/auth/login" replace />;
};

export default ProtectedRoute;
