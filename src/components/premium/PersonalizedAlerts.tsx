import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Bell, AlertTriangle, Clock, Heart, Brain, Moon, Zap, Settings, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface AlertConfig {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  urgencyLevel: number;
  anxietyAware: boolean;
}

export function PersonalizedAlerts() {
  const [configs, setConfigs] = useState<AlertConfig[]>([
    { id: 'stress', name: 'High Stress Alert', icon: Brain, enabled: true, frequency: 'immediate', urgencyLevel: 70, anxietyAware: true },
    { id: 'sleep', name: 'Sleep Quality Warning', icon: Moon, enabled: true, frequency: 'daily', urgencyLevel: 60, anxietyAware: true },
    { id: 'activity', name: 'Activity Reminder', icon: Zap, enabled: true, frequency: 'daily', urgencyLevel: 40, anxietyAware: false },
    { id: 'heart', name: 'Heart Rate Alert', icon: Heart, enabled: false, frequency: 'immediate', urgencyLevel: 80, anxietyAware: true },
    { id: 'regression', name: 'Health Regression', icon: AlertTriangle, enabled: true, frequency: 'weekly', urgencyLevel: 75, anxietyAware: true }
  ]);
  
  const [userAnxietyLevel, setUserAnxietyLevel] = useState(30);
  const [adaptiveTone, setAdaptiveTone] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const updateConfig = (id: string, updates: Partial<AlertConfig>) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case 'immediate': return 'bg-destructive/20 text-destructive';
      case 'daily': return 'bg-warning/20 text-warning';
      case 'weekly': return 'bg-primary/20 text-primary';
      default: return 'bg-muted';
    }
  };

  const getAdaptedTone = (alertName: string) => {
    if (!adaptiveTone) return 'standard';
    if (userAnxietyLevel > 60) return 'gentle';
    if (userAnxietyLevel < 30) return 'direct';
    return 'balanced';
  };

  const getSampleMessage = (config: AlertConfig) => {
    const tone = getAdaptedTone(config.name);
    
    const messages: Record<string, Record<string, string>> = {
      stress: {
        gentle: "Hey there 💙 Your stress seems a bit elevated. When you have a moment, consider a short break.",
        balanced: "Stress Alert: Your stress levels are higher than usual. A 5-minute breathing exercise could help.",
        direct: "⚠️ High Stress Detected - Take immediate action to reduce stress levels."
      },
      sleep: {
        gentle: "Good morning! Your sleep quality was lower than usual. Maybe try an earlier bedtime tonight? 🌙",
        balanced: "Sleep Quality: Below optimal last night. Consider improving sleep hygiene.",
        direct: "Sleep Alert: Poor sleep quality detected. Action recommended."
      },
      activity: {
        gentle: "Friendly reminder: A short walk could boost your energy! 🚶",
        balanced: "Activity Reminder: Time for some movement. 30 minutes of activity recommended.",
        direct: "Activity Alert: Low physical activity today. Exercise needed."
      },
      heart: {
        gentle: "Your heart rate seems a bit different today. Nothing urgent, but worth monitoring. ❤️",
        balanced: "Heart Rate Notice: Unusual pattern detected. Consider checking your vitals.",
        direct: "⚠️ Heart Rate Alert: Abnormal reading. Please verify and consult if needed."
      },
      regression: {
        gentle: "We noticed a small dip in your progress. No worries - let's get back on track together! 💪",
        balanced: "Health Trend: Some metrics have declined. Review your recent habits.",
        direct: "Regression Detected: Health metrics declining. Immediate action recommended."
      }
    };

    return messages[config.id]?.[tone] || "Health alert notification";
  };

  const saveSettings = () => {
    toast({ title: 'Alert Settings Saved', description: 'Your personalized alert preferences have been updated' });
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-coral/10 via-rose-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-rose-500 flex items-center justify-center"
          >
            <Bell className="w-6 h-6 text-white" />
          </motion.div>
          Personalized Alert Intelligence
        </CardTitle>
        <CardDescription>
          Configure adaptive notifications based on your preferences and anxiety levels
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Global Settings */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Global Alert Settings
          </h4>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Your Anxiety Sensitivity Level</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[userAnxietyLevel]}
                  onValueChange={([v]) => setUserAnxietyLevel(v)}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-right">{userAnxietyLevel}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Higher = gentler, more supportive notifications
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Adaptive Tone</Label>
                <p className="text-xs text-muted-foreground">Adjust message tone based on anxiety</p>
              </div>
              <Switch checked={adaptiveTone} onCheckedChange={setAdaptiveTone} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Quiet Hours (10PM - 7AM)</Label>
                <p className="text-xs text-muted-foreground">Reduce notifications at night</p>
              </div>
              <Switch checked={quietHours} onCheckedChange={setQuietHours} />
            </div>
          </div>
        </div>

        {/* Individual Alert Configs */}
        <div className="space-y-3">
          <h4 className="font-semibold">Alert Types</h4>
          
          {configs.map((config) => (
            <motion.div
              key={config.id}
              layout
              className={`rounded-lg border p-4 ${config.enabled ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.enabled ? 'bg-primary/20' : 'bg-muted'}`}>
                    <config.icon className={`w-4 h-4 ${config.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{config.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getFrequencyColor(config.frequency)} variant="outline">
                        {config.frequency}
                      </Badge>
                      {config.anxietyAware && (
                        <Badge variant="outline" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          anxiety-aware
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={config.enabled} 
                  onCheckedChange={(v) => updateConfig(config.id, { enabled: v })}
                />
              </div>

              <AnimatePresence>
                {config.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div>
                      <Label className="text-xs">Urgency Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[config.urgencyLevel]}
                          onValueChange={([v]) => updateConfig(config.id, { urgencyLevel: v })}
                          max={100}
                          className="flex-1"
                        />
                        <span className="text-xs w-10 text-right">{config.urgencyLevel}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {['immediate', 'daily', 'weekly'].map((freq) => (
                        <Badge
                          key={freq}
                          variant={config.frequency === freq ? 'default' : 'outline'}
                          className="cursor-pointer capitalize"
                          onClick={() => updateConfig(config.id, { frequency: freq as any })}
                        >
                          {freq}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(showPreview === config.id ? null : config.id)}
                    >
                      {showPreview === config.id ? 'Hide' : 'Preview'} Alert Message
                    </Button>

                    {showPreview === config.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-background border rounded-lg p-3"
                      >
                        <div className="flex items-start gap-2">
                          <Bell className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">SDOP Health</p>
                            <p className="text-xs text-muted-foreground">{getSampleMessage(config)}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Tone: {getAdaptedTone(config.name)}
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <Button onClick={saveSettings} className="w-full bg-gradient-to-r from-coral to-rose-500">
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Alert Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
