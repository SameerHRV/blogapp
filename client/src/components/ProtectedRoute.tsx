import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Debug authentication state
  useEffect(() => {
    console.log("ProtectedRoute: Authentication state:", {
      isAuthenticated,
      user: user ? { id: user._id, name: user.fullName } : null,
      path: location.pathname,
    });
  }, [isAuthenticated, user, location.pathname]);

  useEffect(() => {
    // Check if token exists but user data is not loaded yet
    const token = localStorage.getItem("accessToken");
    if (!isAuthenticated && token) {
      console.log("ProtectedRoute: Token exists but user not authenticated yet. Waiting...");
      // Don't show error toast if token exists (might be loading)
      return;
    }

    if (!isAuthenticated && !token) {
      console.log("ProtectedRoute: No token and not authenticated. Showing login message.");
      toast.error("Please log in to access this page");
    }
  }, [isAuthenticated]);

  // Check if token exists but user data is not loaded yet
  const token = localStorage.getItem("accessToken");
  if (!isAuthenticated && token) {
    // Show loading state instead of redirecting
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return URL
    console.log("ProtectedRoute: Redirecting to login page");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
