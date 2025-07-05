import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { VideoCard } from "@/components/VideoCard";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import { User, Calendar, MapPin, ExternalLink, Video } from "lucide-react";
import type { Video as VideoType } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  
  const { data: userVideos, isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos", { userId: user?.id }],
    enabled: !!user,
  });

  const { data: userLikes = [] } = useQuery({
    queryKey: ["/api/user/likes"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h1>
          <Button onClick={() => window.location.href = '/api/login'}>
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center overflow-hidden">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "Party Creator"}
                </h1>
                
                {user.email && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {user.email}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user.createdAt!).toLocaleDateString()}
                  </Badge>
                  
                  {user.telegramLink && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Telegram
                    </Badge>
                  )}
                  
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    {userVideos?.length || 0} Videos
                  </Badge>
                </div>
                
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                  
                  {user.telegramLink && (
                    <Button 
                      onClick={() => window.open(user.telegramLink, "_blank")}
                      className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Telegram
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creator Dashboard */}
        <div className="mb-8">
          <CreatorDashboard />
        </div>

        {/* User's Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              My Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {videosLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : userVideos && userVideos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {userVideos.map((video: VideoType) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    userLikes={userLikes}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No videos yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Share your first party experience with the world!
                </p>
                <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white">
                  Upload Your First Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
