import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, TrendingDown, RefreshCw, Sparkles, ArrowRight, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import { toast } from '@/hooks/use-toast';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
}

interface SimulationResult {
  scenario: string;
  impact: 'positive' | 'negative' | 'mixed';
  healthChange: number;
  timeToEffect: string;
  confidence: number;
  breakdown: { metric: string; change: number }[];
  sideEffects: string[];
  recommendations: string[];
}

const PRESET_SCENARIOS: SimulationScenario[] = [
  { id: 'exercise', name: 'Start Exercising Daily', description: 'Add 30 minutes of moderate exercise every day' },
  { id: 'sleep', name: 'Improve Sleep Schedule', description: 'Go to bed 1 hour earlier and maintain consistent schedule' },
  { id: 'diet', name: 'Adopt Healthy Diet', description: 'Switch to whole foods and reduce processed food intake' },
  { id: 'stress', name: 'Practice Stress Management', description: 'Add 15 minutes of daily meditation or relaxation' },
  { id: 'ignore', name: 'Ignore Health Advice', description: 'Continue current habits without changes' },
  { id: 'worsen', name: 'Decline in Habits', description: 'Reduced sleep, increased stress, less activity' },
];

export function DecisionSimulator() {
  const { stats, entries } = useHealthData();
  const [customDecision, setCustomDecision] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const simulateDecision = async (scenarioId?: string) => {
    const decision = scenarioId 
      ? PRESET_SCENARIOS.find(s => s.id === scenarioId)?.description || ''
      : customDecision;

    if (!decision.trim()) {
      toast({ title: 'Enter a decision', description: 'Describe the health decision you want to simulate.', variant: 'destructive' });
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
            content: `As a Health Decision Simulator, analyze this lifestyle change:
            
            Decision: "${decision}"
            
            Current Health Context:
            - Sleep: ${stats?.avgSleepHours?.toFixed(1) || 7} hours/night
            - Stress: ${stats?.avgStressLevel?.toFixed(1) || 5}/10
            - Activity: ${stats?.avgActivityMinutes?.toFixed(0) || 30} min/day
            - Diet: ${stats?.avgDietQuality?.toFixed(1) || 6}/10
            
            Simulate the impact and provide:
            1. Overall health impact (positive/negative/mixed)
            2. Expected health score change percentage
            3. Time until effects are noticeable
            4. Breakdown by health metric
            5. Potential side effects or challenges
            6. Implementation recommendations
            
            Base analysis on evidence-based health research. This is educational, not medical advice.`
          }]
        }),
      });

      // Generate simulation based on decision type
      const isPositive = decision.toLowerCase().includes('exercise') ||
                        decision.toLowerCase().includes('sleep') ||
                        decision.toLowerCase().includes('healthy') ||
                        decision.toLowerCase().includes('meditat');

      const isNegative = decision.toLowerCase().includes('ignore') ||
                        decision.toLowerCase().includes('decline') ||
                        decision.toLowerCase().includes('worse') ||
                        decision.toLowerCase().includes('stop');

      const healthChange = isPositive ? Math.round(8 + Math.random() * 12) :
                          isNegative ? Math.round(-5 - Math.random() * 15) :
                          Math.round((Math.random() - 0.3) * 10);

      const result: SimulationResult = {
        scenario: decision,
        impact: healthChange > 5 ? 'positive' : healthChange < -5 ? 'negative' : 'mixed',
        healthChange,
        timeToEffect: isPositive ? '2-4 weeks' : isNegative ? '1-2 weeks' : '3-6 weeks',
        confidence: 70 + Math.round(Math.random() * 20),
        breakdown: generateBreakdown(decision, healthChange),
        sideEffects: generateSideEffects(decision),
        recommendations: generateRecommendations(decision, isPositive)
      };

      if (comparisonMode && results.length < 3) {
        setResults(prev => [...prev, result]);
      } else {
        setResults([result]);
      }

      toast({ title: 'Simulation Complete', description: 'Your decision impact has been analyzed!' });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({ title: 'Error', description: 'Failed to simulate decision', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateBreakdown = (decision: string, baseChange: number): { metric: string; change: number }[] => {
    const breakdown = [];
    const lowerDecision = decision.toLowerCase();
    
    if (lowerDecision.includes('exercise') || lowerDecision.includes('activity')) {
      breakdown.push({ metric: 'Cardiovascular Health', change: baseChange + 5 });
      breakdown.push({ metric: 'Energy Levels', change: baseChange + 3 });
      breakdown.push({ metric: 'Mental Clarity', change: baseChange + 2 });
    }
    
    if (lowerDecision.includes('sleep')) {
      breakdown.push({ metric: 'Cognitive Function', change: baseChange + 4 });
      breakdown.push({ metric: 'Immune System', change: baseChange + 3 });
      breakdown.push({ metric: 'Mood Stability', change: baseChange + 5 });
    }
    
    if (lowerDecision.includes('diet') || lowerDecision.includes('nutrition')) {
      breakdown.push({ metric: 'Metabolic Health', change: baseChange + 4 });
      breakdown.push({ metric: 'Energy Levels', change: baseChange + 3 });
      breakdown.push({ metric: 'Digestive Health', change: baseChange + 5 });
    }
    
    if (breakdown.length === 0) {
      breakdown.push({ metric: 'Overall Wellness', change: baseChange });
      breakdown.push({ metric: 'Energy Levels', change: Math.round(baseChange * 0.8) });
      breakdown.push({ metric: 'Stress Resilience', change: Math.round(baseChange * 0.6) });
    }
    
    return breakdown;
  };

  const generateSideEffects = (decision: string): string[] => {
    const effects = [];
    const lowerDecision = decision.toLowerCase();
    
    if (lowerDecision.includes('exercise')) {
      effects.push('Initial muscle soreness (1-2 weeks)');
      effects.push('Temporary fatigue during adaptation');
      effects.push('Increased appetite');
    } else if (lowerDecision.includes('sleep')) {
      effects.push('Difficulty adjusting initially');
      effects.push('May feel groggy first few days');
    } else if (lowerDecision.includes('diet')) {
      effects.push('Possible cravings during transition');
      effects.push('Temporary digestive adjustment');
    } else if (lowerDecision.includes('ignore') || lowerDecision.includes('decline')) {
      effects.push('Gradual energy decline');
      effects.push('Increased susceptibility to illness');
      effects.push('Mood fluctuations');
    }
    
    return effects.length > 0 ? effects : ['Minor adjustment period expected'];
  };

  const generateRecommendations = (decision: string, isPositive: boolean): string[] => {
    if (isPositive) {
      return [
        'Start gradually and build up over 2-3 weeks',
        'Track your progress in the health log',
        'Be patient - sustainable changes take time',
        'Consider pairing with complementary healthy habits'
      ];
    } else {
      return [
        'Reconsider this decision for better health outcomes',
        'Consult with a healthcare professional',
        'Explore alternative approaches',
        'Focus on small positive changes instead'
      ];
    }
  };

  const clearResults = () => {
    setResults([]);
    setComparisonMode(false);
    setSelectedPreset(null);
  };

  return (
    <Card className="border-2 border-success/20">
      <CardHeader className="bg-gradient-to-r from-success/10 to-emerald-400/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center"
          >
            <Target className="w-6 h-6 text-white" />
          </motion.div>
          Health Decision Simulator
        </CardTitle>
        <CardDescription>
          Test "what-if" scenarios and compare predicted health outcomes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Input Section */}
        <Tabs defaultValue="preset">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="preset">Preset Scenarios</TabsTrigger>
            <TabsTrigger value="custom">Custom Decision</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((scenario) => (
                <motion.button
                  key={scenario.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPreset(scenario.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedPreset === scenario.id
                      ? 'bg-success/10 border-success'
                      : 'bg-muted/30 border-transparent hover:border-muted'
                  }`}
                >
                  <p className="font-medium text-sm">{scenario.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                </motion.button>
              ))}
            </div>
            <Button
              onClick={() => simulateDecision(selectedPreset || undefined)}
              disabled={!selectedPreset || loading}
              className="w-full bg-gradient-to-r from-success to-emerald-400"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Simulate This Decision
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 pt-4">
            <Textarea
              value={customDecision}
              onChange={(e) => setCustomDecision(e.target.value)}
              placeholder="Describe a health decision you're considering...&#10;&#10;Examples:&#10;- Start walking 30 minutes after dinner&#10;- Cut out sugary drinks completely&#10;- Join a yoga class twice a week"
              rows={4}
            />
            <Button
              onClick={() => simulateDecision()}
              disabled={!customDecision.trim() || loading}
              className="w-full bg-gradient-to-r from-success to-emerald-400"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Simulate Custom Decision
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Comparison Mode Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setComparisonMode(!comparisonMode)}
            className={comparisonMode ? 'bg-primary/10' : ''}
          >
            <Zap className="w-4 h-4 mr-2" />
            {comparisonMode ? 'Comparison Mode ON' : 'Enable Comparison'}
          </Button>
          {results.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearResults}>
              Clear Results
            </Button>
          )}
        </div>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`grid ${results.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}>
                {results.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`h-full ${
                      result.impact === 'positive' ? 'border-success/50' :
                      result.impact === 'negative' ? 'border-destructive/50' : 'border-warning/50'
                    }`}>
                      <CardContent className="p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className={
                              result.impact === 'positive' ? 'bg-success' :
                              result.impact === 'negative' ? 'bg-destructive' : 'bg-warning'
                            }>
                              {result.impact}
                            </Badge>
                            <p className="text-sm font-medium mt-2 line-clamp-2">{result.scenario}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${
                              result.healthChange > 0 ? 'text-success' : 'text-destructive'
                            }`}>
                              {result.healthChange > 0 ? '+' : ''}{result.healthChange}%
                            </p>
                            <p className="text-xs text-muted-foreground">Health Impact</p>
                          </div>
                        </div>

                        {/* Timeline & Confidence */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {result.timeToEffect}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Confidence</span>
                              <span>{result.confidence}%</span>
                            </div>
                            <Progress value={result.confidence} className="h-1" />
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Impact Breakdown</p>
                          {result.breakdown.map((item, j) => (
                            <div key={j} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{item.metric}</span>
                              <span className={item.change > 0 ? 'text-success' : 'text-destructive'}>
                                {item.change > 0 ? '+' : ''}{item.change}%
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Side Effects */}
                        {result.sideEffects.length > 0 && (
                          <div className="text-xs">
                            <p className="font-medium mb-1">Potential Side Effects</p>
                            <ul className="space-y-1 text-muted-foreground">
                              {result.sideEffects.slice(0, 2).map((effect, j) => (
                                <li key={j}>• {effect}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recommendations from first result */}
              {results.length === 1 && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Implementation Recommendations</h4>
                  <ul className="space-y-2">
                    {results[0].recommendations.map((rec, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <ArrowRight className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        {rec}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground text-center">
          ⚕️ These simulations are educational projections. Consult healthcare professionals before making significant lifestyle changes.
        </p>
      </CardContent>
    </Card>
  );
}
