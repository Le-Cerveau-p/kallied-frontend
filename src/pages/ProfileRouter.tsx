import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProfileRouter() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <Navigate to="/admin/profile" />;
  if (user.role === "STAFF") return <Navigate to="/staff/profile" />;
  return <Navigate to="/client/profile" />;
}
