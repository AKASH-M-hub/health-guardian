import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, MessageSquare, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  stats: any;
}

export function DoctorRehearsalAI({ stats }: Props) {
  const [concern, setConcern] = useState('');
  const [rehearsal, setRehearsal] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateRehearsal = () => {
    if (!concern.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const template = {
        opening: `"Doctor, I've been tracking my health and noticed some patterns I'd like to discuss."`,
        mainPoints: [
          `"Over the past few weeks, I've experienced ${concern.toLowerCase()}."`,
          stats?.avgSleepHours && `"My sleep has been averaging ${stats.avgSleepHours.toFixed(1)} hours per night."`,
          stats?.avgStressLevel && `"My stress levels have been around ${stats.avgStressLevel.toFixed(0)} out of 10."`,
          stats?.avgMood && `"My overall mood rating is about ${stats.avgMood.toFixed(0)} out of 10."`,
        ].filter(Boolean),
        questions: [
          '"Could these symptoms be related to my lifestyle patterns?"',
          '"What tests might help identify the cause?"',
          '"Are there any immediate lifestyle changes you recommend?"',
          '"Should I be concerned about these patterns?"',
        ],
        closing: `"I've been logging my health data regularly. Would it be helpful if I shared my detailed health report with you?"`,
        tips: [
          'Bring your health data summary to the appointment',
          'Be specific about when symptoms started',
          'Mention any medications or supplements',
          'Ask for clarification if you don\'t understand something',
        ]
      };

      setRehearsal(template);
      setIsGenerating(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    if (!rehearsal) return;
    
    const text = [
      'OPENING:',
      rehearsal.opening,
      '',
      'MAIN POINTS:',
      ...rehearsal.mainPoints,
      '',
      'QUESTIONS TO ASK:',
      ...rehearsal.questions,
      '',
      'CLOSING:',
      rehearsal.closing,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-ocean/10 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-ocean" />
          Doctor-Conversation Rehearsal AI
        </CardTitle>
        <CardDescription>
          Practice explaining your health concerns before consultations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">What health concern do you want to discuss?</label>
          <Textarea
            placeholder="e.g., I've been feeling tired lately, having trouble sleeping, experiencing headaches..."
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button 
            onClick={generateRehearsal}
            disabled={!concern.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MessageSquare className="w-4 h-4 mr-2" />
            )}
            Generate Conversation Script
          </Button>
        </div>

        <AnimatePresence>
          {rehearsal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge>Conversation Script</Badge>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Opening</p>
                <p className="text-sm italic">{rehearsal.opening}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                <p className="text-xs text-muted-foreground">Main Points</p>
                {rehearsal.mainPoints.map((point: string, i: number) => (
                  <p key={i} className="text-sm italic">{point}</p>
                ))}
              </div>

              <div className="p-4 bg-ocean/5 rounded-xl border border-ocean/20 space-y-2">
                <p className="text-xs text-muted-foreground">Questions to Ask</p>
                {rehearsal.questions.map((q: string, i: number) => (
                  <p key={i} className="text-sm italic">{q}</p>
                ))}
              </div>

              <div className="p-4 bg-success/5 rounded-xl border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Closing</p>
                <p className="text-sm italic">{rehearsal.closing}</p>
              </div>

              <div className="p-4 bg-warning/5 rounded-xl border border-warning/20">
                <p className="text-xs font-medium mb-2">💡 Tips for Your Appointment</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {rehearsal.tips.map((tip: string, i: number) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
