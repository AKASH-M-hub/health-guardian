import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Brain, Wind, Bone } from 'lucide-react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface Props {
  stats: any;
  entries: any[];
}

export function OrganStressRadar({ stats, entries }: Props) {
  const organStress = useMemo(() => {
    if (!stats) return null;

    // Calculate probabilistic stress levels based on lifestyle factors
    const sleepScore = stats.avgSleepHours >= 7 ? 20 : stats.avgSleepHours >= 5 ? 50 : 80;
    const stressScore = stats.avgStressLevel * 10;
    const activityScore = stats.avgActivityMinutes >= 30 ? 20 : stats.avgActivityMinutes >= 15 ? 40 : 70;
    const dietScore = (10 - stats.avgDietQuality) * 10;

    return [
      { 
        organ: 'Heart', 
        stress: Math.min(100, (stressScore * 0.4 + sleepScore * 0.3 + activityScore * 0.3)),
        icon: Heart,
        color: 'text-coral',
        factors: ['Stress level', 'Physical activity', 'Sleep quality']
      },
      { 
        organ: 'Brain', 
        stress: Math.min(100, (stressScore * 0.5 + sleepScore * 0.4 + dietScore * 0.1)),
        icon: Brain,
        color: 'text-lavender-dark',
        factors: ['Mental stress', 'Sleep deprivation', 'Mood fluctuations']
      },
      { 
        organ: 'Lungs', 
        stress: Math.min(100, (activityScore * 0.3 + stressScore * 0.3 + 30)),
        icon: Wind,
        color: 'text-ocean',
        factors: ['Activity level', 'Respiratory patterns', 'Stress breathing']
      },
      { 
        organ: 'Muscles', 
        stress: Math.min(100, (activityScore * 0.5 + sleepScore * 0.3 + dietScore * 0.2)),
        icon: Bone,
        color: 'text-mint-dark',
        factors: ['Exercise intensity', 'Recovery time', 'Nutrition']
      },
      { 
        organ: 'Metabolic', 
        stress: Math.min(100, (dietScore * 0.5 + activityScore * 0.3 + sleepScore * 0.2)),
        icon: Activity,
        color: 'text-warning',
        factors: ['Diet quality', 'Activity level', 'Hydration']
      },
    ];
  }, [stats]);

  const chartData = organStress?.map(o => ({
    subject: o.organ,
    stress: o.stress,
    fullMark: 100,
  }));

  const getStressLevel = (stress: number) => {
    if (stress < 30) return { label: 'Low', color: 'bg-success' };
    if (stress < 60) return { label: 'Moderate', color: 'bg-warning' };
    return { label: 'High', color: 'bg-destructive' };
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-coral/10 to-lavender/20">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-coral" />
          Silent Organ Stress Radar
        </CardTitle>
        <CardDescription>
          Probabilistic stress levels on internal organs before symptoms appear
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {organStress ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Radar
                    name="Stress"
                    dataKey="stress"
                    stroke="hsl(var(--coral))"
                    fill="hsl(var(--coral))"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {organStress.map((organ, i) => {
                const level = getStressLevel(organ.stress);
                const IconComponent = organ.icon;
                
                return (
                  <motion.div
                    key={organ.organ}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg bg-muted/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${organ.color}`} />
                        <span className="font-medium text-sm">{organ.organ}</span>
                      </div>
                      <Badge className={level.color}>{level.label}</Badge>
                    </div>
                    <Progress value={organ.stress} className="h-2" />
                    <div className="flex flex-wrap gap-1">
                      {organ.factors.map((f, j) => (
                        <span key={j} className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground italic text-center">
              *Estimated stress levels based on lifestyle patterns. Not a medical diagnosis.
            </p>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to see organ stress analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
