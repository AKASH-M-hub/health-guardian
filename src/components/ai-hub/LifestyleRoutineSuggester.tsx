import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sun, Moon, Coffee, Dumbbell, Utensils, 
  Droplets, Brain, Heart, Clock, CheckCircle, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface RoutineActivity {
  time: string;
  activity: string;
  icon: React.ElementType;
  benefit: string;
  priority: 'essential' | 'recommended' | 'optional';
}

export function LifestyleRoutineSuggester() {
  const { stats } = useHealthData();
  const [activeTab, setActiveTab] = useState('morning');

  const generateRoutine = (): Record<string, RoutineActivity[]> => {
    const sleepIssue = (stats?.avgSleepHours ?? 7) < 7;
    const stressIssue = (stats?.avgStressLevel ?? 5) > 6;
    const activityIssue = (stats?.avgActivityMinutes ?? 30) < 30;
    const dietIssue = (stats?.avgDietQuality ?? 7) < 6;

    return {
      morning: [
        { 
          time: '6:00 AM', 
          activity: 'Wake up & hydrate with lemon water', 
          icon: Droplets, 
          benefit: 'Boosts metabolism and hydration',
          priority: 'essential'
        },
        { 
          time: '6:15 AM', 
          activity: '10-minute meditation or deep breathing', 
          icon: Brain, 
          benefit: stressIssue ? 'Critical for stress management' : 'Mental clarity boost',
          priority: stressIssue ? 'essential' : 'recommended'
        },
        { 
          time: '6:30 AM', 
          activity: activityIssue ? '20-min exercise (walk/yoga/workout)' : '15-min stretching', 
          icon: Dumbbell, 
          benefit: activityIssue ? 'Essential for daily activity goal' : 'Maintains flexibility',
          priority: activityIssue ? 'essential' : 'recommended'
        },
        { 
          time: '7:00 AM', 
          activity: 'Nutritious breakfast with protein', 
          icon: Utensils, 
          benefit: dietIssue ? 'Critical for improving diet quality' : 'Sustained energy',
          priority: dietIssue ? 'essential' : 'recommended'
        },
        { 
          time: '7:30 AM', 
          activity: 'Sunlight exposure (15 min)', 
          icon: Sun, 
          benefit: sleepIssue ? 'Helps regulate sleep cycle' : 'Vitamin D boost',
          priority: sleepIssue ? 'essential' : 'optional'
        }
      ],
      afternoon: [
        { 
          time: '12:00 PM', 
          activity: 'Balanced lunch with vegetables', 
          icon: Utensils, 
          benefit: 'Sustained afternoon energy',
          priority: 'essential'
        },
        { 
          time: '12:30 PM', 
          activity: '10-minute post-lunch walk', 
          icon: Heart, 
          benefit: 'Aids digestion and prevents energy slump',
          priority: activityIssue ? 'essential' : 'recommended'
        },
        { 
          time: '2:00 PM', 
          activity: 'Hydration check (500ml water)', 
          icon: Droplets, 
          benefit: 'Maintains focus and energy',
          priority: 'recommended'
        },
        { 
          time: '3:00 PM', 
          activity: stressIssue ? '5-min breathing break' : 'Healthy snack break', 
          icon: stressIssue ? Brain : Coffee, 
          benefit: stressIssue ? 'Stress relief checkpoint' : 'Prevents energy crash',
          priority: stressIssue ? 'essential' : 'optional'
        },
        { 
          time: '5:00 PM', 
          activity: 'End-of-work mindfulness moment', 
          icon: Brain, 
          benefit: 'Transition from work to personal time',
          priority: 'optional'
        }
      ],
      evening: [
        { 
          time: '6:00 PM', 
          activity: activityIssue ? '30-min exercise session' : '20-min light activity', 
          icon: Dumbbell, 
          benefit: activityIssue ? 'Completes daily exercise goal' : 'Evening energy release',
          priority: activityIssue ? 'essential' : 'recommended'
        },
        { 
          time: '7:00 PM', 
          activity: 'Light, nutritious dinner', 
          icon: Utensils, 
          benefit: 'Easy digestion for better sleep',
          priority: 'essential'
        },
        { 
          time: '8:00 PM', 
          activity: 'Screen time reduction begins', 
          icon: Moon, 
          benefit: sleepIssue ? 'Critical for sleep improvement' : 'Better sleep quality',
          priority: sleepIssue ? 'essential' : 'recommended'
        },
        { 
          time: '9:00 PM', 
          activity: 'Relaxation activity (reading, stretching)', 
          icon: Heart, 
          benefit: 'Wind-down routine for better rest',
          priority: stressIssue || sleepIssue ? 'essential' : 'recommended'
        },
        { 
          time: sleepIssue ? '9:30 PM' : '10:00 PM', 
          activity: 'Prepare for sleep', 
          icon: Moon, 
          benefit: sleepIssue ? 'Earlier bedtime for 7+ hours sleep' : 'Consistent sleep schedule',
          priority: 'essential'
        }
      ]
    };
  };

  const routine = generateRoutine();

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'essential': return 'bg-primary/20 text-primary border-primary/30';
      case 'recommended': return 'bg-success/20 text-success border-success/30';
      case 'optional': return 'bg-muted text-muted-foreground border-muted';
      default: return '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-warning" />
          Personalized Daily Routine
        </CardTitle>
        <CardDescription>
          AI-suggested routine based on your health data and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="morning" className="gap-1">
              <Sun className="w-3 h-3" /> Morning
            </TabsTrigger>
            <TabsTrigger value="afternoon" className="gap-1">
              <Coffee className="w-3 h-3" /> Afternoon
            </TabsTrigger>
            <TabsTrigger value="evening" className="gap-1">
              <Moon className="w-3 h-3" /> Evening
            </TabsTrigger>
          </TabsList>

          {Object.entries(routine).map(([period, activities]) => (
            <TabsContent key={period} value={period} className="space-y-3">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getPriorityStyle(activity.priority)}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full bg-background">
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium">{activity.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{activity.activity}</p>
                      {activity.priority === 'essential' && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                          <CheckCircle className="w-2 h-2 mr-0.5" />
                          Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.benefit}</p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex flex-wrap gap-2 justify-center pt-4 border-t mt-4">
          <Badge variant="outline" className="bg-primary/20 text-primary">Essential</Badge>
          <Badge variant="outline" className="bg-success/20 text-success">Recommended</Badge>
          <Badge variant="outline" className="bg-muted text-muted-foreground">Optional</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
