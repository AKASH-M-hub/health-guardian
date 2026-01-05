import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VirtualOrganStressScan } from '@/components/scans/VirtualOrganStressScan';
import { WhatIfHealthSimulator } from '@/components/simulation/WhatIfHealthSimulator';
import { FutureSelfSimulation } from '@/components/simulation/FutureSelfSimulation';
import { PrescriptionSuggester } from '@/components/features/PrescriptionSuggester';
import { UserActivityHistory } from '@/components/features/UserActivityHistory';
import { Sparkles, ArrowLeft, Activity, Brain, Stethoscope, History, Scan } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIHealthFeatures() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
                  <Sparkles className="w-10 h-10 text-coral" />
                  AI Health Features
                </h1>
                <p className="text-lg text-muted-foreground">
                  Powerful AI-driven tools to simulate, analyze, and optimize your health
                </p>
              </div>
              <Badge className="bg-success/10 text-success border-success/30 text-base px-4 py-2">
                Free Access
              </Badge>
            </div>
          </div>

          {/* Virtual Scan & Simulators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Scan className="w-6 h-6 text-primary" />
              Health Simulations & Scans
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VirtualOrganStressScan />
              <WhatIfHealthSimulator />
              <FutureSelfSimulation />
            </div>
          </motion.div>

          {/* Prescription & Activity Tools */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-coral" />
              Health Management Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <PrescriptionSuggester />
              <UserActivityHistory />
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-coral/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  About AI Health Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Virtual Organ Stress Scan:</strong> Analyze stress levels across different body systems and organs.
                  </p>
                  <p>
                    <strong className="text-foreground">What-If Health Simulator:</strong> Explore how lifestyle changes could impact your health outcomes.
                  </p>
                  <p>
                    <strong className="text-foreground">Future Self Simulation:</strong> Visualize your health trajectory based on current habits and patterns.
                  </p>
                  <p>
                    <strong className="text-foreground">Prescription Suggester:</strong> Get AI-powered suggestions for medications based on symptoms (educational only).
                  </p>
                  <p>
                    <strong className="text-foreground">Activity History:</strong> Track and review your past health activities and patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
