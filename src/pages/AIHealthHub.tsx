import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHealthData } from '@/hooks/useHealthData';
import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Sparkles, Shield, Heart, Zap, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Feature Components
import { FutureHealthSimulator } from '@/components/ai-hub/FutureHealthSimulator';
import { OrganStressRadar } from '@/components/ai-hub/OrganStressRadar';
import { ConfidenceScore } from '@/components/ai-hub/ConfidenceScore';
import { HealthDriftTimeline } from '@/components/ai-hub/HealthDriftTimeline';
import { ELI5Explainer } from '@/components/ai-hub/ELI5Explainer';
import { MicroHabitEngine } from '@/components/ai-hub/MicroHabitEngine';
import { RiskReversalPredictor } from '@/components/ai-hub/RiskReversalPredictor';
import { PatternMemory } from '@/components/ai-hub/PatternMemory';
import { MentalPhysicalBridge } from '@/components/ai-hub/MentalPhysicalBridge';
import { RiskCoolDown } from '@/components/ai-hub/RiskCoolDown';
import { DoctorRehearsalAI } from '@/components/ai-hub/DoctorRehearsalAI';
import { InvisibleSymptomDetector } from '@/components/ai-hub/InvisibleSymptomDetector';
import { VocabularyBuilder } from '@/components/ai-hub/VocabularyBuilder';
import { LifestyleContradictionDetector } from '@/components/ai-hub/LifestyleContradictionDetector';
import { MentorPersonalitySelector } from '@/components/ai-hub/MentorPersonalitySelector';
import { DataTrustMeter } from '@/components/ai-hub/DataTrustMeter';
import { PreDoctorTestEngine } from '@/components/ai-hub/PreDoctorTestEngine';
import { HealthIdentityCard } from '@/components/ai-hub/HealthIdentityCard';
import { RecoveryReadinessIndex } from '@/components/ai-hub/RecoveryReadinessIndex';
import { RegretPreventionAI } from '@/components/ai-hub/RegretPreventionAI';
import { LifestyleRoutineSuggester } from '@/components/ai-hub/LifestyleRoutineSuggester';

export default function AIHealthHub() {
  const { user, loading: authLoading } = useAuth();
  const { stats, entries, loading: healthLoading } = useHealthData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('predictive');

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

  const tabCategories = [
    { id: 'predictive', label: 'Predictive AI', icon: Sparkles },
    { id: 'analysis', label: 'Analysis', icon: Brain },
    { id: 'guidance', label: 'AI Guidance', icon: Heart },
    { id: 'trust', label: 'Transparency', icon: Shield },
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'tools', label: 'Tools', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-ocean to-coral bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                AI Health Intelligence Hub
              </h1>
              <p className="text-muted-foreground mt-2">
                20+ Advanced AI-powered health insights and predictions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                {entries.length} health entries analyzed
              </span>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted/50">
            {tabCategories.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Predictive AI Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <FutureHealthSimulator stats={stats} entries={entries} />
              <RiskReversalPredictor stats={stats} entries={entries} />
            </div>
            <RecoveryReadinessIndex stats={stats} entries={entries} />
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <OrganStressRadar stats={stats} entries={entries} />
              <HealthDriftTimeline entries={entries} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <InvisibleSymptomDetector entries={entries} />
              <LifestyleContradictionDetector stats={stats} entries={entries} />
            </div>
          </TabsContent>

          {/* AI Guidance Tab */}
          <TabsContent value="guidance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ELI5Explainer stats={stats} />
              <MicroHabitEngine stats={stats} entries={entries} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <MentalPhysicalBridge stats={stats} entries={entries} />
              <RegretPreventionAI stats={stats} entries={entries} />
            </div>
          </TabsContent>

          {/* Transparency Tab */}
          <TabsContent value="trust" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ConfidenceScore stats={stats} entries={entries} />
              <DataTrustMeter entries={entries} />
            </div>
            <RiskCoolDown stats={stats} />
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PatternMemory entries={entries} />
              <VocabularyBuilder stats={stats} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <MentorPersonalitySelector />
              <HealthIdentityCard stats={stats} entries={entries} />
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <DoctorRehearsalAI stats={stats} />
              <PreDoctorTestEngine stats={stats} entries={entries} />
            </div>
            <LifestyleRoutineSuggester />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
