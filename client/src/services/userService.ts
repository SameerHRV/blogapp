import api from "@/lib/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  authProvider: string;
  subscription: {
    plan: string;
    validUntil: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

export interface ProfileUpdateData {
  fullName?: string;
  username?: string;
}

const userService = {
  // Register a new user
  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    if (userData.avatar) {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("avatar", userData.avatar);

      return api.upload<AuthResponse>("/users/register", formData);
    } else {
      return api.post<AuthResponse>("/users/register", userData);
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/users/login", credentials);
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    console.log("UserService: Fetching current user data");
    try {
      const userData = await api.get<User>("/users/me");
      console.log(
        "UserService: User data fetched successfully",
        userData ? { id: userData._id, name: userData.fullName } : null
      );
      return userData;
    } catch (error) {
      console.error("UserService: Error fetching user data:", error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    return api.post<void>("/users/logout", {});
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeData): Promise<{ message: string }> => {
    return api.put<{ message: string }>("/users/change-password", passwordData);
  },

  // Update profile
  updateProfile: async (profileData: ProfileUpdateData): Promise<User> => {
    return api.patch<User>("/users/update-profile", profileData);
  },

  // Update avatar
  updateAvatar: async (avatar: File): Promise<User> => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    return api.upload<User>("/users/update-avatar", formData);
  },
};

export default userService;
