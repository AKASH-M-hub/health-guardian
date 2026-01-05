import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, ArrowLeft, Brain, Activity, Heart, Shield, Zap, 
  TrendingUp, AlertTriangle, Clock, Target, Users, FileText,
  Sparkles, Eye, Dna, HeartPulse, Flame, MessageSquare,
  Bell, Lock, ChevronRight, Star, Lightbulb, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import premium feature components
import { DigitalTwin } from '@/components/premium/DigitalTwin';
import { TenYearForecast } from '@/components/premium/TenYearForecast';
import { DiseaseInteractionPredictor } from '@/components/premium/DiseaseInteractionPredictor';
import { DoctorExplainability } from '@/components/premium/DoctorExplainability';
import { PrivateAICoach } from '@/components/premium/PrivateAICoach';
import { BurnoutWarning } from '@/components/premium/BurnoutWarning';
import { DecisionSimulator } from '@/components/premium/DecisionSimulator';
import { MedicalReportInterpreter } from '@/components/premium/MedicalReportInterpreter';
import { ConfidenceAnalytics } from '@/components/premium/ConfidenceAnalytics';
import { CognitiveIndex } from '@/components/premium/CognitiveIndex';
import { GeneticLayer } from '@/components/premium/GeneticLayer';
import { RegressionDetection } from '@/components/premium/RegressionDetection';
import { LiteratureIntelligence } from '@/components/premium/LiteratureIntelligence';
import { PersonalizedAlerts } from '@/components/premium/PersonalizedAlerts';
import { RecoveryProbability } from '@/components/premium/RecoveryProbability';
import { HealthPriorityOptimizer } from '@/components/premium/HealthPriorityOptimizer';
import { EmotionalHeatmap } from '@/components/premium/EmotionalHeatmap';
import { Body3DVisualization } from '@/components/premium/Body3DVisualization';
import { HealthTrajectoryScan } from '@/components/scans/HealthTrajectoryScan';
import { RiskHeatmapScan } from '@/components/scans/RiskHeatmapScan';
import { MentalBurnoutScan } from '@/components/scans/MentalBurnoutScan';
import { FutureHealthProjectionScan } from '@/components/scans/FutureHealthProjectionScan';
import { HealthRegressionScan } from '@/components/scans/HealthRegressionScan';
import { HealthWisdomEngine } from '@/components/wisdom/HealthWisdomEngine';
import { FutureReadinessIndex } from '@/components/wisdom/FutureReadinessIndex';
import { PersonalHealthPhilosophy } from '@/components/wisdom/PersonalHealthPhilosophy';

