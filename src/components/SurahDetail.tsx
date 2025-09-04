import { ArrowLeft, Play, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import MediaPlayer from "./MediaPlayer";
import { getSurahById, ApiSurah, ApiAyat } from "@/api";

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  verses: number;
  revelation: string;
}

interface SurahDetailProps {
  surah: Surah;
  onBack: () => void;
  onSurahChange?: (surahNumber: number) => void;
}

const SurahDetail = ({ surah: initialSurah, onBack, onSurahChange }: SurahDetailProps) => {
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [surahDetail, setSurahDetail] = useState<ApiSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string>("");
  const [currentSurah, setCurrentSurah] = useState<Surah>(initialSurah);
  
  useEffect(() => {
    const fetchSurahDetail = async () => {
      try {
        setLoading(true);
        const response = await getSurahById(currentSurah.number);
        setSurahDetail(response.data);
        
        // Set default audio URL (first reciter)
        if (response.data.audioFull && Object.keys(response.data.audioFull).length > 0) {
          const firstReciterKey = Object.keys(response.data.audioFull)[0];
          setSelectedAudioUrl(response.data.audioFull[firstReciterKey].trim());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSurahDetail();
  }, [currentSurah.number]);

  const handlePlayAudio = () => {
    setShowMediaPlayer(true);
  };

  const handleNavigateToSurah = async (surahNumber: number) => {
    try {
      setLoading(true);
      const response = await getSurahById(surahNumber);
      setSurahDetail(response.data);
      
      // Update audio URL for new surah
      if (response.data.audioFull && Object.keys(response.data.audioFull).length > 0) {
        const firstReciterKey = Object.keys(response.data.audioFull)[0];
        setSelectedAudioUrl(response.data.audioFull[firstReciterKey].trim());
      } else {
        setSelectedAudioUrl("");
      }
      
      // Update current surah information
      const newSurah: Surah = {
        number: response.data.nomor,
        name: response.data.namaLatin,
        arabicName: response.data.nama,
        englishName: response.data.arti,
        verses: response.data.jumlahAyat,
        revelation: response.data.tempatTurun.toUpperCase() === "MEKAH" ? "MECCAN" : "MEDINAN"
      };
      
      setCurrentSurah(newSurah);
      
      // Also notify parent component if needed
      if (onSurahChange) {
        onSurahChange(surahNumber);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center">
        <p className="text-white text-xl">Loading surah details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center">
        <p className="text-red-200 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 pb-20">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">{currentSurah.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 mb-12">
        {/* Surah Header */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-white text-2xl font-bold mb-2">{currentSurah.name}</h2>
            <p className="text-white/80 text-lg mb-3">{currentSurah.englishName}</p>
            <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
              <span>{currentSurah.revelation}</span>
              <span>•</span>
              <span>{currentSurah.verses} VERSES</span>
            </div>
            <div className="mt-4">
              <p className="text-white text-3xl font-bold" dir="rtl">{currentSurah.arabicName}</p>
            </div>
            
            {/* Audio Play Button */}
            <div className="mt-6">
              <Button 
                onClick={handlePlayAudio}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                variant="outline"
                disabled={!selectedAudioUrl}
              >
                <Play className="h-4 w-4 mr-2" />
                Play Audio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verses */}
        <div className="space-y-4">
          {surahDetail?.ayat?.map((verse: ApiAyat) => (
            <Card
              key={verse.nomorAyat}
              className="bg-white/10 backdrop-blur-sm border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{verse.nomorAyat}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/20 p-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white/70 hover:bg-white/20 p-2"
                      onClick={() => {
                        if (verse.audio && Object.keys(verse.audio).length > 0) {
                          const firstReciterKey = Object.keys(verse.audio)[0];
                          setSelectedAudioUrl(verse.audio[firstReciterKey].trim());
                          setShowMediaPlayer(true);
                        }
                      }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <polygon points="14 7 7 12 14 17 14 7"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/20 p-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                      </svg>
                    </Button>
                  </div>
                </div>
                
                {/* Arabic Text */}
                <div className="mb-4">
                  <p className="text-white text-2xl leading-relaxed text-right" dir="rtl">
                    {verse.teksArab}
                  </p>
                </div>
                
                {/* Translation */}
                <p className="text-white/80 text-base leading-relaxed">
                  {verse.teksIndonesia}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {surahDetail?.suratSebelumnya ? (
            <Button
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 flex items-center gap-2"
              onClick={() => handleNavigateToSurah(surahDetail.suratSebelumnya!.nomor)}
            >
              <ArrowLeftCircle className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-80">Previous</span>
                <span>{surahDetail.suratSebelumnya.namaLatin}</span>
              </div>
            </Button>
          ) : (
            <div></div>
          )}

          {surahDetail?.suratSelanjutnya ? (
            <Button
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 flex items-center gap-2"
              onClick={() => handleNavigateToSurah(surahDetail.suratSelanjutnya!.nomor)}
            >
              <div className="flex flex-col items-end">
                <span className="text-xs opacity-80">Next</span>
                <span>{surahDetail.suratSelanjutnya.namaLatin}</span>
              </div>
              <ArrowRightCircle className="h-5 w-5" />
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* Media Player */}
      {showMediaPlayer && (
        <MediaPlayer
          surahName={currentSurah.name}
          arabicName={currentSurah.arabicName}
          audioUrl={selectedAudioUrl}
          onClose={() => setShowMediaPlayer(false)}
        />
      )}
    </div>
  );
};

export default SurahDetail;