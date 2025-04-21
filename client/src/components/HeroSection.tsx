import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/contexts/BlogContext";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const { getFeaturedPosts } = useBlog();
  const featuredPosts = getFeaturedPosts();
  const mainFeaturedPost = featuredPosts[0];

  if (!mainFeaturedPost) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-secondary/80 to-background animate-fade-in">
      <div className="blog-container">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium mb-2">
              <span className="mr-2">✨</span> Featured Post
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight text-shadow">
                {mainFeaturedPost.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue/40 text-white flex items-center justify-center text-sm font-bold">
                  {mainFeaturedPost.author && mainFeaturedPost.author.fullName
                    ? mainFeaturedPost.author.fullName.charAt(0)
                    : "?"}
                </span>
                <span>
                  {mainFeaturedPost.author && mainFeaturedPost.author.fullName
                    ? mainFeaturedPost.author.fullName
                    : "Anonymous"}{" "}
                  · {formatDistanceToNow(new Date(mainFeaturedPost.createdAt))} ago
                </span>
              </p>
            </div>
            <p className="text-lg text-foreground/90 max-w-xl font-serif animate-fade-in-delayed">
              {mainFeaturedPost.excerpt}
            </p>
            <div className="flex gap-3 flex-wrap animate-fade-in-delayed-more">
              {mainFeaturedPost.tags &&
                mainFeaturedPost.tags.map((tag) => (
                  <Link
                    key={typeof tag === "object" ? tag._id : tag}
                    to={`/tags/${typeof tag === "object" ? tag.slug : tag}`}
                    className="bg-primary/10 hover:bg-primary/20 px-4 py-1.5 rounded-full text-sm font-medium text-primary-foreground transition-colors"
                  >
                    #{typeof tag === "object" ? tag.name : tag}
                  </Link>
                ))}
            </div>
            <div className="pt-4 animate-fade-in-delayed-more">
              <Link to={`/post/${mainFeaturedPost._id}`}>
                <Button size="lg" className="group transition-all">
                  Read Article
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg animate-float">
            {mainFeaturedPost.coverImage ? (
              <img
                src={mainFeaturedPost.coverImage}
                alt={mainFeaturedPost.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent-blue/40 rounded-xl flex items-center justify-center p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-shadow">{mainFeaturedPost.title}</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
