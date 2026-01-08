import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorPage from "../pages/ErrorPage";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) return <ErrorPage type="401" />;
  console.log(roles)
  console.log("user role: "+user.role)

  // Role not allowed
  if (roles && !roles.includes(user.role)) {
    return <ErrorPage type="403" />;   // Forbidden
  }

  return children;
}