import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/contexts/PaymentContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CheckoutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { createCheckoutSession } = usePayment();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  // Get plan details from location state
  const planName = location.state?.planName || "Pro";
  const planAmount = planName === "Pro" ? 12 : 49;

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
    }

    // Load Stripe script
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthenticated, navigate]);

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus("processing");

    try {
      // Create checkout session and redirect to Stripe
      await createCheckoutSession(planName);

      // The redirect happens in the createCheckoutSession function
      // If we get here, something went wrong with the redirect
      throw new Error("Failed to redirect to checkout");
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      toast.error(error.message || "Payment failed");
      setIsLoading(false);
    }
  };

  return (
    <BlogLayout>
      <div className="blog-container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>

          <Card className="border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{planName} Plan</CardTitle>
              <CardDescription>
                {planName === "Pro" ? "For serious bloggers and content creators" : "For teams and businesses"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Plan Features */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Plan Features:</h3>
                  <ul className="space-y-2 text-sm">
                    {planName === "Free" && (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Up to 5 blog posts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Basic analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Standard support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Mobile-responsive design</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>SEO basics</span>
                        </li>
                      </>
                    )}
                    {planName === "Pro" && (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>
                            <strong>Unlimited</strong> blog posts
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Mobile-responsive design</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Advanced SEO tools</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Custom domain</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Ad-free experience</span>
                        </li>
                      </>
                    )}
                    {planName === "Business" && (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>
                            <strong>Unlimited</strong> blog posts
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Premium analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Dedicated support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Mobile-responsive design</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Advanced SEO tools</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Custom domain</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Ad-free experience</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Team collaboration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Multiple authors</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>API access</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Pricing Details */}
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-muted-foreground">Plan Price</span>
                  <span className="font-medium">${planAmount}/month</span>
                </div>

                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="font-medium">Monthly</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${planAmount}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {paymentStatus === "success" ? (
                <div className="flex flex-col items-center space-y-2 py-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className="text-lg font-medium">Payment Successful!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Your subscription is now active. Redirecting to your profile...
                  </p>
                </div>
              ) : paymentStatus === "failed" ? (
                <div className="flex flex-col items-center space-y-2 py-4">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                  <p className="text-lg font-medium">Payment Failed</p>
                  <p className="text-sm text-muted-foreground text-center">
                    There was an issue processing your payment. Please try again.
                  </p>
                  <Button onClick={() => setPaymentStatus("idle")} variant="outline" className="mt-2">
                    Try Again
                  </Button>
                </div>
              ) : (
                <Button onClick={handlePayment} className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              )}

              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <h3 className="text-sm font-semibold mb-2">Test Mode - Use these card details:</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>
                    <span className="font-medium">Card Number:</span> 4242 4242 4242 4242
                  </li>
                  <li>
                    <span className="font-medium">Expiry Date:</span> Any future date (e.g., 12/25)
                  </li>
                  <li>
                    <span className="font-medium">CVC:</span> Any 3 digits (e.g., 123)
                  </li>
                  <li>
                    <span className="font-medium">Name:</span> Any name
                  </li>
                  <li>
                    <span className="font-medium">Country:</span> Any country
                  </li>
                </ul>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </BlogLayout>
  );
};

export default CheckoutPage;
