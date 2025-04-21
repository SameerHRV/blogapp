import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "SJ",
    content:
      "This blogging platform has completely transformed how I create and share content. The interface is intuitive and the customization options are endless.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Tech Blogger",
    avatar: "MC",
    content:
      "I've tried many blogging platforms, but this one stands out for its performance and SEO features. My traffic has increased by 40% since switching.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Travel Writer",
    avatar: "ER",
    content:
      "The image optimization and responsive design make my travel photos look stunning on any device. Plus, the analytics help me understand what my audience loves.",
    rating: 4,
  },
  {
    name: "David Kim",
    role: "Food Blogger",
    avatar: "DK",
    content:
      "The markdown support makes formatting recipes a breeze, and the comment section has helped me build a community around my content.",
    rating: 5,
  },
  {
    name: "Jessica Taylor",
    role: "Lifestyle Blogger",
    avatar: "JT",
    content:
      "I love how easy it is to customize my blog's appearance. The themes are beautiful and the support team is always helpful when I have questions.",
    rating: 5,
  },
  {
    name: "Robert Wilson",
    role: "Business Coach",
    avatar: "RW",
    content:
      "This platform has been instrumental in growing my coaching business. The lead generation features and email integration are top-notch.",
    rating: 4,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied bloggers who have transformed their online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-card-scale">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.avatar}`}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium">
            <span>4.9/5</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
              ))}
            </div>
            <span>from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
