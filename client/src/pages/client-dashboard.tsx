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
      if (message.type === 'command_from_server') {
        handleServerCommand(message.command);
      } else if (message.type === 'permission_result') {
        setPermissions(prev => ({ ...prev, [message.permission]: message.granted }));
      }
    },
    onConnect: () => {
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
      sendMessage({
        type: 'permission_granted',
        permission: 'camera',
        granted: true,
        sessionId
      });
      // Stop the stream immediately for demo
      stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Camera Access Granted",
        description: "Camera permission granted for demonstration",
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
      sendMessage({
        type: 'permission_granted',
        permission: 'microphone',
        granted: true,
        sessionId
      });
      // Stop the stream immediately for demo
      stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Microphone Access Granted",
        description: "Microphone permission granted for demonstration",
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
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setPermissions(prev => ({ ...prev, location: true }));
      sendMessage({
        type: 'permission_granted',
        permission: 'location',
        granted: true,
        sessionId,
        data: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
      });
      toast({
        title: "Location Access Granted",
        description: "Location permission granted for demonstration",
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
    const systemInfo = {
      ...getBrowserInfo(),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      title: document.title
    };
    
    sendMessage({
      type: 'system_info',
      sessionId,
      data: systemInfo
    });
    
    toast({
      title: "System Information Sent",
      description: "System information has been collected",
    });
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