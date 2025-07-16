import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Book, AlertTriangle } from "lucide-react";

interface OverviewProps {
  isConnected: boolean;
  sessionId: string | null;
}

export function Overview({ isConnected, sessionId }: OverviewProps) {
  const statusCards = [
    {
      title: "System Status",
      value: isConnected ? "Secure & Ready" : "Connecting...",
      icon: Shield,
      color: isConnected ? "text-green-400" : "text-yellow-400",
      bgColor: isConnected ? "bg-green-400" : "bg-yellow-400"
    },
    {
      title: "Active Sessions",
      value: isConnected ? "1 Connected" : "0 Connected",
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400"
    },
    {
      title: "Training Modules",
      value: "12 Available",
      icon: Book,
      color: "text-amber-400",
      bgColor: "bg-amber-400"
    },
    {
      title: "Security Alerts",
      value: "Educational Only",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-400"
    }
  ];

  const logEntries = [
    { type: 'INFO', message: 'WebRAT-Lite Training Platform Initialized', color: 'text-green-400' },
    { type: 'SYSTEM', message: 'Educational environment loaded successfully', color: 'text-cyan-400' },
    { type: 'WARNING', message: 'This is a training simulation - no actual data collection', color: 'text-amber-400' },
    { type: 'LOG', message: 'User consent obtained for educational purposes', color: 'text-slate-400' },
    { type: 'READY', message: 'Training dashboard active', color: 'text-green-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Training Dashboard Overview</h2>
        <p className="text-slate-400">Welcome to the WebRAT-Lite cybersecurity training environment</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card) => (
          <Card key={card.title} className="bg-slate-800 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${card.bgColor} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                  <card.icon className={`${card.color} text-xl`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">{card.title}</h3>
                  <p className={`text-sm ${card.color}`}>{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Info */}
      {sessionId && (
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Session ID:</span>
                <span className="text-slate-200 font-mono text-sm">{sessionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Connection Status:</span>
                <span className={isConnected ? "text-green-400" : "text-red-400"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Training Mode:</span>
                <span className="text-cyan-400">Educational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terminal Output */}
      <Card className="bg-slate-900 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            <span className="mr-2">🖥️</span>
            Training Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black bg-opacity-50 rounded p-4 font-mono text-sm">
            <div className="space-y-1">
              {logEntries.map((entry, index) => (
                <div key={index} className={entry.color}>
                  [{entry.type}] {entry.message}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
