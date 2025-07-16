# WebRAT-Lite Educational Platform

## Overview

WebRAT-Lite is an educational cybersecurity training platform designed to teach ethical hacking, security concepts, and browser-based vulnerabilities in a controlled environment. The application simulates various security scenarios while maintaining a clear educational focus with appropriate disclaimers and consent mechanisms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom cyber-themed color palette
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **WebSocket**: Built-in WebSocket server for real-time communication
- **Database**: Drizzle ORM with PostgreSQL (via @neondatabase/serverless)
- **Session Management**: In-memory storage with fallback to PostgreSQL
- **API Design**: RESTful endpoints with WebSocket integration

## Key Components

### Authentication & Session Management
- **In-Memory Storage**: MemStorage class for development/testing
- **Session Tracking**: Unique session IDs generated with nanoid
- **User Management**: Basic user creation and authentication system
- **Training Logs**: Comprehensive logging of all training activities

### Real-Time Communication
- **WebSocket Server**: Custom WebSocket implementation on `/ws` path
- **Heartbeat Mechanism**: Automatic connection health monitoring
- **Message Routing**: Structured message system for different training modules
- **Connection Management**: Active connection tracking with session mapping

### Training Modules
- **Browser Information**: Collects and displays browser/system information
- **Permission Demos**: Educational demonstrations of browser permission requests
- **Security Tests**: Simulated vulnerability demonstrations (XSS, SQL injection, CSRF)
- **Learning Modules**: Structured educational content delivery

### UI Components
- **Dashboard Layout**: Sidebar navigation with content sections
- **Consent System**: Comprehensive legal disclaimers and user consent
- **Real-time Status**: Connection status indicators and notifications
- **Interactive Elements**: Buttons, forms, and feedback mechanisms

## Data Flow

### Client-Server Communication
1. **Initial Connection**: Client establishes WebSocket connection on page load
2. **Session Creation**: Server generates unique session ID and stores connection
3. **Message Exchange**: Structured JSON messages for training activities
4. **Activity Logging**: All user actions logged to database with timestamps
5. **Real-time Updates**: Server pushes updates to connected clients

### Training Activity Flow
1. **Module Selection**: User selects training module from sidebar
2. **Action Execution**: User performs training actions (permission requests, security tests)
3. **Data Collection**: System collects relevant information (browser data, user responses)
4. **Logging**: All activities logged with session ID and timestamps
5. **Feedback**: Real-time feedback provided through toast notifications

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Connection Pooling**: Handled by Neon's serverless infrastructure

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form handling and validation

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Module Replacement**: Instant updates during development
- **Error Handling**: Runtime error overlay for debugging
- **Database**: Development database with schema migrations

### Production Build
- **Client Build**: Vite builds optimized static assets
- **Server Build**: ESBuild bundles Node.js server code
- **Asset Serving**: Express serves static files in production
- **Environment Variables**: Database connection via DATABASE_URL

### Database Management
- **Schema Definition**: Centralized schema in `/shared/schema.ts`
- **Migrations**: Drizzle Kit handles database migrations
- **Type Safety**: Automatic TypeScript types from schema
- **Validation**: Zod schemas for runtime validation

The architecture prioritizes educational value while maintaining security best practices. All potentially sensitive operations are clearly marked as educational demonstrations, and the system includes comprehensive consent mechanisms to ensure users understand the training nature of the platform.