import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Lightbulb, Heart, Shield, Clock, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface WisdomEngineProps {
  userStress?: number;
  userEngagement?: number;
  trustLevel?: number;
}

export function HealthWisdomEngine({ userStress = 45, userEngagement = 72, trustLevel = 80 }: WisdomEngineProps) {
  const [mode, setMode] = useState<'full' | 'minimal' | 'silent'>('full');
  const [insight, setInsight] = useState<string>('');

  useEffect(() => {
    // Wisdom logic: Determine communication mode based on user state
    if (userStress > 70 || userEngagement < 30) {
      setMode('minimal');
      setInsight('Focus on one thing: Get 7+ hours of sleep tonight.');
    } else if (userStress > 85) {
      setMode('silent');
      setInsight('');
    } else {
      setMode('full');
      setInsight('Your health trajectory is positive. Consider adding a 10-minute walk to maintain momentum.');
    }
  }, [userStress, userEngagement]);

  return (
    <Card className="border-primary/20 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary via-coral to-lavender-dark" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-primary" />
          Health Wisdom Engine
        </CardTitle>
        <CardDescription className="text-xs">
          Adaptive intelligence that knows when to speak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded">
            <div className="text-lg font-bold">{userStress}%</div>
            <p className="text-[10px] text-muted-foreground">Stress Level</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="text-lg font-bold">{userEngagement}%</div>
            <p className="text-[10px] text-muted-foreground">Engagement</p>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="text-lg font-bold">{trustLevel}%</div>
            <p className="text-[10px] text-muted-foreground">Trust</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
          <span className="text-sm">AI Communication Mode</span>
          <Badge variant={mode === 'silent' ? 'secondary' : mode === 'minimal' ? 'outline' : 'default'}>
            {mode === 'silent' && <VolumeX className="w-3 h-3 mr-1" />}
            {mode === 'minimal' && <Clock className="w-3 h-3 mr-1" />}
            {mode === 'full' && <Volume2 className="w-3 h-3 mr-1" />}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Badge>
        </div>

        {mode !== 'silent' && insight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-sm">{insight}</p>
            </div>
          </motion.div>
        )}

        <p className="text-[10px] text-muted-foreground text-center">
          Wisdom adapts based on your emotional and cognitive state
        </p>
      </CardContent>
    </Card>
  );
}
