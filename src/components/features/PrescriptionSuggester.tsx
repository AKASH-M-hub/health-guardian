import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pill, AlertTriangle, Search, Sparkles, RefreshCw, Clock, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MedicineSuggestion {
  name: string;
  type: string;
  purpose: string;
  dosage: string;
  precautions: string[];
  alternatives: string[];
}

export function PrescriptionSuggester() {
  const [symptoms, setSymptoms] = useState('');
  const [condition, setCondition] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<MedicineSuggestion[]>([]);

  const analyzeSymptomsAndSuggest = async () => {
    if (!symptoms && !condition) {
      toast({
        title: 'Input Required',
        description: 'Please describe your symptoms or condition',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `As a medical AI assistant, suggest over-the-counter medications for the following:
            Symptoms: ${symptoms}
            Condition: ${condition}
            
            Provide 2-3 medication suggestions in JSON format:
            [{"name":"Medicine Name","type":"Type (Tablet/Syrup/etc)","purpose":"What it treats","dosage":"Recommended dosage","precautions":["precaution1","precaution2"],"alternatives":["alt1","alt2"]}]
            
            IMPORTANT: Only suggest common OTC medicines. Do not suggest prescription medications.`
          }]
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestions');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }
      }

      // Parse SSE response
      const lines = fullContent.split('\n').filter(line => line.startsWith('data: '));
      let aiResponse = '';
      for (const line of lines) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr && jsonStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(jsonStr);
            aiResponse += parsed.choices?.[0]?.delta?.content || '';
          } catch {}
        }
      }

      // Extract JSON array
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setSuggestions(data);
      } else {
        // Fallback suggestions
        setSuggestions([
          {
            name: 'Paracetamol',
            type: 'Tablet',
            purpose: 'Pain relief and fever reduction',
            dosage: '500mg every 4-6 hours as needed',
            precautions: ['Do not exceed 4g daily', 'Avoid alcohol'],
            alternatives: ['Ibuprofen', 'Aspirin']
          }
        ]);
      }

      toast({
        title: 'Analysis Complete',
        description: 'Medicine suggestions generated based on your input'
      });
    } catch (error) {
      console.error('Analysis error:', error);
      // Provide fallback suggestions
      setSuggestions([
        {
          name: 'Consult a Pharmacist',
          type: 'Recommendation',
          purpose: 'For personalized medication advice',
          dosage: 'Visit your local pharmacy',
          precautions: ['Describe all symptoms to the pharmacist', 'Mention any allergies'],
          alternatives: ['Consult a doctor for prescription medications']
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          AI Prescription Suggester
        </CardTitle>
        <CardDescription>
          Get OTC medicine suggestions based on your symptoms (not a prescription)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Disclaimer Banner */}
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-warning">Medical Disclaimer</p>
            <p className="text-muted-foreground">
              This tool suggests common OTC medications only. Always consult a doctor or pharmacist before taking any medicine. This is NOT a prescription.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Describe Your Symptoms</label>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., headache, fever, body pain, cold, cough..."
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Known Condition (Optional)</label>
            <Input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., common cold, seasonal allergy, mild fever..."
            />
          </div>
          <Button 
            onClick={analyzeSymptomsAndSuggest} 
            disabled={isAnalyzing || (!symptoms && !condition)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Get Medicine Suggestions
              </>
            )}
          </Button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Suggested Medications
            </h3>

            {suggestions.map((med, index) => (
              <motion.div
                key={med.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/20 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Pill className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{med.name}</p>
                      <Badge variant="outline">{med.type}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Purpose:</span> {med.purpose}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Dosage:</span> {med.dosage}
                    </div>
                  </div>
                </div>

                {med.precautions.length > 0 && (
                  <div className="bg-warning/10 rounded p-3">
                    <p className="text-xs font-medium text-warning mb-1">Precautions:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {med.precautions.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {med.alternatives.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Alternatives:</span>
                    {med.alternatives.map((alt, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Safety Reminder */}
            <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-success">Safety Reminder</p>
                <p className="text-muted-foreground">
                  Check for allergies before taking any medication. If symptoms persist for more than 3 days, consult a healthcare professional.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
