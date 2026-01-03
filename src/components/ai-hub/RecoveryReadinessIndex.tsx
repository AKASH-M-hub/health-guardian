import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Gauge, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface Props { stats: any; entries: any[]; }

export function RecoveryReadinessIndex({ stats, entries }: Props) {
  const readiness = useMemo(() => {
    if (!stats) return null;
    const sleepFactor = (stats.avgSleepHours >= 7 ? 30 : stats.avgSleepHours >= 5 ? 20 : 10);
    const stressFactor = (stats.avgStressLevel <= 4 ? 30 : stats.avgStressLevel <= 6 ? 20 : 10);
    const dietFactor = (stats.avgDietQuality >= 7 ? 20 : stats.avgDietQuality >= 5 ? 15 : 8);
    const activityFactor = (stats.avgActivityMinutes >= 30 ? 20 : stats.avgActivityMinutes >= 15 ? 15 : 8);
    return sleepFactor + stressFactor + dietFactor + activityFactor;
  }, [stats]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-success/10 to-mint/10">
        <CardTitle className="flex items-center gap-2"><Gauge className="w-5 h-5 text-success" />Recovery Readiness Index</CardTitle>
        <CardDescription>How prepared your body is for health improvement</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {readiness !== null ? (
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Body Readiness Score</p>
              <p className={`text-5xl font-bold ${readiness >= 70 ? 'text-success' : readiness >= 50 ? 'text-warning' : 'text-destructive'}`}>{readiness}%</p>
              <Badge className="mt-2">{readiness >= 70 ? 'Ready to Improve' : readiness >= 50 ? 'Building Momentum' : 'Focus on Basics First'}</Badge>
            </div>
            <Progress value={readiness} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">Higher readiness = better response to lifestyle changes</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground"><Gauge className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Log data to see recovery readiness</p></div>
        )}
      </CardContent>
    </Card>
  );
}
