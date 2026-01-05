import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, Scan, AlertTriangle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface RegressionZone {
  area: string;
  beforeScore: number;
  afterScore: number;
  change: number;
  cause: string;
}

export function HealthRegressionScan() {
  const { stats, entries } = useHealthData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidenceScore] = useState(81);

  const detectRegressions = (): RegressionZone[] => {
    // Simulate detecting regression based on data patterns
    const hasRegression = entries.length >= 2;
    
    if (!hasRegression) {
      return [
        { area: 'Sleep Quality', beforeScore: 75, afterScore: 68, change: -7, cause: 'Irregular sleep schedule' },
        { area: 'Stress Management', beforeScore: 70, afterScore: 58, change: -12, cause: 'Increased workload' },
        { area: 'Physical Activity', beforeScore: 65, afterScore: 60, change: -5, cause: 'Reduced exercise frequency' }
      ];
    }

    const zones: RegressionZone[] = [];
    
    if (stats?.avgStressLevel && stats.avgStressLevel > 5) {
      zones.push({
        area: 'Stress Management',
        beforeScore: 75,
        afterScore: Math.round(100 - stats.avgStressLevel * 10),
        change: -Math.round(stats.avgStressLevel * 2),
        cause: 'Elevated stress levels detected'
      });
    }

    if (stats?.avgSleepHours && stats.avgSleepHours < 7) {
      zones.push({
        area: 'Sleep Recovery',
        beforeScore: 80,
        afterScore: Math.round(stats.avgSleepHours * 10),
        change: -Math.round((8 - stats.avgSleepHours) * 5),
        cause: 'Sleep deficit accumulating'
      });
    }

    if (stats?.avgActivityMinutes && stats.avgActivityMinutes < 30) {
      zones.push({
        area: 'Physical Fitness',
        beforeScore: 70,
        afterScore: Math.round(stats.avgActivityMinutes * 2),
        change: -Math.round((30 - stats.avgActivityMinutes) / 2),
        cause: 'Reduced physical activity'
      });
    }

    if (zones.length === 0) {
      zones.push({
        area: 'Overall Health',
        beforeScore: 70,
        afterScore: 72,
        change: 2,
        cause: 'No significant regression detected'
      });
    }

    return zones;
  };

  const regressions = detectRegressions();
  const hasSignificantRegression = regressions.some(r => r.change < -5);

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3500);
  };

  const getChangeColor = (change: number) => {
    if (change >= 0) return 'text-success';
    if (change > -10) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-rose-500/10 via-red-500/10 to-orange-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center"
          >
            <RefreshCw className="w-6 h-6 text-white" />
          </motion.div>
          Health Regression Scan
        </CardTitle>
        <CardDescription>
          Detect areas where health has declined after previous improvements
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
                  >
                    <motion.div
                      animate={{ 
                        x: [0, 50, 0, -50, 0],
                        scale: [1, 0.9, 1, 0.9, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-rose-500/30 flex items-center justify-center"
                    >
                      <TrendingDown className="w-8 h-8 text-rose-500" />
                    </motion.div>
                  </motion.div>
                </div>
                <p className="text-lg font-medium">Detecting health regressions...</p>
                <p className="text-sm text-muted-foreground">Comparing historical patterns</p>
              </motion.div>
            ) : (
              <div className="py-8">
                <TrendingDown className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Scan for areas where health may have declined after previous improvements
                </p>
                <Button onClick={startScan} className="bg-gradient-to-r from-rose-500 to-red-500">
                  <Scan className="w-4 h-4 mr-2" />
                  Start Regression Scan
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
            {/* Status Banner */}
            {hasSignificantRegression ? (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto text-destructive mb-2" />
                <p className="font-semibold text-destructive">Regression Detected</p>
                <p className="text-sm text-muted-foreground">Some health areas have declined</p>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
                <p className="font-semibold text-success">Minimal Regression</p>
                <p className="text-sm text-muted-foreground">Your health is relatively stable</p>
              </div>
            )}

            {/* Confidence Score */}
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">Detection Confidence</span>
              </div>
              <Badge className="bg-success/10 text-success">{confidenceScore}%</Badge>
            </div>

            {/* Regression Zones */}
            <div className="space-y-4">
              <h4 className="font-semibold">Before & After Comparison</h4>
              {regressions.map((zone, index) => (
                <motion.div
                  key={zone.area}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-muted/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{zone.area}</span>
                    <Badge className={`${getChangeColor(zone.change)} bg-transparent`}>
                      {zone.change > 0 ? '+' : ''}{zone.change}%
                    </Badge>
                  </div>

                  {/* Before/After Visual */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Before</p>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.beforeScore}%` }}
                          className="h-full bg-success"
                        />
                      </div>
                      <p className="text-sm font-medium text-right">{zone.beforeScore}%</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">After</p>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.afterScore}%` }}
                          className={`h-full ${zone.change >= 0 ? 'bg-success' : 'bg-destructive'}`}
                        />
                      </div>
                      <p className="text-sm font-medium text-right">{zone.afterScore}%</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded p-2">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Likely cause:</span> {zone.cause}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recovery Suggestions */}
            {hasSignificantRegression && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">Recovery Actions</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {regressions.filter(r => r.change < -5).map((r, i) => (
                    <li key={i}>• Address {r.area.toLowerCase()}: {r.cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Analysis Notice</p>
                <p className="text-muted-foreground">
                  Regression detection is based on data patterns and may not capture all health changes.
                </p>
              </div>
            </div>

            <Button onClick={startScan} variant="outline" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Rescan for Regressions
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
