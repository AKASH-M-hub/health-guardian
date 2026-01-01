import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Calendar, MapPin, Shield, Coins, 
  Activity, Heart, Brain, Stethoscope, MessageSquare,
  FileText, Hospital, Pill, ArrowLeft, Crown, Star,
  Check, Lock, Zap, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  totalEntries: number;
  totalChats: number;
  totalAssessments: number;
  memberSince: string;
}

const FEATURES = [
  { 
    name: 'Health Dashboard', 
    icon: Activity, 
    description: 'Track your daily health metrics',
    available: true,
    path: '/dashboard'
  },
  { 
    name: 'Risk Analysis', 
    icon: TrendingUp, 
    description: 'AI-powered health risk assessment',
    available: true,
    path: '/risk-analysis'
  },
  { 
    name: 'AI Health Chat', 
    icon: MessageSquare, 
    description: 'Chat with AI health assistant',
    available: true,
    path: '/chatbot'
  },
  { 
    name: 'Hospital Finder', 
    icon: Hospital, 
    description: 'Find nearby healthcare facilities',
    available: true,
    path: '/hospital-finder'
  },
  { 
    name: 'Medicine Awareness', 
    icon: Pill, 
    description: 'Learn about diseases and treatments',
    available: true,
    path: '/medicine-awareness'
  },
  { 
    name: 'Health Reports', 
    icon: FileText, 
    description: 'Generate detailed health reports',
    available: true,
    path: '/health-report'
  },
  { 
    name: 'Premium Analytics', 
    icon: Crown, 
    description: 'Advanced health insights',
    available: false,
    path: '#'
  },
  { 
    name: 'Expert Consultation', 
    icon: Stethoscope, 
    description: 'Connect with health experts',
    available: false,
    path: '#'
  },
];

export default function Account() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalEntries: 0,
    totalChats: 0,
    totalAssessments: 0,
    memberSince: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // Fetch stats
      const [entriesRes, chatsRes, assessmentsRes] = await Promise.all([
        supabase.from('health_entries').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('chat_messages').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('risk_assessments').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      setStats({
        totalEntries: entriesRes.count || 0,
        totalChats: Math.floor((chatsRes.count || 0) / 2), // Divide by 2 for conversations
        totalAssessments: assessmentsRes.count || 0,
        memberSince: new Date(user.created_at).toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <User className="w-8 h-8 text-primary" />
              Account & Features
            </h1>
            <p className="text-muted-foreground">Manage your account and explore available features</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-primary">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-coral flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-xl">{profile?.full_name || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge className="mt-2 bg-success/20 text-success">
                  <Shield className="w-3 h-3 mr-1" />
                  Free Plan
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Joined {stats.memberSince}</span>
                  </div>
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.gender && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{profile.gender}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Credits */}
                <div className="bg-gradient-to-r from-primary/10 to-coral/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Coins className="w-4 h-4 text-warning" />
                      Credits
                    </span>
                    <Badge variant="outline">{credits} available</Badge>
                  </div>
                  <Progress value={Math.min((credits / 100) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Earn credits by logging in daily and tracking health
                  </p>
                </div>

                <Button className="w-full" onClick={() => navigate('/profile')}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Stats & Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                    <Activity className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{stats.totalEntries}</p>
                    <p className="text-xs text-muted-foreground">Health Entries</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="text-center p-4 bg-gradient-to-br from-coral/5 to-coral/10">
                    <MessageSquare className="w-8 h-8 mx-auto text-coral mb-2" />
                    <p className="text-2xl font-bold">{stats.totalChats}</p>
                    <p className="text-xs text-muted-foreground">AI Chats</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="text-center p-4 bg-gradient-to-br from-success/5 to-success/10">
                    <TrendingUp className="w-8 h-8 mx-auto text-success mb-2" />
                    <p className="text-2xl font-bold">{stats.totalAssessments}</p>
                    <p className="text-xs text-muted-foreground">Assessments</p>
                  </Card>
                </motion.div>
              </div>

              {/* Features Grid */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    Available Features
                  </CardTitle>
                  <CardDescription>Explore all the health tools at your disposal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {FEATURES.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            feature.available 
                              ? 'hover:border-primary/50 hover:-translate-y-1' 
                              : 'opacity-60'
                          }`}
                          onClick={() => feature.available && navigate(feature.path)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              feature.available 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              <feature.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-sm">{feature.name}</h3>
                                {feature.available ? (
                                  <Check className="w-4 h-4 text-success" />
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {feature.description}
                              </p>
                              {!feature.available && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Banner */}
              <Card className="bg-gradient-to-r from-primary to-coral text-white overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Crown className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Upgrade to Premium</h3>
                      <p className="text-white/80 text-sm">
                        Unlock advanced analytics, expert consultations & more
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" className="shrink-0">
                    <Star className="w-4 h-4 mr-1" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
