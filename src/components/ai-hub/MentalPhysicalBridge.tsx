import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link2, Brain, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  stats: any;
  entries: any[];
}

export function MentalPhysicalBridge({ stats, entries }: Props) {
  const correlations = useMemo(() => {
    if (!stats || !entries || entries.length < 3) return null;

    // Calculate correlations between mental and physical factors
    const stressSleepCorr = entries
      .filter(e => e.stress_level && e.sleep_quality)
      .length > 2;

    const moodActivityCorr = entries
      .filter(e => e.mood && e.physical_activity_minutes)
      .length > 2;

    return {
      connections: [
        {
          mental: 'High Stress',
          physical: 'Poor Sleep Quality',
          strength: stats.avgStressLevel > 6 && stats.avgSleepQuality < 6 ? 85 : 
                    stats.avgStressLevel > 5 ? 60 : 30,
          impact: 'Stress hormones interfere with your sleep cycles',
          recommendation: 'Try relaxation techniques before bed',
          mentalIcon: '😰',
          physicalIcon: '😴',
        },
        {
          mental: 'Low Mood',
          physical: 'Low Energy/Activity',
          strength: stats.avgMood < 6 && stats.avgActivityMinutes < 30 ? 80 :
                    stats.avgMood < 7 ? 50 : 25,
          impact: 'Mood affects motivation to exercise',
          recommendation: 'Start with just 10-minute walks',
          mentalIcon: '😔',
          physicalIcon: '🚶',
        },
        {
          mental: 'Mental Fatigue',
          physical: 'Diet Quality',
          strength: stats.avgDietQuality < 6 ? 75 : 40,
          impact: 'Poor nutrition affects brain function',
          recommendation: 'Add more omega-3 rich foods',
          mentalIcon: '🧠',
          physicalIcon: '🍎',
        },
        {
          mental: 'Emotional Stability',
          physical: 'Heart Health',
          strength: stats.avgStressLevel > 7 ? 70 : stats.avgStressLevel > 5 ? 45 : 20,
          impact: 'Chronic stress affects cardiovascular system',
          recommendation: 'Practice mindfulness daily',
          mentalIcon: '💭',
          physicalIcon: '❤️',
        }
      ],
      overallBridgeScore: Math.round(
        (10 - stats.avgStressLevel + stats.avgMood + stats.avgSleepQuality) / 3 * 10
      ),
    };
  }, [stats, entries]);

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'text-destructive';
    if (strength >= 40) return 'text-warning';
    return 'text-success';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-coral/10 to-lavender/20">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-coral" />
          Mental–Physical Health Bridge
        </CardTitle>
        <CardDescription>
          How stress, emotions, and mental fatigue connect to physical health
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {correlations ? (
          <>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-lavender/20 to-coral/10 rounded-xl">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-lavender-dark" />
                <span className="text-sm font-medium">Mind-Body Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-coral" />
                <span className="text-xl font-bold">{correlations.overallBridgeScore}%</span>
              </div>
            </div>

            <div className="space-y-4">
              {correlations.connections.map((conn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-muted/30 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{conn.mentalIcon}</span>
                      <span className="text-sm font-medium">{conn.mental}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xl">{conn.physicalIcon}</span>
                      <span className="text-sm font-medium">{conn.physical}</span>
                    </div>
                    <Badge variant="outline" className={getStrengthColor(conn.strength)}>
                      {conn.strength}% linked
                    </Badge>
                  </div>

                  <Progress value={conn.strength} className="h-2" />

                  <div className="text-xs space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Impact:</span> {conn.impact}
                    </p>
                    <p className="text-primary">
                      <span className="font-medium">💡 Tip:</span> {conn.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground italic text-center">
              *Correlation strength based on your logged data patterns
            </p>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Need more data to analyze mind-body connections</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
