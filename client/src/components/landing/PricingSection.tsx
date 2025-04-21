import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const pricingPlans = [
  {
    name: "Free",
    description: "Perfect for getting started with blogging",
    price: "$0",
    period: "forever",
    features: ["Up to 5 blog posts", "Basic analytics", "Standard support", "Mobile-responsive design", "SEO basics"],
    cta: "Get Started",
    popular: false,
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    description: "For serious bloggers and content creators",
    price: "$12",
    period: "per month",
    features: [
      "Unlimited blog posts",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "SEO optimization",
      "Remove branding",
      "Social media integration",
    ],
    cta: "Start Free Trial",
    popular: true,
    ctaVariant: "default" as const,
  },
  {
    name: "Business",
    description: "For teams and businesses",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Multiple authors",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
    ctaVariant: "outline" as const,
  },
];

const PricingSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (planName: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe to a plan");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout", { state: { planName } });
  };
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating amazing content today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col h-full ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {plan.name === "Free" ? (
                  <Link to="/blog" className="w-full">
                    <Button variant={plan.ctaVariant} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button variant={plan.ctaVariant} className="w-full" onClick={() => handleSubscribe(plan.name)}>
                    {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
