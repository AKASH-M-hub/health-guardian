import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  entries: any[];
}

export function DataTrustMeter({ entries }: Props) {
  const trustScore = useMemo(() => {
    if (!entries || entries.length === 0) return null;

    const dataPoints = entries.length;
    const volumeScore = Math.min(100, (dataPoints / 14) * 100);

    const completenessScores = entries.map(e => {
      let fields = 0;
      if (e.sleep_hours !== null) fields++;
      if (e.stress_level !== null) fields++;
      if (e.diet_quality !== null) fields++;
      if (e.mood !== null) fields++;
      if (e.physical_activity_minutes !== null) fields++;
      return (fields / 5) * 100;
    });
    const avgCompleteness = completenessScores.reduce((a, b) => a + b, 0) / completenessScores.length;

    return {
      overall: Math.round((volumeScore * 0.4 + avgCompleteness * 0.6)),
      volume: Math.round(volumeScore),
      completeness: Math.round(avgCompleteness),
      dataPoints,
    };
  }, [entries]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-success/10">
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Health Data Trust Meter
        </CardTitle>
        <CardDescription>Prediction reliability based on data quality</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {trustScore ? (
          <>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Data Trust Score</p>
              <p className={`text-4xl font-bold ${trustScore.overall >= 70 ? 'text-success' : trustScore.overall >= 40 ? 'text-warning' : 'text-destructive'}`}>
                {trustScore.overall}%
              </p>
              <Badge className="mt-2">{trustScore.dataPoints} entries analyzed</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span>Data Volume</span><span>{trustScore.volume}%</span></div>
              <Progress value={trustScore.volume} className="h-2" />
              <div className="flex justify-between text-sm"><span>Entry Completeness</span><span>{trustScore.completeness}%</span></div>
              <Progress value={trustScore.completeness} className="h-2" />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to see trust analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
