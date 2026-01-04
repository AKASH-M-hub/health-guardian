import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code2, Database, Cloud, Shield, Palette, Zap, Brain, Globe } from 'lucide-react';
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
      { name: 'Supabase', description: 'Open source Firebase alternative' },
      { name: 'PostgreSQL', description: 'Advanced relational database' },
      { name: 'Edge Functions', description: 'Serverless backend functions' },
      { name: 'Row Level Security', description: 'Database-level access control' },
    ]
  },
  {
    category: 'AI & Intelligence',
    icon: Brain,
    color: 'text-coral',
    technologies: [
      { name: 'Lovable AI Gateway', description: 'Multi-model AI integration' },
      { name: 'Google Gemini', description: 'Advanced language model' },
      { name: 'Streaming Responses', description: 'Real-time AI chat experience' },
      { name: 'Health Pattern Analysis', description: 'Custom AI health algorithms' },
    ]
  },
  {
    category: 'APIs & Services',
    icon: Globe,
    color: 'text-lavender-dark',
    technologies: [
      { name: 'Google Maps API', description: 'Hospital finder & navigation' },
      { name: 'Geolocation API', description: 'User location detection' },
      { name: 'Recharts', description: 'Composable charting library' },
    ]
  },
  {
    category: 'Security & Auth',
    icon: Shield,
    color: 'text-success',
    technologies: [
      { name: 'Supabase Auth', description: 'Secure authentication system' },
      { name: 'JWT Tokens', description: 'Stateless session management' },
      { name: 'RLS Policies', description: 'Row-level database security' },
      { name: 'Zod Validation', description: 'Schema validation library' },
    ]
  },
  {
    category: 'Development',
    icon: Code2,
    color: 'text-primary',
    technologies: [
      { name: 'Lovable Platform', description: 'AI-powered development environment' },
      { name: 'ESLint', description: 'JavaScript linting utility' },
      { name: 'React Query', description: 'Data fetching & caching' },
      { name: 'React Router', description: 'Client-side routing' },
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
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
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
              transition={{ delay: i * 0.1 }}
            >
              <Card>
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
                        className="cursor-help"
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
              <Cloud className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">SDOP - Smart Disease Outbreak Prevention</p>
                <p className="text-sm text-muted-foreground">
                  A future-ready preventive healthcare intelligence platform built for Imagine Cup, 
                  emphasizing human-centered AI, transparency, and early intervention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
