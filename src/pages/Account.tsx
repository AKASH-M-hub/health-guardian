import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useSubscription } from '@/hooks/useSubscription';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Mail, Calendar, MapPin, Shield, Coins, 
  Activity, Heart, Brain, Stethoscope, MessageSquare,
  FileText, Hospital, Pill, ArrowLeft, Crown, Star,
  Check, Lock, Zap, TrendingUp, Camera, Upload, Code2, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PremiumUpgrade } from '@/components/premium/PremiumUpgrade';
import { TechStack } from '@/components/TechStack';

interface UserStats {
  totalEntries: number;
  totalChats: number;
  totalAssessments: number;
  memberSince: string;
}

const FEATURES = [
  { name: 'Health Dashboard', icon: Activity, description: 'Track your daily health metrics', available: true, path: '/dashboard' },
  { name: 'Risk Analysis', icon: TrendingUp, description: 'AI-powered health risk assessment', available: true, path: '/risk-analysis' },
  { name: 'AI Health Chat', icon: MessageSquare, description: 'Chat with AI health assistant', available: true, path: '/chatbot' },
  { name: 'Hospital Finder', icon: Hospital, description: 'Find nearby healthcare facilities', available: true, path: '/hospital-finder' },
  { name: 'Disease Awareness', icon: Pill, description: 'Learn about 100+ diseases', available: true, path: '/medicine-awareness' },
  { name: 'Health Reports', icon: FileText, description: 'Generate detailed health reports', available: true, path: '/health-report' },
  { name: 'AI Health Hub', icon: Brain, description: '20+ AI intelligence features', available: true, path: '/ai-hub' },
  { name: 'Premium Features', icon: Crown, description: '20 advanced AI features', available: 'premium', path: '/premium', premium: true },
];

export default function Account() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const { isPremium, subscription } = useSubscription();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalEntries: 0,
    totalChats: 0,
    totalAssessments: 0,
    memberSince: ''
  });
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

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
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        if (profileData.avatar_url) setAvatarUrl(profileData.avatar_url);
      }

      const [entriesRes, chatsRes, assessmentsRes] = await Promise.all([
        supabase.from('health_entries').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('chat_messages').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('risk_assessments').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      setStats({
        totalEntries: entriesRes.count || 0,
        totalChats: Math.floor((chatsRes.count || 0) / 2),
        totalAssessments: assessmentsRes.count || 0,
        memberSince: new Date(user.created_at).toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        setAvatarUrl(dataUrl);
        
        // Update profile with the data URL
        await supabase
          .from('profiles')
          .update({ avatar_url: dataUrl })
          .eq('user_id', user.id);
        
        toast({ title: 'Profile photo updated!' });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ title: 'Upload failed', variant: 'destructive' });
      setUploading(false);
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

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <User className="w-8 h-8 text-primary" />
                Account & Features
              </h1>
              <p className="text-muted-foreground">Manage your account and explore available features</p>
            </div>
            <TechStack trigger={
              <Button variant="outline">
                <Code2 className="w-4 h-4 mr-2" />
                Tech Stack
              </Button>
            } />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-primary">
              <CardHeader className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-4 group">
                  <Avatar className="w-full h-full ring-4 ring-primary/20">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-coral text-white text-3xl">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                      disabled={uploading}
                    />
                  </label>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">{profile?.full_name || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {isPremium ? (
                  <Badge className="mt-2 bg-gradient-to-r from-primary to-coral text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium Member
                  </Badge>
                ) : (
                  <Badge className="mt-2 bg-success/20 text-success">
                    <Shield className="w-3 h-3 mr-1" />
                    Free Plan
                  </Badge>
                )}
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
                </div>

                <Separator />

                {/* Credits */}
                <div className="bg-gradient-to-r from-primary/10 to-coral/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Coins className="w-4 h-4 text-warning" />
                      Credits
                    </span>
                      <Badge variant="outline">{credits?.credits || 0} available</Badge>
                  </div>
                    <Progress value={Math.min(((credits?.credits || 0) / 100) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Earn credits by logging in daily
                  </p>
                </div>

                <div className="grid gap-2">
                  <Button className="w-full" onClick={() => navigate('/profile')}>
                    Edit Profile
                  </Button>
                  {isPremium ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-coral text-white"
                      onClick={() => navigate('/premium')}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Premium Dashboard
                    </Button>
                  ) : (
                    <PremiumUpgrade trigger={
                      <Button className="w-full bg-gradient-to-r from-primary to-coral text-white">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium - ₹1
                      </Button>
                    } />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats & Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                  <Card className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                    <Activity className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{stats.totalEntries}</p>
                    <p className="text-xs text-muted-foreground">Health Entries</p>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <Card className="text-center p-4 bg-gradient-to-br from-coral/5 to-coral/10">
                    <MessageSquare className="w-8 h-8 mx-auto text-coral mb-2" />
                    <p className="text-2xl font-bold">{stats.totalChats}</p>
                    <p className="text-xs text-muted-foreground">AI Chats</p>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
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
                  <div className="grid md:grid-cols-3 gap-3">
                    {FEATURES.map((feature, index) => {
                      const isAvailable = feature.available === true || (feature.available === 'premium' && isPremium);
                      return (
                        <motion.div
                          key={feature.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card 
                            className={`p-3 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              isAvailable 
                                ? 'hover:border-primary/50 hover:-translate-y-1' 
                                : 'opacity-60'
                            }`}
                            onClick={() => isAvailable && navigate(feature.path)}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`p-1.5 rounded-lg ${
                                isAvailable 
                                  ? feature.premium ? 'bg-gradient-to-r from-primary/20 to-coral/20 text-primary' : 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                <feature.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h3 className="font-medium text-xs truncate">{feature.name}</h3>
                                  {isAvailable ? (
                                    <Check className="w-3 h-3 text-success shrink-0" />
                                  ) : (
                                    <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {feature.description}
                                </p>
                                {feature.premium && !isPremium && (
                                <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
                                  <Crown className="w-2 h-2 mr-0.5" />
                                  Premium
                                </Badge>
                              )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Premium Banner */}
              {isPremium ? (
                <Card 
                  className="bg-gradient-to-r from-primary to-coral text-white overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => navigate('/premium')}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        <Crown className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Premium Active ✨</h3>
                        <p className="text-white/80 text-sm">
                          You have access to all 20 advanced AI features
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" className="shrink-0">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <PremiumUpgrade trigger={
                  <Card className="bg-gradient-to-r from-primary to-coral text-white overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                          <Crown className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Upgrade to Premium</h3>
                          <p className="text-white/80 text-sm">
                            20 advanced AI features for just ₹1
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" className="shrink-0">
                        <Star className="w-4 h-4 mr-1" />
                        Only ₹1
                      </Button>
                    </CardContent>
                  </Card>
                } />
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}