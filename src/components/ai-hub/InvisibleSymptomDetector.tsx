import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  entries: any[];
}

export function InvisibleSymptomDetector({ entries }: Props) {
  const symptoms = useMemo(() => {
    if (!entries || entries.length < 5) return null;

    const patterns: any[] = [];

    // Analyze gradual sleep decline
    const sleepEntries = entries.filter(e => e.sleep_hours).slice(0, 14);
    if (sleepEntries.length >= 7) {
      const recent = sleepEntries.slice(0, 3).reduce((a, e) => a + e.sleep_hours, 0) / 3;
      const older = sleepEntries.slice(-3).reduce((a, e) => a + e.sleep_hours, 0) / 3;
      if (older - recent > 0.5) {
        patterns.push({
          type: 'warning',
          symptom: 'Gradual Sleep Decline',
          detail: `Sleep decreased from ${older.toFixed(1)}h to ${recent.toFixed(1)}h over 2 weeks`,
          trend: -((older - recent) / older * 100).toFixed(0) + '%',
          recommendation: 'Monitor sleep habits and consider sleep hygiene improvements',
          icon: '😴'
        });
      }
    }

    // Analyze mood fluctuations
    const moodEntries = entries.filter(e => e.mood).slice(0, 14);
    if (moodEntries.length >= 7) {
      const moods = moodEntries.map(e => e.mood);
      const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
      const variance = moods.reduce((acc, m) => acc + Math.pow(m - avgMood, 2), 0) / moods.length;
      if (variance > 4) {
        patterns.push({
          type: 'info',
          symptom: 'Mood Instability Pattern',
          detail: 'Significant mood swings detected in your recent entries',
          trend: 'Variable',
          recommendation: 'Track triggers and consider stress management techniques',
          icon: '🎭'
        });
      }
    }

    // Analyze stress accumulation
    const stressEntries = entries.filter(e => e.stress_level).slice(0, 14);
    if (stressEntries.length >= 7) {
      const avgStress = stressEntries.reduce((a, e) => a + e.stress_level, 0) / stressEntries.length;
      const highStressDays = stressEntries.filter(e => e.stress_level >= 7).length;
      if (highStressDays >= 4) {
        patterns.push({
          type: 'warning',
          symptom: 'Chronic Stress Pattern',
          detail: `${highStressDays} high-stress days in the last 2 weeks`,
          trend: avgStress.toFixed(1) + '/10 avg',
          recommendation: 'Consider stress reduction strategies urgently',
          icon: '😰'
        });
      }
    }

    // Analyze diet-energy correlation
    const dietEntries = entries.filter(e => e.diet_quality && e.mood).slice(0, 14);
    if (dietEntries.length >= 5) {
      const lowDietDays = dietEntries.filter(e => e.diet_quality < 5);
      if (lowDietDays.length >= 3) {
        patterns.push({
          type: 'info',
          symptom: 'Nutritional Decline',
          detail: 'Multiple days with poor nutrition detected',
          trend: 'Declining',
          recommendation: 'Focus on balanced meals and hydration',
          icon: '🍔'
        });
      }
    }

    // If no issues found
    if (patterns.length === 0) {
      patterns.push({
        type: 'success',
        symptom: 'No Hidden Issues Detected',
        detail: 'Your health patterns appear stable and consistent',
        trend: 'Stable',
        recommendation: 'Keep maintaining your healthy habits!',
        icon: '✨'
      });
    }

    return patterns;
  }, [entries]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-warning/10 to-destructive/5">
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-warning" />
          Invisible Symptom Detector
        </CardTitle>
        <CardDescription>
          Identifies subtle, unnoticed health degradation patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {symptoms ? (
          <div className="space-y-3">
            {symptoms.map((symptom, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border ${
                  symptom.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                  symptom.type === 'info' ? 'bg-primary/5 border-primary/20' :
                  'bg-success/5 border-success/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{symptom.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{symptom.symptom}</span>
                      <Badge 
                        variant={symptom.type === 'success' ? 'default' : 'outline'}
                        className={
                          symptom.type === 'warning' ? 'border-warning text-warning' :
                          symptom.type === 'info' ? 'border-primary text-primary' :
                          ''
                        }
                      >
                        {symptom.trend}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{symptom.detail}</p>
                    <div className="flex items-start gap-1 text-xs">
                      {symptom.type === 'warning' ? (
                        <AlertCircle className="w-3 h-3 text-warning mt-0.5" />
                      ) : symptom.type === 'success' ? (
                        <CheckCircle className="w-3 h-3 text-success mt-0.5" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-primary mt-0.5" />
                      )}
                      <span className="text-muted-foreground">{symptom.recommendation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Need at least 5 entries to detect invisible patterns</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
