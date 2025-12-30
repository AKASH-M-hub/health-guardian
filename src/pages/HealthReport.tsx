import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHealthData } from '@/hooks/useHealthData';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, Download, Calendar, Heart, Moon, Brain, Activity, Utensils, Droplets, TrendingUp, TrendingDown, Minus, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthReport() {
  const { user } = useAuth();
  const { stats, entries, loading } = useHealthData();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);

  const getRiskLevel = () => {
    if (!stats) return { level: 'Unknown', color: 'text-muted-foreground', score: 0 };
    const avgScore = (stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4;
    if (avgScore >= 7) return { level: 'Low Risk', color: 'text-success', score: avgScore };
    if (avgScore >= 5) return { level: 'Moderate Risk', color: 'text-warning', score: avgScore };
    return { level: 'High Risk', color: 'text-destructive', score: avgScore };
  };

  const getRecommendations = () => {
    if (!stats) return [];
    const recs = [];
    
    if (stats.avgSleepHours < 7) {
      recs.push({
        icon: Moon,
        title: 'Improve Sleep Duration',
        description: 'Aim for 7-9 hours of sleep. Your average is below recommended levels.',
        priority: 'high'
      });
    }
    if (stats.avgStressLevel > 6) {
      recs.push({
        icon: Brain,
        title: 'Manage Stress Levels',
        description: 'Consider meditation, deep breathing, or exercise to reduce stress.',
        priority: 'high'
      });
    }
    if (stats.avgDietQuality < 6) {
      recs.push({
        icon: Utensils,
        title: 'Improve Diet Quality',
        description: 'Focus on more fruits, vegetables, and whole grains.',
        priority: 'medium'
      });
    }
    if (stats.avgActivityMinutes < 30) {
      recs.push({
        icon: Activity,
        title: 'Increase Physical Activity',
        description: 'Aim for at least 30 minutes of moderate activity daily.',
        priority: 'medium'
      });
    }
    if (recs.length === 0) {
      recs.push({
        icon: Heart,
        title: 'Keep Up the Great Work!',
        description: 'Your health metrics are looking good. Maintain your healthy habits.',
        priority: 'low'
      });
    }
    return recs;
  };

  const handlePrint = () => {
    window.print();
  };

  const risk = getRiskLevel();
  const recommendations = getRecommendations();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6 print:hidden">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>

          {/* Report Header */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 via-mint/10 to-coral/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold">Health Summary Report</h1>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Generated: {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}</span>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className={`text-3xl font-bold ${risk.color}`}>{risk.level}</div>
                  <div className="text-sm text-muted-foreground">Overall Health Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!stats ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Health Data Available</h3>
                <p className="text-muted-foreground mb-4">Start logging your health data to generate a comprehensive report.</p>
                <Button onClick={() => navigate('/health-input')}>
                  Log Health Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Key Metrics */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Key Health Metrics
                  </CardTitle>
                  <CardDescription>Based on {stats.totalEntries} health entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Moon className="w-4 h-4 text-lavender-dark" />
                          Sleep Duration
                        </span>
                        <span className="font-semibold">{stats.avgSleepHours}h</span>
                      </div>
                      <Progress value={(stats.avgSleepHours / 9) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: 7-9 hours</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Moon className="w-4 h-4 text-lavender-dark" />
                          Sleep Quality
                        </span>
                        <span className="font-semibold">{stats.avgSleepQuality}/10</span>
                      </div>
                      <Progress value={stats.avgSleepQuality * 10} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Brain className="w-4 h-4 text-coral" />
                          Stress Level
                        </span>
                        <span className="font-semibold">{stats.avgStressLevel}/10</span>
                      </div>
                      <Progress value={(10 - stats.avgStressLevel) * 10} className="h-2" />
                      <p className="text-xs text-muted-foreground">Lower is better</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Heart className="w-4 h-4 text-coral" />
                          Mood
                        </span>
                        <span className="font-semibold">{stats.avgMood}/10</span>
                      </div>
                      <Progress value={stats.avgMood * 10} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Utensils className="w-4 h-4 text-mint-dark" />
                          Diet Quality
                        </span>
                        <span className="font-semibold">{stats.avgDietQuality}/10</span>
                      </div>
                      <Progress value={stats.avgDietQuality * 10} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Activity className="w-4 h-4 text-ocean" />
                          Activity
                        </span>
                        <span className="font-semibold">{stats.avgActivityMinutes} min</span>
                      </div>
                      <Progress value={Math.min((stats.avgActivityMinutes / 60) * 100, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: 30+ min/day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {stats.weeklyTrend === 'improving' ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : stats.weeklyTrend === 'declining' ? (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    ) : (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    )}
                    Weekly Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline" 
                      className={
                        stats.weeklyTrend === 'improving' 
                          ? 'bg-success/10 text-success border-success/30' 
                          : stats.weeklyTrend === 'declining'
                          ? 'bg-destructive/10 text-destructive border-destructive/30'
                          : 'bg-muted'
                      }
                    >
                      {stats.weeklyTrend === 'improving' ? 'Improving' : 
                       stats.weeklyTrend === 'declining' ? 'Needs Attention' : 'Stable'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {stats.weeklyTrend === 'improving' 
                        ? 'Your health metrics are trending positively. Keep up the good work!'
                        : stats.weeklyTrend === 'declining'
                        ? 'Some metrics have declined recently. Consider focusing on the recommendations below.'
                        : 'Your health metrics are stable. Continue maintaining your current habits.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-coral" />
                    Personalized Recommendations
                  </CardTitle>
                  <CardDescription>Based on your health data analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          rec.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          rec.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }`}>
                          <rec.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>⚠️ Important Disclaimer:</strong> This health report is generated based on self-reported data and is intended for informational purposes only. 
                    It does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals 
                    for medical guidance and before making any changes to your health regimen.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}