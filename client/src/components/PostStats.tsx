import React from "react";
import { Eye, Calendar, UserCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PostStatsProps {
  author?:
    | {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
      }
    | string;
  guestAuthor?: string;
  views: number;
  createdAt: string;
  updatedAt?: string;
}

const PostStats: React.FC<PostStatsProps> = ({ author, guestAuthor, views, createdAt, updatedAt }) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <div className="bg-muted w-7 h-7 rounded-full flex items-center justify-center">
            <UserCircle className="h-4 w-4" />
          </div>
          <span>
            {guestAuthor
              ? `${guestAuthor} (Guest)`
              : typeof author === "string"
              ? author
              : author?.fullName || "Anonymous"}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <div className="bg-muted w-7 h-7 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <span>{formatDistanceToNow(new Date(createdAt))} ago</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Published on {new Date(createdAt).toLocaleDateString()}</p>
          </TooltipContent>
        </Tooltip>

        {updatedAt && updatedAt !== createdAt && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <div className="bg-muted w-7 h-7 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="italic">Updated {formatDistanceToNow(new Date(updatedAt))} ago</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Updated on {new Date(updatedAt).toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <div className="bg-muted w-7 h-7 rounded-full flex items-center justify-center">
            <Eye className="h-4 w-4" />
          </div>
          <span>
            {views} view{views !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PostStats;
