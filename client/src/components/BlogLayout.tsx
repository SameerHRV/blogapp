
import React, { ReactNode, useEffect } from "react";
import NavBar from "./NavBar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  // Add scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };

    // Run once on component mount
    setTimeout(handleScroll, 100);
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <ScrollArea className="flex-grow">
        <main>{children}</main>
        <footer className="py-10 border-t mt-12 bg-muted/20">
          <div className="blog-container text-center space-y-4">
            <div className="font-display font-bold text-2xl">
              <span className="text-primary">Dreamy</span> Blog
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A beautiful place to share your thoughts, stories, and ideas with the world.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Dreamy Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </ScrollArea>
    </div>
  );
};

export default BlogLayout;
