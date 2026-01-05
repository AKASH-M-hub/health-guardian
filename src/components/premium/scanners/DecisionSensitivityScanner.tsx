import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Target, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function DecisionSensitivityScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [testChange, setTestChange] = useState(50);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        sensitivity: 'High',
        decisions: [
          { action: '+30 min daily walk', impact: 12, confidence: 85 },
          { action: 'Reduce sugar by 50%', impact: 18, confidence: 78 },
          { action: '+1 hour sleep', impact: 15, confidence: 92 },
          { action: '10 min meditation', impact: 8, confidence: 88 }
        ]
      });
      setScanning(false);
    }, 1500);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-ocean" />
          Decision Sensitivity Scanner
        </CardTitle>
        <CardDescription>See impact of small lifestyle changes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={scan} disabled={scanning} className="w-full">
          {scanning ? 'Analyzing Sensitivity...' : 'Scan Decision Impact'}
        </Button>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Badge variant="outline" className="w-full justify-center py-2">
              System Sensitivity: <span className="font-bold ml-1">{results.sensitivity}</span>
            </Badge>

            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                High-Impact Decisions
              </h4>
              {results.decisions.map((d: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{d.action}</span>
                    <Badge className="bg-success/20 text-success">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{d.impact}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-success"
                        initial={{ width: 0 }}
                        animate={{ width: `${d.impact * 5}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.confidence}% confidence</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
