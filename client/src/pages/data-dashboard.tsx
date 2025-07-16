import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Database, Users, Activity, Shield, Download, RefreshCw } from "lucide-react";

interface DataDashboardProps {
  onBack: () => void;
}

export function DataDashboard({ onBack }: DataDashboardProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/sessions', refreshKey],
    refetchInterval: 5000,
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['/api/logs', refreshKey],
    refetchInterval: 5000,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const downloadData = (data: any, filename: string) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Database className="text-lg text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Data Collection Dashboard</h1>
                <p className="text-sm text-slate-400">Collected User Information & Activity Logs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Back to Command Center
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-600">
            <TabsTrigger value="sessions" className="data-[state=active]:bg-slate-700">
              <Users className="w-4 h-4 mr-2" />
              Sessions ({sessionsData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs ({logsData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              <Shield className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-slate-200">Session Data</CardTitle>
                  <Button
                    onClick={() => downloadData(sessionsData, 'sessions.json')}
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Sessions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(!sessionsData || sessionsData.length === 0) ? (
                      <div className="text-center py-8 text-slate-400">
                        <Users className="mx-auto mb-4 text-4xl" />
                        <p>No session data available</p>
                        <p className="text-sm">Sessions will appear here once targets connect</p>
                      </div>
                    ) : (
                      sessionsData.map((session: any) => (
                        <Card key={session.id} className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-slate-200 mb-2">Session Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="text-slate-400">ID:</span> {session.sessionId}</p>
                                  <p><span className="text-slate-400">Created:</span> {new Date(session.createdAt).toLocaleString()}</p>
                                  <p><span className="text-slate-400">Status:</span> 
                                    <Badge className={`ml-2 ${session.isActive ? 'bg-green-500' : 'bg-gray-500'} bg-opacity-20`}>
                                      {session.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </p>
                                  <p><span className="text-slate-400">Consent:</span> 
                                    <Badge className={`ml-2 ${session.consent ? 'bg-green-500' : 'bg-red-500'} bg-opacity-20`}>
                                      {session.consent ? 'Granted' : 'Denied'}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-200 mb-2">Browser Information</h4>
                                {session.browserInfo ? (
                                  <div className="space-y-1 text-sm text-slate-400">
                                    {(() => {
                                      try {
                                        const info = JSON.parse(session.browserInfo);
                                        return (
                                          <>
                                            <p><span className="text-slate-400">User Agent:</span> {info.userAgent?.substring(0, 50)}...</p>
                                            <p><span className="text-slate-400">Platform:</span> {info.platform}</p>
                                            <p><span className="text-slate-400">Language:</span> {info.language}</p>
                                            <p><span className="text-slate-400">Screen:</span> {info.screenWidth}x{info.screenHeight}</p>
                                            <p><span className="text-slate-400">Timezone:</span> {info.timezone}</p>
                                            <p><span className="text-slate-400">HTTPS:</span> {info.isHttps ? 'Yes' : 'No'}</p>
                                          </>
                                        );
                                      } catch {
                                        return <p className="text-slate-500">Invalid browser info</p>;
                                      }
                                    })()}
                                  </div>
                                ) : (
                                  <p className="text-slate-500 text-sm">No browser information available</p>
                                )}
                              </div>
                            </div>
                            {session.permissions && (
                              <div className="mt-4">
                                <h4 className="font-medium text-slate-200 mb-2">Permissions</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    try {
                                      const permissions = JSON.parse(session.permissions);
                                      return permissions.map((perm: any, index: number) => (
                                        <Badge 
                                          key={index} 
                                          className={`${perm.granted ? 'bg-green-500' : 'bg-red-500'} bg-opacity-20`}
                                        >
                                          {perm.type}: {perm.granted ? 'Granted' : 'Denied'}
                                        </Badge>
                                      ));
                                    } catch {
                                      return <span className="text-slate-500 text-sm">No permissions data</span>;
                                    }
                                  })()}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="logs">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-slate-200">Activity Logs</CardTitle>
                  <Button
                    onClick={() => downloadData(logsData, 'activity-logs.json')}
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(!logsData || logsData.length === 0) ? (
                      <div className="text-center py-8 text-slate-400">
                        <Activity className="mx-auto mb-4 text-4xl" />
                        <p>No activity logs available</p>
                        <p className="text-sm">User actions will be logged here</p>
                      </div>
                    ) : (
                      logsData.map((log: any) => (
                        <Card key={log.id} className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-slate-200">{log.action}</h4>
                                <p className="text-sm text-slate-400">Session: {log.sessionId}</p>
                              </div>
                              <Badge className="bg-blue-500 bg-opacity-20 text-blue-400">
                                {new Date(log.timestamp).toLocaleString()}
                              </Badge>
                            </div>
                            {log.details && (
                              <div className="mt-2">
                                <pre className="text-xs text-slate-300 bg-slate-800 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(JSON.parse(log.details), null, 2)}
                                </pre>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-200">Sessions Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Sessions:</span>
                      <span className="text-slate-200">{sessionsData?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Sessions:</span>
                      <span className="text-slate-200">
                        {sessionsData?.filter((s: any) => s.isActive).length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consented Users:</span>
                      <span className="text-slate-200">
                        {sessionsData?.filter((s: any) => s.consent).length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-200">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Actions:</span>
                      <span className="text-slate-200">{logsData?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Permission Requests:</span>
                      <span className="text-slate-200">
                        {logsData?.filter((l: any) => l.action === 'permission_granted').length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">System Info Collected:</span>
                      <span className="text-slate-200">
                        {logsData?.filter((l: any) => l.action === 'system_info_collected').length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-200">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Server Status:</span>
                      <Badge className="bg-green-500 bg-opacity-20 text-green-400">Running</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database:</span>
                      <Badge className="bg-blue-500 bg-opacity-20 text-blue-400">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Update:</span>
                      <span className="text-slate-200 text-sm">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}