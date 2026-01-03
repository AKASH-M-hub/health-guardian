import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, BellOff, Bell, AlertTriangle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  stats: any;
}

export function RiskCoolDown({ stats }: Props) {
  const [coolDownActive, setCoolDownActive] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'normal' | 'reduced' | 'minimal'>('normal');

  const overwhelmDetection = useMemo(() => {
    if (!stats) return null;

    const stressScore = stats.avgStressLevel || 5;
    const sleepScore = 10 - (stats.avgSleepQuality || 5);
    const overwhelmScore = (stressScore * 0.6 + sleepScore * 0.4);

    return {
      score: Math.round(overwhelmScore * 10),
      isOverwhelmed: overwhelmScore > 6,
      level: overwhelmScore > 7 ? 'high' : overwhelmScore > 5 ? 'moderate' : 'low',
      factors: [
        stressScore > 6 && 'High stress levels detected',
        stats.avgSleepQuality < 5 && 'Poor sleep quality',
        stats.avgMood < 5 && 'Low mood patterns',
      ].filter(Boolean),
    };
  }, [stats]);

  const alertLevels = [
    { 
      id: 'normal', 
      label: 'Normal', 
      description: 'All health alerts active',
      icon: Bell,
      color: 'bg-primary'
    },
    { 
      id: 'reduced', 
      label: 'Reduced', 
      description: 'Only critical alerts shown',
      icon: BellOff,
      color: 'bg-warning'
    },
    { 
      id: 'minimal', 
      label: 'Minimal', 
      description: 'Essential only, calm mode',
      icon: Heart,
      color: 'bg-success'
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-mint/20 to-success/10">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-mint-dark" />
          Risk Cool-Down Intelligence
        </CardTitle>
        <CardDescription>
          Detects overwhelm and adjusts alert frequency for your wellbeing
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {overwhelmDetection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              overwhelmDetection.isOverwhelmed 
                ? 'bg-warning/10 border-warning/30' 
                : 'bg-success/5 border-success/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {overwhelmDetection.isOverwhelmed ? (
                  <AlertTriangle className="w-5 h-5 text-warning" />
                ) : (
                  <Heart className="w-5 h-5 text-success" />
                )}
                <span className="font-medium">Overwhelm Detection</span>
              </div>
              <Badge variant={overwhelmDetection.isOverwhelmed ? 'destructive' : 'default'}>
                {overwhelmDetection.level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {overwhelmDetection.isOverwhelmed 
                ? "You may be experiencing information overload. Consider activating cool-down mode."
                : "Your stress levels appear manageable. Keep up the good work!"}
            </p>
            {overwhelmDetection.factors.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {overwhelmDetection.factors.map((f, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Cool-Down Mode</p>
              <p className="text-xs text-muted-foreground">Reduce alert frequency</p>
            </div>
          </div>
          <Switch
            checked={coolDownActive}
            onCheckedChange={setCoolDownActive}
          />
        </div>

        {coolDownActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <p className="text-sm font-medium">Select Alert Level</p>
            <div className="grid gap-2">
              {alertLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={alertLevel === level.id ? 'default' : 'outline'}
                  className="justify-start h-auto py-3"
                  onClick={() => setAlertLevel(level.id as any)}
                >
                  <level.icon className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">{level.label}</p>
                    <p className="text-xs opacity-70">{level.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="p-3 bg-primary/5 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            💡 Your mental health matters. It's okay to take breaks from health alerts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
