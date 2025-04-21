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
  getCurrentUser: async (token: string): Promise<User> => {
    return api.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Link Auth0 account with existing account
  linkAccounts: async (data: LinkAccountsData, token: string): Promise<User> => {
    return api.post<User>("/auth/link-accounts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default auth0Service;
