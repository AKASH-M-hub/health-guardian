import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Brain, Heart, Activity, Clock, Battery, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import { toast } from '@/hooks/use-toast';

interface BurnoutIndicator {
  name: string;
  value: number;
  threshold: number;
  trend: 'improving' | 'stable' | 'declining';
  icon: any;
  description: string;
}

interface BurnoutAnalysis {
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  indicators: BurnoutIndicator[];
  recommendations: string[];
  recoveryActions: { action: string; priority: 'high' | 'medium' | 'low'; timeframe: string }[];
  daysToRecovery: number;
}

export function BurnoutWarning() {
  const { stats, entries } = useHealthData();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BurnoutAnalysis | null>(null);

  const analyzeForBurnout = async () => {
    setLoading(true);
    try {
      // Calculate burnout indicators from health data
      const recentEntries = entries.slice(-14); // Last 2 weeks
      
      // Calculate trends
      const avgStress = stats?.avgStressLevel || 5;
      const avgSleep = stats?.avgSleepHours || 7;
      const avgMood = stats?.avgMood || 5;
      const avgActivity = stats?.avgActivityMinutes || 30;

      // Cognitive load based on stress and sleep deprivation
      const cognitiveLoad = Math.min(100, (avgStress * 8) + (8 - avgSleep) * 5);
      
      // Emotional drain based on mood and stress
      const emotionalDrain = Math.min(100, (10 - avgMood) * 8 + avgStress * 3);
      
      // Physical fatigue based on sleep and activity
      const physicalFatigue = Math.min(100, (8 - avgSleep) * 10 + Math.max(0, 60 - avgActivity) * 0.5);
      
      // Sleep debt accumulation
      const sleepDebt = Math.max(0, (7 - avgSleep) * 14); // 2 weeks of deficit
      
      // Recovery capacity
      const recoveryCapacity = Math.max(0, 100 - (cognitiveLoad * 0.3 + physicalFatigue * 0.4 + emotionalDrain * 0.3));

      const indicators: BurnoutIndicator[] = [
        {
          name: 'Cognitive Load',
          value: cognitiveLoad,
          threshold: 75,
          trend: cognitiveLoad > 60 ? 'declining' : 'stable',
          icon: Brain,
          description: 'Mental processing capacity and decision fatigue'
        },
        {
          name: 'Emotional Drain',
          value: emotionalDrain,
          threshold: 70,
          trend: emotionalDrain > 50 ? 'declining' : 'stable',
          icon: Heart,
          description: 'Emotional resilience and mood stability'
        },
        {
          name: 'Physical Fatigue',
          value: physicalFatigue,
          threshold: 65,
          trend: physicalFatigue > 40 ? 'declining' : 'stable',
          icon: Activity,
          description: 'Body energy levels and physical stamina'
        },
        {
          name: 'Sleep Debt',
          value: Math.min(100, sleepDebt * 2),
          threshold: 60,
          trend: sleepDebt > 7 ? 'declining' : 'improving',
          icon: Clock,
          description: 'Accumulated sleep deficit over time'
        },
        {
          name: 'Recovery Capacity',
          value: recoveryCapacity,
          threshold: 40, // Below threshold is concerning
          trend: recoveryCapacity < 50 ? 'declining' : 'stable',
          icon: Battery,
          description: 'Ability to bounce back from stress'
        }
      ];

      // Calculate overall burnout risk
      const warningCount = indicators.filter(i => 
        i.name === 'Recovery Capacity' ? i.value < i.threshold : i.value >= i.threshold
      ).length;
      
      const overallRisk = Math.min(100, 
        (cognitiveLoad * 0.25 + emotionalDrain * 0.25 + physicalFatigue * 0.2 + sleepDebt * 0.15 + (100 - recoveryCapacity) * 0.15)
      );

      let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
      if (overallRisk >= 80) riskLevel = 'critical';
      else if (overallRisk >= 60) riskLevel = 'high';
      else if (overallRisk >= 40) riskLevel = 'moderate';

      const recommendations = generateRecommendations(indicators, riskLevel);
      const recoveryActions = generateRecoveryActions(indicators, riskLevel);
      const daysToRecovery = Math.max(3, Math.round(overallRisk / 10));

      setAnalysis({
        overallRisk,
        riskLevel,
        indicators,
        recommendations,
        recoveryActions,
        daysToRecovery
      });

      toast({ 
        title: 'Burnout Analysis Complete', 
        description: `Your burnout risk level is ${riskLevel}.`,
        variant: riskLevel === 'critical' || riskLevel === 'high' ? 'destructive' : 'default'
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: 'Error', description: 'Failed to analyze burnout risk', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (indicators: BurnoutIndicator[], riskLevel: string): string[] => {
    const recs: string[] = [];
    
    const cognitive = indicators.find(i => i.name === 'Cognitive Load');
    const emotional = indicators.find(i => i.name === 'Emotional Drain');
    const physical = indicators.find(i => i.name === 'Physical Fatigue');
    const sleep = indicators.find(i => i.name === 'Sleep Debt');
    
    if (cognitive && cognitive.value >= cognitive.threshold) {
      recs.push('Reduce multitasking and take short mental breaks every 90 minutes');
    }
    if (emotional && emotional.value >= emotional.threshold) {
      recs.push('Practice emotional check-ins and consider talking to someone you trust');
    }
    if (physical && physical.value >= physical.threshold) {
      recs.push('Prioritize rest and consider lighter physical activities like walking');
    }
    if (sleep && sleep.value >= sleep.threshold) {
      recs.push('Go to bed 30 minutes earlier and limit screen time before sleep');
    }
    
    if (riskLevel === 'critical') {
      recs.unshift('⚠️ Consider taking a mental health day or speaking with a professional');
    }
    
    return recs;
  };

  const generateRecoveryActions = (indicators: BurnoutIndicator[], riskLevel: string) => {
    const actions: { action: string; priority: 'high' | 'medium' | 'low'; timeframe: string }[] = [];
    
    if (riskLevel === 'critical' || riskLevel === 'high') {
      actions.push({ action: 'Take a complete rest day within the next 48 hours', priority: 'high', timeframe: '2 days' });
      actions.push({ action: 'Reduce work/commitments by 20% this week', priority: 'high', timeframe: '1 week' });
    }
    
    actions.push({ action: 'Establish a wind-down routine 1 hour before bed', priority: 'medium', timeframe: '1 week' });
    actions.push({ action: 'Schedule 15 minutes of mindfulness or meditation daily', priority: 'medium', timeframe: '2 weeks' });
    actions.push({ action: 'Add one enjoyable activity to your weekly routine', priority: 'low', timeframe: '2 weeks' });
    
    return actions;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'moderate': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-success bg-success/10';
    }
  };

  return (
    <Card className="border-2 border-destructive/20">
      <CardHeader className="bg-gradient-to-r from-destructive/10 to-red-400/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-destructive to-red-400 flex items-center justify-center"
          >
            <AlertTriangle className="w-6 h-6 text-white" />
          </motion.div>
          Burnout & Mental Collapse Early-Warning
        </CardTitle>
        <CardDescription>
          Detect emotional and cognitive overload before it becomes a crisis
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!analysis ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-semibold mb-2">Analyze Your Burnout Risk</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Based on your health data patterns, we'll assess your risk of burnout and provide actionable recovery guidance.
            </p>
            <Button onClick={analyzeForBurnout} disabled={loading} className="bg-gradient-to-r from-destructive to-red-400">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Burnout Analysis
                </>
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Risk */}
            <div className={`p-4 rounded-lg ${getRiskColor(analysis.riskLevel)}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm opacity-80">Burnout Risk Level</p>
                  <p className="text-3xl font-bold capitalize">{analysis.riskLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{Math.round(analysis.overallRisk)}%</p>
                  <p className="text-sm opacity-80">Risk Score</p>
                </div>
              </div>
              <Progress value={analysis.overallRisk} className="h-3" />
              {analysis.riskLevel !== 'low' && (
                <p className="text-sm mt-3">
                  Estimated recovery time: <strong>{analysis.daysToRecovery} days</strong> with proper rest
                </p>
              )}
            </div>

            {/* Indicators */}
            <div className="space-y-4">
              <h4 className="font-semibold">Burnout Indicators</h4>
              {analysis.indicators.map((indicator, i) => {
                const isWarning = indicator.name === 'Recovery Capacity' 
                  ? indicator.value < indicator.threshold 
                  : indicator.value >= indicator.threshold;
                const Icon = indicator.icon;
                
                return (
                  <motion.div
                    key={indicator.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-2 rounded-lg ${isWarning ? 'bg-destructive/20 text-destructive' : 'bg-muted'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{indicator.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {indicator.trend}
                          </Badge>
                          <span className={isWarning ? 'text-destructive font-bold' : ''}>
                            {Math.round(indicator.value)}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={indicator.value}
                        className={`h-2 ${isWarning ? '[&>div]:bg-destructive' : ''}`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
                    </div>
                    {isWarning && <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />}
                  </motion.div>
                );
              })}
            </div>

            {/* Recommendations */}
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-success">
                <Shield className="w-5 h-5" />
                Recovery Recommendations
              </h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-success">✓</span>
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Recovery Actions */}
            <div>
              <h4 className="font-semibold mb-3">Priority Recovery Actions</h4>
              <div className="space-y-2">
                {analysis.recoveryActions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={
                        action.priority === 'high' ? 'bg-destructive' :
                        action.priority === 'medium' ? 'bg-warning' : 'bg-muted'
                      }>
                        {action.priority}
                      </Badge>
                      <span className="text-sm">{action.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{action.timeframe}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button onClick={analyzeForBurnout} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              ⚕️ If you're experiencing severe burnout symptoms, please consult a mental health professional.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
