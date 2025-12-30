import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Brain,
  Activity,
  Shield,
  MessageSquare,
  MapPin,
  Pill,
  FileText,
  TrendingUp,
  Users,
  Zap,
  Clock,
  BarChart3,
  Stethoscope,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Health Data Logging',
    description: 'Track sleep, stress, activity, nutrition, and vital signs daily to build a comprehensive health profile.',
    href: '/health-input',
    color: 'text-rose-500'
  },
  {
    icon: Brain,
    title: 'AI Risk Analysis',
    description: 'Advanced AI algorithms analyze your health data to predict potential health risks before they become serious.',
    href: '/risk-analysis',
    color: 'text-purple-500'
  },
  {
    icon: MessageSquare,
    title: 'AI Health Chatbot',
    description: 'Get instant, personalized health advice from our AI-powered chatbot trained on medical knowledge.',
    href: '/chatbot',
    color: 'text-blue-500'
  },
  {
    icon: MapPin,
    title: 'Hospital Finder',
    description: 'Find nearby hospitals and healthcare facilities based on your location and specific needs.',
    href: '/hospital-finder',
    color: 'text-emerald-500'
  },
  {
    icon: Pill,
    title: 'Medicine Awareness',
    description: 'Learn about medications, their uses, side effects, and interactions to make informed decisions.',
    href: '/medicine-awareness',
    color: 'text-amber-500'
  },
  {
    icon: FileText,
    title: 'Health Reports',
    description: 'Generate comprehensive health summary reports with visualizations and personalized recommendations.',
    href: '/health-report',
    color: 'text-cyan-500'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your health journey with detailed charts and trend analysis over time.',
    href: '/dashboard',
    color: 'text-indigo-500'
  },
  {
    icon: Users,
    title: 'Profile Management',
    description: 'Manage your personal health profile with secure data storage and privacy controls.',
    href: '/profile',
    color: 'text-pink-500'
  }
];

const upcomingFeatures = [
  { icon: Zap, title: 'Real-time Health Alerts', description: 'Get instant notifications about critical health changes.' },
  { icon: Clock, title: 'Medication Reminders', description: 'Never miss a dose with smart medication scheduling.' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep dive into your health metrics with AI insights.' },
  { icon: Stethoscope, title: 'Doctor Connect', description: 'Direct consultation booking with healthcare providers.' },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Healthcare</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Powerful Features for Your
              <span className="block gradient-text">Health Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover all the tools and capabilities designed to help you take control of your health with AI-powered insights.
            </p>
          </motion.div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/30"
                  onClick={() => navigate(feature.href)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Coming Soon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingFeatures.map((feature, index) => (
                <Card key={feature.title} className="bg-muted/30 border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Card className="gradient-hero text-primary-foreground p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
              <p className="mb-6 opacity-90">
                Join thousands of users who are already taking control of their health with SDOP.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
