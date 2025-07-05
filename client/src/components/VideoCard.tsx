import { useState } from "react";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  userLikes: number[];
  onPlay?: (video: Video) => void;
}

export function VideoCard({ video, userLikes, onPlay }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isLiked = userLikes.includes(video.id);

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/videos/${video.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/likes"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    },
  });

  const handleTelegramClick = async () => {
    try {
      await apiRequest("POST", `/api/videos/${video.id}/telegram-click`);
      window.open(video.telegramLink, "_blank");
    } catch (error) {
      console.error("Failed to track telegram click:", error);
      window.open(video.telegramLink, "_blank");
    }
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  return (
    <Card
      className="overflow-hidden bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay?.(video)}
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Video</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Country badge */}
        {video.country && (
          <Badge className="absolute top-3 left-3 bg-black/50 text-white border-0">
            {video.country}
          </Badge>
        )}
        
        {/* Event type badge */}
        {video.eventType && (
          <Badge className="absolute top-3 right-3 bg-black/50 text-white border-0">
            {video.eventType}
          </Badge>
        )}
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {video.title}
          </h3>
          
          {video.description && (
            <p className="text-gray-300 text-xs mb-2 line-clamp-2">
              {video.description}
            </p>
          )}
          
          {/* Hashtags */}
          {video.hashtags && video.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {video.hashtags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs text-blue-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Stats and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex items-center space-x-1 text-white hover:text-pink-400 transition-colors"
                disabled={likeMutation.isPending}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "fill-pink-500 text-pink-500" : ""
                  }`}
                />
                <span className="text-xs">{video.likes || 0}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-white">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">0</span>
              </div>
              
              <div className="flex items-center space-x-1 text-white">
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">{video.views || 0}</span>
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleTelegramClick();
              }}
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-xs px-3 py-1 h-auto"
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
