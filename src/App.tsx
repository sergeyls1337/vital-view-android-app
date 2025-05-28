
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import EmailConfirmation from "./components/EmailConfirmation";
import ActivityPage from "./pages/ActivityPage";
import WaterPage from "./pages/WaterPage";
import SleepPage from "./pages/SleepPage";
import WeightPage from "./pages/WeightPage";
import StatisticsPage from "./pages/StatisticsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/confirm" element={<EmailConfirmation />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/activity" element={
                  <ProtectedRoute>
                    <ActivityPage />
                  </ProtectedRoute>
                } />
                <Route path="/water" element={
                  <ProtectedRoute>
                    <WaterPage />
                  </ProtectedRoute>
                } />
                <Route path="/sleep" element={
                  <ProtectedRoute>
                    <SleepPage />
                  </ProtectedRoute>
                } />
                <Route path="/weight" element={
                  <ProtectedRoute>
                    <WeightPage />
                  </ProtectedRoute>
                } />
                <Route path="/statistics" element={
                  <ProtectedRoute>
                    <StatisticsPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
