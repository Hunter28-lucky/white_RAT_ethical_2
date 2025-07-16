import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, MapPin, Upload } from "lucide-react";
import { useState } from "react";

interface PermissionsProps {
  onSendMessage: (message: any) => void;
}

export function Permissions({ onSendMessage }: PermissionsProps) {
  const [permissionStatus, setPermissionStatus] = useState<Record<string, string>>({});

  const requestCameraPermission = async () => {
    try {
      setPermissionStatus(prev => ({ ...prev, camera: 'Requesting...' }));
      
      // Educational demonstration - show permission request
      const granted = window.confirm('EDUCATIONAL DEMO: Allow camera access for training purposes?');
      
      if (granted) {
        // In a real scenario, this would request actual camera access
        // navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionStatus(prev => ({ ...prev, camera: 'Granted (Educational Demo)' }));
        
        onSendMessage({
          type: 'permission_request',
          permission: 'camera',
          granted: true
        });
      } else {
        setPermissionStatus(prev => ({ ...prev, camera: 'Denied (Educational Demo)' }));
        
        onSendMessage({
          type: 'permission_request',
          permission: 'camera',
          granted: false
        });
      }
    } catch (error) {
      setPermissionStatus(prev => ({ ...prev, camera: 'Error (Educational Demo)' }));
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      setPermissionStatus(prev => ({ ...prev, microphone: 'Requesting...' }));
      
      const granted = window.confirm('EDUCATIONAL DEMO: Allow microphone access for training purposes?');
      
      if (granted) {
        setPermissionStatus(prev => ({ ...prev, microphone: 'Granted (Educational Demo)' }));
        
        onSendMessage({
          type: 'permission_request',
          permission: 'microphone',
          granted: true
        });
      } else {
        setPermissionStatus(prev => ({ ...prev, microphone: 'Denied (Educational Demo)' }));
        
        onSendMessage({
          type: 'permission_request',
          permission: 'microphone',
          granted: false
        });
      }
    } catch (error) {
      setPermissionStatus(prev => ({ ...prev, microphone: 'Error (Educational Demo)' }));
    }
  };

  const requestLocationPermission = async () => {
    try {
      setPermissionStatus(prev => ({ ...prev, location: 'Requesting...' }));
      
      const granted = window.confirm('EDUCATIONAL DEMO: Allow location access for training purposes?');
      
      if (granted) {
        setPermissionStatus(prev => ({ ...prev, location: 'Granted (Educational Demo)' }));
        
        onSendMessage({
          type: 'permission_request',
          permission: 'location',
          granted: true
        });
      } else {
        setPermissionStatus(prev => ({ ...prev, location: 'Denied (Educational Demo)' }));
        
        onSendMessage({
          type: 'permission_request',
          permission: 'location',
          granted: false
        });
      }
    } catch (error) {
      setPermissionStatus(prev => ({ ...prev, location: 'Error (Educational Demo)' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPermissionStatus(prev => ({ 
        ...prev, 
        file: `Selected: ${file.name} (${Math.round(file.size / 1024)}KB)` 
      }));
      
      onSendMessage({
        type: 'training_action',
        action: 'file_selected',
        details: `File: ${file.name}, Size: ${file.size}, Type: ${file.type}`
      });
    }
  };

  const permissionCards = [
    {
      title: 'Camera Access Demo',
      description: 'This demonstrates how applications request camera access',
      icon: Camera,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400',
      borderColor: 'border-cyan-400',
      action: requestCameraPermission,
      status: permissionStatus.camera
    },
    {
      title: 'Microphone Access Demo',
      description: 'This demonstrates how applications request microphone access',
      icon: Mic,
      color: 'text-green-400',
      bgColor: 'bg-green-400',
      borderColor: 'border-green-400',
      action: requestMicrophonePermission,
      status: permissionStatus.microphone
    },
    {
      title: 'Location Access Demo',
      description: 'This demonstrates how applications request location access',
      icon: MapPin,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400',
      borderColor: 'border-amber-400',
      action: requestLocationPermission,
      status: permissionStatus.location
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Permission Demonstrations</h2>
        <p className="text-slate-400">Educational demonstrations of browser permission requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {permissionCards.map((card) => (
          <Card key={card.title} className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center">
                <card.icon className={`${card.color} mr-2`} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">{card.description}</p>
              <Button 
                className={`w-full ${card.bgColor} bg-opacity-20 ${card.color} border ${card.borderColor} border-opacity-30 hover:bg-opacity-30`}
                onClick={card.action}
              >
                <card.icon className="w-4 h-4 mr-2" />
                Request Permission (Demo)
              </Button>
              {card.status && (
                <div className="mt-4 text-sm text-slate-400">
                  Status: {card.status}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center">
              <Upload className="text-red-400 mr-2" />
              File Upload Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">This demonstrates file upload security considerations</p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.pdf,.jpg,.png,.gif,.doc,.docx"
              className="hidden"
              id="fileUpload"
            />
            <Button 
              className="w-full bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30 hover:bg-opacity-30"
              onClick={() => document.getElementById('fileUpload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Select File for Upload Demo
            </Button>
            {permissionStatus.file && (
              <div className="mt-4 text-sm text-slate-400">
                Status: {permissionStatus.file}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200">Security Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded p-4">
            <p className="text-yellow-400 text-sm">
              <strong>Important:</strong> These demonstrations show how websites can request various permissions. 
              In real-world scenarios, only grant permissions to trusted sites and understand what data you're sharing. 
              Malicious sites can abuse these permissions for unauthorized surveillance or data collection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
