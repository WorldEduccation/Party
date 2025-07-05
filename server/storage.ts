import {
  users,
  videos,
  comments,
  likes,
  type User,
  type UpsertUser,
  type Video,
  type InsertVideo,
  type Comment,
  type InsertComment,
} from "@shared/schema";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Video operations
  getVideos(filters?: {
    country?: string;
    eventType?: string;
    hashtags?: string[];
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, updates: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  incrementViews(id: number): Promise<void>;
  incrementTelegramClicks(id: number): Promise<void>;
  
  // Like operations
  toggleLike(videoId: number, userId: string): Promise<boolean>;
  getUserLikes(userId: string): Promise<number[]>;
  
  // Comment operations
  getVideoComments(videoId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Analytics
  getUserVideoStats(userId: string): Promise<{
    totalViews: number;
    totalLikes: number;
    totalTelegramClicks: number;
    videoCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private videos: Map<number, Video> = new Map();
  private comments: Map<number, Comment> = new Map();
  private likes: Map<string, Set<number>> = new Map(); // userId -> videoIds
  private videoLikes: Map<number, number> = new Map(); // videoId -> count
  private currentVideoId = 1;
  private currentCommentId = 1;

  constructor() {
    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample videos for demonstration
    const sampleVideos = [
      {
        userId: "firebase-user",
        title: "Miami Beach Party 2025 🔥",
        description: "The hottest beach party in Miami! Join us for an unforgettable night of music, dancing, and vibes.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop",
        telegramLink: "https://t.me/miamipartyvip",
        country: "USA",
        eventType: "Beach Party",
        hashtags: ["miami", "beach", "party", "nightlife", "dance"],
        likes: 127,
        views: 1250,
        telegramClicks: 85,
      },
      {
        userId: "firebase-user",
        title: "Berlin Underground Rave ⚡",
        description: "Deep techno vibes in Berlin's underground scene. Experience the real nightlife culture.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop",
        telegramLink: "https://t.me/berlinrave",
        country: "Germany",
        eventType: "Underground",
        hashtags: ["berlin", "techno", "underground", "rave", "music"],
        likes: 89,
        views: 945,
        telegramClicks: 62,
      },
      {
        userId: "firebase-user",
        title: "São Paulo Rooftop Vibes 🌃",
        description: "Amazing city views while partying on São Paulo's best rooftop. Come enjoy the Brazilian energy!",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop",
        telegramLink: "https://t.me/saopaulorooftop",
        country: "Brazil",
        eventType: "Rooftop",
        hashtags: ["saopaulo", "rooftop", "brazil", "nightlife", "city"],
        likes: 156,
        views: 1687,
        telegramClicks: 103,
      },
      {
        userId: "firebase-user",
        title: "London VIP Lounge Experience 💎",
        description: "Exclusive VIP experience in London's most prestigious lounge. Limited access.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=600&fit=crop",
        telegramLink: "https://t.me/londenvip",
        country: "UK",
        eventType: "VIP Lounge",
        hashtags: ["london", "vip", "exclusive", "luxury", "nightlife"],
        likes: 203,
        views: 2134,
        telegramClicks: 145,
      },
      {
        userId: "firebase-user",
        title: "Ibiza Festival Madness 🎪",
        description: "The biggest festival of the summer in Ibiza! Three days of non-stop music and fun.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&h=600&fit=crop",
        telegramLink: "https://t.me/ibizafestival",
        country: "Spain",
        eventType: "Festival",
        hashtags: ["ibiza", "festival", "summer", "music", "spain"],
        likes: 312,
        views: 3245,
        telegramClicks: 198,
      },
    ];

    sampleVideos.forEach((videoData, index) => {
      const video: Video = {
        ...videoData,
        id: this.currentVideoId++,
        description: videoData.description || null,
        thumbnailUrl: videoData.thumbnailUrl || null,
        country: videoData.country || null,
        eventType: videoData.eventType || null,
        hashtags: videoData.hashtags || null,
        likes: videoData.likes || 0,
        views: videoData.views || 0,
        telegramClicks: videoData.telegramClicks || 0,
        createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Spread over last few days
        updatedAt: new Date(),
      };
      this.videos.set(video.id, video);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      telegramLink: userData.telegramLink || null,
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getVideos(filters?: {
    country?: string;
    eventType?: string;
    hashtags?: string[];
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Video[]> {
    let videos = Array.from(this.videos.values());
    
    if (filters?.country) {
      videos = videos.filter(v => v.country === filters.country);
    }
    
    if (filters?.eventType) {
      videos = videos.filter(v => v.eventType === filters.eventType);
    }
    
    if (filters?.hashtags && filters.hashtags.length > 0) {
      videos = videos.filter(v => 
        v.hashtags && filters.hashtags!.some(tag => v.hashtags!.includes(tag))
      );
    }
    
    if (filters?.userId) {
      videos = videos.filter(v => v.userId === filters.userId);
    }
    
    // Sort by creation date (newest first)
    videos.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    if (filters?.offset) {
      videos = videos.slice(filters.offset);
    }
    
    if (filters?.limit) {
      videos = videos.slice(0, filters.limit);
    }
    
    return videos;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(videoData: InsertVideo): Promise<Video> {
    const video: Video = {
      ...videoData,
      id: this.currentVideoId++,
      likes: 0,
      views: 0,
      telegramClicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.videos.set(video.id, video);
    return video;
  }

  async updateVideo(id: number, updates: Partial<InsertVideo>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo: Video = {
      ...video,
      ...updates,
      updatedAt: new Date(),
    };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  async incrementViews(id: number): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video.views = (video.views || 0) + 1;
      this.videos.set(id, video);
    }
  }

  async incrementTelegramClicks(id: number): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video.telegramClicks = (video.telegramClicks || 0) + 1;
      this.videos.set(id, video);
    }
  }

  async toggleLike(videoId: number, userId: string): Promise<boolean> {
    const userLikes = this.likes.get(userId) || new Set();
    const video = this.videos.get(videoId);
    
    if (!video) return false;
    
    const isLiked = userLikes.has(videoId);
    
    if (isLiked) {
      userLikes.delete(videoId);
      video.likes = Math.max(0, (video.likes || 0) - 1);
    } else {
      userLikes.add(videoId);
      video.likes = (video.likes || 0) + 1;
    }
    
    this.likes.set(userId, userLikes);
    this.videos.set(videoId, video);
    
    return !isLiked;
  }

  async getUserLikes(userId: string): Promise<number[]> {
    const userLikes = this.likes.get(userId) || new Set();
    return Array.from(userLikes);
  }

  async getVideoComments(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const comment: Comment = {
      ...commentData,
      id: this.currentCommentId++,
      createdAt: new Date(),
    };
    this.comments.set(comment.id, comment);
    return comment;
  }

  async getUserVideoStats(userId: string): Promise<{
    totalViews: number;
    totalLikes: number;
    totalTelegramClicks: number;
    videoCount: number;
  }> {
    const userVideos = Array.from(this.videos.values()).filter(v => v.userId === userId);
    
    return {
      totalViews: userVideos.reduce((sum, v) => sum + (v.views || 0), 0),
      totalLikes: userVideos.reduce((sum, v) => sum + (v.likes || 0), 0),
      totalTelegramClicks: userVideos.reduce((sum, v) => sum + (v.telegramClicks || 0), 0),
      videoCount: userVideos.length,
    };
  }
}

export const storage = new MemStorage();
