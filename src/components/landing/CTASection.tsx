import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-ocean" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Start Your Health Journey</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Join thousands of users who are proactively managing their health with AI-powered insights. 
            Your journey to better health starts with a single step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="xl"
              variant="glass"
              onClick={() => navigate('/auth?mode=signup')}
              className="group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="hero-outline"
              onClick={() => navigate('/features')}
            >
              View All Features
            </Button>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">
            No credit card required • Free forever for basic features
          </p>
        </motion.div>
      </div>
    </section>
  );
}
