import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  stats: any;
}

export function VocabularyBuilder({ stats }: Props) {
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [savedTerms, setSavedTerms] = useState<string[]>([]);

  const vocabulary = useMemo(() => {
    const terms: any[] = [];

    // Add relevant terms based on user's health patterns
    if (stats?.avgSleepHours !== undefined) {
      terms.push({
        id: 'circadian',
        term: 'Circadian Rhythm',
        simple: 'Your body\'s internal 24-hour clock',
        detailed: 'The natural cycle that tells your body when to sleep, wake, and eat. Disrupting it affects energy, mood, and health.',
        relevance: 'Relevant to your sleep patterns',
        category: 'Sleep'
      });
      terms.push({
        id: 'rem',
        term: 'REM Sleep',
        simple: 'Deep sleep stage where you dream',
        detailed: 'Rapid Eye Movement sleep is crucial for memory, learning, and emotional processing. Adults need 90-120 minutes per night.',
        relevance: 'Important for sleep quality',
        category: 'Sleep'
      });
    }

    if (stats?.avgStressLevel !== undefined) {
      terms.push({
        id: 'cortisol',
        term: 'Cortisol',
        simple: 'The "stress hormone" in your body',
        detailed: 'Released during stress, it\'s useful short-term but harmful when chronically elevated. Affects weight, sleep, and immunity.',
        relevance: 'Connected to your stress levels',
        category: 'Stress'
      });
      terms.push({
        id: 'hpa',
        term: 'HPA Axis',
        simple: 'Your body\'s stress response system',
        detailed: 'The Hypothalamic-Pituitary-Adrenal axis controls stress hormones. Chronic stress can dysregulate this system.',
        relevance: 'Key to understanding stress effects',
        category: 'Stress'
      });
    }

    if (stats?.avgDietQuality !== undefined) {
      terms.push({
        id: 'glycemic',
        term: 'Glycemic Index',
        simple: 'How fast food raises blood sugar',
        detailed: 'Low GI foods provide steady energy; high GI foods cause spikes and crashes. Affects mood, energy, and weight.',
        relevance: 'Related to your diet quality',
        category: 'Diet'
      });
      terms.push({
        id: 'micronutrients',
        term: 'Micronutrients',
        simple: 'Vitamins and minerals your body needs',
        detailed: 'Essential nutrients needed in small amounts: vitamins A, B, C, D, E, K and minerals like iron, zinc, and magnesium.',
        relevance: 'Important for overall nutrition',
        category: 'Diet'
      });
    }

    if (stats?.avgActivityMinutes !== undefined) {
      terms.push({
        id: 'vo2max',
        term: 'VO2 Max',
        simple: 'Your body\'s oxygen efficiency',
        detailed: 'Maximum oxygen your body can use during exercise. Higher is better and is linked to longevity and heart health.',
        relevance: 'Relates to your fitness level',
        category: 'Activity'
      });
      terms.push({
        id: 'mets',
        term: 'METs',
        simple: 'Measure of exercise intensity',
        detailed: 'Metabolic Equivalent of Task. Walking = 3-4 METs, Running = 8-12 METs. Used to calculate calories burned.',
        relevance: 'Helps measure activity impact',
        category: 'Activity'
      });
    }

    // General health terms
    terms.push({
      id: 'biomarkers',
      term: 'Biomarkers',
      simple: 'Measurable signs of health or disease',
      detailed: 'Biological indicators like blood pressure, cholesterol, blood sugar that help assess health status and disease risk.',
      relevance: 'Key health indicators',
      category: 'General'
    });

    return terms;
  }, [stats]);

  const toggleTerm = (id: string) => {
    setExpandedTerms(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleSaved = (id: string) => {
    setSavedTerms(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sleep': return 'bg-lavender text-lavender-dark';
      case 'Stress': return 'bg-coral/20 text-coral';
      case 'Diet': return 'bg-mint text-mint-dark';
      case 'Activity': return 'bg-ocean-light text-ocean-dark';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-lavender/20">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Personal Health Vocabulary Builder
        </CardTitle>
        <CardDescription>
          Medical terms relevant to your health profile
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {vocabulary.length > 0 ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{vocabulary.length} terms</span>
              <span className="text-muted-foreground">{savedTerms.length} saved</span>
            </div>

            <div className="space-y-2">
              {vocabulary.map((term, i) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border rounded-xl overflow-hidden"
                >
                  <div 
                    className="p-3 bg-muted/30 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleTerm(term.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{term.term}</span>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(term.category)}`}>
                        {term.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaved(term.id);
                        }}
                      >
                        <Bookmark 
                          className={`w-4 h-4 ${savedTerms.includes(term.id) ? 'fill-primary text-primary' : ''}`} 
                        />
                      </Button>
                      {expandedTerms.includes(term.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTerms.includes(term.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-3 bg-background space-y-2"
                      >
                        <div>
                          <p className="text-xs text-muted-foreground">Simple Definition</p>
                          <p className="text-sm">{term.simple}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Detailed</p>
                          <p className="text-sm text-muted-foreground">{term.detailed}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {term.relevance}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to get personalized vocabulary</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
