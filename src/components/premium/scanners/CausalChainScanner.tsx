import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CAUSAL_CHAINS = [
  {
    id: 1,
    trigger: 'Poor Sleep (< 6h)',
    effects: ['Increased Cortisol', 'Reduced Focus', 'Elevated Stress', 'Higher Heart Risk'],
    severity: 'high',
    reversible: true
  },
  {
    id: 2,
    trigger: 'Sedentary Lifestyle',
    effects: ['Muscle Atrophy', 'Metabolic Slowdown', 'Weight Gain Risk', 'Cardiovascular Strain'],
    severity: 'medium',
    reversible: true
  },
  {
    id: 3,
    trigger: 'High Sugar Diet',
    effects: ['Insulin Resistance', 'Energy Crashes', 'Inflammation', 'Diabetes Risk'],
    severity: 'high',
    reversible: true
  }
];

export function CausalChainScanner() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-coral" />
          Causal Health Chain Scanner
        </CardTitle>
        <CardDescription>Visualize cause-effect relationships in your health</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={analyze} disabled={analyzing} className="w-full">
          {analyzing ? 'Analyzing Causal Patterns...' : 'Scan Causal Chains'}
        </Button>

        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {CAUSAL_CHAINS.map((chain, i) => (
              <motion.div
                key={chain.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`p-4 rounded-lg border-l-4 ${
                  chain.severity === 'high' ? 'border-l-destructive bg-destructive/5' : 'border-l-warning bg-warning/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className={`w-4 h-4 ${chain.severity === 'high' ? 'text-destructive' : 'text-warning'}`} />
                  <span className="font-medium text-sm">{chain.trigger}</span>
                  {chain.reversible && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      <CheckCircle className="w-3 h-3 mr-1 text-success" />
                      Reversible
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {chain.effects.map((effect, j) => (
                    <div key={j} className="flex items-center gap-1">
                      {j > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs bg-muted px-2 py-1 rounded">{effect}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            <p className="text-xs text-muted-foreground text-center">
              Breaking any chain at the trigger point prevents downstream effects
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
