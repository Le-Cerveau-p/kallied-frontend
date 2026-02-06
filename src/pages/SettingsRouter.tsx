import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function SettingsRouter() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <Navigate to="/admin/settings" />;
  if (user.role === "STAFF") return <Navigate to="/staff/settings" />;
  return <Navigate to="/client/settings" />;
}
