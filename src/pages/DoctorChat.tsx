import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Send, Stethoscope, User, Star, MapPin, Phone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function DoctorChat() {
  const { user } = useAuth();
  const { credits, refreshCredits } = useCredits();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hospitalName = searchParams.get('hospital') || 'Selected Hospital';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm Dr. AI, your virtual health consultant for ${hospitalName}. I'll help you understand this hospital's services, reviews, and suitability for your health needs. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!user) {
      toast({ title: 'Please log in', variant: 'destructive' });
      return;
    }

    if ((credits?.credits || 0) < 2) {
      toast({ title: 'Insufficient credits', variant: 'destructive' });
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

    // Deduct 2 credits from user
    if (user && credits?.credits) {
      await supabase
        .from('user_credits')
        .update({ credits: credits.credits - 2, total_spent: (credits.total_spent || 0) + 2 })
        .eq('user_id', user.id);
    }

    try {
      const conversationHistory = messages
        .filter(m => m.id !== '1')
        .slice(-6)
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
          userContext: `Acting as a doctor consultant for ${hospitalName}. Provide guidance about the hospital, its typical services, and whether it might be suitable based on user needs. Be brief and helpful.`,
          mode: 'concise'
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      let assistantContent = data.message || 'Sorry, I could not generate a response.';
      
      // Clean response formatting
      assistantContent = assistantContent
        .replace(/^#+\s+/gm, '') // Remove headers
        .replace(/###\s+/g, '\n') // Replace ### with newlines
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
        .replace(/_(.+?)_/g, '$1') // Remove italic
        .replace(/\[(.+?)\]\((.+?)\)/g, '$1') // Remove links
        .replace(/---+/g, '') // Remove dividers
        .replace(/^\s*#+\s+User:.*?(?=^\s*#+|$)/gms, '') // Remove User headers
        .replace(/^\s*#+\s+Assistant:.*?(?=^\s*#+|$)/gms, '') // Remove Assistant headers
        .trim();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      setIsTyping(false);
      refreshCredits();
    } catch (error) {
      setIsTyping(false);
      toast({ title: 'Error', description: 'Failed to get response', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Hospital Header */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-coral/10 border-primary/20">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{hospitalName}</h2>
                <p className="text-sm text-muted-foreground">AI Doctor Consultation Mode</p>
              </div>
              <Badge className="bg-success/20 text-success">Live Session</Badge>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="h-[500px] flex flex-col overflow-hidden">
            <CardHeader className="py-3 border-b bg-muted/30">
              <CardTitle className="text-sm flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                Dr. AI Consultation
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
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8">
                        {message.role === 'assistant' ? (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Stethoscope className="w-4 h-4" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-secondary">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="max-w-[80%]">
                        <p className={`text-xs mb-1 ${message.role === 'user' ? 'text-right' : ''} text-muted-foreground`}>
                          {message.role === 'assistant' ? 'Dr. AI' : 'You'}
                        </p>
                        <div className={`rounded-2xl px-4 py-2 text-sm ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Stethoscope className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <CardContent className="border-t p-3">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${hospitalName}...`}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-4">
            ⚕️ This is an AI simulation. Always verify information with actual healthcare providers.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
