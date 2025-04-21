import React from "react";
import BlogLayout from "@/components/BlogLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Lightbulb, Heart, Shield, Clock, Globe } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <BlogLayout>
      <div className="blog-container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Blogger App</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to empower writers and content creators with the tools they need to share their stories with the world.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Blogger App was founded in 2023 with a simple goal: to make blogging accessible, beautiful, and enjoyable for everyone.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              What started as a small project has grown into a platform used by thousands of writers, journalists, and content creators around the world.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We believe that everyone has a story worth telling, and we're here to help you tell yours.
            </p>
            <Link to="/features">
              <Button className="group">
                Explore Our Features
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent-blue/30 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Our Team</h3>
              <p className="text-muted-foreground">
                A passionate group of designers, developers, and writers dedicated to creating the best blogging platform.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg p-6 hover-card-scale">
              <Lightbulb className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We're constantly exploring new ways to improve the blogging experience and stay ahead of the curve.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 hover-card-scale">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Passion</h3>
              <p className="text-muted-foreground">
                We're passionate about writing and helping others share their stories with the world.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 hover-card-scale">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-muted-foreground">
                We believe in building trust through transparency, reliability, and putting our users first.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-muted/30 rounded-lg p-8 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-lg font-medium">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">50,000+</p>
              <p className="text-lg font-medium">Articles Published</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">120+</p>
              <p className="text-lg font-medium">Countries Reached</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="w-0.5 h-full bg-border mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2023 - Founded</h3>
                <p className="text-muted-foreground mb-4">
                  Blogger App was founded with the mission to create a modern blogging platform for everyone.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="w-0.5 h-full bg-border mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2023 - First 1,000 Users</h3>
                <p className="text-muted-foreground mb-4">
                  We reached our first milestone of 1,000 active users within the first three months.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2024 - Going Global</h3>
                <p className="text-muted-foreground mb-4">
                  Expanded our platform to support multiple languages and reached users in over 120 countries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Become a part of our growing community of writers and content creators. Start sharing your stories today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default AboutPage;
