import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BlogLayout from "@/components/BlogLayout";

const NotFound: React.FC = () => {
  return (
    <BlogLayout>
      <div className="blog-container py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </BlogLayout>
  );
};

export default NotFound;
