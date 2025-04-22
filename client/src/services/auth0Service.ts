import api from "@/lib/api";
import { User } from "./userService";

export interface Auth0User {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export interface LinkAccountsData {
  email: string;
  password: string;
}

const auth0Service = {
  // Get current user from Auth0
  getCurrentUser: async (token: string | any): Promise<User> => {
    console.log("Auth0Service: Calling /auth/me with token");
    try {
      // Handle both string tokens and token objects
      const accessToken = typeof token === "string" ? token : token.access_token;

      if (!accessToken) {
        console.error("Auth0Service: No access token provided");
        throw new Error("No access token provided");
      }

      console.log("Auth0Service: Using access token for authentication");

      const user = await api.get<User>("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Auth0Service: Successfully retrieved user data");
      return user;
    } catch (error) {
      console.error("Auth0Service: Error retrieving user data:", error);
      throw error;
    }
  },

  // Link Auth0 account with existing account
  linkAccounts: async (data: LinkAccountsData, token: string | any): Promise<User> => {
    try {
      // Handle both string tokens and token objects
      const accessToken = typeof token === "string" ? token : token.access_token;

      if (!accessToken) {
        console.error("Auth0Service: No access token provided for linking accounts");
        throw new Error("No access token provided");
      }

      return api.post<User>("/auth/link-accounts", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Auth0Service: Error linking accounts:", error);
      throw error;
    }
  },
};

export default auth0Service;
