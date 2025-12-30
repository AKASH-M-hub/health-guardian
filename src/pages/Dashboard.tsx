import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Brain, Moon, Utensils, TrendingUp, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const quickActions = [
    { icon: Activity, label: 'Log Health Data', href: '/health-input', color: 'ocean' },
    { icon: Brain, label: 'View Risk Analysis', href: '/risk-analysis', color: 'lavender' },
    { icon: MessageCircle, label: 'AI Assistant', href: '/chatbot', color: 'coral' },
    { icon: MapPin, label: 'Find Hospitals', href: '/hospital-finder', color: 'mint' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your health overview</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(action.href)}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${action.color}-light flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Health Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-coral" /> Risk Score</CardTitle>
              <CardDescription>Your current health risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success">Low</div>
              <p className="text-sm text-muted-foreground mt-2">Based on your recent data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5 text-lavender-dark" /> Sleep</CardTitle>
              <CardDescription>Last 7 days average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">7.2h</div>
              <p className="text-sm text-success mt-2">+0.5h from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-mint-dark" /> Diet Quality</CardTitle>
              <CardDescription>This week's score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">8/10</div>
              <p className="text-sm text-muted-foreground mt-2">Great progress!</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/health-input')}>Log Today's Health Data</Button>
        </div>
      </main>
    </div>
  );
}
