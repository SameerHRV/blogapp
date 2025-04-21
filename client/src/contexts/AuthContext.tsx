import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { userService, User } from "@/services";

// User interface is now imported from services

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, fullName: string, email: string, password: string) => Promise<boolean>;
  loginWithToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if token is stored in localStorage
    const token = localStorage.getItem("accessToken");
    console.log("AuthContext: Token in localStorage:", !!token);
    if (token) {
      // Fetch user data using the token
      fetchUserData();
    }
  }, []);

  // Debug authentication state
  useEffect(() => {
    console.log("AuthContext: Authentication state:", {
      isAuthenticated: !!user,
      user: user ? { id: user._id, name: user.fullName } : null,
    });
  }, [user]);

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      console.log("AuthContext: Fetching user data...");
      const userData = await userService.getCurrentUser();
      console.log(
        "AuthContext: User data fetched successfully:",
        userData ? { id: userData._id, name: userData.fullName } : null
      );
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Don't remove the token immediately, try to refresh it or retry
      // Only remove token if it's an authentication error (401)
      if (error.status === 401) {
        console.log("AuthContext: Removing invalid token");
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("AuthContext: Attempting login");
    try {
      const authResponse = await userService.login({ email, password });
      console.log("AuthContext: Login successful, received token and user data");

      // Save token and user data
      localStorage.setItem("accessToken", authResponse.accessToken);
      setUser(authResponse.user);

      console.log("AuthContext: User data set and token saved");
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      toast.error(error.message || "Login failed");
      return false;
    }
  };

  const register = async (username: string, fullName: string, email: string, password: string): Promise<boolean> => {
    try {
      const authResponse = await userService.register({ username, fullName, email, password });

      // Save token and user data
      localStorage.setItem("accessToken", authResponse.accessToken);
      setUser(authResponse.user);

      toast.success("Registered successfully");
      return true;
    } catch (error) {
      toast.error(error.message || "Registration failed");
      return false;
    }
  };

  // Login with token (used by Auth0)
  const loginWithToken = (token: string) => {
    console.log("AuthContext: Login with token");
    localStorage.setItem("accessToken", token);
    console.log("AuthContext: Token saved, fetching user data");
    fetchUserData();
  };

  const logout = async () => {
    try {
      await userService.logout();
      localStorage.removeItem("accessToken");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove token and user from local state even if API call fails
      localStorage.removeItem("accessToken");
      setUser(null);
      toast.success("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
