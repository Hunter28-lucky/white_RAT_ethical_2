import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Shield, UserCheck, ArrowRight } from "lucide-react";

interface LearningProps {
  onSendMessage: (message: any) => void;
}

export function Learning({ onSendMessage }: LearningProps) {
  const learningModules = [
    {
      title: 'Web Security Fundamentals',
      description: 'Learn the basics of web application security',
      icon: Book,
      color: 'text-green-400',
      bgColor: 'bg-green-400',
      lessons: 12,
      topics: ['OWASP Top 10', 'Input Validation', 'Authentication', 'Session Management']
    },
    {
      title: 'Network Security',
      description: 'Understanding network protocols and security',
      icon: Shield,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400',
      lessons: 8,
      topics: ['TCP/IP Security', 'Firewall Configuration', 'VPN Technologies', 'Network Monitoring']
    },
    {
      title: 'Ethical Hacking',
      description: 'Learn ethical hacking methodologies',
      icon: UserCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400',
      lessons: 15,
      topics: ['Penetration Testing', 'Vulnerability Assessment', 'Social Engineering', 'Reporting']
    }
  ];

  const startLearningModule = (module: string) => {
    onSendMessage({
      type: 'training_action',
      action: 'learning_module_started',
      details: `Started ${module} learning module`
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Cybersecurity Learning Modules</h2>
        <p className="text-slate-400">Comprehensive cybersecurity education content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module) => (
          <Card key={module.title} className="bg-slate-800 border-slate-600">
            <CardHeader>
              <div className={`w-12 h-12 ${module.bgColor} bg-opacity-20 rounded-lg flex items-center justify-center mb-4`}>
                <module.icon className={`${module.color} text-xl`} />
              </div>
              <CardTitle className="text-slate-200">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">{module.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Lessons:</span>
                  <span className={`text-xs ${module.color}`}>{module.lessons}</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Topics covered:</span>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                className={`w-full ${module.bgColor} bg-opacity-20 ${module.color} border border-opacity-30 hover:bg-opacity-30`}
                onClick={() => startLearningModule(module.title)}
              >
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Overall Progress</span>
              <span className="text-cyan-400">0% Complete</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-cyan-400 h-2 rounded-full w-0"></div>
            </div>
            <p className="text-sm text-slate-400">
              Start your cybersecurity learning journey by selecting a module above. 
              Track your progress and earn certificates as you complete each section.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200">Cybersecurity Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Industry Standards</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• NIST Cybersecurity Framework</li>
                <li>• ISO 27001 Information Security</li>
                <li>• CIS Controls</li>
                <li>• OWASP Guidelines</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Certification Paths</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• CompTIA Security+</li>
                <li>• Certified Ethical Hacker (CEH)</li>
                <li>• CISSP</li>
                <li>• OSCP</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
