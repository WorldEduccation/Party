import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Users, Globe, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                PartyLink
              </h1>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Where the Vibe
              <span className="block bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Meets the Market
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the hottest parties, connect with creators, and join exclusive events via Telegram. 
              The global marketplace for party experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
                onClick={login}
              >
                <Play className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="px-8 py-4 text-lg border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <Globe className="w-5 h-5 mr-2" />
                Explore Videos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-500 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-300">Active Creators</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">2M+</div>
            <div className="text-gray-600 dark:text-gray-300">Party Videos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">180+</div>
            <div className="text-gray-600 dark:text-gray-300">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500 mb-2">10M+</div>
            <div className="text-gray-600 dark:text-gray-300">Connections</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose PartyLink?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The ultimate platform for party creators and experience seekers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Viral Content
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Share your party experiences with the world and build a global audience
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Direct Connection
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Connect directly with party organizers and creators via Telegram
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Creator Analytics
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Track your performance and grow your audience with detailed analytics
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Join the Party?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Start sharing your party experiences and connecting with creators worldwide
          </p>
          <Button 
            size="lg"
            className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={login}
          >
            Join PartyLink Now
          </Button>
        </div>
      </div>
    </div>
  );
}
