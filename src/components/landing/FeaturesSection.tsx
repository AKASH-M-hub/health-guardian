import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  MessageCircle, 
  MapPin, 
  Pill, 
  FileText, 
  Heart,
  Activity,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Risk Prediction',
    description: 'Advanced algorithms analyze your lifestyle patterns to predict potential health risks before symptoms appear.',
    color: 'ocean',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Track your health metrics over time and visualize trends with interactive dashboards.',
    color: 'mint',
  },
  {
    icon: Shield,
    title: 'Explainable AI',
    description: 'Understand why our AI makes specific predictions with clear, transparent explanations.',
    color: 'lavender',
  },
  {
    icon: MessageCircle,
    title: 'Health Assistant',
    description: 'Chat with our AI assistant for personalized health insights and guidance.',
    color: 'coral',
  },
  {
    icon: MapPin,
    title: 'Hospital Finder',
    description: 'Discover nearby hospitals and clinics with specialty filters and contact information.',
    color: 'ocean',
  },
  {
    icon: Pill,
    title: 'Medicine Awareness',
    description: 'Learn about medication categories and their purposes without prescriptions.',
    color: 'mint',
  },
  {
    icon: FileText,
    title: 'Health Reports',
    description: 'Generate comprehensive PDF reports to share with your healthcare provider.',
    color: 'lavender',
  },
  {
    icon: Activity,
    title: 'Lifestyle Tracking',
    description: 'Log sleep, exercise, diet, and stress levels to build your health profile.',
    color: 'coral',
  },
];

const colorClasses = {
  ocean: 'bg-ocean-light text-ocean-dark',
  mint: 'bg-mint text-mint-dark',
  lavender: 'bg-lavender text-lavender-dark',
  coral: 'bg-coral-light text-coral',
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Comprehensive Health Intelligence
          </h2>
          <p className="text-lg text-muted-foreground">
            SDOP combines cutting-edge AI with medical expertise to provide you with actionable health insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 border border-border/50"
            >
              <div className={`w-12 h-12 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
