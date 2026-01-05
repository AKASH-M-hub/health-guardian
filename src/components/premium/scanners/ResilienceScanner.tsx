import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function ResilienceScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        resilienceScore: 68,
        shockAbsorption: 72,
        recoverySpeed: 65,
        adaptability: 78,
        stressors: [
          { name: 'Work Deadline', impact: 'medium', recovery: '2-3 days' },
          { name: 'Sleep Disruption', impact: 'high', recovery: '4-5 days' },
          { name: 'Diet Change', impact: 'low', recovery: '1-2 days' }
        ]
      });
      setScanning(false);
    }, 1800);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          Health Resilience & Shock Scanner
        </CardTitle>
        <CardDescription>Simulate response to sudden stressors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={scan} disabled={scanning} className="w-full">
          {scanning ? 'Simulating Stress Response...' : 'Scan Resilience'}
        </Button>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-success">{results.resilienceScore}</div>
              <p className="text-sm text-muted-foreground">Overall Resilience Score</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-lg font-bold">{results.shockAbsorption}%</div>
                <p className="text-xs text-muted-foreground">Shock Absorption</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-lg font-bold">{results.recoverySpeed}%</div>
                <p className="text-xs text-muted-foreground">Recovery Speed</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-lg font-bold">{results.adaptability}%</div>
                <p className="text-xs text-muted-foreground">Adaptability</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Stress Response Simulation</h4>
              {results.stressors.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <span>{s.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.impact === 'high' ? 'destructive' : s.impact === 'medium' ? 'secondary' : 'outline'}>
                      {s.impact}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{s.recovery}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
