import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function MentorPersonalitySelector() {
  const [selectedPersonality, setSelectedPersonality] = useState<string>('friendly');
  const [saved, setSaved] = useState(false);

  const personalities = [
    {
      id: 'calm',
      name: 'Calm & Supportive',
      emoji: '🧘',
      description: 'Gentle encouragement, peaceful tone',
      sample: '"Take your time. Every small step counts toward your wellbeing."',
      traits: ['Soothing', 'Patient', 'Understanding']
    },
    {
      id: 'strict',
      name: 'Direct & Honest',
      emoji: '📋',
      description: 'Straightforward feedback, clear expectations',
      sample: '"Your sleep is below target. Here\'s exactly what needs to change."',
      traits: ['Clear', 'Structured', 'Goal-focused']
    },
    {
      id: 'motivational',
      name: 'Motivational Coach',
      emoji: '🔥',
      description: 'High energy, inspiring messages',
      sample: '"You\'ve got this! Your health journey is building momentum!"',
      traits: ['Energetic', 'Inspiring', 'Celebratory']
    },
    {
      id: 'friendly',
      name: 'Friendly Companion',
      emoji: '😊',
      description: 'Warm, conversational, like a friend',
      sample: '"Hey! Your stress is a bit high today. Want to chat about it?"',
      traits: ['Warm', 'Casual', 'Empathetic']
    },
    {
      id: 'scientific',
      name: 'Scientific Advisor',
      emoji: '🔬',
      description: 'Data-driven, research-backed insights',
      sample: '"Studies show 7+ hours of sleep improves cognitive function by 23%."',
      traits: ['Analytical', 'Evidence-based', 'Detailed']
    }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-coral/10">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          AI Health Mentor Personality
        </CardTitle>
        <CardDescription>
          Choose how your AI health assistant communicates with you
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <RadioGroup value={selectedPersonality} onValueChange={setSelectedPersonality}>
          <div className="space-y-3">
            {personalities.map((personality, i) => (
              <motion.div
                key={personality.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Label
                  htmlFor={personality.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPersonality === personality.id
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-muted/30 border-transparent hover:border-primary/20'
                  }`}
                >
                  <RadioGroupItem value={personality.id} id={personality.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{personality.emoji}</span>
                      <span className="font-medium">{personality.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{personality.description}</p>
                    <p className="text-sm italic text-muted-foreground bg-background/50 p-2 rounded">
                      {personality.sample}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {personality.traits.map((trait, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Label>
              </motion.div>
            ))}
          </div>
        </RadioGroup>

        <Button onClick={handleSave} className="w-full">
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Save Preference
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your AI mentor will adapt its communication style based on your preference
        </p>
      </CardContent>
    </Card>
  );
}
