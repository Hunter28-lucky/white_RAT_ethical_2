import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Landing } from "@/pages/landing";
import { Dashboard } from "@/pages/dashboard";
import { CommandCenter } from "@/pages/command-center";
import { ClientDashboard } from "@/pages/client-dashboard";
import { DataDashboard } from "@/pages/data-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'command' | 'data'>('landing');

  const handleProceedToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleProceedToCommand = () => {
    setCurrentPage('command');
  };

  const handleProceedToData = () => {
    setCurrentPage('data');
  };

  const handleExitTraining = () => {
    setCurrentPage('landing');
  };

  return (
    <Switch>
      <Route path="/">
        {currentPage === 'landing' ? (
          <Landing onProceed={handleProceedToDashboard} onCommand={handleProceedToCommand} />
        ) : currentPage === 'dashboard' ? (
          <Dashboard onExit={handleExitTraining} />
        ) : currentPage === 'command' ? (
          <CommandCenter onExit={handleExitTraining} onViewData={handleProceedToData} />
        ) : (
          <DataDashboard onBack={handleProceedToCommand} />
        )}
      </Route>
      <Route path="/client/:linkId">
        {(params) => <ClientDashboard linkId={params.linkId} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
