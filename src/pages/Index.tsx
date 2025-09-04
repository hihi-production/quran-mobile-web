import { useState } from "react";
import { BookOpen, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WelcomeScreen from "@/components/WelcomeScreen";
import SurahList from "@/components/SurahList";
import SurahDetail from "@/components/SurahDetail";
import BottomNavigation from "@/components/BottomNavigation";

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  verses: number;
  revelation: string;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'home' | 'surah'>('welcome');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleGetStarted = () => {
    setCurrentScreen('home');
  };

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentScreen('surah');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedSurah(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    }
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === 'surah' && selectedSurah) {
    return <SurahDetail surah={selectedSurah} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Menu className="h-6 w-6 md:hidden" />
              <h1 className="text-xl font-bold">Quran App</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          {/* Date Section */}
          <div className="flex items-center justify-between mb-6 bg-accent rounded-2xl p-4">
            <div>
              <p className="text-sm text-muted-foreground">Tuesday, 25 May</p>
              <p className="text-xs text-muted-foreground">15 Rajab 1455 AH</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next Isha</p>
              <p className="text-2xl font-bold text-foreground">07:20 <span className="text-sm">PM</span></p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full"></div>
            </div>
          </div>

          {/* Explore Features */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Explore Features</h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground">See All</Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground font-medium">Quran</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">Hadith</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">Doa</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-2">
                  <Menu className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">Qibla</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 rounded-xl"
            />
          </div>

          <SurahList searchQuery={searchQuery} onSurahSelect={handleSurahSelect} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
