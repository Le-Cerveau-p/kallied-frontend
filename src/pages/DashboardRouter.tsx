import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" />;
  if (user.role === "STAFF") return <Navigate to="/staff/dashboard" />;
  return <Navigate to="/client/dashboard" />;
}
