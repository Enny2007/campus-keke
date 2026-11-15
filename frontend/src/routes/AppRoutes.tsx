import { Navigate, Route, Routes } from "react-router";
import LandingPage from "../pages/Home";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import PublicRoutes from "./PublicRoutes";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "./routePaths";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path={ROUTES.home} element={<LandingPage />} />
        <Route path={ROUTES.signup} element={<SignUp />} />
        <Route path={ROUTES.login} element={<Login />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["student"]} />}>
        {/* Add student-only routes here */}
      </Route>

      <Route element={<PrivateRoute allowedRoles={["driver"]} />}>
        {/* Add driver-only routes here */}
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
};

export default AppRoutes;