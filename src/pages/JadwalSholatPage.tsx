import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import {
  searchSholatCity,
  getSholatSchedule,
  getCurrentLocation,
  getCityFromCoordinates,
  ApiSholatSchedule,
} from "@/api";

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

interface DailyPrayerTimes {
  date: string;
  location: string;
  daerah?: string;
  prayers: PrayerTime[];
}

const JadwalSholatPage = () => {
  const navigate = useNavigate();
  const [prayerTimes, setPrayerTimes] = useState<DailyPrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertApiToPrayerTimes = (
    schedule: ApiSholatSchedule
  ): PrayerTime[] => {
    return [
      { name: "Subuh", time: schedule.subuh, arabicName: "الفجر" },
      { name: "Dzuhur", time: schedule.dzuhur, arabicName: "الظهر" },
      { name: "Ashar", time: schedule.ashar, arabicName: "العصر" },
      { name: "Maghrib", time: schedule.maghrib, arabicName: "المغرب" },
      { name: "Isya", time: schedule.isya, arabicName: "العشاء" },
    ];
  };

  const fetchPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setLocationStatus("Mendapatkan lokasi...");

      // Get current location
      let cityName = "Jakarta"; // Default fallback

      try {
        const position = await getCurrentLocation();
        setLocationStatus("Mencari nama kota...");

        cityName = await getCityFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );

        setLocationStatus(`Lokasi ditemukan: ${cityName}`);
      } catch (locationError) {
        console.warn(
          "Location detection failed, using default:",
          locationError
        );
        setLocationStatus("Menggunakan lokasi default: Jakarta");
      }

      // Search for city ID
      setLocationStatus("Mencari data kota...");
      const cityResponse = await searchSholatCity(cityName);

      if (!cityResponse.status || cityResponse.data.length === 0) {
        throw new Error(
          `Kota ${cityName} tidak ditemukan. Menggunakan Jakarta sebagai default.`
        );
      }

      const cityData = cityResponse.data[0];
      setLocationStatus("Mengambil jadwal sholat...");

      // Get prayer schedule for today
      const today = formatDate(new Date());
      const scheduleResponse = await getSholatSchedule(cityData.id, today);

      if (!scheduleResponse.status) {
        throw new Error("Gagal mengambil jadwal sholat");
      }

      const prayers = convertApiToPrayerTimes(scheduleResponse.data.jadwal);

      setPrayerTimes({
        date: scheduleResponse.data.jadwal.tanggal,
        location: scheduleResponse.data.lokasi,
        daerah: scheduleResponse.data.daerah,
        prayers,
      });

      setLocationStatus("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      console.error("Error fetching prayer times:", err);

      // Fallback to static data if API fails
      setPrayerTimes({
        date: new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        location: "Jakarta, Indonesia",
        prayers: [
          { name: "Subuh", time: "04:32", arabicName: "الفجر" },
          { name: "Dzuhur", time: "12:05", arabicName: "الظهر" },
          { name: "Ashar", time: "15:23", arabicName: "العصر" },
          { name: "Maghrib", time: "18:12", arabicName: "المغرب" },
          { name: "Isya", time: "19:25", arabicName: "العشاء" },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  const handleBack = () => {
    navigate("/home");
  };

  const handleRefresh = () => {
    fetchPrayerTimes();
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;

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
    const prayerInfo = getCurrentPrayer();
    if (!prayerInfo) return { hours: 0, minutes: 0, nextPrayer: "Subuh" };

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const { next, isAfterIsya } = prayerInfo;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-primary pb-20">
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

        <div className="container mx-auto px-4 py-6">
          <div className="bg-card rounded-3xl p-6 shadow-lg">
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
              <p className="text-lg font-semibold mb-2">Memuat Jadwal Sholat</p>
              {locationStatus && (
                <p className="text-sm text-muted-foreground">
                  {locationStatus}
                </p>
              )}
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error && !prayerTimes) {
    return (
      <div className="min-h-screen bg-primary pb-20">
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

        <div className="container mx-auto px-4 py-6">
          <div className="bg-card rounded-3xl p-6 shadow-lg">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2 text-red-600">
                Gagal Memuat Data
              </p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={handleRefresh}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!prayerTimes) return null;

  const prayerInfo = getCurrentPrayer();
  const { hours, minutes, nextPrayer } = getTimeUntilNext();
  const current = prayerInfo?.current;

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="hover:bg-white/20 p-2 text-white"
              disabled={loading}
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          {/* Error Banner */}
          {error && (
            <Card className="bg-amber-50 border-amber-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-700">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location and Date Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-foreground">
                {prayerTimes.location}
                {prayerTimes.daerah && `, ${prayerTimes.daerah}`}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{prayerTimes.date}</span>
            </div>
          </div>

          {/* Current Prayer Status */}
          {current && (
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
          )}

          {/* Prayer Times List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Jadwal Sholat Hari Ini
            </h3>

            {prayerTimes.prayers.map((prayer, index) => {
              const isCurrentPrayer = current?.name === prayer.name;

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
          <Card className="bg-green-50 border-green-200 mt-6">
            <CardContent className="p-4">
              <div className="text-center">
                <h4 className="font-semibold text-green-800 mb-2">Informasi</h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  Jadwal sholat ini diambil dari API MyQuran dan disesuaikan
                  dengan lokasi Anda.
                  {error &&
                    " Data fallback digunakan karena terjadi kesalahan pada API."}
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
