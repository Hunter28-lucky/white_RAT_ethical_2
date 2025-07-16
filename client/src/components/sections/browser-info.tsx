import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface BrowserInfoProps {
  onSendMessage: (message: any) => void;
}

export function BrowserInfo({ onSendMessage }: BrowserInfoProps) {
  const [browserInfo, setBrowserInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isHttps: location.protocol === 'https:',
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      webRTC: 'mediaDevices' in navigator
    };
    
    setBrowserInfo(info);
    
    // Send browser info to server
    onSendMessage({
      type: 'browser_info',
      info
    });
  }, [onSendMessage]);

  const systemInfo = [
    { label: 'User Agent', value: browserInfo.userAgent, mono: true },
    { label: 'Platform', value: browserInfo.platform },
    { label: 'Screen Resolution', value: `${browserInfo.screenWidth}x${browserInfo.screenHeight}` },
    { label: 'Color Depth', value: `${browserInfo.colorDepth} bits` },
    { label: 'Language', value: browserInfo.language },
    { label: 'Timezone', value: browserInfo.timezone },
  ];

  const securityFeatures = [
    { label: 'HTTPS', value: browserInfo.isHttps ? '✓ Enabled' : '✗ Disabled', color: browserInfo.isHttps ? 'text-green-400' : 'text-red-400' },
    { label: 'Cookies', value: browserInfo.cookieEnabled ? '✓ Enabled' : '✗ Disabled', color: browserInfo.cookieEnabled ? 'text-amber-400' : 'text-red-400' },
    { label: 'Local Storage', value: browserInfo.localStorage ? '✓ Available' : '✗ Not Available', color: browserInfo.localStorage ? 'text-amber-400' : 'text-red-400' },
    { label: 'Session Storage', value: browserInfo.sessionStorage ? '✓ Available' : '✗ Not Available', color: browserInfo.sessionStorage ? 'text-amber-400' : 'text-red-400' },
    { label: 'WebRTC', value: browserInfo.webRTC ? '✓ Available' : '✗ Not Available', color: browserInfo.webRTC ? 'text-cyan-400' : 'text-red-400' },
    { label: 'Online Status', value: browserInfo.onLine ? '✓ Online' : '✗ Offline', color: browserInfo.onLine ? 'text-green-400' : 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Browser Security Information</h2>
        <p className="text-slate-400">Learn about browser security by examining client information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center">
              <Info className="text-cyan-400 mr-2" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {systemInfo.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-slate-400">{item.label}:</span>
                  <span className={`text-slate-200 ${item.mono ? 'font-mono text-xs' : ''} max-w-xs truncate`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center">
              <Shield className="text-green-400 mr-2" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-slate-400">{feature.label}:</span>
                  <span className={feature.color}>{feature.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200">Educational Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded p-4">
            <p className="text-blue-400 text-sm">
              <strong>Security Learning:</strong> This information demonstrates what websites can learn about your browser 
              and system. In real-world scenarios, this data could be used for fingerprinting, targeted attacks, or 
              vulnerability assessment. Always be cautious about what information you share with websites.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
