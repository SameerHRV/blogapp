import { toast } from "sonner";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  const message = error.message || "An error occurred";
  toast.error(message);
  throw error;
};

// Generic API request function
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const token = getAuthToken();

    // Set default headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Log the request details
    console.log(`API Request to ${endpoint}:`, {
      method: options.method,
      headers,
      body: options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : "FormData") : "none",
    });

    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse the response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error(`API Error (${response.status}):`, data);
      throw new Error(data.message || "An error occurred");
    }

    return data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API methods
export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
    console.log("API: Sending POST request to", endpoint, "with data:", data);
    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),

  // Upload file with form data
  upload: <T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> => {
    const token = getAuthToken();
    const headers: HeadersInit = { ...options.headers };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("API: Uploading to", endpoint);
    console.log("API: Form data entries:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      headers,
      body: formData,
    });
  },
};

export default api;
