import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ThreadsRouter() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <Navigate to="/admin/threads" />;
  if (user.role === "STAFF") return <Navigate to="/staff/threads" />;
  return <Navigate to="/client/threads" />;
}
