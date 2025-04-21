import React from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface SubscriptionLimitAlertProps {
  plan: string;
  remainingPosts: number;
  maxPosts: number;
  hasReachedLimit: boolean;
}

const SubscriptionLimitAlert: React.FC<SubscriptionLimitAlertProps> = ({
  plan,
  remainingPosts,
  maxPosts,
  hasReachedLimit,
}) => {
  // If unlimited posts (Pro or Business plan), don't show the alert
  if (remainingPosts === Infinity || plan !== "Free") {
    return null;
  }

  // Calculate percentage of posts used
  const usedPosts = maxPosts - remainingPosts;
  const percentageUsed = Math.min(100, Math.round((usedPosts / maxPosts) * 100));
  
  // Determine alert variant based on remaining posts
  let variant: "default" | "destructive" | "warning" = "default";
  let icon = <CheckCircle className="h-5 w-5" />;
  
  if (hasReachedLimit) {
    variant = "destructive";
    icon = <AlertCircle className="h-5 w-5" />;
  } else if (remainingPosts <= 1) {
    variant = "warning";
    icon = <AlertTriangle className="h-5 w-5" />;
  }

  return (
    <Alert variant={variant} className="mb-6">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <AlertTitle>
            {hasReachedLimit
              ? "Post limit reached"
              : remainingPosts === 1
              ? "Last post available"
              : `${remainingPosts} posts remaining`}
          </AlertTitle>
          <AlertDescription className="mt-1">
            {hasReachedLimit ? (
              <>
                You've reached the maximum of {maxPosts} posts allowed on the Free plan.
                Upgrade to create unlimited posts.
              </>
            ) : (
              <>
                Your Free plan allows {maxPosts} posts. You have {remainingPosts} remaining.
                {remainingPosts <= 1 && " Consider upgrading for unlimited posts."}
              </>
            )}
            
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>{usedPosts} used</span>
                <span>{maxPosts} total</span>
              </div>
              <Progress value={percentageUsed} className="h-2" />
            </div>
            
            {(hasReachedLimit || remainingPosts <= 1) && (
              <div className="mt-3">
                <Link to="/checkout">
                  <Button size="sm" variant={hasReachedLimit ? "default" : "outline"}>
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default SubscriptionLimitAlert;
