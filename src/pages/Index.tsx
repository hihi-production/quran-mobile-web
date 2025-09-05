import { useState } from "react";
import { BookOpenText, BookText, HeartHandshake, Compass } from "lucide-react";
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
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "home" | "surah"
  >("welcome");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const handleGetStarted = () => {
    setCurrentScreen("home");
  };

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentScreen("surah");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setSelectedSurah(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      setCurrentScreen("home");
    }
  };

  if (currentScreen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === "surah" && selectedSurah) {
    return <SurahDetail surah={selectedSurah} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Muslim Pocket</h1>
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
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {/* <p className="text-xs text-muted-foreground">15 Rajab 1455 AH</p> */}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground hidden lg:block">
                Waktu Sekarang
              </p>
              <p className="text-2xl font-bold text-foreground pr-3">
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: (() => {
                  const hour = new Date().getHours();
                  return hour >= 18 || hour < 6
                    ? "linear-gradient(to bottom right, #6366f1, #0f172a)" // Night: blue/indigo
                    : "linear-gradient(to bottom right, #fde68a, #fb923c)"; // Day: yellow/orange
                })(),
              }}
            >
              {(() => {
                const hour = new Date().getHours();
                if (hour >= 18 || hour < 6) {
                  // Night: Moon
                  return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M24 20.5C21.2386 20.5 19 18.2614 19 15.5C19 13.0477 20.7796 10.9998 23.1111 10.5677C22.7562 10.5261 22.3842 10.5 22 10.5C16.201 10.5 11.5 15.201 11.5 21C11.5 23.7614 13.7386 26 16.5 26C20.6421 26 24 22.6421 24 18.5V20.5Z"
                        fill="#fbbf24"
                      />
                    </svg>
                  );
                } else {
                  // Day: Sun
                  return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="8" fill="#fde68a" />
                      <g stroke="#fbbf24" strokeWidth="2">
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="16" y1="26" x2="16" y2="30" />
                        <line x1="2" y1="16" x2="6" y2="16" />
                        <line x1="26" y1="16" x2="30" y2="16" />
                        <line x1="6.93" y1="6.93" x2="9.76" y2="9.76" />
                        <line x1="22.24" y1="22.24" x2="25.07" y2="25.07" />
                        <line x1="6.93" y1="25.07" x2="9.76" y2="22.24" />
                        <line x1="22.24" y1="9.76" x2="25.07" y2="6.93" />
                      </g>
                    </svg>
                  );
                }
              })()}
            </div>
          </div>

          {/* Explore Features */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Jelajahi Fitur
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                See All
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="sm:w-16 sm:h-16 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-2">
                  <BookOpenText className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground font-medium">
                  Quran
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="sm:w-16 sm:h-16 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-2">
                  <BookText className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">
                  Hadist
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="sm:w-16 sm:h-16 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-2">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">Doa</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="sm:w-16 sm:h-16 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-2">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">
                  Qiblat
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Cari surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 rounded-xl"
            />
          </div>

          <SurahList
            searchQuery={searchQuery}
            onSurahSelect={handleSurahSelect}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} /> */}
    </div>
  );
};

export default Index;
