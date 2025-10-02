import { ArrowLeft, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { apidoaDetail, ApiDoa } from "@/api";

interface DoaDetailProps {
  doaId: number;
  onBack: () => void;
}

const DoaDetail = ({ doaId, onBack }: DoaDetailProps) => {
  const [doaDetail, setDoaDetail] = useState<ApiDoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoaDetail = async () => {
      try {
        setLoading(true);
        const response = await apidoaDetail(doaId);
        setDoaDetail(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoaDetail();
  }, [doaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white text-xl">Loading doa details...</p>
      </div>
    );
  }

  if (error || !doaDetail) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-200 text-xl mb-4">
            Error: {error || "Doa not found"}
          </p>
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
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
            <h1 className="text-xl text-white font-bold line-clamp-1">
              {doaDetail.nama}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 mb-12">
        {/* Doa Header */}
        <Card className="bg-white shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{doaDetail.nama}</h2>
              <p className="text-lg text-purple-600 font-medium mb-4">
                {doaDetail.grup}
              </p>

              {/* Tags */}
              {doaDetail.tag && doaDetail.tag.length > 0 && (
                <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                  <Tag className="h-4 w-4 text-purple-400" />
                  {doaDetail.tag.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Arabic Text */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Doa dalam Bahasa Arab
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p
                  className="text-2xl leading-relaxed text-right font-arabic"
                  dir="rtl"
                  style={{ lineHeight: "2.5" }}
                >
                  {doaDetail.ar}
                </p>
              </div>
            </div>

            {/* Transliteration */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Transliterasi</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-base italic leading-relaxed text-blue-900">
                  {doaDetail.tr}
                </p>
              </div>
            </div>

            {/* Indonesian Translation */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Terjemahan</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-base leading-relaxed text-green-900">
                  {doaDetail.idn}
                </p>
              </div>
            </div>

            {/* About/Source */}
            {doaDetail.tentang && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Keterangan</h3>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm leading-relaxed text-amber-900 whitespace-pre-line">
                    {doaDetail.tentang}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Doa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoaDetail;
