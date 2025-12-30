import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import HealthInput from "./pages/HealthInput";
import RiskAnalysis from "./pages/RiskAnalysis";
import Chatbot from "./pages/Chatbot";
import HospitalFinder from "./pages/HospitalFinder";
import MedicineAwareness from "./pages/MedicineAwareness";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health-input" element={<HealthInput />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/hospital-finder" element={<HospitalFinder />} />
            <Route path="/medicine-awareness" element={<MedicineAwareness />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
