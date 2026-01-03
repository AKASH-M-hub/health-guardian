import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IdCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { stats: any; entries: any[]; }

export function HealthIdentityCard({ stats, entries }: Props) {
  if (!stats) return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><IdCard className="w-5 h-5" />Health Identity Card</CardTitle></CardHeader>
    <CardContent className="py-8 text-center text-muted-foreground">Log data to generate your health card</CardContent></Card>
  );

  const getRiskLevel = () => {
    const score = (stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4;
    return score >= 7 ? 'Low' : score >= 5 ? 'Moderate' : 'High';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-ocean text-white">
        <CardTitle className="flex items-center gap-2"><IdCard className="w-5 h-5" />Personal Health Identity Card</CardTitle>
        <CardDescription className="text-white/80">AI-generated health profile summary</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Sleep Avg</p><p className="font-bold">{stats.avgSleepHours?.toFixed(1) || '?'}h</p></div>
          <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Stress Avg</p><p className="font-bold">{stats.avgStressLevel?.toFixed(1) || '?'}/10</p></div>
          <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Diet Quality</p><p className="font-bold">{stats.avgDietQuality?.toFixed(1) || '?'}/10</p></div>
          <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Activity</p><p className="font-bold">{stats.avgActivityMinutes || 0}min</p></div>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
          <span className="font-medium">Risk Level</span><Badge>{getRiskLevel()}</Badge>
        </div>
        <div className="text-xs text-muted-foreground text-center">Based on {entries.length} health entries</div>
      </CardContent>
    </Card>
  );
}
