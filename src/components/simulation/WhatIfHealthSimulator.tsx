import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Activity, Moon, Utensils, Brain, Droplets, TrendingUp, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface SimulationResult {
  healthScore: number;
  improvements: string[];
  risks: string[];
  organChanges: { organ: string; change: number }[];
}

export function WhatIfHealthSimulator() {
  const { stats } = useHealthData();
  const [params, setParams] = useState({
    exercise: 50,
    sleep: 70,
    diet: 60,
    stress: 40,
    hydration: 60,
    mentalHealth: 65
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateHealth = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const healthScore = Math.round(
        params.exercise * 0.2 +
        params.sleep * 0.2 +
        params.diet * 0.15 +
        (100 - params.stress) * 0.15 +
        params.hydration * 0.15 +
        params.mentalHealth * 0.15
      );

      const improvements: string[] = [];
      const risks: string[] = [];

      if (params.exercise >= 70) improvements.push('Strong cardiovascular health');
      else if (params.exercise < 40) risks.push('Low physical activity may affect heart');

      if (params.sleep >= 70) improvements.push('Excellent cognitive function');
      else if (params.sleep < 50) risks.push('Sleep deficit impacting recovery');

      if (params.diet >= 70) improvements.push('Good nutritional balance');
      else if (params.diet < 40) risks.push('Poor diet affecting metabolism');

      if (params.stress >= 60) risks.push('High stress affecting overall health');
      else if (params.stress < 30) improvements.push('Well-managed stress levels');

      setResult({
        healthScore,
        improvements: improvements.length > 0 ? improvements : ['Balanced health profile'],
        risks: risks.length > 0 ? risks : ['No significant risks detected'],
        organChanges: [
          { organ: 'Heart', change: Math.round((params.exercise - 50) * 0.3 + (100 - params.stress - 50) * 0.2) },
          { organ: 'Brain', change: Math.round((params.sleep - 50) * 0.3 + params.mentalHealth * 0.2 - 10) },
          { organ: 'Liver', change: Math.round((params.diet - 50) * 0.3 + (100 - params.stress - 50) * 0.1) },
          { organ: 'Kidneys', change: Math.round((params.hydration - 50) * 0.4) }
        ]
      });
      setIsSimulating(false);
    }, 1500);
  };

  const resetParams = () => {
    setParams({
      exercise: stats?.avgActivityMinutes ? Math.min(100, stats.avgActivityMinutes * 2) : 50,
      sleep: stats?.avgSleepHours ? Math.min(100, (stats.avgSleepHours / 8) * 100) : 70,
      diet: stats?.avgDietQuality ? stats.avgDietQuality * 10 : 60,
      stress: stats?.avgStressLevel ? stats.avgStressLevel * 10 : 40,
      hydration: 60,
      mentalHealth: stats?.avgMood ? stats.avgMood * 10 : 65
    });
    setResult(null);
  };

  const sliderItems = [
    { key: 'exercise', label: 'Exercise Level', icon: Activity, color: 'text-success' },
    { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-primary' },
    { key: 'diet', label: 'Diet Quality', icon: Utensils, color: 'text-coral' },
    { key: 'stress', label: 'Stress Level', icon: Brain, color: 'text-warning', inverted: true },
    { key: 'hydration', label: 'Hydration', icon: Droplets, color: 'text-ocean' },
    { key: 'mentalHealth', label: 'Mental Wellness', icon: Sparkles, color: 'text-lavender-dark' }
  ];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-ocean/10 to-coral/10">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          What-If Health Simulator
        </CardTitle>
        <CardDescription>
          Adjust lifestyle parameters to instantly see projected health outcomes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs defaultValue="adjust">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="adjust">Adjust Parameters</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>View Results</TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="space-y-4 mt-4">
            {sliderItems.map(({ key, label, icon: Icon, color, inverted }) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    {label}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {params[key as keyof typeof params]}%
                    {inverted && ' (lower is better)'}
                  </span>
                </div>
                <Slider
                  value={[params[key as keyof typeof params]]}
                  onValueChange={([v]) => setParams(prev => ({ ...prev, [key]: v }))}
                  max={100}
                  step={5}
                />
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Button onClick={simulateHealth} disabled={isSimulating} className="flex-1">
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Simulate Health
                  </>
                )}
              </Button>
              <Button onClick={resetParams} variant="outline">
                Reset
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Health Score */}
                <div className="text-center bg-muted/30 p-6 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Projected Health Score</p>
                  <p className={`text-5xl font-bold ${
                    result.healthScore >= 70 ? 'text-success' :
                    result.healthScore >= 50 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {result.healthScore}
                  </p>
                </div>

                {/* Organ Changes */}
                <div className="grid grid-cols-2 gap-2">
                  {result.organChanges.map((organ) => (
                    <div key={organ.organ} className={`p-3 rounded-lg text-center ${
                      organ.change > 0 ? 'bg-success/10' : organ.change < 0 ? 'bg-destructive/10' : 'bg-muted/30'
                    }`}>
                      <p className="text-sm font-medium">{organ.organ}</p>
                      <p className={`text-lg font-bold ${
                        organ.change > 0 ? 'text-success' : organ.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {organ.change > 0 ? '+' : ''}{organ.change}%
                      </p>
                    </div>
                  ))}
                </div>

                {/* Improvements & Risks */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-success/10 rounded-lg p-4">
                    <h4 className="font-semibold text-success mb-2">Improvements</h4>
                    <ul className="text-sm space-y-1">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-success">✓</span> {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-4">
                    <h4 className="font-semibold text-warning mb-2">Risk Factors</h4>
                    <ul className="text-sm space-y-1">
                      {result.risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning">•</span> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  ⚕️ This simulation is for educational purposes only
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
