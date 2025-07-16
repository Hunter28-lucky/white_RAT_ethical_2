import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, ShieldQuestion, Camera, Mic, MapPin, Monitor } from "lucide-react";

interface LandingProps {
  onProceed: () => void;
  onCommand: () => void;
}

export function Landing({ onProceed, onCommand }: LandingProps) {
  const permissions = [
    { icon: Camera, label: 'Camera Access (Educational Demo)' },
    { icon: Mic, label: 'Microphone Access (Educational Demo)' },
    { icon: MapPin, label: 'Location Services (Educational Demo)' },
    { icon: Monitor, label: 'System Information (Educational Demo)' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <Shield className="text-2xl text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">WebRAT-Lite</h1>
                <p className="text-sm text-slate-400">Ethical Cybersecurity Training Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-xs bg-green-400 bg-opacity-20 text-green-400 rounded-full border border-green-400 border-opacity-30">
                🎓 Educational Use Only
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Warning Card */}
          <Card className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="text-red-400 text-2xl" />
                <h2 className="text-xl font-bold text-red-400">IMPORTANT LEGAL DISCLAIMER</h2>
              </div>
              <div className="space-y-3 text-slate-200">
                <p className="font-semibold text-red-400">THIS IS AN EDUCATIONAL CYBERSECURITY TRAINING PLATFORM</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>This tool is designed for educational purposes and cybersecurity awareness training only</li>
                  <li>All activities are simulated and do not involve actual penetration testing or unauthorized access</li>
                  <li>By proceeding, you consent to participate in educational security demonstrations</li>
                  <li>No actual sensitive data will be collected, stored, or transmitted</li>
                  <li>This platform demonstrates security concepts in a safe, controlled environment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Permission Card */}
          <Card className="bg-slate-800 border border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldQuestion className="text-cyan-400 text-xl" />
                <h3 className="text-lg font-semibold text-cyan-400">Consent & Permissions</h3>
              </div>
              <div className="space-y-4 text-slate-300">
                <p className="text-sm">This educational platform will demonstrate browser security concepts and may request access to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissions.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-900 bg-opacity-50 rounded">
                      <permission.icon className="text-amber-400" />
                      <span className="text-sm">{permission.label}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-400 bg-slate-900 bg-opacity-30 p-3 rounded">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    All permissions will be requested transparently with clear explanations of their educational purpose.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                onClick={onProceed}
                className="bg-gradient-to-r from-cyan-400 to-green-400 text-slate-900 px-8 py-4 text-lg font-semibold hover:from-green-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Shield className="mr-2" />
                Enter Training Mode
              </Button>
              <Button 
                onClick={onCommand}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 text-lg font-semibold hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Shield className="mr-2" />
                Open Command Center
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              Training Mode: Educational demonstrations • Command Center: Control panel for demonstrations
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-400 text-sm">
            <p>&copy; 2024 WebRAT-Lite Educational Platform. For cybersecurity training purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
