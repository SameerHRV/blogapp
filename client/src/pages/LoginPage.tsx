import BlogLayout from "@/components/BlogLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth0Context } from "@/contexts/Auth0Context";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Loader2, LogIn } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { loginWithGoogle, loginWithFacebook, isLoading: auth0Loading } = useAuth0Context();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state or default to /blog
  const from = location.state?.from || "/blog";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    loginWithFacebook();
  };

  // Development login for testing
  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Development login: Starting...");
      // Call the development login endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/dev-login`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Development login failed:", errorData);
        throw new Error(errorData.message || "Development login failed");
      }

      const data = await response.json();
      console.log("Development login: Success, received token");

      // Store the token directly in localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      console.log("Development login: Token stored in localStorage");

      // Login with the token
      loginWithToken(data.data.accessToken);
      toast.success("Development login successful!");

      // Navigate to the requested page
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Development login error:", error);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlogLayout>
      <div className="blog-container py-12 flex justify-center">
        <Card className="w-full max-w-md border border-border/40 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || auth0Loading}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading || auth0Loading}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>

            {/* Direct Auth0 login button with explicit code flow */}
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => {
                window.location.href = `https://dev-8v6uq83ygwkn1fa4.us.auth0.com/authorize?response_type=code&client_id=SwNlu3Mc09z9PaoMl0QCsM3Ynd0GRSUs&redirect_uri=${encodeURIComponent(
                  "http://localhost:8080/callback"
                )}&scope=openid%20profile%20email%20offline_access&audience=${encodeURIComponent(
                  "https://dev-8v6uq83ygwkn1fa4.us.auth0.com"
                )}`;
              }}
              disabled={isLoading || auth0Loading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Auth0 Universal Login
            </Button>

            {/* Fallback message if Auth0 is not available */}
            <div className="text-xs text-center text-muted-foreground">
              If social login is unavailable, please use the form below or the development login option.
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || auth0Loading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            {import.meta.env.DEV && (
              <>
                <div className="text-xs text-center text-muted-foreground mb-2">
                  Auth0 service not working? Use the development login below:
                </div>
                <Button variant="secondary" className="mt-2 w-full" onClick={handleDevLogin} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Development Login
                    </>
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </BlogLayout>
  );
};

export default LoginPage;
