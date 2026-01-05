import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, Heart } from 'lucide-react';
import { HealthWisdomEngine } from '@/components/wisdom/HealthWisdomEngine';
import { FutureReadinessIndex } from '@/components/wisdom/FutureReadinessIndex';
import { PersonalHealthPhilosophy } from '@/components/wisdom/PersonalHealthPhilosophy';

export default function Wisdom() {
  const [activeTab, setActiveTab] = useState('health-wisdom');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Wisdom Layer</h1>
              <Lightbulb className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock deep health insights through AI-driven wisdom, personalized philosophy, and future readiness analysis.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="health-wisdom" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Health Wisdom
              </TabsTrigger>
              <TabsTrigger value="philosophy" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Philosophy
              </TabsTrigger>
              <TabsTrigger value="future-readiness" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Future Readiness
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health-wisdom" className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Health Wisdom Engine
                  </CardTitle>
                  <CardDescription>
                    Comprehensive health intelligence powered by AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthWisdomEngine userStress={45} userEngagement={72} trustLevel={80} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="philosophy" className="space-y-6">
              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Personal Health Philosophy
                  </CardTitle>
                  <CardDescription>
                    Discover your unique health beliefs and principles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalHealthPhilosophy />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="future-readiness" className="space-y-6">
              <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-emerald-600" />
                    Future Readiness Index
                  </CardTitle>
                  <CardDescription>
                    Assess your preparedness for future health challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FutureReadinessIndex />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
