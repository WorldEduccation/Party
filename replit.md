# PartyLink - Video Social Platform

## Overview

PartyLink is a modern video social platform built with React and Express.js, designed to connect party creators with audiences through video content and Telegram integration. The platform features video uploading, social interactions, and a creator dashboard for analytics.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OIDC integration
- **Session Management**: Express sessions with PostgreSQL store
- **File Upload**: Multer for handling multipart/form-data

### Database Design
- **Users**: Profile management with social links
- **Videos**: Content with metadata, analytics tracking
- **Interactions**: Likes, comments, and engagement metrics
- **Sessions**: Secure session storage for authentication

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Security**: HTTP-only cookies with CSRF protection
- **Authorization**: Route-level authentication middleware

### Video Management
- **Upload Pipeline**: Multipart form handling with metadata extraction
- **Storage**: URL-based video and thumbnail storage
- **Analytics**: View tracking, engagement metrics, Telegram click tracking
- **Filtering**: Country, event type, and hashtag-based filtering

### Social Features
- **Interactions**: Like/unlike functionality with optimistic updates
- **Comments**: Threaded comment system
- **Creator Dashboard**: Analytics and performance metrics
- **Telegram Integration**: Deep linking for external engagement

### UI/UX Design
- **Design System**: Custom Tailwind configuration with CSS variables
- **Dark Mode**: System-wide theme switching
- **Responsive**: Mobile-first design with breakpoint optimization
- **Components**: Reusable UI components following atomic design principles

## Data Flow

### Authentication Flow
1. User initiates login via Replit Auth
2. OIDC provider validates credentials
3. User session created in PostgreSQL
4. Client receives secure HTTP-only cookie
5. Subsequent requests include session validation

### Video Upload Flow
1. User submits video form with metadata
2. Multer processes multipart form data
3. Video validation and metadata extraction
4. Database record creation with analytics initialization
5. Client receives success response with video ID

### Content Discovery Flow
1. Client requests videos with optional filters
2. Server queries database with pagination
3. Results include engagement metrics
4. Client renders video cards with social features
5. User interactions trigger analytics updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database adapter
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **zod**: Schema validation and type safety
- **wouter**: Lightweight routing solution

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint/Prettier**: Code quality and formatting

### Authentication Dependencies
- **openid-client**: OIDC authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds optimized React bundle
2. **Backend**: ESBuild compiles TypeScript to ESM
3. **Database**: Drizzle Kit manages schema migrations
4. **Assets**: Static files served from dist/public

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Allowed domains for OIDC
- **ISSUER_URL**: OIDC provider endpoint

### Production Deployment
- **Server**: Express.js serves both API and static files
- **Database**: PostgreSQL with connection pooling
- **Sessions**: Persistent session storage
- **Security**: HTTPS enforcement, secure cookies, CSRF protection

## Deployment

### Vercel Configuration
- **vercel.json**: Configurado para deploy com Node.js 18
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **Environment Variables**: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID

### Firebase Setup
- **Authentication**: Google OAuth configurado
- **Authorized Domains**: localhost + domínio Vercel
- **Environment**: Production-ready

### Deploy Guide
- **DEPLOY_VERCEL.md**: Guia completo passo a passo
- **GitHub Integration**: Pronto para CI/CD automático
- **Domínio Gratuito**: Opções Vercel (.vercel.app) ou Freenom

## Changelog

```
Changelog:
- July 05, 2025. Initial setup with Replit Auth
- July 05, 2025. Migrated to Firebase Auth for better compatibility
- July 05, 2025. Prepared for Vercel deployment with complete guide
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```