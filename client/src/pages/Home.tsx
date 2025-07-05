import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Moon, Sun, User, Flame, Clock, Heart, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "@/components/VideoCard";
import { VideoUpload } from "@/components/VideoUpload";
import { FilterBar } from "@/components/FilterBar";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import type { Video } from "@shared/schema";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    country?: string;
    eventType?: string;
    hashtags?: string[];
  }>({});
  const [activeTab, setActiveTab] = useState<"trending" | "recent" | "liked" | "dashboard">("trending");

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.country) params.append("country", filters.country);
      if (filters.eventType) params.append("eventType", filters.eventType);
      if (filters.hashtags && filters.hashtags.length > 0) {
        params.append("hashtags", filters.hashtags.join(","));
      }
      
      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      return response.json();
    },
  });

  const { data: userLikes = [] } = useQuery({
    queryKey: ["/api/user/likes"],
    enabled: !!user,
    retry: false,
  });

  const handleVideoPlay = (video: Video) => {
    // This would open a video player modal/page
    console.log("Playing video:", video);
  };

  const filteredVideos = videos?.filter((video: Video) => {
    if (!searchQuery) return true;
    return (
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.hashtags?.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                PartyLink
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search parties, events, vibes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </Button>

              {/* Upload Button */}
              <VideoUpload />

              {/* Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search parties, events, vibes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <FilterBar onFilterChange={setFilters} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-8 text-white mb-8">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Where the Vibe
              <span className="block">Meets the Market</span>
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Discover the hottest parties, connect with creators, and join exclusive events via Telegram
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 font-semibold">
                <TrendingUp className="w-4 h-4 mr-2" />
                Explore Now
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-500 mb-2">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Creators</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">2M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Party Videos</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">180+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">10M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Connections</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <Button
              variant={activeTab === "trending" ? "default" : "ghost"}
              onClick={() => setActiveTab("trending")}
              className={activeTab === "trending" ? "bg-pink-500 text-white" : ""}
            >
              <Flame className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button
              variant={activeTab === "recent" ? "default" : "ghost"}
              onClick={() => setActiveTab("recent")}
              className={activeTab === "recent" ? "bg-pink-500 text-white" : ""}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </Button>
            <Button
              variant={activeTab === "liked" ? "default" : "ghost"}
              onClick={() => setActiveTab("liked")}
              className={activeTab === "liked" ? "bg-pink-500 text-white" : ""}
            >
              <Heart className="w-4 h-4 mr-2" />
              Liked
            </Button>
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => setActiveTab("dashboard")}
              className={activeTab === "dashboard" ? "bg-pink-500 text-white" : ""}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "dashboard" ? (
          <CreatorDashboard />
        ) : (
          <>
            {/* Video Grid */}
            {videosLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-[9/16]">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredVideos.map((video: Video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    userLikes={(userLikes as number[]) || []}
                    onPlay={handleVideoPlay}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!videosLoading && filteredVideos.length > 0 && (
              <div className="text-center mt-8">
                <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white px-8 py-3 font-semibold">
                  Load More Videos
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!videosLoading && filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No videos found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <VideoUpload />
      </div>
    </div>
  );
}
