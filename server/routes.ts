import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSessionSchema, insertTrainingLogSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

interface ExtendedWebSocket extends WebSocket {
  sessionId?: string;
  isAlive?: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections
  const activeConnections = new Map<string, ExtendedWebSocket>();
  
  // Heartbeat mechanism
  const heartbeat = function(this: ExtendedWebSocket) {
    this.isAlive = true;
  };
  
  // WebSocket connection handler
  wss.on('connection', (ws: ExtendedWebSocket) => {
    const sessionId = nanoid();
    ws.sessionId = sessionId;
    ws.isAlive = true;
    
    activeConnections.set(sessionId, ws);
    
    // Setup heartbeat
    ws.on('pong', heartbeat);
    
    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'connection',
      sessionId,
      message: 'Connected to WebRAT-Lite Educational Platform'
    }));
    
    // Handle messages
    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'consent':
            await handleConsentMessage(ws, message);
            break;
          case 'permission_request':
            await handlePermissionRequest(ws, message);
            break;
          case 'browser_info':
            await handleBrowserInfo(ws, message);
            break;
          case 'training_action':
            await handleTrainingAction(ws, message);
            break;
          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      if (ws.sessionId) {
        activeConnections.delete(ws.sessionId);
      }
    });
  });
  
  // Cleanup dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws: ExtendedWebSocket) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
  
  wss.on('close', () => {
    clearInterval(interval);
  });
  
  // Message handlers
  async function handleConsentMessage(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      const sessionData = insertSessionSchema.parse({
        sessionId: ws.sessionId,
        consent: message.consent,
        browserInfo: JSON.stringify(message.browserInfo || {}),
        permissions: JSON.stringify([])
      });
      
      await storage.createSession(sessionData);
      
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'consent_given',
        details: `User provided consent: ${message.consent}`
      });
      
      ws.send(JSON.stringify({
        type: 'consent_acknowledged',
        sessionId: ws.sessionId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process consent'
      }));
    }
  }
  
  async function handlePermissionRequest(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'permission_requested',
        details: JSON.stringify({
          permission: message.permission,
          granted: message.granted
        })
      });
      
      // Update session permissions
      const session = await storage.getSession(ws.sessionId);
      if (session) {
        const permissions = JSON.parse(session.permissions || '[]');
        permissions.push({
          type: message.permission,
          granted: message.granted,
          timestamp: new Date().toISOString()
        });
        
        await storage.updateSession(ws.sessionId, {
          permissions: JSON.stringify(permissions)
        });
      }
      
      ws.send(JSON.stringify({
        type: 'permission_logged',
        permission: message.permission,
        granted: message.granted
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to log permission request'
      }));
    }
  }
  
  async function handleBrowserInfo(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.updateSession(ws.sessionId, {
        browserInfo: JSON.stringify(message.info)
      });
      
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'browser_info_updated',
        details: JSON.stringify(message.info)
      });
      
      ws.send(JSON.stringify({
        type: 'browser_info_logged'
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to update browser info'
      }));
    }
  }
  
  async function handleTrainingAction(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: message.action,
        details: message.details || ''
      });
      
      ws.send(JSON.stringify({
        type: 'training_action_logged',
        action: message.action
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to log training action'
      }));
    }
  }
  
  // API endpoints
  app.get('/api/sessions/:sessionId', async (req, res) => {
    try {
      const session = await storage.getSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch session' });
    }
  });
  
  app.get('/api/sessions/:sessionId/logs', async (req, res) => {
    try {
      const logs = await storage.getTrainingLogsBySession(req.params.sessionId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch logs' });
    }
  });
  
  app.get('/api/status', (req, res) => {
    res.json({
      connected_clients: activeConnections.size,
      server_status: 'running',
      platform: 'WebRAT-Lite Educational Platform'
    });
  });

  return httpServer;
}
