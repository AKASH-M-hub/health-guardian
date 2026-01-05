import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface RegressionEvent {
  metric: string;
  peakDate: string;
  peakValue: number;
  currentValue: number;
  dropPercent: number;
  possibleCauses: string[];
  severity: 'minor' | 'moderate' | 'significant';
}

export function RegressionDetection() {
  const { entries } = useHealthData();
  const [regressions, setRegressions] = useState<RegressionEvent[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [overallTrend, setOverallTrend] = useState<'improving' | 'stable' | 'regressing'>('stable');

  useEffect(() => {
    detectRegressions();
  }, [entries]);

  const detectRegressions = () => {
    if (entries.length < 5) {
      // Generate sample data
      const sample = Array.from({ length: 14 }, (_, i) => {
        const base = 70 + Math.sin(i * 0.5) * 15;
        return {
          date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          healthScore: Math.round(base + (i < 7 ? i * 2 : (14 - i) * 2)),
          sleep: Math.round(65 + Math.random() * 25),
          activity: Math.round(50 + Math.random() * 30)
        };
      });
      setChartData(sample);
      
      setRegressions([{
        metric: 'Sample Metric',
        peakDate: 'Week ago',
        peakValue: 85,
        currentValue: 72,
        dropPercent: 15,
        possibleCauses: ['Reduced activity', 'Sleep pattern changes'],
        severity: 'minor'
      }]);
      return;
    }

    // Calculate health scores for each entry
    const scores = entries.map(entry => {
      const sleepScore = ((entry.sleep_hours || 7) / 8) * 100;
      const stressScore = 100 - ((entry.stress_level || 5) * 10);
      const activityScore = Math.min(100, ((entry.physical_activity_minutes || 30) / 60) * 100);
      const dietScore = (entry.diet_quality || 5) * 10;
      const moodScore = (entry.mood || 5) * 10;

      return {
        date: new Date(entry.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        healthScore: Math.round((sleepScore + stressScore + activityScore + dietScore + moodScore) / 5),
        sleep: Math.round(sleepScore),
        activity: Math.round(activityScore),
        mood: Math.round(moodScore),
        rawEntry: entry
      };
    });

    setChartData(scores.slice(-14));

    // Detect regressions
    const detected: RegressionEvent[] = [];
    
    // Check for peak and decline in overall health
    let peakScore = 0;
    let peakIndex = 0;
    scores.forEach((s, i) => {
      if (s.healthScore > peakScore) {
        peakScore = s.healthScore;
        peakIndex = i;
      }
    });

    const currentScore = scores[scores.length - 1]?.healthScore || 0;
    const recentAvg = scores.slice(-3).reduce((acc, s) => acc + s.healthScore, 0) / Math.min(3, scores.length);

    if (peakScore - currentScore > 10 && peakIndex < scores.length - 3) {
      const causes = [];
      const peakEntry = scores[peakIndex].rawEntry;
      const currentEntry = entries[entries.length - 1];

      if ((currentEntry.sleep_hours || 7) < (peakEntry.sleep_hours || 7) - 1) {
        causes.push('Decreased sleep duration');
      }
      if ((currentEntry.stress_level || 5) > (peakEntry.stress_level || 5) + 2) {
        causes.push('Increased stress levels');
      }
      if ((currentEntry.physical_activity_minutes || 30) < (peakEntry.physical_activity_minutes || 30) - 15) {
        causes.push('Reduced physical activity');
      }
      if ((currentEntry.diet_quality || 5) < (peakEntry.diet_quality || 5) - 2) {
        causes.push('Diet quality decline');
      }

      if (causes.length === 0) {
        causes.push('Natural fluctuation', 'Environmental factors');
      }

      detected.push({
        metric: 'Overall Health Score',
        peakDate: scores[peakIndex].date,
        peakValue: peakScore,
        currentValue: currentScore,
        dropPercent: Math.round(((peakScore - currentScore) / peakScore) * 100),
        possibleCauses: causes,
        severity: peakScore - currentScore > 20 ? 'significant' : peakScore - currentScore > 10 ? 'moderate' : 'minor'
      });
    }

    setRegressions(detected);
    setOverallTrend(
      recentAvg > peakScore - 5 ? 'improving' : 
      detected.some(r => r.severity === 'significant') ? 'regressing' : 'stable'
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-warning/20 text-warning';
      case 'moderate': return 'bg-orange-500/20 text-orange-500';
      case 'significant': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-destructive/10 via-orange-500/10 to-warning/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center"
          >
            <TrendingDown className="w-6 h-6 text-white" />
          </motion.div>
          Health Regression Detection
        </CardTitle>
        <CardDescription>
          Identifies when health worsens after improvement and explains potential causes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Overall Status */}
        <div className="flex items-center justify-center gap-4">
          <div className={`p-4 rounded-xl ${
            overallTrend === 'improving' ? 'bg-success/10' :
            overallTrend === 'regressing' ? 'bg-destructive/10' : 'bg-muted/30'
          }`}>
            {overallTrend === 'improving' ? (
              <TrendingUp className="w-8 h-8 text-success" />
            ) : overallTrend === 'regressing' ? (
              <TrendingDown className="w-8 h-8 text-destructive" />
            ) : (
              <Activity className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold capitalize">{overallTrend} Trend</p>
            <p className="text-sm text-muted-foreground">
              {regressions.length === 0 
                ? 'No significant regressions detected'
                : `${regressions.length} regression${regressions.length > 1 ? 's' : ''} detected`
              }
            </p>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              {regressions.map((r, i) => (
                <ReferenceLine 
                  key={i}
                  x={r.peakDate} 
                  stroke="hsl(var(--warning))" 
                  strokeDasharray="3 3"
                  label={{ value: 'Peak', fontSize: 10, fill: 'hsl(var(--warning))' }}
                />
              ))}
              <Line 
                type="monotone" 
                dataKey="healthScore" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                stroke="hsl(var(--ocean))" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="hsl(var(--success))" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Health Score</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-ocean" />
            <span>Sleep</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Activity</span>
          </div>
        </div>

        {/* Regression Events */}
        {regressions.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Detected Regressions
            </h4>
            
            {regressions.map((regression, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/30 rounded-lg p-4 border-l-4 border-warning"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{regression.metric}</span>
                  <Badge className={getSeverityColor(regression.severity)}>
                    {regression.severity}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Peak</p>
                    <p className="font-medium text-success">{regression.peakValue}%</p>
                    <p className="text-xs text-muted-foreground">{regression.peakDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Current</p>
                    <p className="font-medium text-destructive">{regression.currentValue}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Drop</p>
                    <p className="font-medium text-warning">-{regression.dropPercent}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Possible Causes:</p>
                  <div className="flex flex-wrap gap-1">
                    {regression.possibleCauses.map((cause, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{cause}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-success/5 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
            <p className="font-medium text-success">No Regressions Detected</p>
            <p className="text-sm text-muted-foreground">Your health metrics are stable or improving</p>
          </div>
        )}

        {/* Recovery Tips */}
        {regressions.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Recovery Recommendations
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Focus on consistent sleep schedule (7-8 hours)</li>
              <li>• Gradually increase physical activity</li>
              <li>• Practice stress management techniques</li>
              <li>• Monitor progress daily for 1-2 weeks</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
