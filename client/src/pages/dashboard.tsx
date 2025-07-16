import { useState } from "react";
import { Header } from "@/components/navigation/header";
import { Sidebar } from "@/components/navigation/sidebar";
import { Overview } from "@/components/sections/overview";
import { BrowserInfo } from "@/components/sections/browser-info";
import { Permissions } from "@/components/sections/permissions";
import { SecurityTests } from "@/components/sections/security-tests";
import { Learning } from "@/components/sections/learning";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onExit: () => void;
}

export function Dashboard({ onExit }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const { toast } = useToast();
  
  const { isConnected, sessionId, sendMessage } = useWebSocket({
    onMessage: (message) => {
      console.log('Received message:', message);
      
      if (message.type === 'error') {
        toast({
          title: 'Connection Error',
          description: message.message,
          variant: 'destructive',
        });
      }
    },
    onConnect: () => {
      toast({
        title: 'Connected',
        description: 'Successfully connected to training platform',
      });
    },
    onDisconnect: () => {
      toast({
        title: 'Disconnected',
        description: 'Connection to training platform lost',
        variant: 'destructive',
      });
    }
  });

  const handleSendMessage = (message: any) => {
    sendMessage(message);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview isConnected={isConnected} sessionId={sessionId} />;
      case 'browser-info':
        return <BrowserInfo onSendMessage={handleSendMessage} />;
      case 'permissions':
        return <Permissions onSendMessage={handleSendMessage} />;
      case 'security-tests':
        return <SecurityTests onSendMessage={handleSendMessage} />;
      case 'learning':
        return <Learning onSendMessage={handleSendMessage} />;
      default:
        return <Overview isConnected={isConnected} sessionId={sessionId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header isConnected={isConnected} onExitTraining={onExit} />
      
      <div className="flex">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}
