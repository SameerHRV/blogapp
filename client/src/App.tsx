import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Auth0Provider as CustomAuth0Provider } from "@/contexts/Auth0Context";
import { AuthProvider } from "@/contexts/AuthContext";
import { BlogProvider } from "@/contexts/BlogContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from "./pages/AboutPage";
import CallbackPage from "./pages/CallbackPage";
import CheckoutPage from "./pages/CheckoutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import FeaturesPage from "./pages/FeaturesPage";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PostEditor from "./pages/PostEditor";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import TagsPage from "./pages/TagsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={0}>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN || ""}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ""}
        authorizationParams={{
          redirect_uri: "http://localhost:8080/callback",
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        <AuthProvider>
          <CustomAuth0Provider>
            <PaymentProvider>
              <BlogProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/callback" element={<CallbackPage />} />

                    {/* Protected Routes - Require Authentication */}
                    <Route
                      path="/blog"
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/post/:id"
                      element={
                        <ProtectedRoute>
                          <PostPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/new"
                      element={
                        <ProtectedRoute>
                          <PostEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit/:id"
                      element={
                        <ProtectedRoute>
                          <PostEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tags"
                      element={
                        <ProtectedRoute>
                          <TagsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tags/:tagName"
                      element={
                        <ProtectedRoute>
                          <TagsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <SearchPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payment-history"
                      element={
                        <ProtectedRoute>
                          <PaymentHistoryPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payment-success"
                      element={
                        <ProtectedRoute>
                          <PaymentSuccessPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </BlogProvider>
            </PaymentProvider>
          </CustomAuth0Provider>
        </AuthProvider>
      </Auth0Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
