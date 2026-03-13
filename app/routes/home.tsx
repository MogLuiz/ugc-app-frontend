import { Navigate } from "react-router";

export default function HomeRoute() {
  return <Navigate to="/auth/login" replace />;
}
