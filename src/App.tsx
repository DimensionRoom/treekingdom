import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import PlantsPage from "./pages/PlantsPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import SupplyDetailPage from "./pages/SupplyDetailPage";
import LuckyPage from "./pages/LuckyPage";
import PersonalityPage from "./pages/PersonalityPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isDetailPage =
    /^\/plants\/.+/.test(location.pathname) ||
    /^\/categories\/.+/.test(location.pathname);
  const isAuthArea = location.pathname === "/tk-portal-9x7" || location.pathname.startsWith("/admin");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/:id" element={<PlantDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:id" element={<SupplyDetailPage />} />
          <Route path="/lucky" element={<LuckyPage />} />
          <Route path="/personality" element={<PersonalityPage />} />
          <Route path="/tk-portal-9x7" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isDetailPage && !isAuthArea && <Footer />}
    </div>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
