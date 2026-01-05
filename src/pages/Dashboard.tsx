import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useHealthData } from '@/hooks/useHealthData';
import { useSubscription } from '@/hooks/useSubscription';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, Moon, Utensils, TrendingUp, TrendingDown, Minus, MessageCircle, MapPin, FileText, User, Coins, Droplets, Pill, Crown, Sparkles, Bot, History, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { HealthSimulator } from '@/components/simulation/HealthSimulator';
import { BodyStatusDiagram } from '@/components/simulation/BodyStatusDiagram';
import { VirtualOrganStressScan } from '@/components/scans/VirtualOrganStressScan';
import { WhatIfHealthSimulator } from '@/components/simulation/WhatIfHealthSimulator';
import { FutureSelfSimulation } from '@/components/simulation/FutureSelfSimulation';
import { PrescriptionSuggester } from '@/components/features/PrescriptionSuggester';
import { UserActivityHistory } from '@/components/features/UserActivityHistory';
import { BackgroundAnimation } from '@/components/ui/BackgroundAnimation';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { stats, loading: healthLoading } = useHealthData();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const quickActions = [
    { icon: Activity, label: 'Log Health Data', href: '/health-input', color: 'bg-ocean/10 text-ocean hover:bg-ocean/20' },
    { icon: Bot, label: 'AKASHII Bot', href: '/chatbot', color: 'bg-coral/10 text-coral hover:bg-coral/20' },
    { icon: MapPin, label: 'Find Hospitals', href: '/hospital-finder', color: 'bg-mint/10 text-mint-dark hover:bg-mint/20' },
    { icon: Sparkles, label: 'AI Health Features', href: '/ai-health-features', color: 'bg-lavender/10 text-lavender-dark hover:bg-lavender/20' },
    { icon: Pill, label: 'Medicine Info', href: '/medicine-awareness', color: 'bg-primary/10 text-primary hover:bg-primary/20' },
    { icon: FileText, label: 'Health Report', href: '/health-report', color: 'bg-success/10 text-success hover:bg-success/20' },
    { icon: User, label: 'My Profile', href: '/profile', color: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' },
  ];

  const getTrendIcon = () => {
    if (!stats) return <Minus className="w-4 h-4" />;
    switch (stats.weeklyTrend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRiskLevel = () => {
    if (!stats) return { level: 'Unknown', color: 'text-muted-foreground' };
    const avgScore = (stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4;
    if (avgScore >= 7) return { level: 'Low', color: 'text-success' };
    if (avgScore >= 5) return { level: 'Moderate', color: 'text-warning' };
    return { level: 'High', color: 'text-destructive' };
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">Here's your health overview</p>
            </div>
            <Card className="bg-gradient-to-r from-primary/10 to-coral/10 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Coins className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">{creditsLoading ? '...' : credits}</div>
                  <div className="text-xs text-muted-foreground">Credits Available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card 
                className="cursor-pointer hover:shadow-lg hover:shadow-primary/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 h-full group" 
                onClick={() => navigate(action.href)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium group-hover:text-primary transition-colors">{action.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Health Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full hover:shadow-lg hover:shadow-coral/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${risk.color}`}>{risk.level}</div>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon()}
                  <span className="text-xs text-muted-foreground">
                    {stats?.weeklyTrend === 'improving' ? 'Improving' : 
                     stats?.weeklyTrend === 'declining' ? 'Needs attention' : 'Stable'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="h-full hover:shadow-lg hover:shadow-lavender-dark/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Moon className="w-4 h-4 text-lavender-dark group-hover:scale-110 transition-transform" />
                  Avg Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {healthLoading ? '...' : stats ? `${stats.avgSleepHours}h` : 'No data'}
                </div>
                <Progress value={stats ? (stats.avgSleepHours / 9) * 100 : 0} className="mt-2 h-2" />
                <span className="text-xs text-muted-foreground">Target: 7-9 hours</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full hover:shadow-lg hover:shadow-mint-dark/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-mint-dark group-hover:scale-110 transition-transform" />
                  Diet Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {healthLoading ? '...' : stats ? `${stats.avgDietQuality}/10` : 'No data'}
                </div>
                <Progress value={stats ? stats.avgDietQuality * 10 : 0} className="mt-2 h-2" />
                <span className="text-xs text-muted-foreground">Keep it above 7</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="h-full hover:shadow-lg hover:shadow-ocean/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-ocean group-hover:scale-110 transition-transform" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {healthLoading ? '...' : stats ? `${stats.avgActivityMinutes}m` : 'No data'}
                </div>
                <Progress value={stats ? Math.min((stats.avgActivityMinutes / 60) * 100, 100) : 0} className="mt-2 h-2" />
                <span className="text-xs text-muted-foreground">Goal: 30+ min/day</span>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="hover:shadow-lg hover:shadow-coral/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
                  Stress Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {healthLoading ? '...' : stats ? stats.avgStressLevel : '-'}
                  </span>
                  <span className="text-muted-foreground mb-1">/10</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats && stats.avgStressLevel > 6 ? 'Consider relaxation techniques' : 'Good stress management'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="hover:shadow-lg hover:shadow-ocean/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-ocean group-hover:scale-110 transition-transform" />
                  Hydration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {healthLoading ? '...' : stats?.latestEntry?.water_intake_liters ?? '-'}
                  </span>
                  <span className="text-muted-foreground mb-1">L/day</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Target: 2-3 liters daily</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  Health Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthLoading ? '...' : stats?.totalEntries ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.latestEntry ? `Last entry: ${new Date(stats.latestEntry.entry_date).toLocaleDateString()}` : 'No entries yet'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Health Simulation Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Health Simulations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <HealthSimulator />
            <BodyStatusDiagram 
              healthData={{
                sleepHours: stats?.avgSleepHours ?? 7,
                stressLevel: stats?.avgStressLevel ?? 5,
                exerciseMinutes: stats?.avgActivityMinutes ?? 30,
                dietQuality: stats?.avgDietQuality ?? 7,
                heartRate: stats?.latestEntry?.heart_rate ?? 72
              }}
            />
          </div>
        </motion.div>

        {/* AI Health Features Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-coral" />
              AI Health Features
            </h2>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              Free Access
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VirtualOrganStressScan />
            <WhatIfHealthSimulator />
            <FutureSelfSimulation />
          </div>
        </motion.div>

        {/* Prescription & History Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Health Tools
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <PrescriptionSuggester />
            <UserActivityHistory />
          </div>
        </motion.div>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8">
            <Card 
              className="bg-gradient-to-r from-primary to-coral text-white cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
              onClick={() => navigate('/premium')}
            >
              <CardContent className="py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Unlock 20+ Premium AI Features</h3>
                    <p className="text-white/80 text-sm">
                      Digital Twin, 10-Year Forecast, Advanced Scanners & more
                    </p>
                  </div>
                </div>
                <Button variant="secondary" className="shrink-0">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Explore Premium
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 via-mint/5 to-coral/5 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-2">Ready to track today's health?</h3>
              <p className="text-muted-foreground mb-4">Log your daily metrics for personalized insights</p>
              <Button size="lg" onClick={() => navigate('/health-input')} className="bg-gradient-to-r from-primary to-coral hover:opacity-90 transition-opacity">
                <Activity className="w-4 h-4 mr-2" />
                Log Today's Health Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
