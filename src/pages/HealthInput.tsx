import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Activity, Brain, Utensils, Droplets, Heart, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function HealthInput() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sleepHours: 7,
    sleepQuality: 5,
    stressLevel: 5,
    mood: 5,
    dietQuality: 5,
    physicalActivityMinutes: 30,
    activityIntensity: 'moderate',
    waterIntake: 2,
    heartRate: 72,
    notes: ''
  });

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Please log in', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('health_entries').insert({
        user_id: user.id,
        sleep_hours: formData.sleepHours,
        sleep_quality: formData.sleepQuality,
        stress_level: formData.stressLevel,
        mood: formData.mood,
        diet_quality: formData.dietQuality,
        physical_activity_minutes: formData.physicalActivityMinutes,
        activity_intensity: formData.activityIntensity,
        water_intake_liters: formData.waterIntake,
        heart_rate: formData.heartRate,
        notes: formData.notes
      });

      if (error) throw error;
      
      toast({ title: 'Health data saved!', description: 'Your entry has been recorded successfully.' });
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: 'Error saving data', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const SliderField = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    min = 1, 
    max = 10, 
    step = 1,
    unit = '',
    color = 'primary'
  }: { 
    label: string; 
    icon: any; 
    value: number; 
    onChange: (v: number) => void; 
    min?: number; 
    max?: number; 
    step?: number;
    unit?: string;
    color?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Icon className="w-4 h-4 text-primary" />
          {label}
        </Label>
        <span className="text-lg font-semibold text-primary">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Log Health Data</h1>
            <p className="text-muted-foreground">Track your daily health metrics for better insights</p>
          </div>

          <div className="grid gap-6">
            {/* Sleep Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-lavender-dark" />
                  Sleep Metrics
                </CardTitle>
                <CardDescription>How well did you sleep?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderField
                  label="Sleep Duration"
                  icon={Moon}
                  value={formData.sleepHours}
                  onChange={(v) => setFormData(p => ({ ...p, sleepHours: v }))}
                  min={0}
                  max={12}
                  step={0.5}
                  unit="h"
                />
                <SliderField
                  label="Sleep Quality"
                  icon={Moon}
                  value={formData.sleepQuality}
                  onChange={(v) => setFormData(p => ({ ...p, sleepQuality: v }))}
                />
              </CardContent>
            </Card>

            {/* Mental Health Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-coral" />
                  Mental Wellness
                </CardTitle>
                <CardDescription>How are you feeling mentally?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderField
                  label="Stress Level"
                  icon={Brain}
                  value={formData.stressLevel}
                  onChange={(v) => setFormData(p => ({ ...p, stressLevel: v }))}
                />
                <SliderField
                  label="Mood"
                  icon={Brain}
                  value={formData.mood}
                  onChange={(v) => setFormData(p => ({ ...p, mood: v }))}
                />
              </CardContent>
            </Card>

            {/* Physical Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-mint-dark" />
                  Physical Activity
                </CardTitle>
                <CardDescription>Track your movement and exercise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderField
                  label="Activity Duration"
                  icon={Activity}
                  value={formData.physicalActivityMinutes}
                  onChange={(v) => setFormData(p => ({ ...p, physicalActivityMinutes: v }))}
                  min={0}
                  max={180}
                  step={5}
                  unit=" min"
                />
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Activity Intensity
                  </Label>
                  <Select 
                    value={formData.activityIntensity}
                    onValueChange={(v) => setFormData(p => ({ ...p, activityIntensity: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (Walking, Stretching)</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate (Jogging, Cycling)</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="intense">Intense (Running, HIIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-ocean" />
                  Nutrition & Hydration
                </CardTitle>
                <CardDescription>Track your diet and water intake</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderField
                  label="Diet Quality"
                  icon={Utensils}
                  value={formData.dietQuality}
                  onChange={(v) => setFormData(p => ({ ...p, dietQuality: v }))}
                />
                <SliderField
                  label="Water Intake"
                  icon={Droplets}
                  value={formData.waterIntake}
                  onChange={(v) => setFormData(p => ({ ...p, waterIntake: v }))}
                  min={0}
                  max={5}
                  step={0.5}
                  unit="L"
                />
              </CardContent>
            </Card>

            {/* Vitals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-coral" />
                  Vital Signs
                </CardTitle>
                <CardDescription>Optional: Track your heart rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderField
                  label="Resting Heart Rate"
                  icon={Heart}
                  value={formData.heartRate}
                  onChange={(v) => setFormData(p => ({ ...p, heartRate: v }))}
                  min={40}
                  max={120}
                  unit=" bpm"
                />
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Any other observations about your health today?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How are you feeling overall? Any symptoms or observations..."
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              size="lg" 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Health Data'}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
