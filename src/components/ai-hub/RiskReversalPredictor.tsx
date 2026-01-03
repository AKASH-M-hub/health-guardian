import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Calculator, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  stats: any;
  entries: any[];
}

export function RiskReversalPredictor({ stats, entries }: Props) {
  const [showPrediction, setShowPrediction] = useState(false);

  const predictions = useMemo(() => {
    if (!stats) return null;

    const currentRisk = 100 - ((
      (stats.avgMood || 5) + 
      (10 - (stats.avgStressLevel || 5)) + 
      (stats.avgDietQuality || 5) + 
      (stats.avgSleepQuality || 5)
    ) / 4) * 10;

    return {
      currentRisk: Math.round(currentRisk),
      recommendations: [
        {
          action: 'Improve sleep to 7-8 hours',
          currentValue: stats.avgSleepHours?.toFixed(1) || '?',
          targetValue: '7-8 hours',
          riskReduction: stats.avgSleepHours < 7 ? 15 : 0,
          timeToImpact: '1-2 weeks',
          difficulty: 'Medium',
          applicable: stats.avgSleepHours < 7
        },
        {
          action: 'Reduce stress level below 5/10',
          currentValue: stats.avgStressLevel?.toFixed(1) || '?',
          targetValue: '< 5/10',
          riskReduction: stats.avgStressLevel > 5 ? 18 : 0,
          timeToImpact: '2-4 weeks',
          difficulty: 'Medium',
          applicable: stats.avgStressLevel > 5
        },
        {
          action: 'Improve diet quality to 8+/10',
          currentValue: stats.avgDietQuality?.toFixed(1) || '?',
          targetValue: '8+/10',
          riskReduction: stats.avgDietQuality < 8 ? 12 : 0,
          timeToImpact: '2-3 weeks',
          difficulty: 'Easy',
          applicable: stats.avgDietQuality < 8
        },
        {
          action: 'Exercise 30+ minutes daily',
          currentValue: `${stats.avgActivityMinutes || 0} min`,
          targetValue: '30+ min',
          riskReduction: stats.avgActivityMinutes < 30 ? 20 : 0,
          timeToImpact: '1-2 weeks',
          difficulty: 'Medium',
          applicable: stats.avgActivityMinutes < 30
        },
        {
          action: 'Maintain consistent sleep schedule',
          currentValue: 'Variable',
          targetValue: 'Same time daily',
          riskReduction: 8,
          timeToImpact: '2-4 weeks',
          difficulty: 'Easy',
          applicable: true
        }
      ].filter(r => r.applicable && r.riskReduction > 0),
      potentialRisk: Math.max(5, currentRisk - 40),
    };
  }, [stats]);

  const totalPotentialReduction = predictions?.recommendations.reduce((acc, r) => acc + r.riskReduction, 0) || 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-success/10 to-mint/10">
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-success" />
          Risk Reversal Predictor
        </CardTitle>
        <CardDescription>
          Estimate how much your risk can reduce with lifestyle changes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {predictions ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                <p className="text-xs text-muted-foreground mb-1">Current Risk Level</p>
                <p className="text-3xl font-bold text-destructive">{predictions.currentRisk}%</p>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Potential Risk</p>
                <p className="text-3xl font-bold text-success">{predictions.potentialRisk}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <span className="text-sm font-medium">Potential Risk Reduction</span>
              <Badge className="bg-success text-white">
                Up to -{totalPotentialReduction}%
              </Badge>
            </div>

            <Button 
              onClick={() => setShowPrediction(!showPrediction)}
              variant={showPrediction ? 'secondary' : 'default'}
              className="w-full"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {showPrediction ? 'Hide Details' : 'Show How to Reduce Risk'}
            </Button>

            <AnimatePresence>
              {showPrediction && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {predictions.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-muted/50 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                          <span className="font-medium text-sm">{rec.action}</span>
                        </div>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          -{rec.riskReduction}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-background rounded">
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">{rec.currentValue}</p>
                        </div>
                        <div className="p-2 bg-background rounded">
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium text-success">{rec.targetValue}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {rec.timeToImpact}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {rec.difficulty}
                        </Badge>
                      </div>

                      <Progress value={rec.riskReduction * 3} className="h-1" />
                    </motion.div>
                  ))}

                  <div className="p-4 bg-success/5 rounded-xl border border-success/20 text-center">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Following all recommendations could reduce your risk by up to {totalPotentialReduction}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Results vary based on individual factors and consistency
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to see risk reversal predictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
