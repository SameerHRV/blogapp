import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { auth0Service } from "@/services";

interface Auth0ContextType {
  isLoading: boolean;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  handleAuth0Login: () => Promise<void>;
  linkAccounts: (email: string, password: string) => Promise<boolean>;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export const useAuth0Context = () => {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error("useAuth0Context must be used within an Auth0Provider");
  }
  return context;
};

export const Auth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loginWithRedirect, isLoading: auth0Loading, isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { login, isAuthenticated: isAppAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // API services are now imported from @/services

  // Handle Auth0 authentication
  useEffect(() => {
    const checkAuth0User = async () => {
      if (isAuthenticated && user && !isAppAuthenticated) {
        await handleAuth0Login();
      }
    };

    checkAuth0User();
  }, [isAuthenticated, user, isAppAuthenticated]);

  // Login with Google
  const loginWithGoogle = () => {
    try {
      console.log("Initiating Google login with Auth0");
      loginWithRedirect({
        authorizationParams: {
          connection: "google-oauth2",
          scope: "openid profile email offline_access",
          response_type: "code",
        },
        appState: {
          returnTo: window.location.pathname,
        },
      });
    } catch (error) {
      console.error("Error initiating Google login:", error);
      toast.error("Could not connect to authentication service. Please try again later.");
    }
  };

  // Login with Facebook
  const loginWithFacebook = () => {
    try {
      console.log("Initiating Facebook login with Auth0");
      loginWithRedirect({
        authorizationParams: {
          connection: "facebook",
          scope: "openid profile email offline_access",
          response_type: "code",
        },
        appState: {
          returnTo: window.location.pathname,
        },
      });
    } catch (error) {
      console.error("Error initiating Facebook login:", error);
      toast.error("Could not connect to authentication service. Please try again later.");
    }
  };

  // Handle Auth0 login
  const handleAuth0Login = async () => {
    setIsLoading(true);
    try {
      console.log("Auth0 user info:", user);

      // Get Auth0 token with specific scopes
      console.log("Requesting token with offline_access scope...");
      let tokenResponse;
      try {
        tokenResponse = await getAccessTokenSilently({
          authorizationParams: {
            scope: "openid profile email offline_access",
            response_type: "code",
          },
          detailedResponse: true,
          cacheMode: "off", // Force a new token request
        });

        console.log("Token response received");
        console.log("Token includes refresh_token:", !!tokenResponse.refresh_token);
        console.log("Token includes id_token:", !!tokenResponse.id_token);
        console.log("Token includes access_token:", !!tokenResponse.access_token);
      } catch (tokenError) {
        console.error("Error getting token:", tokenError);
        throw tokenError;
      }

      console.log("Auth0 token received:", tokenResponse ? "[TOKEN RECEIVED]" : "[NO TOKEN]");

      // Check if we have a refresh token
      if (tokenResponse.refresh_token) {
        console.log("Refresh token received");
        // Store the refresh token if needed
        localStorage.setItem("auth0RefreshToken", tokenResponse.refresh_token);
      } else {
        console.warn("No refresh token received from Auth0");
      }

      // Use the access token to call our API
      const accessToken = tokenResponse.access_token || tokenResponse;
      console.log("Calling backend with access token...");

      // Call our API to get user data and JWT token
      const userData = await auth0Service.getCurrentUser(accessToken);
      console.log("Backend authentication successful");

      // Login with our JWT token
      login(userData.accessToken);

      toast.success("Successfully logged in with Auth0");
    } catch (error) {
      console.error("Auth0 login error:", error);
      toast.error(error.message || "Failed to authenticate with Auth0");
    } finally {
      setIsLoading(false);
    }
  };

  // Link Auth0 account with existing account
  const linkAccounts = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Get Auth0 token
      const token = await getAccessTokenSilently();

      // Call our API to link accounts
      const userData = await auth0Service.linkAccounts({ email, password }, token);

      // Login with our JWT token
      login(userData.accessToken);

      toast.success("Accounts linked successfully");
      return true;
    } catch (error) {
      console.error("Link accounts error:", error);
      toast.error(error.message || "Failed to link accounts");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading: isLoading || auth0Loading,
    loginWithGoogle,
    loginWithFacebook,
    handleAuth0Login,
    linkAccounts,
  };

  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>;
};
