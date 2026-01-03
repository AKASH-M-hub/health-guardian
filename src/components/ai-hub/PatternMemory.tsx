import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  entries: any[];
}

export function PatternMemory({ entries }: Props) {
  const patterns = useMemo(() => {
    if (!entries || entries.length < 5) return null;

    const insights: any[] = [];

    // Analyze sleep patterns
    const sleepData = entries.filter(e => e.sleep_hours && e.mood);
    if (sleepData.length > 3) {
      const goodSleepMood = sleepData
        .filter(e => e.sleep_hours >= 7)
        .reduce((acc, e) => acc + (e.mood || 5), 0) / (sleepData.filter(e => e.sleep_hours >= 7).length || 1);
      const poorSleepMood = sleepData
        .filter(e => e.sleep_hours < 7)
        .reduce((acc, e) => acc + (e.mood || 5), 0) / (sleepData.filter(e => e.sleep_hours < 7).length || 1);

      if (goodSleepMood > poorSleepMood + 0.5) {
        insights.push({
          type: 'positive',
          category: 'Sleep',
          pattern: 'Better sleep = Better mood for you',
          detail: `Your mood averages ${goodSleepMood.toFixed(1)} when sleeping 7+ hours vs ${poorSleepMood.toFixed(1)} with less sleep`,
          icon: '😴'
        });
      }
    }

    // Analyze activity patterns
    const activityData = entries.filter(e => e.physical_activity_minutes && e.stress_level);
    if (activityData.length > 3) {
      const activeStress = activityData
        .filter(e => e.physical_activity_minutes >= 30)
        .reduce((acc, e) => acc + (e.stress_level || 5), 0) / (activityData.filter(e => e.physical_activity_minutes >= 30).length || 1);
      const inactiveStress = activityData
        .filter(e => e.physical_activity_minutes < 30)
        .reduce((acc, e) => acc + (e.stress_level || 5), 0) / (activityData.filter(e => e.physical_activity_minutes < 30).length || 1);

      if (activeStress < inactiveStress - 0.5) {
        insights.push({
          type: 'positive',
          category: 'Activity',
          pattern: 'Exercise reduces your stress',
          detail: `Stress drops to ${activeStress.toFixed(1)} on active days vs ${inactiveStress.toFixed(1)} on rest days`,
          icon: '🏃'
        });
      }
    }

    // Analyze diet patterns
    const dietData = entries.filter(e => e.diet_quality && e.sleep_quality);
    if (dietData.length > 3) {
      const goodDietSleep = dietData
        .filter(e => e.diet_quality >= 7)
        .reduce((acc, e) => acc + (e.sleep_quality || 5), 0) / (dietData.filter(e => e.diet_quality >= 7).length || 1);
      const poorDietSleep = dietData
        .filter(e => e.diet_quality < 7)
        .reduce((acc, e) => acc + (e.sleep_quality || 5), 0) / (dietData.filter(e => e.diet_quality < 7).length || 1);

      if (goodDietSleep > poorDietSleep + 0.5) {
        insights.push({
          type: 'positive',
          category: 'Diet',
          pattern: 'Good diet improves your sleep',
          detail: `Sleep quality is ${goodDietSleep.toFixed(1)} with healthy eating vs ${poorDietSleep.toFixed(1)} otherwise`,
          icon: '🥗'
        });
      }
    }

    // Add general patterns
    if (entries.length >= 7) {
      insights.push({
        type: 'neutral',
        category: 'Tracking',
        pattern: 'Consistency is key',
        detail: `You've tracked ${entries.length} days - this helps AI understand your patterns better`,
        icon: '📊'
      });
    }

    return insights;
  }, [entries]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-lavender/20 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-lavender-dark" />
          Personal Health Pattern Memory
        </CardTitle>
        <CardDescription>
          AI remembers what works and what doesn't for your health
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {patterns && patterns.length > 0 ? (
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border ${
                  pattern.type === 'positive' ? 'bg-success/5 border-success/20' :
                  pattern.type === 'negative' ? 'bg-destructive/5 border-destructive/20' :
                  'bg-muted/50 border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{pattern.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{pattern.pattern}</span>
                      {pattern.type === 'positive' && <TrendingUp className="w-4 h-4 text-success" />}
                      {pattern.type === 'negative' && <TrendingDown className="w-4 h-4 text-destructive" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{pattern.detail}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{pattern.category}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="p-3 bg-primary/5 rounded-lg flex items-center gap-2 text-sm">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                Keep logging to discover more personal patterns
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Need at least 5 entries to detect patterns</p>
            <p className="text-xs mt-2">Keep tracking your health daily!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
