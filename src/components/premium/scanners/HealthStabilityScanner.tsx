import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export function HealthStabilityScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        stabilityScore: 72,
        volatility: 28,
        trend: 'improving',
        fragility: 35,
        metrics: [
          { name: 'Sleep Consistency', value: 78, change: 5 },
          { name: 'Stress Variability', value: 45, change: -8 },
          { name: 'Activity Regularity', value: 65, change: 12 },
          { name: 'Diet Stability', value: 82, change: 3 }
        ]
      });
      setScanning(false);
    }, 1500);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-warning" />
          Health Stability Oscillation Scanner
        </CardTitle>
        <CardDescription>Measure volatility and fragility over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={scan} disabled={scanning} className="w-full">
          {scanning ? 'Measuring Stability...' : 'Scan Health Stability'}
        </Button>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{results.stabilityScore}%</div>
                <p className="text-xs text-muted-foreground">Stability Score</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-warning">{results.volatility}%</div>
                <p className="text-xs text-muted-foreground">Volatility Index</p>
              </div>
            </div>

            <div className="space-y-3">
              {results.metrics.map((metric: any) => (
                <div key={metric.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.value}%</span>
                      <span className={`text-xs flex items-center ${metric.change > 0 ? 'text-success' : 'text-destructive'}`}>
                        {metric.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>

            <Badge variant="outline" className="w-full justify-center py-2">
              Trend: {results.trend === 'improving' ? '📈 Improving' : '📉 Declining'} | Fragility: {results.fragility}%
            </Badge>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
