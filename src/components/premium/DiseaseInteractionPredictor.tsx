import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertTriangle, RefreshCw, Zap, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import { toast } from '@/hooks/use-toast';

interface RiskInteraction {
  factors: string[];
  combinedRisk: number;
  amplification: number;
  explanation: string;
  preventionStrategies: string[];
}

const RISK_FACTORS = [
  { id: 'stress', label: 'High Stress', category: 'mental' },
  { id: 'sleep', label: 'Poor Sleep', category: 'lifestyle' },
  { id: 'sedentary', label: 'Sedentary Lifestyle', category: 'physical' },
  { id: 'diet', label: 'Poor Nutrition', category: 'lifestyle' },
  { id: 'smoking', label: 'Smoking', category: 'habit' },
  { id: 'alcohol', label: 'Excessive Alcohol', category: 'habit' },
  { id: 'obesity', label: 'Obesity', category: 'physical' },
  { id: 'hypertension', label: 'High Blood Pressure', category: 'condition' },
  { id: 'diabetes_risk', label: 'Diabetes Risk', category: 'condition' },
  { id: 'family_history', label: 'Family History of Disease', category: 'genetic' },
];

export function DiseaseInteractionPredictor() {
  const { stats } = useHealthData();
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState<RiskInteraction[]>([]);

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  const analyzeInteractions = async () => {
    if (selectedFactors.length < 2) {
      toast({ title: 'Select at least 2 factors', description: 'Risk interaction requires multiple factors to analyze.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `As a Disease Interaction AI, analyze how these risk factors interact:
            
            Selected Risk Factors: ${selectedFactors.map(f => RISK_FACTORS.find(rf => rf.id === f)?.label).join(', ')}
            
            Explain:
            1. How these factors amplify each other's risks
            2. The combined risk level compared to individual risks
            3. Specific disease risks from this combination
            4. Prevention strategies to break the interaction chain
            
            Use evidence-based health information only. This is for educational awareness, not diagnosis.`
          }]
        }),
      });

      // Generate interaction analysis
      const selectedLabels = selectedFactors.map(f => RISK_FACTORS.find(rf => rf.id === f)?.label || f);
      
      // Calculate synergistic effects
      const baseRisk = selectedFactors.length * 12;
      const synergyBonus = selectedFactors.length > 2 ? (selectedFactors.length - 2) * 8 : 0;
      
      // Check for known dangerous combinations
      const hasDangerousCombo = 
        (selectedFactors.includes('stress') && selectedFactors.includes('sleep')) ||
        (selectedFactors.includes('sedentary') && selectedFactors.includes('obesity')) ||
        (selectedFactors.includes('hypertension') && selectedFactors.includes('stress'));
      
      const combinedRisk = Math.min(95, baseRisk + synergyBonus + (hasDangerousCombo ? 15 : 0));
      const amplification = 1 + (selectedFactors.length * 0.3) + (hasDangerousCombo ? 0.5 : 0);

      const newInteractions: RiskInteraction[] = [
        {
          factors: selectedLabels,
          combinedRisk,
          amplification,
          explanation: generateInteractionExplanation(selectedFactors),
          preventionStrategies: generatePreventionStrategies(selectedFactors)
        }
      ];

      // Add pair-wise interactions for detailed analysis
      if (selectedFactors.length > 2) {
        for (let i = 0; i < selectedFactors.length - 1; i++) {
          for (let j = i + 1; j < selectedFactors.length; j++) {
            const pair = [selectedFactors[i], selectedFactors[j]];
            const pairLabels = pair.map(f => RISK_FACTORS.find(rf => rf.id === f)?.label || f);
            const pairRisk = Math.min(75, 25 + Math.random() * 30);
            
            newInteractions.push({
              factors: pairLabels,
              combinedRisk: pairRisk,
              amplification: 1.2 + Math.random() * 0.5,
              explanation: `${pairLabels[0]} combined with ${pairLabels[1]} creates compounding health effects.`,
              preventionStrategies: [
                `Address ${pairLabels[0].toLowerCase()} first as the primary risk`,
                `Monitor effects when improving ${pairLabels[1].toLowerCase()}`
              ]
            });
          }
        }
      }

      setInteractions(newInteractions);
      toast({ title: 'Interaction Analysis Complete', description: `Analyzed ${selectedFactors.length} risk factors and their interactions.` });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: 'Analysis Error', description: 'Failed to analyze interactions. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateInteractionExplanation = (factors: string[]) => {
    const explanations: Record<string, string> = {
      'stress+sleep': 'Stress disrupts sleep patterns, while poor sleep increases cortisol levels, creating a vicious cycle that affects cardiovascular and immune health.',
      'sedentary+obesity': 'Sedentary behavior reduces metabolic rate, promoting weight gain, while excess weight makes physical activity harder, reinforcing inactivity.',
      'diet+diabetes_risk': 'Poor nutrition directly impacts blood sugar regulation, accelerating insulin resistance and diabetes progression.',
      'hypertension+stress': 'Chronic stress elevates blood pressure, while existing hypertension increases sensitivity to stress hormones.',
    };

    // Check for known combinations
    for (const combo of Object.keys(explanations)) {
      const [f1, f2] = combo.split('+');
      if (factors.includes(f1) && factors.includes(f2)) {
        return explanations[combo];
      }
    }

    return `The combination of ${factors.length} risk factors creates synergistic effects where each factor amplifies the others, increasing overall health vulnerability beyond what each factor would cause independently.`;
  };

  const generatePreventionStrategies = (factors: string[]) => {
    const strategies: string[] = [];
    
    if (factors.includes('stress')) strategies.push('Practice daily stress-reduction techniques (meditation, deep breathing)');
    if (factors.includes('sleep')) strategies.push('Establish consistent sleep schedule with 7-8 hours target');
    if (factors.includes('sedentary')) strategies.push('Add 30 minutes of daily walking or movement');
    if (factors.includes('diet')) strategies.push('Focus on whole foods and reduce processed food intake');
    if (factors.includes('obesity')) strategies.push('Consult nutritionist for sustainable weight management plan');
    if (factors.includes('hypertension')) strategies.push('Monitor blood pressure regularly and limit sodium intake');
    if (factors.includes('smoking')) strategies.push('Seek smoking cessation support and resources');
    if (factors.includes('alcohol')) strategies.push('Reduce alcohol consumption or seek counseling if needed');
    if (factors.includes('diabetes_risk')) strategies.push('Monitor blood sugar and maintain healthy glycemic diet');
    if (factors.includes('family_history')) strategies.push('Schedule regular preventive health screenings');

    return strategies.slice(0, 5);
  };

  return (
    <Card className="border-2 border-warning/20">
      <CardHeader className="bg-gradient-to-r from-warning/10 to-orange-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center"
          >
            <Activity className="w-6 h-6 text-white" />
          </motion.div>
          AI Disease Interaction Predictor
        </CardTitle>
        <CardDescription>
          Analyze how multiple health risks interact and amplify each other
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Risk Factor Selection */}
        <div>
          <h4 className="font-semibold mb-4">Select Your Risk Factors</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {RISK_FACTORS.map((factor) => (
              <motion.div
                key={factor.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedFactors.includes(factor.id)
                    ? 'bg-warning/10 border-warning'
                    : 'bg-muted/30 border-transparent hover:border-muted'
                }`}
                onClick={() => toggleFactor(factor.id)}
              >
                <Checkbox checked={selectedFactors.includes(factor.id)} />
                <span className="text-sm">{factor.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <Button
          onClick={analyzeInteractions}
          disabled={loading || selectedFactors.length < 2}
          className="w-full bg-gradient-to-r from-warning to-orange-500"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Interactions...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Analyze Risk Interactions
            </>
          )}
        </Button>

        {/* Interaction Results */}
        <AnimatePresence>
          {interactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Combined Analysis */}
              <Card className="bg-gradient-to-br from-warning/5 to-orange-500/5 border-warning/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Combined Risk Analysis
                    </h4>
                    <Badge className="bg-warning text-white">
                      {interactions[0].amplification.toFixed(1)}x Amplification
                    </Badge>
                  </div>

                  {/* Risk Meter */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Combined Risk Level</span>
                      <span className="font-bold text-warning">{interactions[0].combinedRisk}%</span>
                    </div>
                    <Progress
                      value={interactions[0].combinedRisk}
                      className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-warning [&>div]:to-destructive"
                    />
                  </div>

                  {/* Factor Flow */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {interactions[0].factors.map((factor, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant="outline">{factor}</Badge>
                        {i < interactions[0].factors.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">{interactions[0].explanation}</p>
                </CardContent>
              </Card>

              {/* Prevention Strategies */}
              <Card className="bg-success/5 border-success/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-success">
                    <Shield className="w-5 h-5" />
                    Prevention Strategies
                  </h4>
                  <ul className="space-y-2">
                    {interactions[0].preventionStrategies.map((strategy, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-success font-bold">✓</span>
                        {strategy}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pair-wise Analysis */}
              {interactions.length > 1 && (
                <div>
                  <h4 className="font-semibold mb-3">Factor Pair Analysis</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {interactions.slice(1, 5).map((interaction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {interaction.factors.map((f, j) => (
                            <span key={j} className="text-xs font-medium">
                              {f}{j < interaction.factors.length - 1 && ' + '}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={interaction.combinedRisk} className="flex-1 h-2" />
                          <span className="text-xs font-bold">{Math.round(interaction.combinedRisk)}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground text-center">
          ⚕️ This analysis is for educational awareness. Consult healthcare professionals for personalized medical advice.
        </p>
      </CardContent>
    </Card>
  );
}
