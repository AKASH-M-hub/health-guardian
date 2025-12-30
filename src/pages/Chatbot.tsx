import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, User, ArrowLeft, Sparkles, Heart, Brain, MapPin, Pill, Coins, AlertCircle } from 'lucide-react';
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
  { icon: Heart, label: 'Explain my risk score', prompt: 'Can you explain what my health risk score means and how I can improve it?' },
  { icon: Brain, label: 'Stress management', prompt: 'What are the most effective evidence-based stress management techniques I should try?' },
  { icon: MapPin, label: 'Healthcare guidance', prompt: 'What should I look for when choosing a healthcare provider or hospital?' },
  { icon: Pill, label: 'Medicine awareness', prompt: 'Can you explain the different categories of medications and what I should know about them?' }
];

export default function Chatbot() {
  const { user } = useAuth();
  const { credits, spendCredits, refreshCredits } = useCredits();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 **Hello! I'm your Health Intelligence Assistant.**\n\nI'm here to help you understand your health data, explain risk scores, provide wellness guidance, and support your health journey.\n\n**I can help you with:**\n- 📊 Understanding your health metrics\n- 💡 Personalized wellness tips\n- 🏥 Healthcare guidance\n- 💊 Medicine awareness (general information)\n- 🧘 Stress management techniques\n\n*Each message costs 2 credits. How can I assist you today?*",
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
        .limit(50);

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

    // Check credits
    if (credits < CREDITS_PER_MESSAGE) {
      toast({
        title: 'Insufficient Credits',
        description: `You need ${CREDITS_PER_MESSAGE} credits. Log in tomorrow for 10 free credits!`,
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

    // Spend credits
    const creditSpent = await spendCredits(CREDITS_PER_MESSAGE);
    if (!creditSpent) {
      setIsTyping(false);
      return;
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: userMessage.content
    });

    try {
      // Call AI endpoint
      const conversationHistory = messages
        .filter(m => m.id !== '1')
        .map(m => ({ role: m.role, content: m.content }));
      
      conversationHistory.push({ role: 'user', content: userInput });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantMessageId = (Date.now() + 1).toString();

      // Add placeholder assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessageId 
                    ? { ...m, content: assistantContent }
                    : m
                ));
              }
            } catch {
              // Incomplete JSON, continue
            }
          }
        }
      }

      setIsTyping(false);

      // Save assistant message
      if (assistantContent) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: assistantContent
        });
      }

      refreshCredits();
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment. If the issue persists, check your internet connection or contact support.",
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

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return `<li key="${i}" class="ml-4">${line.slice(2)}</li>`;
        }
        return line ? `<p key="${i}" class="mb-1">${line}</p>` : '<br/>';
      })
      .join('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                Health Intelligence Assistant
              </h1>
              <p className="text-muted-foreground">Your AI-powered health companion</p>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto flex items-center gap-2 px-3 py-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-semibold">{credits}</span>
              <span className="text-muted-foreground">credits</span>
            </Badge>
          </div>

          {credits < CREDITS_PER_MESSAGE && (
            <Card className="mb-4 border-warning/50 bg-warning/5">
              <CardContent className="py-3 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-sm">Low on credits!</p>
                  <p className="text-xs text-muted-foreground">Log in tomorrow to receive 10 free credits.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                Chat with AI Assistant
                <span className="text-xs text-muted-foreground ml-auto">({CREDITS_PER_MESSAGE} credits per message)</span>
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
                        <AvatarFallback className={message.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                          {message.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div 
                          className="text-sm prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        <span className="text-xs opacity-60 mt-2 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3">
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
            <div className="px-4 py-2 border-t">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {QUICK_PROMPTS.map((item) => (
                  <Button
                    key={item.label}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => handleQuickPrompt(item.prompt)}
                  >
                    <item.icon className="w-3 h-3 mr-1" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <CardContent className="border-t p-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about your health..."
                  className="flex-1"
                  disabled={credits < CREDITS_PER_MESSAGE}
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isTyping || credits < CREDITS_PER_MESSAGE}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            ⚕️ This AI assistant provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </motion.div>
      </main>
    </div>
  );
}