// Define response types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
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