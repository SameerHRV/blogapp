
import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ title, url }) => {
  // Use the current URL if no URL is provided
  const shareUrl = url || window.location.href;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };
  
  const shareOnFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, 
      "facebook-share", "width=580, height=296");
  };
  
  const shareOnTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, 
      "twitter-share", "width=550, height=235");
  };
  
  const shareOnLinkedIn = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, 
      "linkedin-share", "width=580, height=296");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <p className="flex items-center gap-1 text-muted-foreground">
        <Share2 className="h-4 w-4" />
        <span>Share:</span>
      </p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnFacebook}
          title="Share on Facebook"
          className="h-8 w-8 rounded-full"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnTwitter}
          title="Share on Twitter"
          className="h-8 w-8 rounded-full"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnLinkedIn}
          title="Share on LinkedIn"
          className="h-8 w-8 rounded-full"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          title="Copy link"
          className="h-8 w-8 rounded-full"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        
        {'share' in navigator && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            title="Share"
            className="h-8 w-8 rounded-full"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SocialShare;
