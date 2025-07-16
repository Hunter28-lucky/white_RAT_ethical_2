import { Button } from "@/components/ui/button";
import { Shield, LogOut, WifiOff, Wifi } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  onExitTraining: () => void;
}

export function Header({ isConnected, onExitTraining }: HeaderProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
              <Shield className="text-lg text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-cyan-400">WebRAT-Lite Dashboard</h1>
              <p className="text-sm text-slate-400">Cybersecurity Training Environment</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Connected</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Disconnected</span>
                </>
              )}
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onExitTraining}
              className="bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30 hover:bg-opacity-30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit Training
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
