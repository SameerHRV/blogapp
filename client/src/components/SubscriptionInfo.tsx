import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePayment } from "@/contexts/PaymentContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

const SubscriptionInfo: React.FC = () => {
  const { getSubscriptionStatus, subscription, isLoading } = usePayment();
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      await getSubscriptionStatus();
      setIsInitialLoading(false);
    };

    fetchSubscription();
  }, [getSubscriptionStatus]);

  const handleUpgrade = (planName: string) => {
    navigate("/checkout", { state: { planName } });
  };

  if (isInitialLoading || isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current subscription plan</CardDescription>
          </div>
          {subscription?.isActive && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscription ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Plan</span>
                <span className="font-medium">{subscription.plan}</span>
              </div>

              {subscription.validUntil && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valid Until</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{format(new Date(subscription.validUntil), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center">
                  {subscription.isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium text-green-700">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="font-medium text-amber-700">Expired</span>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">You are currently on the Free plan</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Link to="/payment-history" className="text-sm text-primary hover:underline mb-2 text-center">
          View payment history
        </Link>
        {!subscription || subscription.plan === "Free" ? (
          <>
            <Button className="w-full" onClick={() => handleUpgrade("Pro")}>
              Upgrade to Pro
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleUpgrade("Business")}>
              Upgrade to Business
            </Button>
          </>
        ) : subscription.plan === "Pro" ? (
          <Button className="w-full" onClick={() => handleUpgrade("Business")}>
            Upgrade to Business
          </Button>
        ) : subscription.isActive ? (
          <Button variant="outline" className="w-full" disabled>
            You're on our highest plan
          </Button>
        ) : (
          <Button className="w-full" onClick={() => handleUpgrade("Business")}>
            Renew Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionInfo;
