import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HeartPulse, TrendingUp, Clock, Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface RecoveryMetric {
  area: string;
  currentLevel: number;
  targetLevel: number;
  recoveryProbability: number;
  timeToRecover: string;
  requiredActions: string[];
}

export function RecoveryProbability() {
  const { stats, entries } = useHealthData();
  const [metrics, setMetrics] = useState<RecoveryMetric[]>([]);
  const [overallProbability, setOverallProbability] = useState(0);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    calculateRecovery();
  }, [stats, entries]);

  const calculateRecovery = () => {
    const sleepScore = stats?.avgSleepHours ? (stats.avgSleepHours / 8) * 100 : 70;
    const stressScore = stats?.avgStressLevel ? 100 - (stats.avgStressLevel * 10) : 60;
    const activityScore = stats?.avgActivityMinutes ? Math.min(100, (stats.avgActivityMinutes / 60) * 100) : 50;
    const dietScore = stats?.avgDietQuality ? stats.avgDietQuality * 10 : 60;

    const calculatedMetrics: RecoveryMetric[] = [
      {
        area: 'Energy Levels',
        currentLevel: Math.round((sleepScore + activityScore) / 2),
        targetLevel: 85,
        recoveryProbability: sleepScore >= 75 ? 92 : sleepScore >= 50 ? 75 : 55,
        timeToRecover: sleepScore >= 75 ? '1-2 weeks' : '3-4 weeks',
        requiredActions: sleepScore < 75 ? ['Improve sleep to 7-8 hours', 'Maintain consistent bedtime'] : ['Continue current sleep habits']
      },
      {
        area: 'Stress Recovery',
        currentLevel: Math.round(stressScore),
        targetLevel: 80,
        recoveryProbability: stressScore >= 70 ? 88 : stressScore >= 50 ? 68 : 45,
        timeToRecover: stressScore >= 70 ? '2 weeks' : '4-6 weeks',
        requiredActions: stressScore < 70 ? ['Practice daily meditation', 'Reduce workload', 'Get more rest'] : ['Maintain stress management']
      },
      {
        area: 'Physical Fitness',
        currentLevel: Math.round(activityScore),
        targetLevel: 80,
        recoveryProbability: activityScore >= 60 ? 85 : activityScore >= 40 ? 70 : 50,
        timeToRecover: activityScore >= 60 ? '2-3 weeks' : '6-8 weeks',
        requiredActions: activityScore < 60 ? ['Start with 30 min walks', 'Gradually increase intensity'] : ['Maintain activity level']
      },
      {
        area: 'Metabolic Health',
        currentLevel: Math.round(dietScore),
        targetLevel: 85,
        recoveryProbability: dietScore >= 70 ? 82 : dietScore >= 50 ? 65 : 48,
        timeToRecover: dietScore >= 70 ? '3-4 weeks' : '8-12 weeks',
        requiredActions: dietScore < 70 ? ['Improve diet quality', 'Increase vegetables', 'Stay hydrated'] : ['Continue balanced nutrition']
      }
    ];

    setMetrics(calculatedMetrics);
    setOverallProbability(Math.round(calculatedMetrics.reduce((acc, m) => acc + m.recoveryProbability, 0) / calculatedMetrics.length));
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return 'text-success';
    if (prob >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const recalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      calculateRecovery();
      setCalculating(false);
    }, 1000);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-success/10 via-emerald-500/10 to-teal-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center"
          >
            <HeartPulse className="w-6 h-6 text-white" />
          </motion.div>
          Recovery Probability Score
        </CardTitle>
        <CardDescription>
          Estimates how likely your body will recover with immediate action
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Probability Gauge */}
        <div className="relative flex items-center justify-center">
          <div className="w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              {/* Progress arc */}
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="url(#recoveryGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={251}
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - (251 * overallProbability / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="recoveryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--success))" />
                  <stop offset="100%" stopColor="hsl(142, 76%, 36%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <motion.span
                key={overallProbability}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-4xl font-bold ${getProbabilityColor(overallProbability)}`}
              >
                {overallProbability}%
              </motion.span>
              <span className="text-xs text-muted-foreground">Recovery Chance</span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className={`text-center p-3 rounded-lg ${
          overallProbability >= 80 ? 'bg-success/10' :
          overallProbability >= 60 ? 'bg-warning/10' : 'bg-destructive/10'
        }`}>
          {overallProbability >= 80 ? (
            <p className="text-sm text-success flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              High recovery probability - Keep up the good work!
            </p>
          ) : overallProbability >= 60 ? (
            <p className="text-sm text-warning flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Moderate probability - Some improvements needed
            </p>
          ) : (
            <p className="text-sm text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Action required for optimal recovery
            </p>
          )}
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.area}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-muted/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{metric.area}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {metric.timeToRecover}
                  </Badge>
                  <span className={`font-bold ${getProbabilityColor(metric.recoveryProbability)}`}>
                    {metric.recoveryProbability}%
                  </span>
                </div>
              </div>

              {/* Level Bars */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Current: {metric.currentLevel}%</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.currentLevel}%` }}
                    />
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Target: {metric.targetLevel}%</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${metric.targetLevel}%` }} />
                  </div>
                </div>
              </div>

              {/* Required Actions */}
              <div className="flex flex-wrap gap-1">
                {metric.requiredActions.map((action, j) => (
                  <Badge key={j} variant="outline" className="text-xs bg-background">
                    {action}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <Button onClick={recalculate} disabled={calculating} className="w-full" variant="outline">
          {calculating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Recalculating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Recalculate Recovery Score
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          ⚕️ Recovery estimates are based on lifestyle data. Individual results may vary.
        </p>
      </CardContent>
    </Card>
  );
}
