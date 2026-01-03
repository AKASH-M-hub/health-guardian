import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO, differenceInDays } from 'date-fns';

interface Props {
  entries: any[];
}

export function HealthDriftTimeline({ entries }: Props) {
  const driftAnalysis = useMemo(() => {
    if (!entries || entries.length < 3) return null;

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
    );

    // Calculate composite health score for each entry
    const scores = sortedEntries.map(e => ({
      date: e.entry_date,
      score: (
        (e.sleep_quality || 5) +
        (10 - (e.stress_level || 5)) +
        (e.diet_quality || 5) +
        (e.mood || 5)
      ) / 4,
      sleep: e.sleep_quality || 5,
      stress: e.stress_level || 5,
      diet: e.diet_quality || 5,
      mood: e.mood || 5,
    }));

    // Calculate baseline (first 3 entries average)
    const baseline = scores.slice(0, 3).reduce((acc, s) => acc + s.score, 0) / 3;

    // Find drift points
    const driftPoints: any[] = [];
    let lastStableIndex = 0;

    scores.forEach((score, i) => {
      if (i < 3) return;
      
      const recentAvg = scores.slice(Math.max(0, i - 2), i + 1).reduce((acc, s) => acc + s.score, 0) / 3;
      const deviation = recentAvg - baseline;
      
      if (Math.abs(deviation) > 1 && i - lastStableIndex >= 2) {
        driftPoints.push({
          date: score.date,
          type: deviation > 0 ? 'improvement' : 'decline',
          magnitude: Math.abs(deviation).toFixed(1),
          score: score.score,
          factors: [
            deviation > 0 ? 
              (score.sleep > 6 ? 'Better sleep' : score.diet > 6 ? 'Improved diet' : 'Reduced stress') :
              (score.stress > 6 ? 'Increased stress' : score.sleep < 5 ? 'Poor sleep' : 'Diet changes')
          ]
        });
        lastStableIndex = i;
      }
    });

    // Chart data
    const chartData = scores.map(s => ({
      date: format(parseISO(s.date), 'MMM d'),
      score: parseFloat(s.score.toFixed(1)),
      baseline: parseFloat(baseline.toFixed(1)),
    }));

    return {
      baseline: baseline.toFixed(1),
      currentScore: scores[scores.length - 1]?.score.toFixed(1) || '0',
      driftPoints,
      chartData,
      trend: scores[scores.length - 1]?.score > baseline ? 'positive' : 
             scores[scores.length - 1]?.score < baseline ? 'negative' : 'stable',
      daysSinceStart: differenceInDays(
        new Date(sortedEntries[sortedEntries.length - 1].entry_date),
        new Date(sortedEntries[0].entry_date)
      ),
    };
  }, [entries]);

  if (!driftAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Health Drift Timeline
          </CardTitle>
          <CardDescription>Track when lifestyle patterns deviate from baseline</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Need at least 3 entries to analyze drift patterns</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-lavender/20 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-lavender-dark" />
          Health Drift Timeline
        </CardTitle>
        <CardDescription>
          Tracking {driftAnalysis.daysSinceStart} days of lifestyle patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Baseline</p>
            <p className="text-xl font-bold text-primary">{driftAnalysis.baseline}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className={`text-xl font-bold ${
              driftAnalysis.trend === 'positive' ? 'text-success' :
              driftAnalysis.trend === 'negative' ? 'text-destructive' : 'text-muted-foreground'
            }`}>{driftAnalysis.currentScore}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Trend</p>
            <div className="flex items-center justify-center gap-1">
              {driftAnalysis.trend === 'positive' ? 
                <TrendingUp className="w-5 h-5 text-success" /> :
                driftAnalysis.trend === 'negative' ?
                <TrendingDown className="w-5 h-5 text-destructive" /> :
                <span className="text-xl">→</span>
              }
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={driftAnalysis.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <ReferenceLine 
                y={parseFloat(driftAnalysis.baseline)} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="5 5"
                label={{ value: 'Baseline', fill: 'hsl(var(--primary))', fontSize: 10 }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--ocean))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--ocean))', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {driftAnalysis.driftPoints.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Detected Drift Events</p>
            {driftAnalysis.driftPoints.slice(-3).map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border ${
                  point.type === 'improvement' ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {point.type === 'improvement' ? 
                      <CheckCircle className="w-4 h-4 text-success" /> :
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    }
                    <span className="text-sm font-medium">
                      {format(parseISO(point.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <Badge variant={point.type === 'improvement' ? 'default' : 'destructive'}>
                    {point.type === 'improvement' ? '+' : '-'}{point.magnitude} pts
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {point.factors.map((f: string, j: number) => (
                    <span key={j} className="text-xs bg-background px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
