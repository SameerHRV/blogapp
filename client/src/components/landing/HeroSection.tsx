import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium">
              <span className="mr-2">✨</span> The Ultimate Blogging Platform
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight text-shadow animate-fade-in">
              Share Your <span className="text-primary">Stories</span> With The World
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-delayed">
              Create beautiful, responsive blogs in minutes. No coding required. Just write and publish.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-delayed-more">
              <Link to="/blog">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/blog">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-blue/30 rounded-full blur-xl"></div>
            
            <div className="relative z-5 bg-card border shadow-xl rounded-xl overflow-hidden animate-float">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-sm font-medium text-muted-foreground">My Awesome Blog</div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-muted rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/60 rounded-md"></div>
                    <div className="h-4 w-full bg-muted/60 rounded-md"></div>
                    <div className="h-4 w-2/3 bg-muted/60 rounded-md"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-primary/20 rounded-full"></div>
                    <div className="h-6 w-16 bg-primary/20 rounded-full"></div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="h-4 w-full bg-muted/60 rounded-md"></div>
                    <div className="h-4 w-full bg-muted/60 rounded-md"></div>
                    <div className="h-4 w-full bg-muted/60 rounded-md"></div>
                    <div className="h-4 w-4/5 bg-muted/60 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
