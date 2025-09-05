import {
  ArrowLeft,
  Play,
  ArrowLeftCircle,
  ArrowRightCircle,
} from "lucide-react";
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

const SurahDetail = ({
  surah: initialSurah,
  onBack,
  onSurahChange,
}: SurahDetailProps) => {
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
        if (
          response.data.audioFull &&
          Object.keys(response.data.audioFull).length > 0
        ) {
          const firstReciterKey = Object.keys(response.data.audioFull)[0];
          setSelectedAudioUrl(response.data.audioFull[firstReciterKey].trim());
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
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
      if (
        response.data.audioFull &&
        Object.keys(response.data.audioFull).length > 0
      ) {
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
        revelation: response.data.tempatTurun,
      };

      setCurrentSurah(newSurah);

      // Also notify parent component if needed
      if (onSurahChange) {
        onSurahChange(surahNumber);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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
    <div className="min-h-screen bg-primary pb-20">
      {/* Header */}
      <header className="bg-primary shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-white/20 p-2 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl text-white font-bold">
              {currentSurah.name}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 mb-12">
        {/* Surah Header */}
        <Card className="bg-white shadow-lg mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{currentSurah.name}</h2>
            <p className="text-lg mb-3">{currentSurah.englishName}</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span>{currentSurah.revelation}</span>
              <span>•</span>
              <span>{currentSurah.verses} Ayat</span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold" dir="rtl">
                {currentSurah.arabicName}
              </p>
            </div>

            {/* Audio Play Button */}
            <div className="mt-6">
              <Button
                onClick={handlePlayAudio}
                className="bg-primary hover:bg-white/30 text-white border border-white/30"
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
              className="bg-white backdrop-blur-sm border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-sm">{verse.nomorAyat}</span>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="mb-4">
                  <p className="text-2xl leading-relaxed text-right" dir="rtl">
                    {verse.teksArab}
                  </p>
                </div>

                {/* Translation */}
                <p className="italic font-light pb-3">{verse.teksLatin}</p>
                <p className="text-base leading-relaxed">
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
              onClick={() =>
                handleNavigateToSurah(surahDetail.suratSebelumnya!.nomor)
              }
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
              onClick={() =>
                handleNavigateToSurah(surahDetail.suratSelanjutnya!.nomor)
              }
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