// 20 Premium Features Data
const PREMIUM_FEATURES = [
  {
    id: 'digital-twin',
    name: 'Personal Health Digital Twin',
    description: 'Continuously simulates your body and predicts future health scenarios based on lifestyle changes',
    icon: Brain,
    category: 'predictive',
    color: 'from-primary to-coral'
  },
  {
    id: '10-year-forecast',
    name: '10-Year Health Forecast Engine',
    description: 'Shows best-case, worst-case, and most-likely future health outcomes over the next decade',
    icon: TrendingUp,
    category: 'predictive',
    color: 'from-success to-teal-400'
  },
  {
    id: 'disease-interaction',
    name: 'AI Disease Interaction Predictor',
    description: 'Models how multiple health risks interact with each other for comprehensive risk assessment',
    icon: Activity,
    category: 'analysis',
    color: 'from-warning to-orange-500'
  },
  {
    id: 'doctor-explainability',
    name: 'Doctor-Grade Explainability Mode',
    description: 'Provides deeper clinical-style reasoning and correlation insights for professional understanding',
    icon: FileText,
    category: 'transparency',
    color: 'from-coral to-pink-500'
  },
  {
    id: 'private-coach',
    name: 'Private AI Health Coach',
    description: 'Long-term memory, adaptive guidance style, and emotional awareness for personalized coaching',
    icon: MessageSquare,
    category: 'coaching',
    color: 'from-primary to-indigo-500'
  },
  {
    id: 'burnout-warning',
    name: 'Burnout & Mental Collapse Early-Warning',
    description: 'Detects emotional and cognitive overload before crisis using advanced pattern recognition',
    icon: AlertTriangle,
    category: 'mental',
    color: 'from-destructive to-red-400'
  },
  {
    id: 'decision-simulator',
    name: 'Health Decision Simulator',
    description: 'Test "what-if" lifestyle and health decisions before committing to changes',
    icon: Target,
    category: 'simulation',
    color: 'from-success to-emerald-400'
  },
  {
    id: 'report-interpreter',
    name: 'AI Medical Report Interpreter',
    description: 'Explains uploaded lab reports and medical documents in simple, understandable language',
    icon: Eye,
    category: 'analysis',
    color: 'from-primary to-blue-500'
  },
  {
    id: 'confidence-analytics',
    name: 'Advanced Risk Confidence Analytics',
    description: 'Exposes uncertainty, sensitivity, and data-quality impact on predictions',
    icon: BarChart3,
    category: 'transparency',
    color: 'from-warning to-amber-500'
  },
  {
    id: 'cognitive-index',
    name: 'Cognitive & Focus Health Index',
    description: 'Tracks mental clarity, attention stability, and decision fatigue over time',
    icon: Lightbulb,
    category: 'mental',
    color: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'genetic-layer',
    name: 'Genetic Awareness Layer',
    description: 'Adjusts risk probabilities when user-provided genetic context is available',
    icon: Dna,
    category: 'analysis',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'regression-detection',
    name: 'Health Regression Detection',
    description: 'Identifies when health worsens after improvement and explains potential causes',
    icon: TrendingUp,
    category: 'monitoring',
    color: 'from-destructive to-orange-500'
  },
  {
    id: 'literature-intelligence',
    name: 'AI Medical Literature Intelligence',
    description: 'Summarizes relevant, up-to-date medical research and guidelines personalized for you',
    icon: FileText,
    category: 'research',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    id: 'doctor-collaboration',
    name: 'Doctor Collaboration Mode',
    description: 'Enables secure sharing of AI-generated reports with doctors and allows annotations',
    icon: Users,
    category: 'collaboration',
    color: 'from-primary to-coral'
  },
  {
    id: 'personalized-alerts',
    name: 'Personalized Alert Intelligence',
    description: 'Adapts notification timing and tone based on user behavior and anxiety levels',
    icon: Bell,
    category: 'coaching',
    color: 'from-coral to-rose-500'
  },
  {
    id: 'recovery-probability',
    name: 'Recovery Probability Score',
    description: 'Estimates how likely your body is to recover if actions are taken immediately',
    icon: HeartPulse,
    category: 'predictive',
    color: 'from-success to-green-400'
  },
  {
    id: 'priority-optimizer',
    name: 'Health Priority Optimizer',
    description: 'Identifies the single most impactful action to focus on first for maximum benefit',
    icon: Target,
    category: 'coaching',
    color: 'from-primary to-violet-500'
  },
  {
    id: 'emotional-heatmap',
    name: 'Emotional Health Heatmap',
    description: 'Visualizes long-term emotional stress and burnout patterns in an intuitive format',
    icon: Flame,
    category: 'mental',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'mentor-personas',
    name: 'Custom AI Health Mentor Personas',
    description: 'Choose coaching styles: calm, strict, scientific, or friendly based on your preference',
    icon: Sparkles,
    category: 'coaching',
    color: 'from-pink-400 to-purple-500'
  },
  {
    id: 'health-vault',
    name: 'Premium Health Vault',
    description: 'Secure storage for medical records, AI summaries, reports, and long-term health history',
    icon: Lock,
    category: 'storage',
    color: 'from-slate-500 to-gray-600'
  },
  {
    id: 'wisdom-layer',
    name: 'AI Wisdom Layer',
    description: 'Meta-AI intelligence that adapts communication based on your emotional and cognitive state',
    icon: Lightbulb,
    category: 'coaching',
    color: 'from-lavender-dark to-purple-500'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Features', icon: Zap },
  { id: 'predictive', label: 'Predictive AI', icon: Brain },
  { id: 'analysis', label: 'Analysis', icon: BarChart3 },
  { id: 'mental', label: 'Mental Health', icon: Heart },
  { id: 'coaching', label: 'AI Coaching', icon: MessageSquare },
  { id: 'transparency', label: 'Transparency', icon: Eye }
];

// Feature Demo Components
function DigitalTwinDemo() {
  const [lifestyle, setLifestyle] = useState({ exercise: 50, sleep: 70, diet: 60, stress: 40 });
  
  const healthScore = Math.round((lifestyle.exercise * 0.3 + lifestyle.sleep * 0.25 + lifestyle.diet * 0.25 + (100 - lifestyle.stress) * 0.2));
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
            <circle 
              cx="80" cy="80" r="70" stroke="url(#gradient)" strokeWidth="8" fill="none" 
              strokeDasharray={440} strokeDashoffset={440 - (440 * healthScore / 100)} 
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--coral))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold">{healthScore}</span>
            <span className="text-xs text-muted-foreground">Digital Twin Score</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(lifestyle).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{key}</span>
              <span className="text-muted-foreground">{value}%</span>
            </div>
            <Slider 
              value={[value]} 
              onValueChange={([v]) => setLifestyle(prev => ({ ...prev, [key]: v }))}
              max={100} 
              step={1}
            />
          </div>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Adjust lifestyle factors to see how they affect your digital twin's health projection
      </p>
    </div>
  );
}

