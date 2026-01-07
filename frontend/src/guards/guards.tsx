import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { useUserStore } from "@/stores/AuthStore";

interface ProtectedRouteProps {
    children: ReactNode,
    requireAdmin?: boolean,
    requireSuperAdmin?: boolean
}

// A simple protected route wrapper
export const ProtectedRoute = ({ children, requireAdmin = false, requireSuperAdmin = false }: ProtectedRouteProps) => {
  const { isAdmin, isSuperAdmin } = useUserStore();
  
  // If super admin is required, only super admins can access
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If admin is required, both admins and super admins can access
  if (requireAdmin && !isAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If logged in, render the children
  return children;
};

export const ProtectedDashboard = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Dashboard />
    </ProtectedRoute>
  );
};