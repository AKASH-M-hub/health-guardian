import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function InvisibleDamageScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        cumulativeStress: 42,
        silentRisks: [
          { area: 'Cardiovascular', accumulation: 28, status: 'low', trend: 'stable' },
          { area: 'Metabolic', accumulation: 45, status: 'medium', trend: 'rising' },
          { area: 'Cognitive', accumulation: 35, status: 'low', trend: 'stable' },
          { area: 'Immune', accumulation: 22, status: 'low', trend: 'improving' }
        ],
        earlyWarnings: 2
      });
      setScanning(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-lavender-dark" />
          Invisible Damage Accumulation Scanner
        </CardTitle>
        <CardDescription>Detect slow cumulative stress before symptoms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={scan} disabled={scanning} className="w-full">
          {scanning ? 'Detecting Silent Accumulation...' : 'Scan for Hidden Damage'}
        </Button>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-3xl font-bold">{results.cumulativeStress}%</div>
              <p className="text-sm text-muted-foreground">Cumulative Stress Index</p>
              <Progress value={results.cumulativeStress} className="mt-2 h-2" />
            </div>

            <div className="space-y-3">
              {results.silentRisks.map((risk: any) => (
                <div key={risk.area} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{risk.area}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {risk.trend === 'rising' ? '↑' : risk.trend === 'improving' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                  <Progress value={risk.accumulation} className="h-1.5" />
                  <span className="text-xs text-muted-foreground">Accumulation: {risk.accumulation}%</span>
                </div>
              ))}
            </div>

            {results.earlyWarnings > 0 && (
              <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm">{results.earlyWarnings} early warning signals detected</span>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
