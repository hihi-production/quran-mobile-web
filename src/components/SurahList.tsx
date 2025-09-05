import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { getSurah, ApiSurah } from "@/api";
import { BookText, MapPin } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  verses: number;
  revelation: string;
}

interface SurahListProps {
  searchQuery: string;
  onSurahSelect: (surah: Surah) => void;
}

// Custom hook for fetching surahs
const useSurahs = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const data = await getSurah();

        // Transform the API data to match our Surah interface
        const transformedSurahs: Surah[] = data.data.map((surah: ApiSurah) => ({
          number: surah.nomor,
          name: surah.namaLatin,
          arabicName: surah.nama,
          englishName: surah.arti,
          verses: surah.jumlahAyat,
          revelation: surah.tempatTurun,
        }));

        setSurahs(transformedSurahs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  return { surahs, loading, error };
};

const SurahList = ({ searchQuery, onSurahSelect }: SurahListProps) => {
  const { surahs, loading, error } = useSurahs();

  // Memoize filtered surahs to prevent unnecessary recalculations
  const filteredSurahs = useMemo(() => {
    return surahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.arabicName.includes(searchQuery)
    );
  }, [surahs, searchQuery]);

  if (loading) {
    return <div className="text-black text-center py-8">Loading surahs...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="space-y-3">
      {filteredSurahs.map((surah) => (
        <Card
          key={surah.number}
          onClick={() => onSurahSelect(surah)}
          className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Surah Number */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xs sm:text-sm">
                    {surah.number}
                  </span>
                </div>

                {/* Surah Info */}
                <div>
                  <h3 className="text-black font-semibold text-sm sm:text-lg">
                    {surah.name}
                    <span className="text-xs font-light italic text-slate-500 block md:inline-block md:pl-2">
                      {" "}
                      ({surah.englishName}){" "}
                    </span>
                  </h3>
                  <div className="flex items-center text-xs sm:text-sm">
                    <div className="flex items-center mr-2">
                      <MapPin className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span>{surah.revelation}</span>
                    </div>
                    <div className="flex items-center">
                      <BookText className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span>{surah.verses} Ayat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arabic Name */}
              <div className="text-right">
                <p
                  className="text-black font-semibold text-base sm:text-xl"
                  dir="rtl"
                >
                  {surah.arabicName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurahList;
