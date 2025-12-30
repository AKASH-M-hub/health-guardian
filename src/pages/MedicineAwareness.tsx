import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Pill, Search, ArrowLeft, AlertTriangle, Info, Heart, Brain, Droplets, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface MedicineCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  usedFor: string[];
  commonSideEffects: string[];
  warnings: string[];
  color: string;
}

const MEDICINE_CATEGORIES: MedicineCategory[] = [
  {
    id: 'analgesics',
    name: 'Pain Relievers (Analgesics)',
    icon: Shield,
    description: 'Medications used to relieve pain without causing loss of consciousness.',
    usedFor: ['Headaches', 'Muscle pain', 'Arthritis', 'Post-surgical pain', 'Chronic pain conditions'],
    commonSideEffects: ['Stomach upset', 'Drowsiness', 'Dizziness', 'Nausea'],
    warnings: ['May interact with blood thinners', 'Long-term use may affect liver/kidney', 'Not recommended during pregnancy without consultation'],
    color: 'coral'
  },
  {
    id: 'antihypertensives',
    name: 'Blood Pressure Medications',
    icon: Heart,
    description: 'Medications that help lower and control high blood pressure.',
    usedFor: ['Hypertension', 'Heart failure', 'Kidney protection', 'Stroke prevention'],
    commonSideEffects: ['Dizziness', 'Fatigue', 'Frequent urination', 'Dry cough (some types)'],
    warnings: ['Should not be stopped suddenly', 'Regular monitoring required', 'May cause low blood pressure if dosage is too high'],
    color: 'ocean'
  },
  {
    id: 'antidiabetics',
    name: 'Diabetes Medications',
    icon: Droplets,
    description: 'Medications used to manage blood sugar levels in diabetic patients.',
    usedFor: ['Type 2 diabetes', 'Blood sugar control', 'Prevention of diabetic complications'],
    commonSideEffects: ['Low blood sugar', 'Weight changes', 'Digestive issues', 'Dizziness'],
    warnings: ['Requires regular blood sugar monitoring', 'Diet and exercise are essential companions', 'May interact with alcohol'],
    color: 'mint'
  },
  {
    id: 'statins',
    name: 'Cholesterol Medications',
    icon: Heart,
    description: 'Medications that help lower cholesterol levels in the blood.',
    usedFor: ['High cholesterol', 'Cardiovascular disease prevention', 'Post heart attack care'],
    commonSideEffects: ['Muscle pain', 'Digestive problems', 'Headache', 'Sleep disturbances'],
    warnings: ['Regular liver function tests may be needed', 'Grapefruit may interact', 'Muscle pain should be reported immediately'],
    color: 'lavender'
  },
  {
    id: 'antidepressants',
    name: 'Mental Health Medications',
    icon: Brain,
    description: 'Medications used to treat depression, anxiety, and related conditions.',
    usedFor: ['Depression', 'Anxiety disorders', 'Panic disorders', 'OCD', 'PTSD'],
    commonSideEffects: ['Drowsiness', 'Weight changes', 'Sleep changes', 'Dry mouth'],
    warnings: ['Takes weeks to show full effect', 'Should not be stopped abruptly', 'May increase suicidal thoughts initially in young adults'],
    color: 'ocean'
  },
  {
    id: 'antibiotics',
    name: 'Antibiotics',
    icon: Shield,
    description: 'Medications that fight bacterial infections.',
    usedFor: ['Bacterial infections', 'Respiratory infections', 'Urinary tract infections', 'Skin infections'],
    commonSideEffects: ['Digestive upset', 'Allergic reactions', 'Yeast infections', 'Sun sensitivity'],
    warnings: ['Complete the full course', 'Not effective against viruses', 'May reduce effectiveness of birth control'],
    color: 'mint'
  }
];

export default function MedicineAwareness() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = MEDICINE_CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.usedFor.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Pill className="w-8 h-8 text-primary" />
              Medicine Awareness
            </h1>
            <p className="text-muted-foreground">Educational information about common medication categories</p>
          </div>

          {/* Important Disclaimer */}
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-warning mb-1">Important Disclaimer</h3>
                  <p className="text-sm text-muted-foreground">
                    This information is for <strong>educational purposes only</strong>. We do not provide:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Specific drug names or brands</li>
                    <li>• Dosage recommendations</li>
                    <li>• Instructions to take any medication</li>
                    <li>• Medical prescriptions or advice</li>
                  </ul>
                  <p className="text-sm font-medium mt-3">
                    Always consult a qualified healthcare professional before taking any medication.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medication categories..."
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {filteredCategories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={category.id} className="border-none">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-12 h-12 rounded-xl bg-${category.color}-light flex items-center justify-center`}>
                            <category.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="grid gap-6 mt-4">
                          {/* Used For */}
                          <div>
                            <h4 className="font-medium flex items-center gap-2 mb-3">
                              <Info className="w-4 h-4 text-primary" />
                              Commonly Used For
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {category.usedFor.map(use => (
                                <Badge key={use} variant="secondary">{use}</Badge>
                              ))}
                            </div>
                          </div>

                          {/* Side Effects */}
                          <div>
                            <h4 className="font-medium flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-4 h-4 text-warning" />
                              Common Side Effects
                            </h4>
                            <ul className="grid sm:grid-cols-2 gap-2">
                              {category.commonSideEffects.map(effect => (
                                <li key={effect} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                                  {effect}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Warnings */}
                          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                            <h4 className="font-medium flex items-center gap-2 mb-3 text-destructive">
                              <AlertTriangle className="w-4 h-4" />
                              Important Warnings
                            </h4>
                            <ul className="space-y-2">
                              {category.warnings.map(warning => (
                                <li key={warning} className="text-sm flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <Card className="mt-8 border-dashed">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                For personalized medical advice, dosage information, or specific drug recommendations,
                please consult with your healthcare provider or pharmacist.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/hospital-finder')}>
                <MapPin className="w-4 h-4 mr-2" />
                Find Healthcare Providers Near You
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

// Fix missing import
import { MapPin } from 'lucide-react';
