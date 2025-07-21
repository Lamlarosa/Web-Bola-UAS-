import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StandingsPage from "./pages/StandingsPage";
import CategoryPage from "./pages/CategoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

// 🔁 Redirect dari /standings/:leagueId ke season default
const RedirectToDefaultSeason = () => {
  const location = useLocation();
  const leagueId = location.pathname.split("/")[2];
  return <Navigate to={`/standings/${leagueId}/2023`} replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/categories" element={<CategoryPage />} />

                {/* 🔒 Rute standings lengkap */}
                <Route
                  path="/standings/:leagueId/:season"
                  element={
                    <ProtectedRoute>
                      <StandingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 🔁 Redirect otomatis ke season 2023 */}
                <Route path="/standings/:leagueId" element={<RedirectToDefaultSeason />} />

                {/* 🛡️ Redirect jika akses ke /standings tanpa ID */}
                <Route path="/standings" element={<Navigate to="/categories" replace />} />

                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />

                {/* ❌ Halaman tidak ditemukan */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
