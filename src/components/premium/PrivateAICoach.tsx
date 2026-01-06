import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Sparkles, Heart, Brain, Moon, Activity, Settings, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useHealthData } from '@/hooks/useHealthData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CoachMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
  emotion?: string;
}

interface CoachMemory {
  goals: string[];
  preferences: string[];
  struggles: string[];
  achievements: string[];
}

const COACH_PERSONAS = [
  { id: 'calm', name: 'Calm Coach', emoji: '🧘', style: 'Gentle, mindful, and reassuring' },
  { id: 'strict', name: 'Strict Coach', emoji: '💪', style: 'Direct, disciplined, and goal-focused' },
  { id: 'scientific', name: 'Scientific Coach', emoji: '🔬', style: 'Data-driven, analytical, and evidence-based' },
  { id: 'friendly', name: 'Friendly Coach', emoji: '😊', style: 'Warm, supportive, and encouraging' },
];

export function PrivateAICoach() {
  const { user } = useAuth();
  const { stats, entries } = useHealthData();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState('friendly');
  const [showSettings, setShowSettings] = useState(false);
  const [memory, setMemory] = useState<CoachMemory>({
    goals: [],
    preferences: [],
    struggles: [],
    achievements: []
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial greeting
    const selectedPersona = COACH_PERSONAS.find(p => p.id === persona) || COACH_PERSONAS[3];
    setMessages([{
      id: '1',
      role: 'coach',
      content: `${selectedPersona.emoji} **Hello! I'm your ${selectedPersona.name}.**\n\nI'm here to support your health journey with ${selectedPersona.style.toLowerCase()} guidance. I remember our conversations and adapt to your needs.\n\n**I can help you with:**\n- Setting and tracking health goals\n- Understanding your health patterns\n- Providing personalized wellness advice\n- Emotional support and motivation\n\nWhat would you like to focus on today?`,
      timestamp: new Date()
    }]);
  }, [persona]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('worried')) return 'stressed';
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('excited')) return 'happy';
    if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('fatigue')) return 'tired';
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) return 'sad';
    if (lowerText.includes('frustrated') || lowerText.includes('angry')) return 'frustrated';
    return 'neutral';
  };

  const updateMemory = (userMessage: string, coachResponse: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect goals
    if (lowerMessage.includes('goal') || lowerMessage.includes('want to') || lowerMessage.includes('trying to')) {
      setMemory(prev => ({
        ...prev,
        goals: [...new Set([...prev.goals, userMessage.slice(0, 100)])]
      }));
    }
    
    // Detect struggles
    if (lowerMessage.includes('struggle') || lowerMessage.includes('hard') || lowerMessage.includes('difficult')) {
      setMemory(prev => ({
        ...prev,
        struggles: [...new Set([...prev.struggles, userMessage.slice(0, 100)])]
      }));
    }
    
    // Detect achievements
    if (lowerMessage.includes('achieved') || lowerMessage.includes('did it') || lowerMessage.includes('success')) {
      setMemory(prev => ({
        ...prev,
        achievements: [...new Set([...prev.achievements, userMessage.slice(0, 100)])]
      }));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userEmotion = detectEmotion(input);
    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      emotion: userEmotion
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      const selectedPersona = COACH_PERSONAS.find(p => p.id === persona) || COACH_PERSONAS[3];
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a ${selectedPersona.name} - ${selectedPersona.style}. You have LONG-TERM MEMORY of the user's journey.

PERSONA STYLE: ${selectedPersona.style}

USER CONTEXT:
- Detected emotion: ${userEmotion}
- Health data: ${entries.length} entries, avg sleep ${stats?.avgSleepHours?.toFixed(1) || 'N/A'}h, avg stress ${stats?.avgStressLevel?.toFixed(1) || 'N/A'}/10
- Known goals: ${memory.goals.join('; ') || 'Not yet shared'}
- Known struggles: ${memory.struggles.join('; ') || 'Not yet shared'}
- Achievements: ${memory.achievements.join('; ') || 'Not yet shared'}

GUIDELINES:
1. Acknowledge their emotional state appropriately
2. Reference their health data when relevant
3. Remember and reference their goals and struggles
4. Provide actionable, personalized advice
5. Be ${selectedPersona.style.toLowerCase()}
6. Keep responses concise but warm
7. Never diagnose or prescribe - guide to professionals when needed

Respond as ${selectedPersona.name} with emoji ${selectedPersona.emoji}`
            },
            ...messages.slice(-10).map(m => ({ role: m.role === 'coach' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: userInput }
          ]
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      let coachContent = data.message || 'Sorry, I could not generate a response.';

      // Clean up markdown and formatting
      coachContent = coachContent
        .replace(/^#+\s+/gm, '')
        .replace(/###\s+/g, '\n')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
        .replace(/---+/g, '')
        .trim();

      const coachMessageId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, {
        id: coachMessageId,
        role: 'coach',
        content: coachContent,
        timestamp: new Date()
      }]);

      updateMemory(userInput, coachContent);
    } catch (error) {
      console.error('Coach error:', error);
      toast({ title: 'Connection Error', description: 'Failed to get coach response', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (line.startsWith('- ')) return `<li class="ml-4">${line.slice(2)}</li>`;
        return line ? `<p class="mb-1">${line}</p>` : '<br/>';
      })
      .join('');
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-indigo-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-2xl"
            >
              {COACH_PERSONAS.find(p => p.id === persona)?.emoji || '😊'}
            </motion.div>
            Private AI Health Coach
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        <CardDescription>
          Personalized coaching with long-term memory and emotional awareness
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b"
            >
              <div className="p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Choose Your Coach Persona</h4>
                <div className="grid grid-cols-2 gap-2">
                  {COACH_PERSONAS.map((p) => (
                    <Button
                      key={p.id}
                      variant={persona === p.id ? 'default' : 'outline'}
                      className="justify-start gap-2 h-auto py-3"
                      onClick={() => setPersona(p.id)}
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <div className="text-left">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs opacity-70">{p.style}</p>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {/* Memory Display */}
                {(memory.goals.length > 0 || memory.struggles.length > 0) && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Coach Memory
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {memory.goals.slice(0, 3).map((g, i) => (
                        <Badge key={i} variant="outline" className="text-xs">🎯 Goal tracked</Badge>
                      ))}
                      {memory.struggles.slice(0, 3).map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs">💪 Challenge noted</Badge>
                      ))}
                      {memory.achievements.slice(0, 3).map((a, i) => (
                        <Badge key={i} variant="outline" className="text-xs">⭐ Achievement!</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  {message.role === 'coach' ? (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-500 text-white text-xl">
                      {COACH_PERSONAS.find(p => p.id === persona)?.emoji || '😊'}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-secondary">
                      <Heart className="w-5 h-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-xs ${message.role === 'user' ? 'text-right' : ''} text-muted-foreground`}>
                      {message.role === 'coach' ? COACH_PERSONAS.find(p => p.id === persona)?.name : 'You'}
                    </p>
                    {message.emotion && message.role === 'user' && (
                      <Badge variant="outline" className="text-xs py-0">
                        {message.emotion}
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
                    <div
                      className="text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                  <span className={`text-xs opacity-60 mt-1 block ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-500 text-white text-xl">
                    {COACH_PERSONAS.find(p => p.id === persona)?.emoji || '😊'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-background">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts, goals, or concerns..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="bg-gradient-to-r from-primary to-indigo-500">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Your coach remembers your journey and adapts to your emotional state
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
