import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Compass, Target, TrendingUp, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function FutureReadinessIndex() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults({
        overallScore: 74,
        dimensions: [
          { name: 'Resilience', score: 78, trend: 'up' },
          { name: 'Adaptability', score: 72, trend: 'stable' },
          { name: 'Preparedness', score: 68, trend: 'up' },
          { name: 'Recovery Capacity', score: 80, trend: 'up' }
        ],
        readinessLevel: 'Good',
        recommendation: 'Your health foundation is strong. Focus on stress management to reach optimal readiness.'
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Compass className="w-5 h-5 text-success" />
          Future Readiness Index
        </CardTitle>
        <CardDescription className="text-xs">
          Measure your preparedness for future health stressors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={analyze} disabled={analyzing} className="w-full" size="sm">
          {analyzing ? 'Calculating...' : 'Analyze Readiness'}
        </Button>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="text-center p-3 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg">
              <div className="text-3xl font-bold text-success">{results.overallScore}</div>
              <Badge variant="outline" className="mt-1">
                <Shield className="w-3 h-3 mr-1" />
                {results.readinessLevel} Readiness
              </Badge>
            </div>

            <div className="space-y-2">
              {results.dimensions.map((d: any) => (
                <div key={d.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{d.name}</span>
                    <span className="font-medium">{d.score}%</span>
                  </div>
                  <Progress value={d.score} className="h-1.5" />
                </div>
              ))}
            </div>

            <div className="p-2 bg-muted/50 rounded text-xs text-center">
              <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
              {results.recommendation}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
