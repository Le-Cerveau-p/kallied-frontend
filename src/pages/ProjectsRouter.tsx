import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProjectsRouter() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <Navigate to="/admin/projects" />;
  if (user.role === "STAFF") return <Navigate to="/staff/projects" />;
  return <Navigate to="/client/projects" />;
}
