import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <Navigate to="/dashboard/admin" />;
  if (user.role === "STAFF") return <Navigate to="/dashboard/staff" />;
  return <Navigate to="/dashboard/client" />;
}