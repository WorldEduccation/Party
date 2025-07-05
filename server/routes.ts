import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

// Simple auth middleware for Firebase
const isAuthenticated = (req: any, res: any, next: any) => {
  // For now, just allow all requests - Firebase auth will be handled on frontend
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth routes - simplified for Firebase
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return a mock user for now - Firebase handles auth on frontend
      res.json({ 
        id: "firebase-user", 
        email: "user@example.com", 
        firstName: "Party", 
        lastName: "Creator" 
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Video routes
  app.get('/api/videos', async (req, res) => {
    try {
      const { country, eventType, hashtags, userId, limit, offset } = req.query;
      
      const filters = {
        country: country as string,
        eventType: eventType as string,
        hashtags: hashtags ? (hashtags as string).split(',') : undefined,
        userId: userId as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      
      const videos = await storage.getVideos(filters);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get('/api/videos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Increment views
      await storage.incrementViews(id);
      
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post('/api/videos', isAuthenticated, upload.single('video'), async (req: any, res) => {
    try {
      const userId = "firebase-user"; // Simplified for now
      const videoData = {
        ...req.body,
        userId,
        hashtags: req.body.hashtags ? req.body.hashtags.split(',').map((tag: string) => tag.trim()) : [],
      };
      
      const validatedData = insertVideoSchema.parse(videoData);
      const video = await storage.createVideo(validatedData);
      
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put('/api/videos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "firebase-user";
      
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      if (video.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this video" });
      }
      
      const updateData = {
        ...req.body,
        hashtags: req.body.hashtags ? req.body.hashtags.split(',').map((tag: string) => tag.trim()) : undefined,
      };
      
      const updatedVideo = await storage.updateVideo(id, updateData);
      res.json(updatedVideo);
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete('/api/videos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "firebase-user";
      
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      if (video.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this video" });
      }
      
      const deleted = await storage.deleteVideo(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Video not found" });
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Like routes
  app.post('/api/videos/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const userId = "firebase-user";
      
      const isLiked = await storage.toggleLike(videoId, userId);
      res.json({ isLiked });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.get('/api/user/likes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = "firebase-user";
      const likes = await storage.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch user likes" });
    }
  });

  // Comment routes
  app.get('/api/videos/:id/comments', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const comments = await storage.getVideoComments(videoId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/videos/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const userId = "firebase-user";
      
      const commentData = {
        videoId,
        userId,
        content: req.body.content,
      };
      
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(validatedData);
      
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Telegram click tracking
  app.post('/api/videos/:id/telegram-click', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementTelegramClicks(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking telegram click:", error);
      res.status(500).json({ message: "Failed to track telegram click" });
    }
  });

  // Analytics routes
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = "firebase-user";
      const stats = await storage.getUserVideoStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
