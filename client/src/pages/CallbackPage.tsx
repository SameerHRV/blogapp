import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CallbackPage: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user, error } = useAuth0();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Log Auth0 configuration for debugging
    console.log("Auth0 Configuration:", {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ? "Set" : "Not set",
      callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL || "http://localhost:8080/callback",
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    });

    // Check for Auth0 errors
    if (error) {
      console.error("Auth0 error:", error);
      setAuthError(error.message || "Authentication error");
      toast.error(`Auth0 error: ${error.message}`);
      return;
    }

    const handleCallback = async () => {
      if (isAuthenticated && user) {
        try {
          console.log("User authenticated with Auth0, getting access token...");
          // Get the token from Auth0
          const token = await getAccessTokenSilently();
          console.log("Access token received, validating with backend...");

          // Call your backend to validate and get a session token
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Server authentication failed:", errorData);
            throw new Error(errorData.message || "Failed to authenticate with the server");
          }

          const data = await response.json();
          console.log("Backend authentication successful");

          // Login with the token from your backend
          loginWithToken(data.data.accessToken);
          toast.success("Authentication successful!");

          // Redirect to the blog page
          navigate("/blog");
        } catch (error) {
          console.error("Error during callback processing:", error);
          setAuthError(error.message || "Authentication failed");
          toast.error(`Authentication error: ${error.message}`);
          setTimeout(() => navigate("/login"), 3000);
        }
      } else if (!isLoading && !isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login");
      }
    };

    if (!isLoading) {
      handleCallback();
    }
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithToken, navigate, error]);

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p className="text-center text-gray-700 mb-4">{authError}</p>
        <p className="text-center text-gray-500 mb-6">Redirecting to login page...</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg">Completing authentication...</p>
      <p className="mt-2 text-sm text-gray-500">Please wait while we verify your credentials</p>
    </div>
  );
};

export default CallbackPage;
