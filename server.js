import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import formidable from 'formidable';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Simple in-memory storage
let videos = [
  {
    id: 1,
    title: "Miami Beach Party",
    description: "Incredible beach party in Miami with amazing vibes",
    videoUrl: "/uploads/videos/miami-beach.mp4",
    thumbnailUrl: "/uploads/thumbnails/miami-beach.jpg",
    telegramLink: "https://t.me/miamiparties",
    country: "USA",
    eventType: "Beach Party",
    hashtags: ["beach", "miami", "party", "summer"],
    likes: 234,
    views: 1250,
    telegramClicks: 89,
    userId: "user1",
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 2,
    title: "Berlin Techno Night",
    description: "Underground techno scene in Berlin's best club",
    videoUrl: "/uploads/videos/berlin-techno.mp4",
    thumbnailUrl: "/uploads/thumbnails/berlin-techno.jpg",
    telegramLink: "https://t.me/berlintechno",
    country: "Germany",
    eventType: "Techno Party",
    hashtags: ["techno", "berlin", "underground", "electronic"],
    likes: 445,
    views: 2100,
    telegramClicks: 156,
    userId: "user2",
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 3,
    title: "São Paulo Carnival",
    description: "Street carnival in São Paulo with samba and energy",
    videoUrl: "/uploads/videos/sao-paulo-carnival.mp4",
    thumbnailUrl: "/uploads/thumbnails/sao-paulo-carnival.jpg",
    telegramLink: "https://t.me/sambaparty",
    country: "Brazil",
    eventType: "Carnival",
    hashtags: ["carnival", "samba", "brazil", "street"],
    likes: 789,
    views: 3450,
    telegramClicks: 267,
    userId: "user3",
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03')
  }
];

let users = [];
let videoIdCounter = 4;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Helper functions
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function serveStaticFile(res, filePath) {
  const fullPath = path.join(__dirname, 'public', filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    const mimeType = getMimeType(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Ensure upload directories exist
function ensureUploadDirs() {
  const dirs = ['uploads', 'uploads/videos', 'uploads/thumbnails'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// API handlers
function handleGetVideos(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const { country, eventType, userId } = parsedUrl.query;
  
  let filteredVideos = videos;
  
  if (country) {
    filteredVideos = filteredVideos.filter(v => v.country === country);
  }
  
  if (eventType) {
    filteredVideos = filteredVideos.filter(v => v.eventType === eventType);
  }
  
  if (userId) {
    filteredVideos = filteredVideos.filter(v => v.userId === userId);
  }
  
  sendJSON(res, filteredVideos);
}

function handleVideoUpload(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'uploads');
  form.keepExtensions = true;
  form.maxFileSize = 100 * 1024 * 1024; // 100MB
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      sendJSON(res, { error: 'Upload failed' }, 400);
      return;
    }
    
    const videoFile = files.video;
    const thumbnailFile = files.thumbnail;
    
    if (!videoFile) {
      sendJSON(res, { error: 'No video file provided' }, 400);
      return;
    }
    
    const videoId = videoIdCounter++;
    const videoFileName = `video_${videoId}_${Date.now()}${path.extname(videoFile.originalFilename || '.mp4')}`;
    const thumbnailFileName = thumbnailFile ? 
      `thumb_${videoId}_${Date.now()}${path.extname(thumbnailFile.originalFilename || '.jpg')}` : 
      null;
    
    const videoPath = path.join(__dirname, 'uploads', 'videos', videoFileName);
    const thumbnailPath = thumbnailFileName ? 
      path.join(__dirname, 'uploads', 'thumbnails', thumbnailFileName) : 
      null;
    
    // Move video file
    fs.rename(videoFile.filepath, videoPath, (err) => {
      if (err) {
        sendJSON(res, { error: 'Failed to save video' }, 500);
        return;
      }
      
      // Move thumbnail if provided
      const saveThumbnail = () => {
        if (thumbnailFile && thumbnailPath) {
          fs.rename(thumbnailFile.filepath, thumbnailPath, (err) => {
            if (err) {
              console.warn('Failed to save thumbnail:', err);
            }
            createVideoRecord();
          });
        } else {
          createVideoRecord();
        }
      };
      
      const createVideoRecord = () => {
        const newVideo = {
          id: videoId,
          title: fields.title || 'Untitled Video',
          description: fields.description || '',
          videoUrl: `/uploads/videos/${videoFileName}`,
          thumbnailUrl: thumbnailFileName ? `/uploads/thumbnails/${thumbnailFileName}` : null,
          telegramLink: fields.telegramLink || '',
          country: fields.country || '',
          eventType: fields.eventType || '',
          hashtags: fields.hashtags ? fields.hashtags.split(',').map(tag => tag.trim()) : [],
          likes: 0,
          views: 0,
          telegramClicks: 0,
          userId: fields.userId || 'anonymous',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        videos.push(newVideo);
        sendJSON(res, newVideo, 201);
      };
      
      saveThumbnail();
    });
  });
}

function handleLikeVideo(req, res) {
  const videoId = parseInt(req.url.split('/')[3]);
  const video = videos.find(v => v.id === videoId);
  
  if (!video) {
    sendJSON(res, { error: 'Video not found' }, 404);
    return;
  }
  
  video.likes++;
  sendJSON(res, { likes: video.likes });
}

function handleIncrementViews(req, res) {
  const videoId = parseInt(req.url.split('/')[3]);
  const video = videos.find(v => v.id === videoId);
  
  if (!video) {
    sendJSON(res, { error: 'Video not found' }, 404);
    return;
  }
  
  video.views++;
  sendJSON(res, { views: video.views });
}

// Main server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API routes
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/videos' && method === 'GET') {
      handleGetVideos(req, res);
    } else if (pathname === '/api/videos' && method === 'POST') {
      handleVideoUpload(req, res);
    } else if (pathname.startsWith('/api/videos/') && pathname.endsWith('/like') && method === 'POST') {
      handleLikeVideo(req, res);
    } else if (pathname.startsWith('/api/videos/') && pathname.endsWith('/view') && method === 'POST') {
      handleIncrementViews(req, res);
    } else {
      sendJSON(res, { error: 'API endpoint not found' }, 404);
    }
    return;
  }
  
  // Static file serving
  if (pathname.startsWith('/uploads/')) {
    const filePath = pathname.substring(1);
    const fullPath = path.join(__dirname, filePath);
    
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    });
    return;
  }
  
  // Serve main HTML file for SPA routing
  const htmlFile = path.join(__dirname, 'public', 'index.html');
  fs.readFile(htmlFile, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Page not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// Initialize server
ensureUploadDirs();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`PartyLink server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});