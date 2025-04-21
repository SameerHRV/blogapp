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
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
      },
    });
  };

  // Login with Facebook
  const loginWithFacebook = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "facebook",
      },
    });
  };

  // Handle Auth0 login
  const handleAuth0Login = async () => {
    setIsLoading(true);
    try {
      // Get Auth0 token
      const token = await getAccessTokenSilently();

      // Call our API to get user data and JWT token
      const userData = await auth0Service.getCurrentUser(token);

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
