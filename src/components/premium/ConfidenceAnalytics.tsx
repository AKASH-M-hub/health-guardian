import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, AlertTriangle, TrendingUp, Database, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface ConfidenceMetric {
  name: string;
  confidence: number;
  uncertainty: number;
  dataPoints: number;
  sensitivity: 'high' | 'medium' | 'low';
  impact: string;
}

export function ConfidenceAnalytics() {
  const { entries, stats } = useHealthData();
  const [metrics, setMetrics] = useState<ConfidenceMetric[]>([]);
  const [overallConfidence, setOverallConfidence] = useState(0);
  const [dataCompleteness, setDataCompleteness] = useState(0);

  useEffect(() => {
    calculateConfidence();
  }, [entries, stats]);

  const calculateConfidence = () => {
    const dataPoints = entries.length;
    const completeness = Math.min(100, (dataPoints / 30) * 100);
    setDataCompleteness(completeness);

    // Calculate metrics based on available data
    const calculatedMetrics: ConfidenceMetric[] = [
      {
        name: 'Sleep Pattern Prediction',
        confidence: dataPoints >= 7 ? 85 : Math.max(30, dataPoints * 10),
        uncertainty: dataPoints >= 7 ? 15 : 70 - dataPoints * 5,
        dataPoints: entries.filter(e => e.sleep_hours !== null).length,
        sensitivity: 'high',
        impact: 'Major influence on stress and energy predictions'
      },
      {
        name: 'Cardiovascular Risk',
        confidence: dataPoints >= 14 ? 78 : Math.max(25, dataPoints * 5),
        uncertainty: dataPoints >= 14 ? 22 : 75 - dataPoints * 3,
        dataPoints: entries.filter(e => e.heart_rate !== null).length,
        sensitivity: 'high',
        impact: 'Requires consistent activity and heart rate data'
      },
      {
        name: 'Stress Level Accuracy',
        confidence: dataPoints >= 7 ? 82 : Math.max(35, dataPoints * 8),
        uncertainty: dataPoints >= 7 ? 18 : 65 - dataPoints * 4,
        dataPoints: entries.filter(e => e.stress_level !== null).length,
        sensitivity: 'medium',
        impact: 'Improves with mood correlation data'
      },
      {
        name: 'Diet Impact Analysis',
        confidence: dataPoints >= 14 ? 70 : Math.max(20, dataPoints * 4),
        uncertainty: dataPoints >= 14 ? 30 : 80 - dataPoints * 3,
        dataPoints: entries.filter(e => e.diet_quality !== null).length,
        sensitivity: 'medium',
        impact: 'Long-term tracking needed for accuracy'
      },
      {
        name: 'Activity Correlation',
        confidence: dataPoints >= 7 ? 88 : Math.max(40, dataPoints * 10),
        uncertainty: dataPoints >= 7 ? 12 : 60 - dataPoints * 5,
        dataPoints: entries.filter(e => e.physical_activity_minutes !== null).length,
        sensitivity: 'low',
        impact: 'Well-established patterns detected quickly'
      }
    ];

    setMetrics(calculatedMetrics);
    setOverallConfidence(Math.round(calculatedMetrics.reduce((acc, m) => acc + m.confidence, 0) / calculatedMetrics.length));
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/20 text-success';
      default: return 'bg-muted';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-warning/10 via-primary/10 to-ocean/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center"
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </motion.div>
          Advanced Risk Confidence Analytics
        </CardTitle>
        <CardDescription>
          Understanding prediction uncertainty and data quality impact
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-muted/30 rounded-xl p-4 text-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                <motion.circle
                  cx="48" cy="48" r="40"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251}
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (251 * overallConfidence / 100) }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getConfidenceColor(overallConfidence)}`}>{overallConfidence}%</span>
              </div>
            </div>
            <p className="text-sm font-medium">Overall Confidence</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-muted/30 rounded-xl p-4 text-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                <motion.circle
                  cx="48" cy="48" r="40"
                  stroke="hsl(var(--ocean))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251}
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (251 * dataCompleteness / 100) }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Database className="w-5 h-5 text-ocean mb-1" />
                <span className="text-lg font-bold text-ocean">{Math.round(dataCompleteness)}%</span>
              </div>
            </div>
            <p className="text-sm font-medium">Data Completeness</p>
          </motion.div>
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-muted/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSensitivityColor(metric.sensitivity)}>
                    {metric.sensitivity} sensitivity
                  </Badge>
                  <span className={`font-bold ${getConfidenceColor(metric.confidence)}`}>
                    {metric.confidence}%
                  </span>
                </div>
              </div>

              {/* Confidence Bar with Uncertainty */}
              <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.confidence}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
                <motion.div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-destructive/50 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.uncertainty}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{metric.dataPoints} data points</span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  ±{metric.uncertainty}% uncertainty
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-2 italic">{metric.impact}</p>
            </motion.div>
          ))}
        </div>

        {/* Improvement Tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Improve Prediction Accuracy
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Log health data daily for better pattern recognition</li>
            <li>• Include heart rate readings when available</li>
            <li>• Track sleep and stress consistently</li>
            <li>• 30+ days of data significantly improves accuracy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
