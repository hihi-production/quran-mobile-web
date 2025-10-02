import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { apidoaList, ApiDoa } from "@/api";
import { BookText, Tag, ChevronLeft, ChevronRight } from "lucide-react";

interface DoaListProps {
  searchQuery: string;
  onDoaSelect: (doa: ApiDoa) => void;
}

// Custom hook for fetching doa
const useDoa = () => {
  const [doa, setDoa] = useState<ApiDoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoa = async () => {
      try {
        setLoading(true);
        const data = await apidoaList();
        setDoa(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoa();
  }, []);

  return { doa, loading, error };
};

const DoaList = ({ searchQuery, onDoaSelect }: DoaListProps) => {
  const { doa, loading, error } = useDoa();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Memoize filtered doa to prevent unnecessary recalculations
  const filteredDoa = useMemo(() => {
    return doa.filter(
      (doaItem) =>
        doaItem.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doaItem.grup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doaItem.idn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doaItem.tag.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [doa, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDoa.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoa = filteredDoa.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <div className="text-black text-center py-8">Loading doa...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Results Info */}
      <div className="text-sm text-muted-foreground mb-4">
        Menampilkan {currentDoa.length} dari {filteredDoa.length} doa
        {searchQuery && ` untuk "${searchQuery}"`}
      </div>

      {/* Doa List */}
      <div className="space-y-3">
        {currentDoa.map((doaItem) => (
          <Card
            key={doaItem.id}
            onClick={() => onDoaSelect(doaItem)}
            className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 lg:gap-4 flex-1">
                  {/* Doa Number */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xs sm:text-sm">
                      {doaItem.id}
                    </span>
                  </div>

                  {/* Doa Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-black font-semibold text-sm sm:text-lg mb-1">
                      {doaItem.nama}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-600 font-medium mb-2">
                      {doaItem.grup}
                    </p>

                    {/* Indonesian Translation Preview */}
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2">
                      {doaItem.idn.length > 100
                        ? `${doaItem.idn.substring(0, 100)}...`
                        : doaItem.idn}
                    </p>

                    {/* Tags */}
                    {doaItem.tag && doaItem.tag.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="h-3 w-3 text-purple-400" />
                        {doaItem.tag.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {doaItem.tag.length > 3 && (
                          <span className="text-xs text-purple-600">
                            +{doaItem.tag.length - 3} lagi
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Arabic Text Preview */}
                <div className="text-right ml-2 flex-shrink-0 max-w-[120px] sm:max-w-[200px]">
                  <p
                    className="text-black font-semibold text-sm sm:text-base line-clamp-2"
                    dir="rtl"
                  >
                    {doaItem.ar.length > 50
                      ? `${doaItem.ar.substring(0, 50)}...`
                      : doaItem.ar}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/20 hover:bg-white/30 text-black border-white/30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className={
                    currentPage === pageNumber
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : "bg-white/20 hover:bg-white/30 text-black border-white/30"
                  }
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white/20 hover:bg-white/30 text-black border-white/30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </div>
      )}

      {/* No Results */}
      {filteredDoa.length === 0 && (
        <div className="text-center py-8">
          <BookText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery
              ? `Tidak ada doa yang ditemukan untuk "${searchQuery}"`
              : "Tidak ada doa tersedia"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoaList;
