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

export const getSurahById = async (id: number): Promise<ApiResponse<ApiSurah>> => {
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