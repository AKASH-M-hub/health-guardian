import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Brain, AlertTriangle, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface CognitiveMetric {
  date: string;
  focusScore: number;
  clarityScore: number;
  decisionFatigue: number;
  overallCognitive: number;
}

export function CognitiveIndex() {
  const { entries, stats } = useHealthData();
  const [cognitiveData, setCognitiveData] = useState<CognitiveMetric[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fatigueAlert, setFatigueAlert] = useState(false);
  const [trend, setTrend] = useState<'improving' | 'stable' | 'declining'>('stable');

  useEffect(() => {
    calculateCognitiveIndex();
  }, [entries]);

  const calculateCognitiveIndex = () => {
    if (entries.length === 0) {
      // Generate sample data for visualization
      const sampleData: CognitiveMetric[] = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        focusScore: 60 + Math.random() * 30,
        clarityScore: 55 + Math.random() * 35,
        decisionFatigue: 20 + Math.random() * 40,
        overallCognitive: 55 + Math.random() * 30
      }));
      setCognitiveData(sampleData);
      setCurrentIndex(70);
      return;
    }

    const data = entries.slice(-14).map(entry => {
      const sleepFactor = ((entry.sleep_hours || 7) / 8) * 100;
      const stressFactor = 100 - ((entry.stress_level || 5) * 10);
      const moodFactor = (entry.mood || 5) * 10;
      
      const focusScore = Math.round(sleepFactor * 0.4 + stressFactor * 0.3 + moodFactor * 0.3);
      const clarityScore = Math.round(sleepFactor * 0.5 + stressFactor * 0.3 + moodFactor * 0.2);
      const decisionFatigue = Math.round(100 - (stressFactor * 0.5 + sleepFactor * 0.3 + moodFactor * 0.2));
      const overallCognitive = Math.round((focusScore + clarityScore + (100 - decisionFatigue)) / 3);

      return {
        date: new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'short' }),
        focusScore: Math.min(100, Math.max(0, focusScore)),
        clarityScore: Math.min(100, Math.max(0, clarityScore)),
        decisionFatigue: Math.min(100, Math.max(0, decisionFatigue)),
        overallCognitive: Math.min(100, Math.max(0, overallCognitive))
      };
    });

    setCognitiveData(data);

    if (data.length > 0) {
      const latest = data[data.length - 1];
      setCurrentIndex(latest.overallCognitive);
      setFatigueAlert(latest.decisionFatigue > 60);

      if (data.length >= 3) {
        const recent = data.slice(-3).reduce((acc, d) => acc + d.overallCognitive, 0) / 3;
        const earlier = data.slice(0, 3).reduce((acc, d) => acc + d.overallCognitive, 0) / 3;
        setTrend(recent > earlier + 5 ? 'improving' : recent < earlier - 5 ? 'declining' : 'stable');
      }
    }
  };

  const getIndexColor = (value: number) => {
    if (value >= 75) return 'text-success';
    if (value >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-primary/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(251, 191, 36, 0)', '0 0 0 10px rgba(251, 191, 36, 0.3)', '0 0 0 0 rgba(251, 191, 36, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
          >
            <Lightbulb className="w-6 h-6 text-white" />
          </motion.div>
          Cognitive & Focus Health Index
        </CardTitle>
        <CardDescription>
          Track mental clarity, focus stability, and decision fatigue over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-center gap-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center flex-col">
                <span className={`text-4xl font-bold ${getIndexColor(currentIndex)}`}>{currentIndex}</span>
                <span className="text-xs text-muted-foreground">Cognitive Score</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-sm capitalize">{trend} trend</span>
            </div>
            {fatigueAlert && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-warning"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">High decision fatigue</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Cognitive Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cognitiveData}>
              <defs>
                <linearGradient id="cognitiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="overallCognitive" 
                stroke="hsl(var(--primary))" 
                fill="url(#cognitiveGradient)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="focusScore" 
                stroke="hsl(var(--success))" 
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="decisionFatigue" 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Overall Cognitive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Focus Score</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Decision Fatigue</span>
          </div>
        </div>

        {/* Sub-metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <Brain className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{cognitiveData[cognitiveData.length - 1]?.focusScore?.toFixed(0) || '—'}%</p>
            <p className="text-xs text-muted-foreground">Focus</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-lg font-bold">{cognitiveData[cognitiveData.length - 1]?.clarityScore?.toFixed(0) || '—'}%</p>
            <p className="text-xs text-muted-foreground">Clarity</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-warning" />
            <p className="text-lg font-bold">{cognitiveData[cognitiveData.length - 1]?.decisionFatigue?.toFixed(0) || '—'}%</p>
            <p className="text-xs text-muted-foreground">Fatigue</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm">Boost Your Cognitive Performance</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Take 5-minute breaks every 90 minutes</li>
            <li>• Prioritize 7-8 hours of quality sleep</li>
            <li>• Limit major decisions to morning hours</li>
            <li>• Practice mindfulness for 10 minutes daily</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
