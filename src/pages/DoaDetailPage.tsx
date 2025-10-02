import { useParams, useNavigate } from "react-router-dom";
import DoaDetail from "@/components/DoaDetail";

const DoaDetailPage = () => {
  const { doaId } = useParams<{ doaId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/doa");
  };

  if (!doaId) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white text-xl">Doa ID tidak ditemukan</p>
      </div>
    );
  }

  return <DoaDetail doaId={parseInt(doaId)} onBack={handleBack} />;
};

export default DoaDetailPage;
