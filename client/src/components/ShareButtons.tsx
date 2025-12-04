import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
  compact?: boolean;
}

export default function ShareButtons({ url, title, description, compact = false }: ShareButtonsProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = description ? encodeURIComponent(description) : encodedTitle;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard",
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Share:</span>
        <button
          onClick={() => handleShare('facebook', shareLinks.facebook)}
          className="w-8 h-8 rounded-full bg-[#1877F2] hover:opacity-90 transition-opacity flex items-center justify-center text-white"
          aria-label="Share on Facebook"
        >
          <i className="fab fa-facebook-f text-sm"></i>
        </button>
        <button
          onClick={() => handleShare('twitter', shareLinks.twitter)}
          className="w-8 h-8 rounded-full bg-[#1DA1F2] hover:opacity-90 transition-opacity flex items-center justify-center text-white"
          aria-label="Share on Twitter"
        >
          <i className="fab fa-twitter text-sm"></i>
        </button>
        <button
          onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
          className="w-8 h-8 rounded-full bg-[#25D366] hover:opacity-90 transition-opacity flex items-center justify-center text-white"
          aria-label="Share on WhatsApp"
        >
          <i className="fab fa-whatsapp text-sm"></i>
        </button>
        <button
          onClick={handleCopyLink}
          className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
          aria-label="Copy link"
        >
          <i className={`fas ${isCopied ? 'fa-check' : 'fa-link'} text-sm`}></i>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Share This Page
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook', shareLinks.facebook)}
          className="justify-start"
        >
          <i className="fab fa-facebook-f text-[#1877F2] mr-2"></i>
          Facebook
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter', shareLinks.twitter)}
          className="justify-start"
        >
          <i className="fab fa-twitter text-[#1DA1F2] mr-2"></i>
          Twitter
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
          className="justify-start"
        >
          <i className="fab fa-whatsapp text-[#25D366] mr-2"></i>
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin', shareLinks.linkedin)}
          className="justify-start"
        >
          <i className="fab fa-linkedin text-[#0A66C2] mr-2"></i>
          LinkedIn
        </Button>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopyLink}
        className="w-full"
      >
        <i className={`fas ${isCopied ? 'fa-check' : 'fa-link'} mr-2`}></i>
        {isCopied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
}
