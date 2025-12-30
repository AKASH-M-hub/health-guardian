import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Moon, Utensils, TrendingUp, TrendingDown, Minus, ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function RiskAnalysis() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHealthData();
  }, [user]);

  const fetchHealthData = async () => {
    try {
      const { data: entries } = await supabase
        .from('health_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('entry_date', { ascending: false })
        .limit(30);

      setHealthData(entries || []);
      
      // Calculate risk assessment from data
      if (entries && entries.length > 0) {
        calculateRiskAssessment(entries);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskAssessment = (entries: any[]) => {
    const latest = entries[0];
    const avgSleep = entries.reduce((a, b) => a + (b.sleep_hours || 7), 0) / entries.length;
    const avgStress = entries.reduce((a, b) => a + (b.stress_level || 5), 0) / entries.length;
    const avgDiet = entries.reduce((a, b) => a + (b.diet_quality || 5), 0) / entries.length;
    const avgActivity = entries.reduce((a, b) => a + (b.physical_activity_minutes || 30), 0) / entries.length;

    // Calculate risk scores (inverse for positive metrics)
    const sleepRisk = avgSleep < 6 ? 70 : avgSleep < 7 ? 40 : 20;
    const stressRisk = avgStress > 7 ? 70 : avgStress > 5 ? 40 : 20;
    const dietRisk = avgDiet < 4 ? 70 : avgDiet < 6 ? 40 : 20;
    const activityRisk = avgActivity < 20 ? 70 : avgActivity < 40 ? 40 : 20;

    const overallRisk = Math.round((sleepRisk + stressRisk + dietRisk + activityRisk) / 4);
    const riskLevel = overallRisk > 60 ? 'High' : overallRisk > 35 ? 'Moderate' : 'Low';

    setRiskAssessment({
      overall: overallRisk,
      level: riskLevel,
      categories: {
        sleep: { score: sleepRisk, avg: avgSleep.toFixed(1) },
        stress: { score: stressRisk, avg: avgStress.toFixed(1) },
        diet: { score: dietRisk, avg: avgDiet.toFixed(1) },
        activity: { score: activityRisk, avg: avgActivity.toFixed(0) }
      },
      factors: [
        { name: 'Sleep', value: 100 - sleepRisk },
        { name: 'Stress Management', value: 100 - stressRisk },
        { name: 'Diet', value: 100 - dietRisk },
        { name: 'Physical Activity', value: 100 - activityRisk },
        { name: 'Consistency', value: Math.min(entries.length * 10, 100) }
      ]
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-success';
      case 'Moderate': return 'text-warning';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low': return <Badge className="bg-success/20 text-success border-success/30">Low Risk</Badge>;
      case 'Moderate': return <Badge className="bg-warning/20 text-warning border-warning/30">Moderate Risk</Badge>;
      case 'High': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">High Risk</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const trendData = healthData.slice(0, 14).reverse().map((entry, i) => ({
    day: `Day ${i + 1}`,
    sleep: entry.sleep_hours || 0,
    stress: entry.stress_level || 0,
    mood: entry.mood || 0,
    activity: (entry.physical_activity_minutes || 0) / 10
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Risk Analysis</h1>
            <p className="text-muted-foreground">AI-powered health risk assessment based on your data</p>
          </div>

          {healthData.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Health Data Yet</h3>
                <p className="text-muted-foreground mb-4">Start logging your health data to see risk analysis</p>
                <Button onClick={() => navigate('/health-input')}>Log Health Data</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {/* Overall Risk Score */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-coral" />
                      Overall Health Risk Score
                    </span>
                    {riskAssessment && getRiskBadge(riskAssessment.level)}
                  </CardTitle>
                  <CardDescription>Based on {healthData.length} health entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className={`text-6xl font-bold ${getRiskColor(riskAssessment?.level)}`}>
                      {riskAssessment?.overall}%
                    </div>
                    <div className="flex-1">
                      <Progress value={100 - (riskAssessment?.overall || 0)} className="h-4 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {riskAssessment?.level === 'Low' && 'Great job! Your health indicators are within healthy ranges.'}
                        {riskAssessment?.level === 'Moderate' && 'Some areas need attention. Consider improving your lifestyle habits.'}
                        {riskAssessment?.level === 'High' && 'Please consult a healthcare professional for personalized advice.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Moon className="w-4 h-4 text-lavender-dark" />
                      Sleep
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskAssessment?.categories.sleep.avg}h</div>
                    <p className="text-xs text-muted-foreground">Average per night</p>
                    <Progress value={100 - riskAssessment?.categories.sleep.score} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-coral" />
                      Stress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskAssessment?.categories.stress.avg}/10</div>
                    <p className="text-xs text-muted-foreground">Average level</p>
                    <Progress value={100 - riskAssessment?.categories.stress.score} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-mint-dark" />
                      Diet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskAssessment?.categories.diet.avg}/10</div>
                    <p className="text-xs text-muted-foreground">Quality score</p>
                    <Progress value={100 - riskAssessment?.categories.diet.score} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-ocean" />
                      Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskAssessment?.categories.activity.avg}min</div>
                    <p className="text-xs text-muted-foreground">Daily average</p>
                    <Progress value={100 - riskAssessment?.categories.activity.score} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Trends (Last 14 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="day" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Line type="monotone" dataKey="sleep" stroke="hsl(var(--primary))" strokeWidth={2} name="Sleep (hrs)" />
                          <Line type="monotone" dataKey="mood" stroke="hsl(220 70% 60%)" strokeWidth={2} name="Mood" />
                          <Line type="monotone" dataKey="activity" stroke="hsl(150 60% 45%)" strokeWidth={2} name="Activity (x10 min)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Health Factor Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={riskAssessment?.factors || []}>
                          <PolarGrid className="stroke-border" />
                          <PolarAngleAxis dataKey="name" className="text-xs" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Health Score"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>Explainable analysis of your health factors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskAssessment?.categories.sleep.score > 40 && (
                    <div className="flex gap-3 p-4 rounded-lg bg-lavender-light/50 border border-lavender/30">
                      <Moon className="w-5 h-5 text-lavender-dark mt-0.5" />
                      <div>
                        <h4 className="font-medium">Sleep Quality Needs Attention</h4>
                        <p className="text-sm text-muted-foreground">Your average sleep of {riskAssessment.categories.sleep.avg}h is below the recommended 7-9 hours. Poor sleep can increase risk of various health conditions.</p>
                      </div>
                    </div>
                  )}
                  
                  {riskAssessment?.categories.stress.score > 40 && (
                    <div className="flex gap-3 p-4 rounded-lg bg-coral-light/50 border border-coral/30">
                      <AlertTriangle className="w-5 h-5 text-coral mt-0.5" />
                      <div>
                        <h4 className="font-medium">Elevated Stress Levels</h4>
                        <p className="text-sm text-muted-foreground">Your stress level averaging {riskAssessment.categories.stress.avg}/10 may impact your cardiovascular and mental health. Consider stress management techniques.</p>
                      </div>
                    </div>
                  )}

                  {riskAssessment?.level === 'Low' && (
                    <div className="flex gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-medium">Healthy Lifestyle Detected</h4>
                        <p className="text-sm text-muted-foreground">Your health metrics indicate a balanced lifestyle. Keep maintaining these healthy habits!</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-dashed">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground text-center">
                    <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute medical advice. 
                    Please consult a healthcare professional for proper diagnosis and treatment.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
