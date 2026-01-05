import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code2, Database, Cloud, Shield, Palette, Zap, Brain, Globe, Bot, Layers, Eye, Sparkles, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: Palette,
    color: 'text-ocean',
    technologies: [
      { name: 'React 18', description: 'Modern UI library with hooks & concurrent features' },
      { name: 'TypeScript', description: 'Type-safe JavaScript for robust code' },
      { name: 'Vite', description: 'Next-generation frontend build tool' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
      { name: 'Framer Motion', description: 'Production-ready motion library' },
      { name: 'Shadcn/UI', description: 'Beautiful, accessible UI components' },
    ]
  },
  {
    category: 'Backend & Database',
    icon: Database,
    color: 'text-mint-dark',
    technologies: [
      { name: 'Lovable Cloud', description: 'Managed backend infrastructure' },
      { name: 'PostgreSQL', description: 'Advanced relational database' },
      { name: 'Edge Functions', description: 'Serverless backend functions' },
      { name: 'Row Level Security', description: 'Database-level access control' },
      { name: 'Real-time Subscriptions', description: 'Live data synchronization' },
    ]
  },
  {
    category: 'AI & Intelligence',
    icon: Brain,
    color: 'text-coral',
    technologies: [
      { name: 'AKASHII Bot', description: 'Custom AI Health Intelligence Agent' },
      { name: 'Lovable AI Gateway', description: 'Multi-model AI integration' },
      { name: 'Google Gemini', description: 'Advanced language model' },
      { name: 'Streaming Responses', description: 'Real-time AI chat experience' },
      { name: 'Health Pattern Analysis', description: 'Custom AI health algorithms' },
      { name: 'Wisdom Engine', description: 'Adaptive AI communication layer' },
    ]
  },
  {
    category: 'Premium Scanners',
    icon: Layers,
    color: 'text-lavender-dark',
    technologies: [
      { name: 'Multi-Layer Scan', description: 'Toggle lifestyle, mental, physiological layers' },
      { name: 'Causal Chain Scanner', description: 'Visualize health cause-effect relationships' },
      { name: 'Stability Oscillation', description: 'Measure volatility and fragility' },
      { name: 'Resilience Scanner', description: 'Simulate stress response' },
      { name: 'Invisible Damage', description: 'Detect cumulative silent stress' },
      { name: 'Decision Sensitivity', description: 'Impact of small lifestyle changes' },
    ]
  },
  {
    category: 'Visualization',
    icon: Eye,
    color: 'text-warning',
    technologies: [
      { name: 'Virtual Organ Scan', description: 'Body visualization with stress levels' },
      { name: 'Health Trajectory', description: 'Timeline-based health progression' },
      { name: 'Risk Heatmap', description: 'Color-coded risk distribution' },
      { name: 'Mental Burnout Scan', description: 'Brain visualization for stress' },
      { name: '3D Body Visualization', description: 'Interactive 3D health model' },
      { name: 'Emotional Heatmap', description: 'Long-term emotional patterns' },
    ]
  },
  {
    category: 'Wisdom Layer',
    icon: Sparkles,
    color: 'text-success',
    technologies: [
      { name: 'Health Wisdom Engine', description: 'Adaptive AI communication' },
      { name: 'Future Readiness Index', description: 'Health preparedness score' },
      { name: 'Personal Philosophy', description: 'Customizable AI persona' },
      { name: 'Trust Calibration', description: 'Dynamic transparency adjustment' },
      { name: 'Decision Fatigue Protection', description: 'Cognitive load monitoring' },
    ]
  },
  {
    category: 'APIs & Services',
    icon: Globe,
    color: 'text-primary',
    technologies: [
      { name: 'OpenStreetMap API', description: 'Hospital finder & navigation' },
      { name: 'Geolocation API', description: 'User location detection' },
      { name: 'Recharts', description: 'Composable charting library' },
      { name: 'Speech Recognition', description: 'Voice input for AKASHII' },
      { name: 'Text-to-Speech', description: 'Voice response capability' },
    ]
  },
  {
    category: 'Security & Auth',
    icon: Shield,
    color: 'text-destructive',
    technologies: [
      { name: 'Secure Auth', description: 'Email/password authentication' },
      { name: 'JWT Tokens', description: 'Stateless session management' },
      { name: 'RLS Policies', description: 'Row-level database security' },
      { name: 'Zod Validation', description: 'Schema validation library' },
      { name: 'Credits System', description: 'Usage-based access control' },
    ]
  },
  {
    category: 'Development',
    icon: Code2,
    color: 'text-ocean-dark',
    technologies: [
      { name: 'Lovable Platform', description: 'AI-powered development environment' },
      { name: 'ESLint', description: 'JavaScript linting utility' },
      { name: 'React Query', description: 'Data fetching & caching' },
      { name: 'React Router', description: 'Client-side routing' },
      { name: 'Theme System', description: 'Light/Dark mode support' },
    ]
  },
];

interface TechStackProps {
  trigger?: React.ReactNode;
}

export function TechStack({ trigger }: TechStackProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Code2 className="w-4 h-4 mr-2" />
            View Tech Stack
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-warning" />
            Technology Stack
          </DialogTitle>
          <DialogDescription>
            Built with modern, enterprise-grade technologies for the Imagine Cup
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {TECH_STACK.map((category, i) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {category.technologies.map((tech) => (
                      <Badge 
                        key={tech.name} 
                        variant="secondary" 
                        className="cursor-help hover:bg-primary/20 transition-colors"
                        title={tech.description}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-coral/10 border-primary/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold">SDOP - Silent Disease Onset Predictor</p>
                <p className="text-sm text-muted-foreground">
                  A future-ready preventive healthcare intelligence platform featuring AKASHII, 
                  an advanced AI Health Agent with wisdom-based adaptive communication, 
                  multi-layer health scanning, and doctor collaboration modes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
