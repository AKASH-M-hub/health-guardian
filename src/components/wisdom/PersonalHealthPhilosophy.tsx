import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Brain, Heart, Lightbulb, Zap, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const PERSONAS = [
  { id: 'calm', name: 'Calm Guide', icon: Heart, description: 'Gentle, reassuring communication', color: 'bg-mint-dark' },
  { id: 'strict', name: 'Strict Coach', icon: Zap, description: 'Direct, no-nonsense guidance', color: 'bg-coral' },
  { id: 'scientific', name: 'Scientific Advisor', icon: Brain, description: 'Data-driven explanations', color: 'bg-primary' },
  { id: 'friendly', name: 'Friendly Buddy', icon: Smile, description: 'Casual, supportive tone', color: 'bg-lavender-dark' }
];

export function PersonalHealthPhilosophy() {
  const [selectedPersona, setSelectedPersona] = useState('calm');
  const [preferences, setPreferences] = useState({
    detailLevel: 'moderate',
    notificationFrequency: 'balanced'
  });

  const currentPersona = PERSONAS.find(p => p.id === selectedPersona);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="w-5 h-5 text-lavender-dark" />
          Personal Health Philosophy
        </CardTitle>
        <CardDescription className="text-xs">
          Customize how AI communicates with you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {PERSONAS.map(persona => (
            <motion.div
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPersona === persona.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPersona(persona.id)}
            >
              <div className={`w-8 h-8 rounded-lg ${persona.color} flex items-center justify-center mb-2`}>
                <persona.icon className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-medium">{persona.name}</h4>
              <p className="text-[10px] text-muted-foreground">{persona.description}</p>
            </motion.div>
          ))}
        </div>

        {currentPersona && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <currentPersona.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Active: {currentPersona.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All AI communications will now use a {currentPersona.description.toLowerCase()} style
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium">Detail Level</label>
          <Select value={preferences.detailLevel} onValueChange={(v) => setPreferences(p => ({ ...p, detailLevel: v }))}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal - Key points only</SelectItem>
              <SelectItem value="moderate">Moderate - Balanced detail</SelectItem>
              <SelectItem value="detailed">Detailed - Full explanations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
