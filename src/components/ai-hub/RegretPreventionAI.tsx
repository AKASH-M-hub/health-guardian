import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Heart, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props { stats: any; entries: any[]; }

export function RegretPreventionAI({ stats, entries }: Props) {
  const warnings = useMemo(() => {
    if (!stats) return [];
    const items = [];
    if (stats.avgSleepHours < 6) items.push({ area: 'Sleep', message: 'Consistent sleep deprivation may accumulate over time, affecting long-term cognitive health.', tone: 'gentle', icon: '😴' });
    if (stats.avgStressLevel > 7) items.push({ area: 'Stress', message: 'Prolonged high stress can gradually impact your heart and immune system.', tone: 'caring', icon: '💆' });
    if (stats.avgActivityMinutes < 15) items.push({ area: 'Activity', message: 'Small amounts of daily movement now can prevent mobility issues later.', tone: 'encouraging', icon: '🚶' });
    if (items.length === 0) items.push({ area: 'Great Job', message: 'You\'re making choices your future self will thank you for!', tone: 'positive', icon: '🌟' });
    return items;
  }, [stats]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-warning/10 to-coral/10">
        <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-coral" />Health Regret Prevention AI</CardTitle>
        <CardDescription>Gentle reminders about long-term consequences</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {warnings.map((w, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border ${w.tone === 'positive' ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
            <div className="flex items-center gap-2 mb-2"><span className="text-xl">{w.icon}</span><Badge variant="outline">{w.area}</Badge></div>
            <p className="text-sm text-muted-foreground">{w.message}</p>
          </motion.div>
        ))}
        <p className="text-xs text-muted-foreground italic text-center flex items-center justify-center gap-1"><Clock className="w-3 h-3" />Small changes today = big rewards tomorrow</p>
      </CardContent>
    </Card>
  );
}
