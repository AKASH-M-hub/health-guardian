import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Minus, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  stats: any;
  entries: any[];
}

export function FutureHealthSimulator({ stats, entries }: Props) {
  const [yearsAhead, setYearsAhead] = useState(5);
  const [simulation, setSimulation] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate based on current patterns
    setTimeout(() => {
      const currentScore = stats ? 
        (stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4 : 5;
      
      // Project future based on trends
      const trendMultiplier = stats?.weeklyTrend === 'improving' ? 1.1 : 
                              stats?.weeklyTrend === 'declining' ? 0.85 : 1;
      
      const projectedScore = Math.min(10, Math.max(0, currentScore * Math.pow(trendMultiplier, yearsAhead / 2)));
      
      const scenarios = {
        optimistic: {
          score: Math.min(10, projectedScore * 1.2),
          description: 'Following all recommendations consistently',
          riskReduction: Math.round((1 - projectedScore / 10) * 60),
        },
        realistic: {
          score: projectedScore,
          description: 'Maintaining current lifestyle patterns',
          riskChange: stats?.weeklyTrend === 'improving' ? -15 : stats?.weeklyTrend === 'declining' ? 25 : 0,
        },
        pessimistic: {
          score: Math.max(1, projectedScore * 0.7),
          description: 'If healthy habits decline further',
          riskIncrease: Math.round((10 - projectedScore) * 8),
        }
      };

      setSimulation({
        currentScore: currentScore.toFixed(1),
        yearsAhead,
        scenarios,
        keyFactors: [
          { name: 'Sleep Pattern', impact: stats?.avgSleepHours >= 7 ? 'positive' : 'negative' },
          { name: 'Stress Management', impact: stats?.avgStressLevel <= 5 ? 'positive' : 'negative' },
          { name: 'Diet Quality', impact: stats?.avgDietQuality >= 7 ? 'positive' : 'negative' },
          { name: 'Physical Activity', impact: stats?.avgActivityMinutes >= 30 ? 'positive' : 'negative' },
        ]
      });
      setIsSimulating(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-success';
    if (score >= 5) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-ocean/10">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Future-Self Health Simulator
        </CardTitle>
        <CardDescription>
          Visualize your future health based on current lifestyle patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Simulate {yearsAhead} years ahead</span>
            <Badge variant="outline">{yearsAhead} years</Badge>
          </div>
          <Slider
            value={[yearsAhead]}
            onValueChange={(v) => setYearsAhead(v[0])}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>10 years</span>
            <span>20 years</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={runSimulation} disabled={isSimulating || !stats} className="flex-1">
            {isSimulating ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run Simulation
          </Button>
          {simulation && (
            <Button variant="outline" onClick={() => setSimulation(null)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {simulation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Current Health Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(parseFloat(simulation.currentScore))}`}>
                  {simulation.currentScore}/10
                </p>
              </div>

              <div className="grid gap-3">
                {Object.entries(simulation.scenarios).map(([key, scenario]: [string, any]) => (
                  <motion.div
                    key={key}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: key === 'optimistic' ? 0.1 : key === 'realistic' ? 0.2 : 0.3 }}
                    className={`p-4 rounded-xl border ${
                      key === 'optimistic' ? 'bg-success/5 border-success/20' :
                      key === 'realistic' ? 'bg-primary/5 border-primary/20' :
                      'bg-destructive/5 border-destructive/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize flex items-center gap-2">
                        {key === 'optimistic' ? <TrendingUp className="w-4 h-4 text-success" /> :
                         key === 'pessimistic' ? <TrendingDown className="w-4 h-4 text-destructive" /> :
                         <Minus className="w-4 h-4 text-primary" />}
                        {key} Scenario
                      </span>
                      <span className={`text-xl font-bold ${getScoreColor(scenario.score)}`}>
                        {scenario.score.toFixed(1)}/10
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Key Contributing Factors</p>
                <div className="flex flex-wrap gap-2">
                  {simulation.keyFactors.map((factor: any, i: number) => (
                    <Badge 
                      key={i} 
                      variant={factor.impact === 'positive' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {factor.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic text-center">
                *This is a predictive simulation, not a diagnosis. Consult healthcare professionals for medical advice.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!stats && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Log health data to enable simulation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
