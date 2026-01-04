import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, Brain, Activity, Droplets, Wind, Shield,
  AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BodySystemStatus {
  name: string;
  icon: React.ElementType;
  score: number;
  status: 'optimal' | 'good' | 'attention' | 'concern';
  details: string;
}

interface BodyStatusDiagramProps {
  healthData?: {
    sleepHours?: number;
    stressLevel?: number;
    exerciseMinutes?: number;
    dietQuality?: number;
    heartRate?: number;
  };
}

export function BodyStatusDiagram({ healthData }: BodyStatusDiagramProps) {
  const [systems, setSystems] = useState<BodySystemStatus[]>([]);

  useEffect(() => {
    // Calculate system statuses based on health data
    const sleep = healthData?.sleepHours ?? 7;
    const stress = healthData?.stressLevel ?? 5;
    const exercise = healthData?.exerciseMinutes ?? 30;
    const diet = healthData?.dietQuality ?? 7;
    const heartRate = healthData?.heartRate ?? 72;

    const getStatus = (score: number): 'optimal' | 'good' | 'attention' | 'concern' => {
      if (score >= 85) return 'optimal';
      if (score >= 70) return 'good';
      if (score >= 50) return 'attention';
      return 'concern';
    };

    const cardiovascularScore = Math.min(100, 
      (heartRate >= 60 && heartRate <= 100 ? 80 : 50) +
      (exercise >= 30 ? 20 : exercise * 0.67)
    );

    const neurologicalScore = Math.min(100,
      (sleep >= 7 ? 50 : sleep * 7.14) +
      ((10 - stress) * 5)
    );

    const respiratoryScore = Math.min(100,
      70 + (exercise >= 30 ? 30 : exercise)
    );

    const digestiveScore = Math.min(100,
      diet * 10
    );

    const immuneScore = Math.min(100,
      (sleep >= 7 ? 40 : sleep * 5.7) +
      ((10 - stress) * 3) +
      (diet * 3)
    );

    const renalScore = Math.min(100, 75 + (diet >= 7 ? 25 : diet * 3.5));

    setSystems([
      {
        name: 'Cardiovascular',
        icon: Heart,
        score: Math.round(cardiovascularScore),
        status: getStatus(cardiovascularScore),
        details: heartRate >= 60 && heartRate <= 100 
          ? 'Heart rate within normal range' 
          : 'Heart rate needs attention'
      },
      {
        name: 'Neurological',
        icon: Brain,
        score: Math.round(neurologicalScore),
        status: getStatus(neurologicalScore),
        details: sleep >= 7 && stress <= 5 
          ? 'Good sleep and stress management' 
          : 'Consider improving sleep or reducing stress'
      },
      {
        name: 'Respiratory',
        icon: Wind,
        score: Math.round(respiratoryScore),
        status: getStatus(respiratoryScore),
        details: exercise >= 30 
          ? 'Good lung capacity from exercise' 
          : 'Increase cardio activity'
      },
      {
        name: 'Digestive',
        icon: Activity,
        score: Math.round(digestiveScore),
        status: getStatus(digestiveScore),
        details: diet >= 7 
          ? 'Healthy dietary habits' 
          : 'Improve nutritional balance'
      },
      {
        name: 'Immune',
        icon: Shield,
        score: Math.round(immuneScore),
        status: getStatus(immuneScore),
        details: immuneScore >= 70 
          ? 'Immune system functioning well' 
          : 'Support immunity with sleep and nutrition'
      },
      {
        name: 'Renal',
        icon: Droplets,
        score: Math.round(renalScore),
        status: getStatus(renalScore),
        details: 'Kidney function estimated from lifestyle'
      }
    ]);
  }, [healthData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-success bg-success/10';
      case 'good': return 'text-primary bg-primary/10';
      case 'attention': return 'text-warning bg-warning/10';
      case 'concern': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'optimal': return '[&>div]:bg-success';
      case 'good': return '[&>div]:bg-primary';
      case 'attention': return '[&>div]:bg-warning';
      case 'concern': return '[&>div]:bg-destructive';
      default: return '';
    }
  };

  const overallScore = systems.length > 0 
    ? Math.round(systems.reduce((acc, s) => acc + s.score, 0) / systems.length)
    : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Body System Status
        </CardTitle>
        <CardDescription>
          Real-time analysis of your body systems based on health data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle 
                cx="56" cy="56" r="48" 
                stroke="currentColor" 
                strokeWidth="6" 
                fill="none" 
                className="text-muted/20" 
              />
              <motion.circle 
                cx="56" cy="56" r="48" 
                stroke="url(#bodyGradient)" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray={301}
                initial={{ strokeDashoffset: 301 }}
                animate={{ strokeDashoffset: 301 - (301 * overallScore / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--success))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold">{overallScore}%</span>
              <span className="text-[10px] text-muted-foreground">Overall</span>
            </div>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-2 gap-3">
          {systems.map((system, index) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/30 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${getStatusColor(system.status)}`}>
                  <system.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{system.name}</span>
              </div>
              <Progress 
                value={system.score} 
                className={`h-2 mb-2 ${getProgressColor(system.status)}`}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{system.score}%</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusColor(system.status)}`}>
                  {system.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 justify-center pt-2 border-t">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-success" />
            <span className="text-xs">Optimal</span>
          </div>
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-primary" />
            <span className="text-xs">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-xs">Attention</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-destructive" />
            <span className="text-xs">Concern</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
