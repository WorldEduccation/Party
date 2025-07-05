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

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
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
