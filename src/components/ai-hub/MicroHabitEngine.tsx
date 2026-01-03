import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, Clock, CheckCircle, Star, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  stats: any;
  entries: any[];
}

export function MicroHabitEngine({ stats, entries }: Props) {
  const [acceptedHabits, setAcceptedHabits] = useState<string[]>([]);

  const microHabits = useMemo(() => {
    if (!stats) return [];

    const habits: any[] = [];

    // Sleep-related micro-habits
    if (stats.avgSleepHours < 7) {
      habits.push({
        id: 'sleep-1',
        category: 'Sleep',
        habit: 'Set a "wind-down alarm" 30 min before bed',
        duration: '30 sec to set',
        impact: 'Better sleep quality',
        difficulty: 'Easy',
        icon: '🌙'
      });
      habits.push({
        id: 'sleep-2',
        category: 'Sleep',
        habit: 'Place phone across the room at night',
        duration: '5 seconds',
        impact: 'Less screen time, better sleep',
        difficulty: 'Easy',
        icon: '📱'
      });
    }

    // Stress-related micro-habits
    if (stats.avgStressLevel > 5) {
      habits.push({
        id: 'stress-1',
        category: 'Stress',
        habit: 'Take 3 deep breaths before meals',
        duration: '20 seconds',
        impact: 'Reduced stress response',
        difficulty: 'Easy',
        icon: '🧘'
      });
      habits.push({
        id: 'stress-2',
        category: 'Stress',
        habit: 'Write one worry on paper, then crumple it',
        duration: '1 minute',
        impact: 'Mental declutter',
        difficulty: 'Easy',
        icon: '📝'
      });
    }

    // Diet-related micro-habits
    if (stats.avgDietQuality < 7) {
      habits.push({
        id: 'diet-1',
        category: 'Diet',
        habit: 'Drink a glass of water before each meal',
        duration: '1 minute',
        impact: 'Better hydration & portion control',
        difficulty: 'Easy',
        icon: '💧'
      });
      habits.push({
        id: 'diet-2',
        category: 'Diet',
        habit: 'Add one vegetable to your plate',
        duration: '2 minutes',
        impact: 'Better nutrition',
        difficulty: 'Easy',
        icon: '🥕'
      });
    }

    // Activity-related micro-habits
    if (stats.avgActivityMinutes < 30) {
      habits.push({
        id: 'activity-1',
        category: 'Activity',
        habit: 'Walk while on phone calls',
        duration: 'No extra time',
        impact: 'Extra steps daily',
        difficulty: 'Easy',
        icon: '🚶'
      });
      habits.push({
        id: 'activity-2',
        category: 'Activity',
        habit: '5 squats before sitting down',
        duration: '15 seconds',
        impact: 'Muscle activation',
        difficulty: 'Easy',
        icon: '🏋️'
      });
    }

    // General wellness habits
    habits.push({
      id: 'general-1',
      category: 'Wellness',
      habit: 'Stand up and stretch every hour',
      duration: '30 seconds',
      impact: 'Better posture & energy',
      difficulty: 'Easy',
      icon: '🙆'
    });

    habits.push({
      id: 'general-2',
      category: 'Wellness',
      habit: 'Smile at yourself in the mirror',
      duration: '5 seconds',
      impact: 'Mood boost',
      difficulty: 'Easy',
      icon: '😊'
    });

    return habits.slice(0, 6);
  }, [stats]);

  const toggleHabit = (id: string) => {
    setAcceptedHabits(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sleep': return 'bg-lavender text-lavender-dark';
      case 'Stress': return 'bg-coral/20 text-coral';
      case 'Diet': return 'bg-mint text-mint-dark';
      case 'Activity': return 'bg-ocean-light text-ocean-dark';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-warning/10 to-coral/10">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-warning" />
          Micro-Habit Recommendation Engine
        </CardTitle>
        <CardDescription>
          Small, realistic habit changes instead of drastic plans
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {microHabits.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {acceptedHabits.length} of {microHabits.length} habits accepted
              </p>
              <Button variant="ghost" size="sm" onClick={() => setAcceptedHabits([])}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>

            <div className="space-y-3">
              {microHabits.map((habit, i) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    acceptedHabits.includes(habit.id) 
                      ? 'bg-success/5 border-success/30' 
                      : 'bg-muted/30 border-transparent hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={acceptedHabits.includes(habit.id)}
                      onCheckedChange={() => toggleHabit(habit.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{habit.icon}</span>
                        <span className="font-medium text-sm">{habit.habit}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getCategoryColor(habit.category)} variant="secondary">
                          {habit.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {habit.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {habit.impact}
                        </Badge>
                      </div>
                    </div>
                    {acceptedHabits.includes(habit.id) && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {acceptedHabits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-success/10 rounded-xl border border-success/20 text-center"
              >
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium">Great choices!</p>
                <p className="text-xs text-muted-foreground">
                  These tiny habits can lead to big changes over time
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to get personalized micro-habits</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
