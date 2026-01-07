import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { useUserStore } from "@/stores/AuthStore";

interface ProtectedRouteProps {
    children: ReactNode,
    isAdmin: boolean
}
// A simple protected route wrapper
export const ProtectedRoute = ({ children, isAdmin }: ProtectedRouteProps) => {
  if (!isAdmin) {
    // If not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }
  // If logged in, render the children
  return children;
};

export const ProtectedDashboard = () => {
  const { isAdmin } = useUserStore();

  return (
    <ProtectedRoute isAdmin={isAdmin}>
      <Dashboard />
    </ProtectedRoute>
  );
};
