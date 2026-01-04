import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, Heart, Brain, Moon, Droplets, 
  Utensils, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthMetrics {
  sleep: number;
  exercise: number;
  diet: number;
  stress: number;
  hydration: number;
}

interface SimulationResult {
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  riskLevel: 'low' | 'moderate' | 'high';
  projectedChange: number;
  recommendations: string[];
  organImpacts: { organ: string; status: 'healthy' | 'stressed' | 'at-risk'; score: number }[];
}

export function HealthSimulator() {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    sleep: 70,
    exercise: 50,
    diet: 60,
    stress: 40,
    hydration: 65
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const calculateSimulation = (): SimulationResult => {
    const overallScore = Math.round(
      metrics.sleep * 0.25 +
      metrics.exercise * 0.2 +
      metrics.diet * 0.2 +
      (100 - metrics.stress) * 0.2 +
      metrics.hydration * 0.15
    );

    const trend = overallScore >= 70 ? 'improving' : overallScore >= 50 ? 'stable' : 'declining';
    const riskLevel = overallScore >= 70 ? 'low' : overallScore >= 50 ? 'moderate' : 'high';
    
    const projectedChange = trend === 'improving' ? Math.round((100 - overallScore) * 0.15) :
                           trend === 'stable' ? 0 : -Math.round(overallScore * 0.1);

    const recommendations = [];
    if (metrics.sleep < 70) recommendations.push('Improve sleep quality to 7-8 hours');
    if (metrics.exercise < 60) recommendations.push('Increase physical activity to 150+ min/week');
    if (metrics.diet < 60) recommendations.push('Focus on balanced nutrition');
    if (metrics.stress > 50) recommendations.push('Practice stress management techniques');
    if (metrics.hydration < 70) recommendations.push('Increase daily water intake');

    const organImpacts = [
      { 
        organ: 'Heart', 
        status: metrics.exercise >= 60 && metrics.stress < 50 ? 'healthy' : metrics.stress > 70 ? 'at-risk' : 'stressed',
        score: Math.round((metrics.exercise * 0.6 + (100 - metrics.stress) * 0.4))
      },
      { 
        organ: 'Brain', 
        status: metrics.sleep >= 70 && metrics.stress < 50 ? 'healthy' : metrics.sleep < 50 ? 'at-risk' : 'stressed',
        score: Math.round((metrics.sleep * 0.5 + (100 - metrics.stress) * 0.5))
      },
      { 
        organ: 'Liver', 
        status: metrics.diet >= 60 && metrics.hydration >= 60 ? 'healthy' : metrics.diet < 40 ? 'at-risk' : 'stressed',
        score: Math.round((metrics.diet * 0.6 + metrics.hydration * 0.4))
      },
      { 
        organ: 'Kidneys', 
        status: metrics.hydration >= 70 ? 'healthy' : metrics.hydration < 40 ? 'at-risk' : 'stressed',
        score: Math.round(metrics.hydration)
      },
      { 
        organ: 'Lungs', 
        status: metrics.exercise >= 60 ? 'healthy' : metrics.exercise < 30 ? 'at-risk' : 'stressed',
        score: Math.round(metrics.exercise)
      }
    ] as SimulationResult['organImpacts'];

    return { overallScore, trend, riskLevel, projectedChange, recommendations, organImpacts };
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setResult(calculateSimulation());
      setIsSimulating(false);
    }, 1500);
  };

  const metricConfigs = [
    { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'bg-indigo-500' },
    { key: 'exercise', label: 'Physical Activity', icon: Activity, color: 'bg-green-500' },
    { key: 'diet', label: 'Diet Quality', icon: Utensils, color: 'bg-orange-500' },
    { key: 'stress', label: 'Stress Level', icon: Brain, color: 'bg-red-500', inverted: true },
    { key: 'hydration', label: 'Hydration', icon: Droplets, color: 'bg-blue-500' }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Health Simulator
        </CardTitle>
        <CardDescription>
          Adjust your lifestyle metrics to see projected health outcomes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Sliders */}
        <div className="grid gap-4">
          {metricConfigs.map(({ key, label, icon: Icon, color, inverted }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${color} text-white`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {metrics[key as keyof HealthMetrics]}%
                </span>
              </div>
              <Slider
                value={[metrics[key as keyof HealthMetrics]]}
                onValueChange={([value]) => setMetrics(prev => ({ ...prev, [key]: value }))}
                max={100}
                step={5}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>

        <Button 
          onClick={runSimulation} 
          className="w-full bg-gradient-to-r from-primary to-coral"
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-4 border-t"
            >
              {/* Overall Score */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke={result.riskLevel === 'low' ? 'hsl(var(--success))' : result.riskLevel === 'moderate' ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray={352} 
                      strokeDashoffset={352 - (352 * result.overallScore / 100)}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{result.overallScore}</span>
                    <span className="text-xs text-muted-foreground">Health Score</span>
                  </div>
                </div>
              </div>

              {/* Trend & Projection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <Badge className={
                    result.trend === 'improving' ? 'bg-success/20 text-success' :
                    result.trend === 'stable' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                  }>
                    {result.trend === 'improving' ? <TrendingUp className="w-3 h-3 mr-1" /> :
                     result.trend === 'declining' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                    {result.trend.charAt(0).toUpperCase() + result.trend.slice(1)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Current Trend</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <span className={`text-xl font-bold ${result.projectedChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {result.projectedChange > 0 ? '+' : ''}{result.projectedChange}%
                  </span>
                  <p className="text-xs text-muted-foreground">30-Day Projection</p>
                </div>
              </div>

              {/* Organ Impacts */}
              <div>
                <h4 className="text-sm font-medium mb-2">Organ Health Projection</h4>
                <div className="grid grid-cols-5 gap-2">
                  {result.organImpacts.map(organ => (
                    <div key={organ.organ} className="text-center">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        organ.status === 'healthy' ? 'bg-success/20' :
                        organ.status === 'stressed' ? 'bg-warning/20' : 'bg-destructive/20'
                      }`}>
                        {organ.status === 'healthy' ? <CheckCircle className="w-5 h-5 text-success" /> :
                         organ.status === 'stressed' ? <AlertTriangle className="w-5 h-5 text-warning" /> :
                         <Heart className="w-5 h-5 text-destructive" />}
                      </div>
                      <p className="text-xs font-medium">{organ.organ}</p>
                      <p className="text-[10px] text-muted-foreground">{organ.score}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-primary/5 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
