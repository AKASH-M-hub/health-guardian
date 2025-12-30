import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User, ArrowLeft, Sparkles, Heart, Brain, MapPin, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: Heart, label: 'Explain my risk score', prompt: 'Can you explain what my health risk score means?' },
  { icon: Brain, label: 'Stress management tips', prompt: 'What are some effective stress management techniques?' },
  { icon: MapPin, label: 'Find nearby hospitals', prompt: 'How can I find hospitals near me?' },
  { icon: Pill, label: 'Medicine awareness', prompt: 'What should I know about common medication categories?' }
];

export default function Chatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Health Intelligence Assistant. I can help you understand your health data, explain risk scores, provide wellness tips, and guide you to nearby healthcare facilities. How can I assist you today?",
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

  const generateResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('risk') || lowerMsg.includes('score')) {
      return "Your health risk score is calculated based on multiple factors including sleep quality, stress levels, physical activity, and diet. A lower score indicates better health. The analysis considers trends over time rather than single data points, giving you a more accurate picture of your overall health trajectory. Would you like me to explain any specific factor in detail?";
    }
    
    if (lowerMsg.includes('stress')) {
      return "Stress management is crucial for preventing silent diseases. Here are some evidence-based techniques:\n\n• **Deep Breathing**: Practice 4-7-8 breathing technique\n• **Regular Exercise**: 30 minutes of moderate activity daily\n• **Sleep Hygiene**: Maintain consistent sleep schedule\n• **Mindfulness**: Try meditation apps for guided sessions\n• **Social Connection**: Maintain supportive relationships\n\nWould you like specific guidance on any of these techniques?";
    }
    
    if (lowerMsg.includes('sleep')) {
      return "Quality sleep is one of the most important factors for disease prevention. Adults typically need 7-9 hours per night. Poor sleep has been linked to increased risk of cardiovascular disease, diabetes, and mental health issues. Tips for better sleep:\n\n• Keep a consistent sleep schedule\n• Avoid screens 1 hour before bed\n• Keep your room cool and dark\n• Limit caffeine after 2 PM\n\nYour sleep data helps us track patterns and identify potential issues early.";
    }
    
    if (lowerMsg.includes('hospital') || lowerMsg.includes('doctor') || lowerMsg.includes('clinic')) {
      return "To find healthcare facilities near you, please visit the Hospital Finder feature in the app. You can:\n\n• Allow location access for automatic nearby search\n• Filter by specialty (cardiology, general practice, etc.)\n• View facility details and contact information\n• Get directions to the facility\n\nWould you like me to guide you to the Hospital Finder?";
    }
    
    if (lowerMsg.includes('medicine') || lowerMsg.includes('medication') || lowerMsg.includes('drug')) {
      return "I can provide general medicine awareness information, but please note:\n\n⚠️ **Important Disclaimer**: I cannot prescribe medications or provide specific dosage advice. Always consult a healthcare professional.\n\nGeneral medication categories include:\n• **Analgesics**: For pain relief\n• **Antihypertensives**: For blood pressure management\n• **Statins**: For cholesterol management\n• **Antidiabetics**: For blood sugar control\n\nWould you like general information about any category?";
    }
    
    if (lowerMsg.includes('diet') || lowerMsg.includes('food') || lowerMsg.includes('nutrition')) {
      return "A balanced diet is fundamental for disease prevention. Key recommendations:\n\n• **Fruits & Vegetables**: Aim for 5+ servings daily\n• **Whole Grains**: Choose over refined grains\n• **Lean Proteins**: Fish, poultry, legumes\n• **Healthy Fats**: Olive oil, nuts, avocados\n• **Limit**: Processed foods, added sugars, excessive sodium\n\nYour diet quality score helps track your nutritional habits over time.";
    }
    
    if (lowerMsg.includes('exercise') || lowerMsg.includes('activity') || lowerMsg.includes('workout')) {
      return "Regular physical activity is essential for preventing many silent diseases. WHO recommendations:\n\n• **Adults**: 150-300 minutes of moderate activity per week\n• **Or**: 75-150 minutes of vigorous activity\n• **Plus**: Muscle strengthening 2+ days per week\n\nEven small amounts help! Start with 10-minute walks and gradually increase. Your activity tracking helps identify patterns and areas for improvement.";
    }
    
    return "I'm here to help you understand your health data and provide wellness guidance. I can explain your risk scores, offer lifestyle tips, guide you to healthcare resources, or answer questions about general health topics. What would you like to know more about?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Save user message
    if (user) {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        content: userMessage.content
      });
    }

    // Simulate AI response delay
    setTimeout(async () => {
      const responseContent = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Save assistant message
      if (user) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: responseContent
        });
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
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

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Health Intelligence Assistant
            </h1>
            <p className="text-muted-foreground">Your AI-powered health companion</p>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                Chat with AI Assistant
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
                      <Avatar className="w-8 h-8">
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
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-60 mt-1 block">
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
                />
                <Button type="submit" disabled={!input.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            This AI assistant provides general health information only. It is not a substitute for professional medical advice.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
