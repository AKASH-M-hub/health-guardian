import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Calendar as CalendarIcon, Activity, Moon, Utensils, Brain, Heart, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import { format } from 'date-fns';

interface ActivityItem {
  time: string;
  type: 'health_log' | 'chat' | 'scan' | 'simulation' | 'report';
  title: string;
  description: string;
  icon: typeof Activity;
  color: string;
}

export function UserActivityHistory() {
  const { entries } = useHealthData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate activities based on health entries and selected date
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayEntries = entries.filter(e => e.entry_date === dateStr);

    const generatedActivities: ActivityItem[] = [];

    dayEntries.forEach(entry => {
      if (entry.sleep_hours) {
        generatedActivities.push({
          time: '08:00 AM',
          type: 'health_log',
          title: 'Sleep Logged',
          description: `${entry.sleep_hours} hours of sleep recorded`,
          icon: Moon,
          color: 'bg-lavender/20 text-lavender-dark'
        });
      }
      if (entry.physical_activity_minutes) {
        generatedActivities.push({
          time: '10:30 AM',
          type: 'health_log',
          title: 'Activity Logged',
          description: `${entry.physical_activity_minutes} minutes of ${entry.activity_intensity || 'moderate'} activity`,
          icon: Activity,
          color: 'bg-ocean/20 text-ocean'
        });
      }
      if (entry.diet_quality) {
        generatedActivities.push({
          time: '01:00 PM',
          type: 'health_log',
          title: 'Diet Quality Recorded',
          description: `Diet quality rated ${entry.diet_quality}/10`,
          icon: Utensils,
          color: 'bg-mint/20 text-mint-dark'
        });
      }
      if (entry.stress_level) {
        generatedActivities.push({
          time: '06:00 PM',
          type: 'health_log',
          title: 'Stress Level Updated',
          description: `Stress level: ${entry.stress_level}/10`,
          icon: Brain,
          color: 'bg-coral/20 text-coral'
        });
      }
      if (entry.mood) {
        generatedActivities.push({
          time: '09:00 PM',
          type: 'health_log',
          title: 'Mood Recorded',
          description: `Mood rating: ${entry.mood}/10`,
          icon: Heart,
          color: 'bg-primary/20 text-primary'
        });
      }
    });

    // Add some simulated activities if no entries exist
    if (generatedActivities.length === 0) {
      generatedActivities.push({
        time: '09:00 AM',
        type: 'simulation',
        title: 'No Activity Recorded',
        description: 'Log your health data to see your activity history',
        icon: Clock,
        color: 'bg-muted text-muted-foreground'
      });
    }

    // Sort by time
    generatedActivities.sort((a, b) => {
      const timeA = new Date(`2000/01/01 ${a.time}`);
      const timeB = new Date(`2000/01/01 ${b.time}`);
      return timeA.getTime() - timeB.getTime();
    });

    setActivities(generatedActivities);
  }, [selectedDate, entries]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'health_log': return 'Health Log';
      case 'chat': return 'AI Chat';
      case 'scan': return 'Health Scan';
      case 'simulation': return 'Simulation';
      case 'report': return 'Report';
      default: return type;
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-ocean/10 to-coral/10">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          Activity History
        </CardTitle>
        <CardDescription>
          View your health activities by date and time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Date Picker */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Selected Date</p>
            <p className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                Change Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Activity Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-ocean to-coral" />

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full ${activity.color} border-2 border-background flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>

                  <div className="bg-muted/20 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(activity.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{activities.filter(a => a.type === 'health_log').length}</p>
            <p className="text-xs text-muted-foreground">Health Logs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-ocean">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-coral">{activities.length}</p>
            <p className="text-xs text-muted-foreground">Activities Today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
