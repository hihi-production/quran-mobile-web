import { useState } from "react";
import { ArrowLeft, Clock, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

interface DailyPrayerTimes {
  date: string;
  hijriDate: string;
  location: string;
  prayers: PrayerTime[];
}

const JadwalSholatPage = () => {
  const navigate = useNavigate();

  // Static prayer times data
  const [prayerTimes] = useState<DailyPrayerTimes>({
    date: new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    hijriDate: "15 Rajab 1446 H",
    location: "Jakarta, Indonesia",
    prayers: [
      { name: "Subuh", time: "04:32", arabicName: "الفجر" },
      { name: "Dzuhur", time: "12:05", arabicName: "الظهر" },
      { name: "Ashar", time: "15:23", arabicName: "العصر" },
      { name: "Maghrib", time: "18:12", arabicName: "المغرب" },
      { name: "Isya", time: "19:25", arabicName: "العشاء" },
    ],
  });

  const handleBack = () => {
    navigate("/home");
  };

  const getCurrentPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerMinutes = prayerTimes.prayers.map((prayer) => {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      return { ...prayer, minutes: hours * 60 + minutes };
    });

    // Find current prayer
    for (let i = 0; i < prayerMinutes.length; i++) {
      const nextIndex = (i + 1) % prayerMinutes.length;
      const currentPrayerTime = prayerMinutes[i].minutes;
      const nextPrayerTime = prayerMinutes[nextIndex].minutes;

      if (nextIndex === 0) {
        // Handle transition from Isya to Subuh (next day)
        if (currentTime >= currentPrayerTime || currentTime < nextPrayerTime) {
          return {
            current: prayerMinutes[i],
            next: prayerMinutes[nextIndex],
            isAfterIsya: currentTime >= currentPrayerTime,
          };
        }
      } else {
        if (currentTime >= currentPrayerTime && currentTime < nextPrayerTime) {
          return {
            current: prayerMinutes[i],
            next: prayerMinutes[nextIndex],
            isAfterIsya: false,
          };
        }
      }
    }

    // Default to Subuh if no match
    return {
      current: prayerMinutes[4], // Isya
      next: prayerMinutes[0], // Subuh
      isAfterIsya: true,
    };
  };

  const getTimeUntilNext = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const { next, isAfterIsya } = getCurrentPrayer();

    let timeUntil;
    if (isAfterIsya && next.name === "Subuh") {
      // Calculate time until Subuh tomorrow
      timeUntil = 24 * 60 - currentTime + next.minutes;
    } else {
      timeUntil = next.minutes - currentTime;
    }

    const hours = Math.floor(timeUntil / 60);
    const minutes = timeUntil % 60;

    return { hours, minutes, nextPrayer: next.name };
  };

  const { hours, minutes, nextPrayer } = getTimeUntilNext();
  const { current } = getCurrentPrayer();

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-white/20 p-2 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl text-white font-bold">Jadwal Sholat</h1>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          {/* Location and Date Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-foreground">
                {prayerTimes.location}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{prayerTimes.date}</span>
              <span>•</span>
              <span>{prayerTimes.hijriDate}</span>
            </div>
          </div>

          {/* Current Prayer Status */}
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-6">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm opacity-90">
                    Waktu Sholat Saat Ini
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{current.name}</h3>
                <p className="text-lg opacity-90" dir="rtl">
                  {current.arabicName}
                </p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-sm opacity-90">
                    {nextPrayer} dalam {hours > 0 && `${hours} jam `}
                    {minutes} menit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Jadwal Sholat Hari Ini
            </h3>

            {prayerTimes.prayers.map((prayer, index) => {
              const isCurrentPrayer = current.name === prayer.name;

              return (
                <Card
                  key={index}
                  className={`transition-all duration-200 ${
                    isCurrentPrayer
                      ? "bg-purple-50 border-purple-200 shadow-md"
                      : "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Prayer Icon */}
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCurrentPrayer
                              ? "bg-purple-500 text-white"
                              : "bg-purple-500/30"
                          }`}
                        >
                          <Clock className="h-6 w-6" />
                        </div>

                        {/* Prayer Info */}
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isCurrentPrayer ? "text-purple-700" : "text-black"
                            }`}
                          >
                            {prayer.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              isCurrentPrayer
                                ? "text-purple-600"
                                : "text-muted-foreground"
                            }`}
                            dir="rtl"
                          >
                            {prayer.arabicName}
                          </p>
                        </div>
                      </div>

                      {/* Prayer Time */}
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${
                            isCurrentPrayer ? "text-purple-700" : "text-black"
                          }`}
                        >
                          {prayer.time}
                        </p>
                        {isCurrentPrayer && (
                          <p className="text-xs text-purple-600 font-medium">
                            Waktu Saat Ini
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <Card className="bg-amber-50 border-amber-200 mt-6">
            <CardContent className="p-4">
              <div className="text-center">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Catatan Penting
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Jadwal sholat ini berdasarkan perhitungan untuk wilayah
                  Jakarta. Untuk akurasi yang lebih baik, silakan sesuaikan
                  dengan lokasi Anda.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default JadwalSholatPage;
