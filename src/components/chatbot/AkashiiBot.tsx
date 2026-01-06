import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Send, User, Sparkles, Heart, Brain, MapPin, Pill, Coins, AlertCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CREDITS_PER_MESSAGE = 2;

const QUICK_PROMPTS = [
  { icon: Heart, label: 'Risk Score', prompt: 'Explain my health risk briefly' },
  { icon: Brain, label: 'Stress Tips', prompt: 'Quick stress relief tips' },
  { icon: MapPin, label: 'Healthcare', prompt: 'How to find good healthcare' },
  { icon: Pill, label: 'Medicine', prompt: 'Basic medicine awareness' }
];

export function AkashiiBot() {
  const { user } = useAuth();
  const { credits, spendCredits, refreshCredits } = useCredits();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AKASHII, your AI Health Intelligence Agent. How can I assist you today? Ask me anything about your health.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user) loadChatHistory();
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(30);

      if (data && data.length > 0) {
        setMessages(prev => [
          prev[0],
          ...data.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(m.created_at)
          }))
        ]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!user) {
      toast({ title: 'Please log in', variant: 'destructive' });
      return;
    }

    if (credits < CREDITS_PER_MESSAGE) {
      toast({
        title: 'Insufficient Credits',
        description: `You need ${CREDITS_PER_MESSAGE} credits.`,
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    const creditSpent = await spendCredits(CREDITS_PER_MESSAGE);
    if (!creditSpent) {
      setIsTyping(false);
      return;
    }

    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: userMessage.content
    });

    try {
      const conversationHistory = messages
        .filter(m => m.id !== '1')
        .slice(-10) // Keep last 10 messages for context
        .map(m => ({ role: m.role, content: m.content }));
      
      conversationHistory.push({ role: 'user', content: userInput });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: conversationHistory,
          mode: 'concise' // Signal for short responses
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantContent = data.message || 'Sorry, I could not generate a response.';
      const assistantMessageId = (Date.now() + 1).toString();

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }]);

      if (assistantContent) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: assistantContent
        });

        if (mode === 'voice' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(assistantContent);
          utterance.onend = () => setIsSpeaking(false);
          setIsSpeaking(true);
          speechSynthesis.speak(utterance);
        }
      }

      refreshCredits();
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble responding. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev.filter(m => m.content !== ''), errorMessage]);
      
      toast({
        title: 'Connection Error',
        description: error.message || 'Failed to get AI response',
        variant: 'destructive',
      });
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({ title: 'Voice not supported', variant: 'destructive' });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  return (
    <Card className="h-[600px] flex flex-col overflow-hidden border-2 border-primary/20 shadow-glow">
      {/* Header with AKASHII branding */}
      <CardHeader className="py-3 bg-gradient-to-r from-primary/10 via-coral/10 to-primary/10 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px hsl(var(--primary) / 0.3)', '0 0 40px hsl(var(--primary) / 0.6)', '0 0 20px hsl(var(--primary) / 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-coral flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-primary/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <span className="font-bold text-lg">AKASHII</span>
              <p className="text-xs text-muted-foreground">AI Health Intelligence Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-primary" />
              {credits}
            </Badge>
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'text' | 'voice')}>
              <TabsList className="h-8">
                <TabsTrigger value="text" className="text-xs px-2">Text</TabsTrigger>
                <TabsTrigger value="voice" className="text-xs px-2">Voice</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.role === 'assistant' ? (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-coral text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-secondary">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="max-w-[80%]">
                  <p className={`text-xs mb-1 ${message.role === 'user' ? 'text-right' : ''} text-muted-foreground`}>
                    {message.role === 'assistant' ? 'AKASHII' : 'You'}
                  </p>
                  <div 
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-primary to-coral text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
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

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t bg-muted/30">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => setInput(item.prompt)}
            >
              <item.icon className="w-3 h-3 mr-1" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <CardContent className="border-t p-3 bg-background">
        {credits < CREDITS_PER_MESSAGE && (
          <div className="flex items-center gap-2 mb-2 text-sm text-warning">
            <AlertCircle className="w-4 h-4" />
            Low credits! Log in tomorrow for 10 free.
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AKASHII..."
            className="flex-1"
            disabled={credits < CREDITS_PER_MESSAGE}
          />
          {mode === 'voice' && (
            <Button 
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleVoiceInput}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!input.trim() || isTyping || credits < CREDITS_PER_MESSAGE}
            className="bg-gradient-to-r from-primary to-coral"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
