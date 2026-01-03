import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  stats: any;
}

export function ELI5Explainer({ stats }: Props) {
  const [explanation, setExplanation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);

  const topics = [
    { id: 'risk', label: 'Health Risk Score', icon: '❤️' },
    { id: 'sleep', label: 'Sleep Impact', icon: '😴' },
    { id: 'stress', label: 'Stress Effects', icon: '😰' },
    { id: 'diet', label: 'Diet & Health', icon: '🥗' },
    { id: 'activity', label: 'Exercise Benefits', icon: '🏃' },
  ];

  const explanations: Record<string, any> = {
    risk: {
      simple: stats?.avgMood >= 7 ? 
        "Your body is like a happy plant that's getting enough water and sunshine! 🌱" :
        stats?.avgMood >= 5 ?
        "Your body is doing okay, but it would love a bit more rest and good food - like a puppy that needs more playtime! 🐕" :
        "Your body is sending little signals that it needs more TLC - like a phone that needs to charge! 🔋",
      analogy: "Think of your health score like a video game health bar. The more good habits you have, the fuller the bar stays!",
      action: stats?.avgStressLevel > 6 ? 
        "Try taking 5 slow, deep breaths - like blowing up a big balloon really slowly! 🎈" :
        "Keep doing what you're doing, and maybe add one fun activity you enjoy! 🎮"
    },
    sleep: {
      simple: stats?.avgSleepHours >= 7 ?
        "You're sleeping like a champion! Your brain is getting time to organize all its thoughts, like cleaning up a messy room! 🧹" :
        "Your brain is like a phone that's not fully charging at night. It needs more sleep hours to work its best! 📱",
      analogy: "Sleep is like putting your body in 'repair mode' - it's when all the tiny helpers in your body fix things and clean up!",
      action: "Try going to bed at the same time each night - your body loves routines, just like having breakfast at the same time! ⏰"
    },
    stress: {
      simple: stats?.avgStressLevel <= 5 ?
        "You're handling stress like a duck in water - it slides right off! 🦆" :
        "Your stress level is like carrying too many bags at once - it's making everything harder! 🎒",
      analogy: "Stress is like a balloon. A little air is fine, but too much and it might pop! We need to let some air out regularly.",
      action: "When you feel stressed, try the 5-4-3-2-1 game: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste! 🔢"
    },
    diet: {
      simple: stats?.avgDietQuality >= 7 ?
        "You're feeding your body like a race car - premium fuel only! 🏎️" :
        "Your body is asking for more colorful foods - like painting a rainbow on your plate! 🌈",
      analogy: "Food is like building blocks for your body. Good food = strong blocks. Junk food = wobbly blocks!",
      action: "Try adding one extra vegetable or fruit to each meal - think of it as giving your body a little present! 🎁"
    },
    activity: {
      simple: stats?.avgActivityMinutes >= 30 ?
        "You're moving and grooving! Your body loves all that action! 💃" :
        "Your body misses moving around - it's like a car that needs to be driven or the engine gets rusty! 🚗",
      analogy: "Exercise is like taking your body for a walk - just like a dog, it gets happier and healthier with regular walks!",
      action: "Start with just 10 minutes of dancing to your favorite song - your body will thank you! 🎵"
    }
  };

  const getExplanation = (topicId: string) => {
    setIsLoading(true);
    setTopic(topicId);
    
    setTimeout(() => {
      setExplanation(explanations[topicId]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-mint/20 to-success/10">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-mint-dark" />
          AI Health Explainer (ELI5 Mode)
        </CardTitle>
        <CardDescription>
          Complex health concepts explained in simple, friendly language
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <Button
              key={t.id}
              variant={topic === t.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => getExplanation(t.id)}
              disabled={isLoading || !stats}
              className="text-sm"
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          ) : explanation ? (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <Badge>Simple Explanation</Badge>
                </div>
                <p className="text-sm leading-relaxed">{explanation.simple}</p>
              </div>

              <div className="p-4 bg-mint/10 rounded-xl border border-mint-dark/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <Badge variant="secondary">Fun Analogy</Badge>
                </div>
                <p className="text-sm leading-relaxed">{explanation.analogy}</p>
              </div>

              <div className="p-4 bg-coral/5 rounded-xl border border-coral/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <Badge variant="outline">Try This!</Badge>
                </div>
                <p className="text-sm leading-relaxed">{explanation.action}</p>
              </div>

              <Button variant="ghost" size="sm" className="w-full" disabled>
                <Volume2 className="w-4 h-4 mr-2" />
                Listen to explanation (coming soon)
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a topic to get a simple explanation</p>
              {!stats && <p className="text-xs mt-2">Log health data first for personalized explanations</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
