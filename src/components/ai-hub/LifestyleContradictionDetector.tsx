import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertOctagon, X, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  stats: any;
  entries: any[];
}

export function LifestyleContradictionDetector({ stats, entries }: Props) {
  const contradictions = useMemo(() => {
    if (!stats) return null;

    const issues: any[] = [];

    // High stress but no relaxation activities
    if (stats.avgStressLevel > 6 && stats.avgActivityMinutes < 20) {
      issues.push({
        habit1: 'High Stress Levels',
        habit2: 'Low Physical Activity',
        conflict: 'Exercise reduces stress hormones, but you\'re not getting enough movement',
        solution: 'Even 15 minutes of walking can significantly reduce stress',
        severity: 'high',
        icons: ['😰', '🚶']
      });
    }

    // Poor sleep but high caffeine/activity before bed (simulated)
    if (stats.avgSleepQuality < 6 && stats.avgStressLevel > 5) {
      issues.push({
        habit1: 'Poor Sleep Quality',
        habit2: 'Elevated Stress',
        conflict: 'Stress keeps your mind active, preventing restorative sleep',
        solution: 'Try a wind-down routine 1 hour before bed with no screens',
        severity: 'high',
        icons: ['😴', '😰']
      });
    }

    // Good diet but poor hydration (simulated)
    if (stats.avgDietQuality >= 7) {
      const waterEntries = entries.filter(e => e.water_intake_liters);
      const avgWater = waterEntries.length > 0 
        ? waterEntries.reduce((a, e) => a + e.water_intake_liters, 0) / waterEntries.length 
        : 0;
      if (avgWater < 1.5 && waterEntries.length > 0) {
        issues.push({
          habit1: 'Good Diet Quality',
          habit2: 'Low Hydration',
          conflict: 'Healthy food needs adequate water for proper nutrient absorption',
          solution: 'Aim for 2-3 liters of water daily alongside your healthy meals',
          severity: 'medium',
          icons: ['🥗', '💧']
        });
      }
    }

    // High activity but poor diet
    if (stats.avgActivityMinutes > 30 && stats.avgDietQuality < 6) {
      issues.push({
        habit1: 'Active Lifestyle',
        habit2: 'Poor Nutrition',
        conflict: 'Your exercise benefits are limited without proper fuel',
        solution: 'Focus on protein and complex carbs to support your activity',
        severity: 'medium',
        icons: ['🏃', '🍔']
      });
    }

    // Good sleep hours but poor quality
    if (stats.avgSleepHours >= 7 && stats.avgSleepQuality < 6) {
      issues.push({
        habit1: 'Enough Sleep Hours',
        habit2: 'Poor Sleep Quality',
        conflict: 'Quantity doesn\'t equal quality - you may have sleep disruptions',
        solution: 'Check for sleep environment issues, stress, or late-night eating',
        severity: 'medium',
        icons: ['⏰', '😴']
      });
    }

    if (issues.length === 0) {
      issues.push({
        habit1: 'No Major Contradictions',
        habit2: 'Habits Aligned',
        conflict: 'Your lifestyle habits appear to be working together well!',
        solution: 'Keep maintaining this consistency for best results',
        severity: 'none',
        icons: ['✅', '🎯']
      });
    }

    return issues;
  }, [stats, entries]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'medium': return 'bg-warning/10 border-warning/30 text-warning';
      default: return 'bg-success/10 border-success/30 text-success';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-destructive/10 to-warning/10">
        <CardTitle className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-destructive" />
          Lifestyle Contradiction Detector
        </CardTitle>
        <CardDescription>
          Identifies conflicting habits preventing health improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {contradictions ? (
          <div className="space-y-4">
            {contradictions.map((contradiction, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border ${getSeverityColor(contradiction.severity)}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{contradiction.icons[0]}</span>
                  <span className="font-medium text-sm">{contradiction.habit1}</span>
                  <X className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xl">{contradiction.icons[1]}</span>
                  <span className="font-medium text-sm">{contradiction.habit2}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {contradiction.conflict}
                </p>

                <div className="flex items-start gap-2 p-2 bg-background/50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm">{contradiction.solution}</p>
                </div>

                {contradiction.severity !== 'none' && (
                  <Badge 
                    variant="outline" 
                    className={`mt-3 ${
                      contradiction.severity === 'high' ? 'border-destructive text-destructive' : 
                      'border-warning text-warning'
                    }`}
                  >
                    {contradiction.severity === 'high' ? 'Priority Fix' : 'Worth Addressing'}
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <AlertOctagon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to detect contradictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
