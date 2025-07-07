
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
}

// Sample verses for Al-Fatiah
const sampleVerses = [
  {
    number: 1,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "[All] praise is [due] to Allah, Lord of the worlds -"
  },
  {
    number: 2,
    arabic: "الرَّحْمَنِ الرَّحِيمِ",
    translation: "The Entirely Merciful, the Especially Merciful,"
  },
  {
    number: 3,
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    translation: "Sovereign of the Day of Recompense."
  },
  {
    number: 4,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation: "It is You we worship and You we ask for help."
  },
  {
    number: 5,
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translation: "Guide us to the straight path -"
  },
  {
    number: 6,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
  }
];

const SurahDetail = ({ surah, onBack }: SurahDetailProps) => {
  // Use sample verses for Al-Fatiah, otherwise show placeholder
  const verses = surah.number === 1 ? sampleVerses : [
    { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." }
  ];

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
            <h1 className="text-xl font-bold text-white">{surah.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Surah Header */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-white text-2xl font-bold mb-2">{surah.name}</h2>
            <p className="text-white/80 text-lg mb-3">{surah.englishName}</p>
            <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
              <span>{surah.revelation}</span>
              <span>•</span>
              <span>{surah.verses} VERSES</span>
            </div>
            <div className="mt-4">
              <p className="text-white text-3xl font-bold" dir="rtl">{surah.arabicName}</p>
            </div>
          </CardContent>
        </Card>

        {/* Verses */}
        <div className="space-y-4">
          {verses.map((verse) => (
            <Card
              key={verse.number}
              className="bg-white/10 backdrop-blur-sm border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{verse.number}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/20 p-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/20 p-2">
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
                    {verse.arabic}
                  </p>
                </div>
                
                {/* Translation */}
                <p className="text-white/80 text-base leading-relaxed">
                  {verse.translation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurahDetail;
