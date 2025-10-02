// Define response types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiAyat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface ApiSurahBrief {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface ApiSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  ayat?: ApiAyat[];
  suratSelanjutnya?: ApiSurahBrief;
  suratSebelumnya?: ApiSurahBrief;
}

const baseUrl = "https://equran.id/api/v2";

export interface ApiDoa {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

export interface ApiDoaListResponse {
  status: string;
  total: number;
  data: ApiDoa[];
}

export interface ApiDoaDetailResponse {
  status: string;
  data: ApiDoa;
}

const baseUrlDoa = "https://equran.id/api/doa";

// Sholat API Types and Base URL
export interface ApiSholatCity {
  id: string;
  lokasi: string;
}

export interface ApiSholatCityResponse {
  status: boolean;
  request: {
    path: string;
    keyword: string;
  };
  data: ApiSholatCity[];
}

export interface ApiSholatSchedule {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  date: string;
}

export interface ApiSholatScheduleResponse {
  status: boolean;
  request: {
    path: string;
    year: string;
    month: string;
    date: string;
  };
  data: {
    id: number;
    lokasi: string;
    daerah: string;
    jadwal: ApiSholatSchedule;
  };
}

const baseUrlSholat = "https://api.myquran.com/v2/sholat";

export const getSurah = async (): Promise<ApiResponse<ApiSurah[]>> => {
  try {
    const response = await fetch(`${baseUrl}/surat`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

export const getSurahById = async (
  id: number
): Promise<ApiResponse<ApiSurah>> => {
  try {
    const response = await fetch(`${baseUrl}/surat/${id}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching surah ${id}:`, error);
    throw error;
  }
};

export const apidoaList = async (): Promise<ApiDoaListResponse> => {
  try {
    const response = await fetch(baseUrlDoa);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doa list:", error);
    throw error;
  }
};

export const apidoaDetail = async (
  id: number
): Promise<ApiDoaDetailResponse> => {
  try {
    const response = await fetch(`${baseUrlDoa}/${id}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching doa ${id}:`, error);
    throw error;
  }
};

// Sholat API Functions
export const searchSholatCity = async (
  cityName: string
): Promise<ApiSholatCityResponse> => {
  try {
    const response = await fetch(
      `${baseUrlSholat}/kota/cari/${encodeURIComponent(cityName)}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error searching city ${cityName}:`, error);
    throw error;
  }
};

export const getSholatSchedule = async (
  cityId: string,
  date: string
): Promise<ApiSholatScheduleResponse> => {
  try {
    const response = await fetch(`${baseUrlSholat}/jadwal/${cityId}/${date}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Error fetching sholat schedule for city ${cityId} on ${date}:`,
      error
    );
    throw error;
  }
};

// Geolocation utility function
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Get city name from coordinates using reverse geocoding
export const getCityFromCoordinates = async (
  lat: number,
  lon: number
): Promise<string> => {
  try {
    // Using a free reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
    );

    if (!response.ok) {
      throw new Error("Failed to get location information");
    }

    const data = await response.json();

    // Try to get city name, fallback to locality or administrative area
    const cityName =
      data.city || data.locality || data.principalSubdivision || "Jakarta";

    return cityName;
  } catch (error) {
    console.error("Error getting city from coordinates:", error);
    // Fallback to Jakarta if geocoding fails
    return "Jakarta";
  }
};
