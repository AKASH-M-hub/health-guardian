import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Heart, Activity, Moon, Zap, TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useHealthData } from '@/hooks/useHealthData';
import { toast } from '@/hooks/use-toast';

interface LifestyleParams {
  exercise: number;
  sleep: number;
  diet: number;
  stress: number;
  hydration: number;
  mentalActivity: number;
}

interface HealthProjection {
  currentScore: number;
  projectedScore: number;
  timeframe: string;
  riskFactors: string[];
  improvements: string[];
  organImpacts: { organ: string; status: 'good' | 'warning' | 'critical'; change: number }[];
}

export function DigitalTwin() {
  const { user } = useAuth();
  const { stats, entries } = useHealthData();
  const [lifestyle, setLifestyle] = useState<LifestyleParams>({
    exercise: 50,
    sleep: 70,
    diet: 60,
    stress: 40,
    hydration: 55,
    mentalActivity: 65
  });
  const [projection, setProjection] = useState<HealthProjection | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('adjust');

  // Load real data from health entries
  useEffect(() => {
    if (entries.length > 0) {
      const latestEntry = entries[entries.length - 1];
      setLifestyle({
        exercise: Math.min(100, (latestEntry.physical_activity_minutes || 0) * 2),
        sleep: Math.min(100, ((latestEntry.sleep_hours || 7) / 8) * 100),
        diet: (latestEntry.diet_quality || 5) * 10,
        stress: 100 - ((latestEntry.stress_level || 5) * 10),
        hydration: Math.min(100, ((latestEntry.water_intake_liters || 2) / 3) * 100),
        mentalActivity: (latestEntry.mood || 5) * 10
      });
    }
  }, [entries]);

  const calculateTwinScore = () => {
    return Math.round(
      lifestyle.exercise * 0.2 +
      lifestyle.sleep * 0.2 +
      lifestyle.diet * 0.15 +
      (100 - lifestyle.stress) * 0.15 +
      lifestyle.hydration * 0.15 +
      lifestyle.mentalActivity * 0.15
    );
  };

  const generateProjection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `As a Digital Health Twin AI, analyze these lifestyle parameters and generate a health projection:
            - Exercise Level: ${lifestyle.exercise}%
            - Sleep Quality: ${lifestyle.sleep}%
            - Diet Quality: ${lifestyle.diet}%
            - Stress Management: ${100 - lifestyle.stress}%
            - Hydration: ${lifestyle.hydration}%
            - Mental Activity: ${lifestyle.mentalActivity}%
            
            Provide a JSON response with:
            1. Current health score (0-100)
            2. Projected score in 6 months if maintained
            3. Top 3 risk factors
            4. Top 3 improvement recommendations
            5. Organ impact predictions (heart, brain, liver, lungs, kidneys)
            
            Format: {"currentScore":X,"projectedScore":Y,"riskFactors":[],"improvements":[],"organImpacts":[]}`
          }]
        }),
      });

      if (!response.ok) throw new Error('Failed to generate projection');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }
      }

      // Parse SSE response
      const lines = fullContent.split('\n').filter(line => line.startsWith('data: '));
      let aiResponse = '';
      for (const line of lines) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr && jsonStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(jsonStr);
            aiResponse += parsed.choices?.[0]?.delta?.content || '';
          } catch {
            // Silently ignore malformed JSON chunks in streaming response
          }
        }
      }

      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setProjection({
          currentScore: data.currentScore || calculateTwinScore(),
          projectedScore: data.projectedScore || calculateTwinScore() + 10,
          timeframe: '6 months',
          riskFactors: data.riskFactors || ['Low activity', 'High stress', 'Poor hydration'],
          improvements: data.improvements || ['Increase exercise', 'Improve sleep', 'Reduce stress'],
          organImpacts: data.organImpacts || [
            { organ: 'Heart', status: 'good', change: 5 },
            { organ: 'Brain', status: 'warning', change: -2 },
            { organ: 'Lungs', status: 'good', change: 3 }
          ]
        });
      } else {
        // Use calculated values
        setProjection({
          currentScore: calculateTwinScore(),
          projectedScore: calculateTwinScore() + 8,
          timeframe: '6 months',
          riskFactors: lifestyle.stress > 60 ? ['High stress levels'] : [],
          improvements: ['Maintain current routine', 'Consider adding meditation'],
          organImpacts: [
            { organ: 'Heart', status: lifestyle.exercise > 60 ? 'good' : 'warning', change: lifestyle.exercise > 60 ? 5 : -3 },
            { organ: 'Brain', status: lifestyle.sleep > 60 ? 'good' : 'warning', change: lifestyle.sleep > 60 ? 4 : -2 },
            { organ: 'Liver', status: lifestyle.diet > 60 ? 'good' : 'warning', change: lifestyle.diet > 60 ? 3 : -1 }
          ]
        });
      }

      setActiveView('results');
      toast({ title: 'Digital Twin Updated', description: 'Your health projection has been generated!' });
    } catch (error) {
      console.error('Projection error:', error);
      // Generate fallback projection
      setProjection({
        currentScore: calculateTwinScore(),
        projectedScore: calculateTwinScore() + 5,
        timeframe: '6 months',
        riskFactors: ['Insufficient data for detailed analysis'],
        improvements: ['Continue logging health data', 'Maintain healthy habits'],
        organImpacts: [
          { organ: 'Heart', status: 'good', change: 2 },
          { organ: 'Brain', status: 'good', change: 1 },
          { organ: 'Overall', status: 'good', change: 3 }
        ]
      });
      setActiveView('results');
    } finally {
      setLoading(false);
    }
  };

  const twinScore = calculateTwinScore();

  const lifestyleParams = [
    { key: 'exercise', label: 'Physical Activity', icon: Activity, color: 'text-success' },
    { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-primary' },
    { key: 'diet', label: 'Nutrition', icon: Heart, color: 'text-coral' },
    { key: 'stress', label: 'Stress Level', icon: Zap, color: 'text-warning', inverted: true },
    { key: 'hydration', label: 'Hydration', icon: Activity, color: 'text-ocean' },
    { key: 'mentalActivity', label: 'Mental Wellness', icon: Brain, color: 'text-primary' },
  ];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-ocean/10 to-coral/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          Personal Health Digital Twin
        </CardTitle>
        <CardDescription>
          Your virtual health simulation that predicts future health scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="adjust">Adjust Parameters</TabsTrigger>
            <TabsTrigger value="results">View Projection</TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="space-y-6">
            {/* Digital Twin Visualization */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted/20" />
                <motion.circle
                  cx="96" cy="96" r="85"
                  stroke="url(#twinGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={534}
                  initial={{ strokeDashoffset: 534 }}
                  animate={{ strokeDashoffset: 534 - (534 * twinScore / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="twinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="50%" stopColor="hsl(var(--ocean))" />
                    <stop offset="100%" stopColor="hsl(var(--coral))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <motion.span
                  key={twinScore}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold bg-gradient-to-r from-primary to-coral bg-clip-text text-transparent"
                >
                  {twinScore}
                </motion.span>
                <span className="text-xs text-muted-foreground">Twin Health Score</span>
              </div>
            </div>

            {/* Lifestyle Sliders */}
            <div className="space-y-4">
              {lifestyleParams.map(({ key, label, icon: Icon, color, inverted }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      {label}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {inverted ? `${lifestyle[key as keyof LifestyleParams]}% stress` : `${lifestyle[key as keyof LifestyleParams]}%`}
                    </span>
                  </div>
                  <Slider
                    value={[lifestyle[key as keyof LifestyleParams]]}
                    onValueChange={([v]) => setLifestyle(prev => ({ ...prev, [key]: v }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <Button onClick={generateProjection} disabled={loading} className="w-full bg-gradient-to-r from-primary to-ocean">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulating Future...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Health Projection
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <AnimatePresence>
              {projection ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Score Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Current Score</p>
                        <p className="text-3xl font-bold text-primary">{projection.currentScore}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-success/10 to-success/5">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Projected ({projection.timeframe})</p>
                        <p className="text-3xl font-bold text-success flex items-center justify-center gap-1">
                          {projection.projectedScore}
                          <TrendingUp className="w-5 h-5" />
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Organ Impacts */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-coral" />
                      Organ Impact Predictions
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.isArray(projection.organImpacts) && projection.organImpacts.length > 0 ? (
                        projection.organImpacts.map((impact, i) => (
                          <motion.div
                            key={impact.organ || i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-3 rounded-lg text-center ${
                              impact.status === 'good' ? 'bg-success/10' :
                              impact.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
                            }`}
                          >
                            <p className="text-xs font-medium">{impact.organ}</p>
                            <p className={`text-lg font-bold ${
                              impact.change > 0 ? 'text-success' : 'text-destructive'
                            }`}>
                              {impact.change > 0 ? '+' : ''}{impact.change}%
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center text-sm text-muted-foreground py-4">
                          No organ impact data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Risk Factors & Improvements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                      <h4 className="font-semibold text-warning mb-2">Risk Factors</h4>
                      <ul className="text-sm space-y-1">
                        {projection.riskFactors.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-warning">•</span> {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                      <h4 className="font-semibold text-success mb-2">Improvements</h4>
                      <ul className="text-sm space-y-1">
                        {projection.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-success">✓</span> {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    ⚕️ This simulation is for educational purposes. Consult healthcare professionals for medical advice.
                  </p>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Adjust your lifestyle parameters and generate a projection</p>
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
