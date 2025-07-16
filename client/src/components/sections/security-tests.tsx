import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, Network, Shield, AlertTriangle } from "lucide-react";

interface SecurityTestsProps {
  onSendMessage: (message: any) => void;
}

export function SecurityTests({ onSendMessage }: SecurityTestsProps) {
  const vulnerabilities = [
    {
      name: 'XSS (Cross-Site Scripting)',
      description: 'Learn about XSS vulnerabilities and prevention',
      severity: 'High',
      color: 'text-red-400'
    },
    {
      name: 'SQL Injection',
      description: 'Understanding SQL injection attacks and mitigation',
      severity: 'Critical',
      color: 'text-red-500'
    },
    {
      name: 'CSRF Protection',
      description: 'Cross-Site Request Forgery prevention techniques',
      severity: 'Medium',
      color: 'text-yellow-400'
    }
  ];

  const startDemo = (vulnerability: string) => {
    onSendMessage({
      type: 'training_action',
      action: 'security_demo_started',
      details: `Started ${vulnerability} demonstration`
    });
  };

  const networkScanOutput = [
    { text: '$ nmap -sV localhost (Educational Simulation)', color: 'text-green-400' },
    { text: 'Starting Nmap scan on localhost...', color: 'text-slate-400' },
    { text: 'PORT    STATE SERVICE VERSION', color: 'text-cyan-400' },
    { text: '5000/tcp open  http    Node.js Express framework', color: 'text-slate-300' },
    { text: '8080/tcp open  http    WebRAT-Lite Educational Platform', color: 'text-amber-400' },
    { text: 'Scan complete. Educational purposes only.', color: 'text-green-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Security Testing Modules</h2>
        <p className="text-slate-400">Educational security vulnerability demonstrations</p>
      </div>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            <Bug className="text-red-400 mr-2" />
            Common Web Vulnerabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vulnerabilities.map((vuln, index) => (
              <div key={index} className="bg-slate-900 bg-opacity-50 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-red-400">{vuln.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${vuln.color} bg-opacity-20`}>
                    {vuln.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{vuln.description}</p>
                <Button 
                  size="sm"
                  variant="outline"
                  className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                  onClick={() => startDemo(vuln.name)}
                >
                  Start Demo
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            <Network className="text-green-400 mr-2" />
            Network Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black bg-opacity-50 rounded p-4 font-mono text-sm">
            <div className="space-y-1">
              {networkScanOutput.map((line, index) => (
                <div key={index} className={line.color}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            <Shield className="text-blue-400 mr-2" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 bg-opacity-50 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Input Validation</h4>
                <p className="text-sm text-slate-400">Always validate and sanitize user input on both client and server sides.</p>
              </div>
              <div className="bg-slate-900 bg-opacity-50 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">HTTPS Encryption</h4>
                <p className="text-sm text-slate-400">Use HTTPS for all communications to prevent man-in-the-middle attacks.</p>
              </div>
              <div className="bg-slate-900 bg-opacity-50 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Authentication</h4>
                <p className="text-sm text-slate-400">Implement strong authentication mechanisms and session management.</p>
              </div>
              <div className="bg-slate-900 bg-opacity-50 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Access Control</h4>
                <p className="text-sm text-slate-400">Enforce proper authorization and least privilege principles.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center">
            <AlertTriangle className="text-yellow-400 mr-2" />
            Educational Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded p-4">
            <p className="text-yellow-400 text-sm">
              <strong>Important:</strong> All security tests and demonstrations are educational simulations. 
              These tools should only be used in controlled environments with proper authorization. 
              Unauthorized security testing is illegal and unethical.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
