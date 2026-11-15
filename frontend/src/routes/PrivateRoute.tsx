import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";
import { ROUTES } from "./routePaths";

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;