function TenYearForecastDemo() {
  const scenarios = [
    { name: 'Best Case', value: 92, color: 'bg-success' },
    { name: 'Most Likely', value: 74, color: 'bg-primary' },
    { name: 'Worst Case', value: 45, color: 'bg-destructive' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {scenarios.map((scenario, i) => (
          <motion.div 
            key={scenario.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-24 text-sm font-medium">{scenario.name}</div>
            <div className="flex-1 bg-muted/30 rounded-full h-6 overflow-hidden">
              <motion.div 
                className={`h-full ${scenario.color} rounded-full flex items-center justify-end px-2`}
                initial={{ width: 0 }}
                animate={{ width: `${scenario.value}%` }}
                transition={{ delay: i * 0.2 + 0.3, duration: 0.8 }}
              >
                <span className="text-xs font-bold text-white">{scenario.value}%</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          Key Factors for Best Outcome
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Maintain 150+ minutes weekly exercise</li>
          <li>• Consistent 7-8 hours sleep pattern</li>
          <li>• Stress management below 40%</li>
        </ul>
      </div>
    </div>
  );
}

function BurnoutWarningDemo() {
  const indicators = [
    { name: 'Cognitive Load', value: 72, threshold: 80, icon: Brain },
    { name: 'Emotional Drain', value: 58, threshold: 70, icon: Heart },
    { name: 'Physical Fatigue', value: 45, threshold: 75, icon: Activity },
    { name: 'Sleep Debt', value: 65, threshold: 60, icon: Clock }
  ];
  
  return (
    <div className="space-y-4">
      {indicators.map((indicator) => {
        const isWarning = indicator.value >= indicator.threshold;
        return (
          <div key={indicator.name} className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isWarning ? 'bg-destructive/20 text-destructive' : 'bg-muted'}`}>
              <indicator.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{indicator.name}</span>
                <span className={isWarning ? 'text-destructive font-medium' : ''}>
                  {indicator.value}%
                </span>
              </div>
              <Progress 
                value={indicator.value} 
                className={`h-2 ${isWarning ? '[&>div]:bg-destructive' : ''}`}
              />
            </div>
            {isWarning && <AlertTriangle className="w-4 h-4 text-destructive" />}
          </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
        <p className="text-sm font-medium text-warning flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Sleep Debt exceeds safe threshold
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Consider prioritizing rest tonight to prevent burnout cascade
        </p>
      </div>
    </div>
  );
}

function DecisionSimulatorDemo() {
  const [decision, setDecision] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const simulate = () => {
    if (!decision) return;
    setSimulating(true);
    setTimeout(() => {
      setResult({
        impact: Math.random() > 0.5 ? 'positive' : 'mixed',
        healthChange: Math.round((Math.random() - 0.3) * 20),
        timeToEffect: Math.round(Math.random() * 12) + 1,
        confidence: Math.round(Math.random() * 30) + 70
      });
      setSimulating(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Describe a health decision to simulate:</label>
        <Textarea 
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="e.g., Start running 30 minutes daily, reduce sugar intake..."
          rows={3}
        />
      </div>
      
      <Button onClick={simulate} disabled={!decision || simulating} className="w-full">
        {simulating ? 'Simulating...' : 'Simulate Decision'}
      </Button>
      
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-muted/30 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between">
              <span className="text-sm">Health Impact</span>
              <Badge className={result.healthChange > 0 ? 'bg-success' : 'bg-warning'}>
                {result.healthChange > 0 ? '+' : ''}{result.healthChange}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Time to Effect</span>
              <span className="text-sm font-medium">{result.timeToEffect} weeks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Prediction Confidence</span>
              <span className="text-sm font-medium">{result.confidence}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PremiumDashboard() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  const filteredFeatures = activeCategory === 'all' 
    ? PREMIUM_FEATURES 
    : PREMIUM_FEATURES.filter(f => f.category === activeCategory);
  
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <Crown className="w-20 h-20 mx-auto text-warning mb-6" />
            <h1 className="text-3xl font-bold mb-4">Premium Features</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Upgrade to Premium to access 20 advanced AI-powered health intelligence features
            </p>
            <Button onClick={() => navigate('/account')} className="bg-gradient-to-r from-primary to-coral">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now - Just ₹1
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const renderFeatureDemo = (featureId: string) => {
    switch (featureId) {
      case 'digital-twin': return <DigitalTwin />;
      case '10-year-forecast': return <TenYearForecast />;
      case 'disease-interaction': return <DiseaseInteractionPredictor />;
      case 'doctor-explainability': return <DoctorExplainability />;
      case 'private-coach': return <PrivateAICoach />;
      case 'burnout-warning': return <BurnoutWarning />;
      case 'decision-simulator': return <DecisionSimulator />;
      case 'report-interpreter': return <MedicalReportInterpreter />;
      case 'confidence-analytics': return <ConfidenceAnalytics />;
      case 'cognitive-index': return <CognitiveIndex />;
      case 'genetic-layer': return <GeneticLayer />;
      case 'regression-detection': return <RegressionDetection />;
      case 'literature-intelligence': return <LiteratureIntelligence />;
      case 'personalized-alerts': return <PersonalizedAlerts />;
      case 'recovery-probability': return <RecoveryProbability />;
      case 'priority-optimizer': return <HealthPriorityOptimizer />;
      case 'emotional-heatmap': return <EmotionalHeatmap />;
      case 'health-vault': return <Body3DVisualization />;
      case 'health-trajectory': return <HealthTrajectoryScan />;
      case 'risk-heatmap': return <RiskHeatmapScan />;
      case 'mental-burnout': return <MentalBurnoutScan />;
      case 'future-projection': return <FutureHealthProjectionScan />;
      case 'health-regression': return <HealthRegressionScan />;
      case 'wisdom-layer': return (
        <div className="grid md:grid-cols-3 gap-4">
          <HealthWisdomEngine userStress={45} userEngagement={72} trustLevel={80} />
          <PersonalHealthPhilosophy />
          <FutureReadinessIndex />
        </div>
      );
      default: return (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Feature coming soon!</p>
        </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/account')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Button>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Premium Dashboard</h1>
                <Badge className="bg-gradient-to-r from-primary to-coral text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Access all 20 advanced AI-powered health intelligence features
              </p>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className="gap-2"
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </Button>
            ))}
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/20 group ${
                    selectedFeature === feature.id ? 'ring-2 ring-primary shadow-lg shadow-primary/30' : ''
                  }`}
                  onClick={() => setSelectedFeature(feature.id === selectedFeature ? null : feature.id)}
                >
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{feature.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{feature.description}</p>
                    <div className="mt-3 flex items-center text-xs text-primary group-hover:gap-1 transition-all">
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Selected Feature Demo */}
          <AnimatePresence>
            {selectedFeature && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-coral/10">
                    <CardTitle className="flex items-center gap-3">
                      {(() => {
                        const feature = PREMIUM_FEATURES.find(f => f.id === selectedFeature);
                        if (!feature) return null;
                        return (
                          <>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            {feature.name}
                          </>
                        );
                      })()}
                    </CardTitle>
                    <CardDescription>
                      {PREMIUM_FEATURES.find(f => f.id === selectedFeature)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {renderFeatureDemo(selectedFeature)}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Quick Stats for Premium */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">20</p>
                <p className="text-xs text-muted-foreground">Premium Features</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-success/5 to-success/10">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto text-success mb-2" />
                <p className="text-2xl font-bold">∞</p>
                <p className="text-xs text-muted-foreground">Unlimited Access</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-coral/5 to-coral/10">
              <CardContent className="p-4 text-center">
                <Lock className="w-8 h-8 mx-auto text-coral mb-2" />
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground">Data Secured</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-warning/5 to-warning/10">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto text-warning mb-2" />
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-muted-foreground">AI Support</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
