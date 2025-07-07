
import { useState } from "react";
import { BookOpen, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WelcomeScreen from "@/components/WelcomeScreen";
import SurahList from "@/components/SurahList";
import SurahDetail from "@/components/SurahDetail";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'home' | 'surah'>('welcome');
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGetStarted = () => {
    setCurrentScreen('home');
  };

  const handleSurahSelect = (surah: any) => {
    setSelectedSurah(surah);
    setCurrentScreen('surah');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedSurah(null);
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === 'surah' && selectedSurah) {
    return <SurahDetail surah={selectedSurah} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Menu className="h-6 w-6 text-white md:hidden" />
              <h1 className="text-xl font-bold text-white">Quran App</h1>
            </div>
            <Search className="h-6 w-6 text-white" />
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-white mb-6">
          <p className="text-sm opacity-90">Asslamuaaikum</p>
          <h2 className="text-2xl font-bold">Tanvir Ahassan</h2>
        </div>

        {/* Last Read Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Last Read</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-1">Al-Fatiah</h3>
          <p className="text-white/70 text-sm">Ayah No. 1</p>
          
          {/* Book Illustration */}
          <div className="mt-4 flex justify-center">
            <div className="relative">
              <div className="w-24 h-16 bg-gradient-to-r from-orange-400 to-orange-300 rounded-lg transform rotate-3 shadow-lg"></div>
              <div className="absolute top-0 left-0 w-24 h-16 bg-gradient-to-r from-white to-gray-100 rounded-lg shadow-lg">
                <div className="p-2">
                  <div className="h-1 bg-gray-300 rounded mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded mb-1"></div>
                  <div className="h-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search surah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b border-white/20">
          <button className="text-white font-medium pb-2 border-b-2 border-white">
            Surah
          </button>
          <button className="text-white/70 font-medium pb-2">
            Para
          </button>
          <button className="text-white/70 font-medium pb-2">
            Page
          </button>
          <button className="text-white/70 font-medium pb-2">
            Hijb
          </button>
        </div>

        {/* Surah List */}
        <SurahList searchQuery={searchQuery} onSurahSelect={handleSurahSelect} />
      </div>
    </div>
  );
};

export default Index;
