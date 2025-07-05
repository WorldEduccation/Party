import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, TrendingUp, Video, Users, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function CreatorDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: userVideos, isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos", { userId: "current" }],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Creator Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Track your performance and grow your audience
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                This Month
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {stats?.totalViews ? stats.totalViews.toLocaleString() : '0'}
            </div>
            <div className="text-sm opacity-80">Total Views</div>
            <div className="text-sm mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ExternalLink className="w-8 h-8 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                This Month
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {stats?.totalTelegramClicks ? stats.totalTelegramClicks.toLocaleString() : '0'}
            </div>
            <div className="text-sm opacity-80">Telegram Clicks</div>
            <div className="text-sm mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +23.1%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                This Month
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {stats?.totalLikes ? stats.totalLikes.toLocaleString() : '0'}
            </div>
            <div className="text-sm opacity-80">Total Likes</div>
            <div className="text-sm mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18.7%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Video className="w-8 h-8 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                Total
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {stats?.videoCount || 0}
            </div>
            <div className="text-sm opacity-80">Videos</div>
            <div className="text-sm mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2 this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500 mb-2">
                {stats?.totalViews && stats?.videoCount 
                  ? Math.round(stats.totalViews / stats.videoCount)
                  : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Views per Video
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-2">
                {stats?.totalTelegramClicks && stats?.totalViews
                  ? Math.round((stats.totalTelegramClicks / stats.totalViews) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Click-through Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-2">
                {stats?.totalLikes && stats?.totalViews
                  ? Math.round((stats.totalLikes / stats.totalViews) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Engagement Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full Analytics
        </Button>
      </div>
    </div>
  );
}
