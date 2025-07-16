import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Chrome, 
  ShieldCheck, 
  Bug, 
  GraduationCap 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'browser-info', label: 'Chrome Information', icon: Chrome },
    { id: 'permissions', label: 'Permission Demos', icon: ShieldCheck },
    { id: 'security-tests', label: 'Security Tests', icon: Bug },
    { id: 'learning', label: 'Learning Modules', icon: GraduationCap },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              className={cn(
                "w-full justify-start space-x-3 px-4 py-3 rounded-lg transition-all",
                activeSection === id
                  ? "bg-cyan-400 bg-opacity-20 text-cyan-400 border border-cyan-400 border-opacity-30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:bg-opacity-50"
              )}
              onClick={() => onSectionChange(id)}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
