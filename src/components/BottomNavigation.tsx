
import { BookOpen, Home, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'surah', icon: BookOpen, label: 'Surah' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/20 z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
