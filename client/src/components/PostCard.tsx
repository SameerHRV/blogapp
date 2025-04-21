import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Star, StarOff, ArrowRight } from "lucide-react";
import { Post, useBlog } from "@/contexts/BlogContext";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, compact = false }) => {
  const { toggleFeatured } = useBlog();

  return (
    <Card className="h-full flex flex-col overflow-hidden hover-card-scale border border-border/40 bg-card/80 backdrop-blur-sm">
      {post.coverImage && !compact && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      {!post.coverImage && !compact && (
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent-blue/30 flex items-center justify-center p-4 animate-pulse-soft">
          <h3 className="text-xl font-semibold text-center text-shadow">{post.title}</h3>
        </div>
      )}

      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/post/${post._id}`}>
              <h3 className={`font-bold hover:text-primary transition-colors ${compact ? "text-lg" : "text-xl"}`}>
                {post.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <span className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-medium">
                {post.guestAuthor
                  ? post.guestAuthor.charAt(0)
                  : post.author && post.author.fullName
                  ? post.author.fullName.charAt(0)
                  : "?"}
              </span>
              <span>
                {post.guestAuthor
                  ? `${post.guestAuthor} (Guest)`
                  : post.author && post.author.fullName
                  ? post.author.fullName
                  : "Anonymous"}{" "}
                · {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              toggleFeatured(post._id);
            }}
            className="text-muted-foreground hover:text-yellow-500 transition-colors"
          >
            {post.featured ? (
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-5 pt-3">
        {!compact && <p className="text-muted-foreground line-clamp-3 font-serif">{post.excerpt}</p>}
      </CardContent>

      <CardFooter className="flex flex-col items-start p-5 pt-0 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {post.tags &&
            post.tags.slice(0, compact ? 1 : 3).map((tag) => (
              <Link
                key={typeof tag === "object" ? tag._id : tag}
                to={`/tags/${typeof tag === "object" ? tag.slug : tag}`}
              >
                <Badge variant="outline" className="hover:bg-secondary transition-colors">
                  #{typeof tag === "object" ? tag.name : tag}
                </Badge>
              </Link>
            ))}
          {post.tags && post.tags.length > (compact ? 1 : 3) && (
            <Badge variant="outline">+{post.tags.length - (compact ? 1 : 3)}</Badge>
          )}
        </div>

        {!compact && (
          <Link to={`/post/${post._id}`} className="w-full">
            <Button variant="outline" className="w-full group">
              <span>Read More</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
