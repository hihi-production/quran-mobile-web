import { useState } from "react";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import DoaList from "@/components/DoaList";
import BottomNavigation from "@/components/BottomNavigation";
import { ApiDoa } from "@/api";
import { Button } from "@/components/ui/button";

const DoaPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleDoaSelect = (doa: ApiDoa) => {
    navigate(`/doa/${doa.id}`);
  };

  const handleBack = () => {
    navigate("/home");
  };

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
            <h1 className="text-xl text-white font-bold">Doa-Doa Harian</h1>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          {/* Search Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Cari Doa
            </h2>
            <Input
              placeholder="Cari berdasarkan nama, kategori, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 rounded-xl"
            />
          </div>

          {/* Doa List */}
          <DoaList searchQuery={searchQuery} onDoaSelect={handleDoaSelect} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DoaPage;
