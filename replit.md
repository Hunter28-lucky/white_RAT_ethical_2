# WebRAT-Lite Educational Platform

## Overview

WebRAT-Lite is an educational cybersecurity training platform designed to teach ethical hacking, security concepts, and browser-based vulnerabilities in a controlled environment. The application now features a proper Red Team command center structure where operators can generate links, share them with targets, and gain real-time control over connected clients after obtaining proper consent. All activities are educational simulations with comprehensive logging and consent mechanisms.

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

### Command Center (Red Team Dashboard)
- **Link Generator**: Creates unique target links for sharing with participants
- **Client Management**: Real-time monitoring and control of connected clients
- **Permission Control**: Request camera, microphone, location, and system information
- **Activity Logging**: Comprehensive logging of all training activities
- **Real-time Communication**: WebSocket-based command and control

### Client Dashboard
- **Consent Management**: Clear consent process for educational demonstrations
- **Permission Demonstrations**: Educational examples of browser permission requests
- **System Information**: Display browser and system information safely
- **Real-time Updates**: Live connection status and activity feedback

### Authentication & Session Management
- **In-Memory Storage**: MemStorage class for development/testing
- **Session Tracking**: Unique session IDs generated with nanoid
- **Client Registration**: Link-based client connection system
- **Training Logs**: Comprehensive logging of all training activities

### Real-Time Communication
- **WebSocket Server**: Custom WebSocket implementation on `/ws` path
- **Heartbeat Mechanism**: Automatic connection health monitoring
- **Command Routing**: Structured message system between command center and clients
- **Connection Management**: Separate tracking for command centers and clients

### Training Modules
- **Browser Information**: Collects and displays browser/system information
- **Permission Demos**: Educational demonstrations of browser permission requests
- **Security Tests**: Simulated vulnerability demonstrations (XSS, SQL injection, CSRF)
- **Learning Modules**: Structured educational content delivery

### UI Components
- **Command Center Interface**: Red Team operations dashboard
- **Client Dashboard**: Target-side interface for demonstrations
- **Consent System**: Comprehensive legal disclaimers and user consent
- **Real-time Status**: Connection status indicators and notifications
- **Interactive Elements**: Buttons, forms, and feedback mechanisms

## Data Flow

### Command Center Operation
1. **Command Center Registration**: Operator opens command center and registers via WebSocket
2. **Link Generation**: Operator generates unique target links for sharing
3. **Client Connection**: Targets click links and connect to client dashboard
4. **Consent Process**: Targets provide explicit consent for educational demonstrations
5. **Command Execution**: Operator sends commands to selected clients
6. **Permission Requests**: Clients receive commands and request browser permissions
7. **Real-time Updates**: Command center receives live updates from all clients

### Client-Server Communication
1. **Initial Connection**: Client establishes WebSocket connection via shared link
2. **Session Creation**: Server generates unique session ID and stores connection
3. **Message Exchange**: Structured JSON messages for training activities
4. **Activity Logging**: All user actions logged to database with timestamps
5. **Real-time Updates**: Server pushes updates to command centers and clients

### Training Activity Flow
1. **Target Selection**: Operator selects connected client from command center
2. **Command Execution**: Operator sends commands (camera, microphone, location, etc.)
3. **Permission Request**: Client receives command and requests browser permission
4. **Data Collection**: System collects relevant information (browser data, user responses)
5. **Logging**: All activities logged with session ID and timestamps
6. **Feedback**: Real-time feedback provided to both operator and client

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