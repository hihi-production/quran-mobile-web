import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { getSurah, ApiSurah } from "@/api";

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
          revelation: surah.tempatTurun.toUpperCase() === "MEKAH" ? "MECCAN" : "MEDINAN"
        }));
        
        setSurahs(transformedSurahs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
    return surahs.filter(surah => 
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Surah Number */}
                <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">{surah.number}</span>
                </div>
                
                {/* Surah Info */}
                <div>
                  <h3 className="text-black font-semibold text-lg">{surah.name}</h3>
                  <p className="text-sm">
                    {surah.revelation} • {surah.verses} VERSES
                  </p>
                </div>
              </div>
              
              {/* Arabic Name */}
              <div className="text-right">
                <p className="text-black font-semibold text-xl" dir="rtl">{surah.arabicName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurahList;