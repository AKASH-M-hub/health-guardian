import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface FutureState {
  year: number;
  score: number;
  status: string;
  changes: string[];
}

export function FutureSelfSimulation() {
  const { stats } = useHealthData();
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeYear, setActiveYear] = useState('1');
  const [simulated, setSimulated] = useState(false);

  const baseScore = stats ? 
    Math.round((stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4 * 10) : 60;

  const futureStates: FutureState[] = [
    {
      year: 1,
      score: Math.min(95, baseScore + 8),
      status: 'Improving',
      changes: ['Better sleep patterns established', 'Stress management improving', 'Physical activity increasing']
    },
    {
      year: 5,
      score: Math.min(95, baseScore + 18),
      status: 'Strong',
      changes: ['Cardiovascular health optimized', 'Mental resilience built', 'Healthy habits automated']
    },
    {
      year: 10,
      score: Math.min(95, baseScore + 25),
      status: 'Excellent',
      changes: ['Disease prevention achieved', 'Optimal body composition', 'Peak mental wellness']
    }
  ];

  const startSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulated(true);
    }, 2000);
  };

  const currentState = futureStates.find(s => s.year === parseInt(activeYear)) || futureStates[0];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          Future Self Simulation
        </CardTitle>
        <CardDescription>
          Visualize your health at 1, 5, and 10-year horizons
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!simulated ? (
          <div className="text-center py-8">
            {isSimulating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="relative w-32 h-32 mx-auto">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-4 border-violet-500/30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-12 h-12 text-violet-500" />
                  </div>
                </div>
                <p className="text-lg font-medium">Simulating future self...</p>
              </motion.div>
            ) : (
              <>
                <User className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  See how your health could evolve over the next decade
                </p>
                <Button onClick={startSimulation} className="bg-gradient-to-r from-violet-500 to-purple-500">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Future Self Simulation
                </Button>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Tabs value={activeYear} onValueChange={setActiveYear}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="1">1 Year</TabsTrigger>
                <TabsTrigger value="5">5 Years</TabsTrigger>
                <TabsTrigger value="10">10 Years</TabsTrigger>
              </TabsList>

              <TabsContent value={activeYear} className="mt-4 space-y-4">
                {/* Avatar Evolution */}
                <div className="relative h-48 bg-gradient-to-b from-muted/30 to-transparent rounded-xl overflow-hidden">
                  <motion.div
                    key={activeYear}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className={`relative w-32 h-32 rounded-full ${
                      currentState.score >= 80 ? 'bg-success/20' :
                      currentState.score >= 60 ? 'bg-warning/20' : 'bg-muted/30'
                    } flex items-center justify-center`}>
                      <User className={`w-16 h-16 ${
                        currentState.score >= 80 ? 'text-success' :
                        currentState.score >= 60 ? 'text-warning' : 'text-muted-foreground'
                      }`} />
                      <div className="absolute -bottom-2 bg-background px-3 py-1 rounded-full border">
                        <span className="text-sm font-bold">+{currentState.year}Y</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Score Display */}
                <div className="text-center bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Projected Health Score</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-success">{currentState.score}</span>
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <Badge className="mt-2 bg-success/10 text-success">{currentState.status}</Badge>
                </div>

                {/* Comparison */}
                <div className="flex items-center justify-between bg-muted/20 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold">{baseScore}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">In {currentState.year} Year{currentState.year > 1 ? 's' : ''}</p>
                    <p className="text-2xl font-bold text-success">{currentState.score}</p>
                  </div>
                </div>

                {/* Expected Changes */}
                <div className="bg-success/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Expected Improvements</h4>
                  <ul className="text-sm space-y-2">
                    {currentState.changes.map((change, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-success">✓</span> {change}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground text-center">
              ⚕️ Projections assume consistent healthy lifestyle choices
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
