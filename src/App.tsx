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
import Profile from "./pages/Profile";
import HealthReport from "./pages/HealthReport";
import Features from "./pages/Features";
import Account from "./pages/Account";
import AIHealthHub from "./pages/AIHealthHub";
import PremiumDashboard from "./pages/PremiumDashboard";
import NotFound from "./pages/NotFound";
import TestAuth from "./pages/TestAuth";

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
            <Route path="/features" element={<Features />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health-input" element={<HealthInput />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/hospital-finder" element={<HospitalFinder />} />
            <Route path="/medicine-awareness" element={<MedicineAwareness />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/health-report" element={<HealthReport />} />
            <Route path="/account" element={<Account />} />
            <Route path="/ai-hub" element={<AIHealthHub />} />
            <Route path="/ai-health-hub" element={<AIHealthHub />} />
            <Route path="/premium" element={<PremiumDashboard />} />
            <Route path="/test-auth" element={<TestAuth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
