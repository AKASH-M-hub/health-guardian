import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dna, AlertTriangle, Shield, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface GeneticFactor {
  id: string;
  name: string;
  description: string;
  riskModifier: number;
  category: string;
}

const GENETIC_FACTORS: GeneticFactor[] = [
  { id: 'heart_family', name: 'Family history of heart disease', description: 'Immediate family member diagnosed', riskModifier: 1.3, category: 'Cardiovascular' },
  { id: 'diabetes_family', name: 'Family history of diabetes', description: 'Parent or sibling with Type 2 diabetes', riskModifier: 1.25, category: 'Metabolic' },
  { id: 'cancer_family', name: 'Family history of cancer', description: 'Close relative diagnosed before 50', riskModifier: 1.2, category: 'Oncology' },
  { id: 'hypertension', name: 'Genetic predisposition to hypertension', description: 'Multiple family members with high BP', riskModifier: 1.15, category: 'Cardiovascular' },
  { id: 'obesity_tendency', name: 'Genetic obesity tendency', description: 'Family pattern of weight management issues', riskModifier: 1.1, category: 'Metabolic' },
  { id: 'mental_health', name: 'Mental health conditions in family', description: 'Depression, anxiety, or other conditions', riskModifier: 1.2, category: 'Mental Health' },
  { id: 'autoimmune', name: 'Autoimmune condition history', description: 'Family history of autoimmune diseases', riskModifier: 1.15, category: 'Immune' },
  { id: 'longevity', name: 'Family longevity pattern', description: 'Grandparents lived past 85', riskModifier: 0.85, category: 'Positive' }
];

interface RiskAdjustment {
  category: string;
  originalRisk: number;
  adjustedRisk: number;
  factors: string[];
}

export function GeneticLayer() {
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [adjustments, setAdjustments] = useState<RiskAdjustment[]>([]);

  const toggleFactor = (id: string) => {
    setSelectedFactors(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    setAdjustments([]);
  };

  const analyzeGeneticImpact = async () => {
    if (!consent) {
      toast({ title: 'Consent Required', description: 'Please acknowledge the disclaimer', variant: 'destructive' });
      return;
    }

    setAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const categories = ['Cardiovascular', 'Metabolic', 'Mental Health', 'Immune'];
    const results: RiskAdjustment[] = categories.map(category => {
      const relevantFactors = GENETIC_FACTORS.filter(f => 
        selectedFactors.includes(f.id) && f.category === category
      );
      
      const baseRisk = 15 + Math.random() * 20;
      let modifier = 1;
      relevantFactors.forEach(f => modifier *= f.riskModifier);
      
      // Also check for longevity (positive factor)
      if (selectedFactors.includes('longevity')) modifier *= 0.9;

      return {
        category,
        originalRisk: Math.round(baseRisk),
        adjustedRisk: Math.round(baseRisk * modifier),
        factors: relevantFactors.map(f => f.name)
      };
    });

    setAdjustments(results);
    setAnalyzing(false);
    toast({ title: 'Analysis Complete', description: 'Genetic factors have been applied to your risk profile' });
  };

  const getRiskColor = (original: number, adjusted: number) => {
    if (adjusted < original) return 'text-success';
    if (adjusted > original + 5) return 'text-destructive';
    return 'text-warning';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-primary/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Dna className="w-6 h-6 text-white" />
          </motion.div>
          Genetic Awareness Layer
        </CardTitle>
        <CardDescription>
          Optional genetic context to personalize risk predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Disclaimer */}
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Important Disclaimer</p>
              <p className="text-muted-foreground text-xs">
                This feature uses self-reported family history, not genetic testing. Results are 
                estimates only and should not replace professional genetic counseling or medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3 bg-muted/30 rounded-lg p-4">
          <Checkbox 
            id="consent" 
            checked={consent} 
            onCheckedChange={(checked) => setConsent(checked === true)}
          />
          <Label htmlFor="consent" className="text-sm cursor-pointer">
            I understand this is for educational purposes only and consent to provide optional genetic information
          </Label>
        </div>

        {/* Genetic Factors Selection */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            Select Applicable Genetic Factors
          </h4>
          <div className="grid gap-2">
            {GENETIC_FACTORS.map((factor) => (
              <motion.div
                key={factor.id}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedFactors.includes(factor.id) 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-border hover:border-purple-500/50'
                }`}
                onClick={() => toggleFactor(factor.id)}
              >
                <Checkbox checked={selectedFactors.includes(factor.id)} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{factor.name}</p>
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
                <Badge className={factor.riskModifier < 1 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}>
                  {factor.riskModifier < 1 ? '↓' : '↑'} {Math.abs((factor.riskModifier - 1) * 100).toFixed(0)}%
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        <Button 
          onClick={analyzeGeneticImpact}
          disabled={!consent || analyzing}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Genetic Impact...
            </>
          ) : (
            <>
              <Dna className="w-4 h-4 mr-2" />
              Apply Genetic Context ({selectedFactors.length} factors)
            </>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
          {adjustments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h4 className="font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Adjusted Risk Profile
              </h4>
              
              <div className="grid gap-3">
                {adjustments.map((adj, i) => (
                  <motion.div
                    key={adj.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-muted/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{adj.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{adj.originalRisk}%</span>
                        <span className="text-muted-foreground">→</span>
                        <span className={`font-bold ${getRiskColor(adj.originalRisk, adj.adjustedRisk)}`}>
                          {adj.adjustedRisk}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Visual bar */}
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          adj.adjustedRisk < adj.originalRisk ? 'bg-success' :
                          adj.adjustedRisk > adj.originalRisk + 5 ? 'bg-destructive' : 'bg-warning'
                        }`}
                        style={{ width: `${Math.min(100, adj.adjustedRisk)}%` }}
                      />
                    </div>

                    {adj.factors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {adj.factors.map(f => (
                          <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                ⚕️ These adjustments are estimates based on general statistics. Consult a genetic counselor for personalized advice.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
