import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Star, Zap, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface PriorityAction {
  id: string;
  action: string;
  category: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  description: string;
  benefits: string[];
}

export function HealthPriorityOptimizer() {
  const { stats, entries } = useHealthData();
  const [priorities, setPriorities] = useState<PriorityAction[]>([]);
  const [topPriority, setTopPriority] = useState<PriorityAction | null>(null);

  useEffect(() => {
    calculatePriorities();
  }, [stats, entries]);

  const calculatePriorities = () => {
    const actions: PriorityAction[] = [];
    
    const sleepScore = stats?.avgSleepHours ? (stats.avgSleepHours / 8) * 100 : 70;
    const stressScore = stats?.avgStressLevel ? 100 - (stats.avgStressLevel * 10) : 60;
    const activityScore = stats?.avgActivityMinutes ? Math.min(100, (stats.avgActivityMinutes / 60) * 100) : 50;
    const dietScore = stats?.avgDietQuality ? stats.avgDietQuality * 10 : 60;
    const moodScore = stats?.avgMood ? stats.avgMood * 10 : 65;

    // Calculate potential improvements
    if (sleepScore < 80) {
      actions.push({
        id: 'sleep',
        action: 'Improve Sleep Quality',
        category: 'Rest & Recovery',
        impact: Math.round((80 - sleepScore) * 0.8),
        effort: sleepScore < 50 ? 'high' : 'medium',
        timeframe: '1-2 weeks',
        description: 'Optimize your sleep schedule for 7-8 hours of quality rest',
        benefits: ['Better energy', 'Improved focus', 'Reduced stress', 'Better mood']
      });
    }

    if (stressScore < 70) {
      actions.push({
        id: 'stress',
        action: 'Reduce Stress Levels',
        category: 'Mental Wellness',
        impact: Math.round((70 - stressScore) * 0.9),
        effort: 'medium',
        timeframe: '2-3 weeks',
        description: 'Implement daily stress management techniques',
        benefits: ['Lower blood pressure', 'Better sleep', 'Improved immunity', 'Mental clarity']
      });
    }

    if (activityScore < 70) {
      actions.push({
        id: 'activity',
        action: 'Increase Physical Activity',
        category: 'Fitness',
        impact: Math.round((70 - activityScore) * 0.85),
        effort: activityScore < 40 ? 'high' : 'low',
        timeframe: '2-4 weeks',
        description: 'Add 30 minutes of moderate exercise daily',
        benefits: ['Weight management', 'Heart health', 'More energy', 'Better mood']
      });
    }

    if (dietScore < 70) {
      actions.push({
        id: 'diet',
        action: 'Improve Nutrition',
        category: 'Diet',
        impact: Math.round((70 - dietScore) * 0.75),
        effort: 'medium',
        timeframe: '3-4 weeks',
        description: 'Focus on balanced meals with more vegetables and whole foods',
        benefits: ['Better digestion', 'More energy', 'Stable weight', 'Clearer skin']
      });
    }

    if (moodScore < 70) {
      actions.push({
        id: 'mood',
        action: 'Boost Mental Wellbeing',
        category: 'Mental Health',
        impact: Math.round((70 - moodScore) * 0.7),
        effort: 'low',
        timeframe: '1-2 weeks',
        description: 'Practice gratitude, connect with loved ones, and engage in hobbies',
        benefits: ['Positive outlook', 'Better relationships', 'Increased resilience']
      });
    }

    // Add default action if everything is good
    if (actions.length === 0) {
      actions.push({
        id: 'maintain',
        action: 'Maintain Current Habits',
        category: 'Wellness',
        impact: 20,
        effort: 'low',
        timeframe: 'Ongoing',
        description: 'Your health metrics are excellent! Focus on consistency.',
        benefits: ['Sustained health', 'Prevention', 'Long-term wellness']
      });
    }

    // Sort by impact score
    actions.sort((a, b) => b.impact - a.impact);
    
    setPriorities(actions);
    setTopPriority(actions[0]);
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-success/20 text-success';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'high': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-violet-500/10 to-indigo-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center"
          >
            <Target className="w-6 h-6 text-white" />
          </motion.div>
          Health Priority Optimizer
        </CardTitle>
        <CardDescription>
          Identifies the most impactful actions for maximum health improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Top Priority Highlight */}
        {topPriority && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-xl p-5 border-2 border-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="font-semibold text-sm text-warning">TOP PRIORITY</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{topPriority.action}</h3>
            <p className="text-sm text-muted-foreground mb-4">{topPriority.description}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">{topPriority.impact}% potential impact</span>
              </div>
              <Badge className={getEffortColor(topPriority.effort)}>
                {topPriority.effort} effort
              </Badge>
              <Badge variant="outline">
                {topPriority.timeframe}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {topPriority.benefits.map((benefit, i) => (
                <Badge key={i} variant="outline" className="bg-background">
                  <CheckCircle className="w-3 h-3 mr-1 text-success" />
                  {benefit}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Other Priorities */}
        {priorities.length > 1 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Other Improvement Opportunities
            </h4>
            
            {priorities.slice(1).map((priority, i) => (
              <motion.div
                key={priority.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/30 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{priority.action}</span>
                    <Badge variant="outline" className="text-xs">{priority.category}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {priority.impact}% impact
                    </span>
                    <Badge className={`${getEffortColor(priority.effort)} text-xs`}>
                      {priority.effort}
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Impact Summary */}
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-success">
            <TrendingUp className="w-4 h-4" />
            Potential Total Improvement
          </h4>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-success">
              +{priorities.reduce((acc, p) => acc + p.impact, 0)}%
            </div>
            <p className="text-sm text-muted-foreground">
              possible health improvement by addressing all priorities
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          ⚕️ Focus on one priority at a time for sustainable improvement.
        </p>
      </CardContent>
    </Card>
  );
}
