import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any admin page. Requires login AND role === "admin".
export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
