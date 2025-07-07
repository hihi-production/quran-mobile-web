
import { useState } from "react";

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

const surahs: Surah[] = [
  { number: 1, name: "Al-Fatiah", arabicName: "الفاتحة", englishName: "The Opening", verses: 7, revelation: "MECCAN" },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", englishName: "The Cow", verses: 286, revelation: "MEDINAN" },
  { number: 3, name: "Al 'Imran", arabicName: "آل عمران", englishName: "The Family of Imran", verses: 200, revelation: "MECCAN" },
  { number: 4, name: "An-Nisa", arabicName: "النساء", englishName: "The Women", verses: 176, revelation: "MECCAN" },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", englishName: "The Table", verses: 120, revelation: "MEDINAN" },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", englishName: "The Cattle", verses: 165, revelation: "MECCAN" },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", englishName: "The Heights", verses: 206, revelation: "MECCAN" },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", englishName: "The Spoils of War", verses: 75, revelation: "MEDINAN" },
];

const SurahList = ({ searchQuery, onSurahSelect }: SurahListProps) => {
  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.includes(searchQuery)
  );

  return (
    <div className="space-y-3">
      {filteredSurahs.map((surah) => (
        <div
          key={surah.number}
          onClick={() => onSurahSelect(surah)}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Surah Number */}
              <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{surah.number}</span>
              </div>
              
              {/* Surah Info */}
              <div>
                <h3 className="text-white font-semibold text-lg">{surah.name}</h3>
                <p className="text-white/70 text-sm">
                  {surah.revelation} • {surah.verses} VERSES
                </p>
              </div>
            </div>
            
            {/* Arabic Name */}
            <div className="text-right">
              <p className="text-white font-semibold text-xl" dir="rtl">{surah.arabicName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurahList;
