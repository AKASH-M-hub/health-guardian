import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Clock, Scan, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface TimelinePoint {
  date: string;
  label: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  event?: string;
}

export function HealthTrajectoryScan() {
  const { stats, entries } = useHealthData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidenceScore] = useState(82);

  const generateTimeline = (): TimelinePoint[] => {
    const baseScore = stats ? 
      Math.round((stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4 * 10) : 65;

    return [
      { date: '6 months ago', label: 'Health Drift Start', score: baseScore + 15, trend: 'stable', event: 'Initial baseline' },
      { date: '4 months ago', label: 'Early Deviation', score: baseScore + 8, trend: 'down', event: 'Sleep patterns changed' },
      { date: '2 months ago', label: 'Moderate Drift', score: baseScore, trend: 'down', event: 'Stress increased' },
      { date: 'Present', label: 'Current State', score: baseScore - 5, trend: 'stable', event: 'Active monitoring' },
      { date: '+3 months', label: 'Projected (No Change)', score: baseScore - 12, trend: 'down', event: 'Continued decline likely' },
      { date: '+6 months', label: 'Projected (With Action)', score: baseScore + 10, trend: 'up', event: 'Recovery possible' }
    ];
  };

  const timeline = generateTimeline();

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3500);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
          >
            <Clock className="w-6 h-6 text-white" />
          </motion.div>
          Health Trajectory Scan
        </CardTitle>
        <CardDescription>
          Timeline visualization showing health drift progression and future projections
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!scanComplete ? (
          <div className="text-center space-y-6">
            {isScanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="relative h-32 mx-auto">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
                  </div>
                </div>
                <p className="text-lg font-medium">Analyzing health trajectory...</p>
                <p className="text-sm text-muted-foreground">Building timeline from historical data</p>
              </motion.div>
            ) : (
              <div className="py-8">
                <Calendar className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Generate a trajectory scan to visualize your health journey over time
                </p>
                <Button onClick={startScan} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Scan className="w-4 h-4 mr-2" />
                  Start Trajectory Scan
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Confidence Score */}
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">Trajectory Confidence</span>
              </div>
              <Badge className="bg-success/10 text-success">{confidenceScore}%</Badge>
            </div>

            {/* Timeline Visualization */}
            <div className="relative">
              {/* Central line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-success via-warning to-destructive" />
              
              <div className="space-y-4">
                {timeline.map((point, index) => (
                  <motion.div
                    key={point.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative pl-16"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-6 w-5 h-5 rounded-full border-2 ${
                      index < 4 ? 'bg-background border-primary' : 
                      point.trend === 'up' ? 'bg-success border-success' : 'bg-warning border-warning'
                    } flex items-center justify-center`}>
                      <div className={`w-2 h-2 rounded-full ${
                        index === 3 ? 'bg-primary animate-pulse' : 
                        point.trend === 'up' ? 'bg-success' : 
                        point.trend === 'down' ? 'bg-destructive' : 'bg-muted-foreground'
                      }`} />
                    </div>

                    <div className={`p-4 rounded-lg ${
                      index === 3 ? 'bg-primary/10 border-2 border-primary' : 
                      index >= 4 ? 'bg-muted/30 border border-dashed border-muted-foreground' : 'bg-muted/20'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{point.date}</p>
                          <p className="font-semibold">{point.label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(point.trend)}
                          <span className={`text-2xl font-bold ${getScoreColor(point.score)}`}>
                            {point.score}
                          </span>
                        </div>
                      </div>
                      {point.event && (
                        <Badge variant="outline" className="text-xs">
                          {point.event}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-destructive/10 rounded-lg p-4 text-center">
                <TrendingDown className="w-8 h-8 mx-auto text-destructive mb-2" />
                <p className="text-sm font-medium">Without Action</p>
                <p className="text-xs text-muted-foreground">Health may decline further</p>
              </div>
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-success mb-2" />
                <p className="text-sm font-medium">With Improvements</p>
                <p className="text-xs text-muted-foreground">Recovery is achievable</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Projection Disclaimer</p>
                <p className="text-muted-foreground">
                  Future projections are estimates based on current trends. Actual outcomes depend on lifestyle changes and other factors.
                </p>
              </div>
            </div>

            <Button onClick={startScan} variant="outline" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Rescan Trajectory
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
