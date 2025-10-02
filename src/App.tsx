import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import SurahDetailPage from "./pages/SurahDetailPage";
import DoaPage from "./pages/DoaPage";
import DoaDetailPage from "./pages/DoaDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/surah/:surahId" element={<SurahDetailPage />} />
          {/* Future routes for new modules */}
          <Route
            path="/hadist"
            element={<div>Hadist Module - Coming Soon</div>}
          />
          <Route path="/doa" element={<DoaPage />} />
          <Route path="/doa/:doaId" element={<DoaDetailPage />} />
          <Route
            path="/jadwal-sholat"
            element={<div>Jadwal Sholat Module - Coming Soon</div>}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
