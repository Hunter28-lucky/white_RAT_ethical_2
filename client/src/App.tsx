import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Landing } from "@/pages/landing";
import { Dashboard } from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');

  const handleProceedToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleExitTraining = () => {
    setCurrentPage('landing');
  };

  return (
    <Switch>
      <Route path="/">
        {currentPage === 'landing' ? (
          <Landing onProceed={handleProceedToDashboard} />
        ) : (
          <Dashboard onExit={handleExitTraining} />
        )}
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
