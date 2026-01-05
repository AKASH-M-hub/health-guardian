import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Scan, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface HeatmapZone {
  name: string;
  intensity: number;
  factors: string[];
}

export function RiskHeatmapScan() {
  const { stats } = useHealthData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidenceScore] = useState(88);

  const generateHeatmap = (): HeatmapZone[] => {
    const stressBase = stats?.avgStressLevel ? stats.avgStressLevel * 10 : 50;
    const sleepBase = stats?.avgSleepHours ? (8 - stats.avgSleepHours) * 12 : 40;
    const activityBase = stats?.avgActivityMinutes ? (60 - stats.avgActivityMinutes) : 30;
    const dietBase = stats?.avgDietQuality ? (10 - stats.avgDietQuality) * 8 : 35;

    return [
      { 
        name: 'Cardiovascular', 
        intensity: Math.min(100, Math.round(stressBase * 0.4 + activityBase * 0.4 + dietBase * 0.2)),
        factors: ['Stress levels', 'Physical activity', 'Diet quality']
      },
      { 
        name: 'Neurological', 
        intensity: Math.min(100, Math.round(sleepBase * 0.5 + stressBase * 0.3 + 20)),
        factors: ['Sleep patterns', 'Mental stress', 'Cognitive load']
      },
      { 
        name: 'Metabolic', 
        intensity: Math.min(100, Math.round(dietBase * 0.5 + activityBase * 0.3 + sleepBase * 0.2)),
        factors: ['Diet quality', 'Activity level', 'Sleep recovery']
      },
      { 
        name: 'Respiratory', 
        intensity: Math.min(100, Math.round(activityBase * 0.4 + stressBase * 0.3 + 25)),
        factors: ['Exercise capacity', 'Stress breathing', 'Air quality exposure']
      },
      { 
        name: 'Musculoskeletal', 
        intensity: Math.min(100, Math.round(activityBase * 0.5 + sleepBase * 0.3 + 20)),
        factors: ['Physical activity', 'Recovery time', 'Posture habits']
      },
      { 
        name: 'Immune System', 
        intensity: Math.min(100, Math.round(sleepBase * 0.4 + stressBase * 0.3 + dietBase * 0.3)),
        factors: ['Sleep quality', 'Stress impact', 'Nutrition']
      }
    ];
  };

  const heatmapZones = generateHeatmap();

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity < 30) return 'from-green-400 to-green-600';
    if (intensity < 50) return 'from-yellow-400 to-yellow-600';
    if (intensity < 70) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity < 30) return 'Low Risk';
    if (intensity < 50) return 'Moderate';
    if (intensity < 70) return 'Elevated';
    return 'High Risk';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
          >
            <Flame className="w-6 h-6 text-white" />
          </motion.div>
          Risk Heatmap Scan
        </CardTitle>
        <CardDescription>
          Color-coded visualization of combined risk intensity across body systems
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!scanComplete ? (
          <div className="text-center space-y-6">
            {isScanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-lg"
                      animate={{
                        backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444', '#22c55e'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <p className="text-lg font-medium">Generating risk heatmap...</p>
                <p className="text-sm text-muted-foreground">Analyzing multi-factor risk distribution</p>
              </motion.div>
            ) : (
              <div className="py-8">
                <Flame className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Generate a heatmap scan to visualize risk distribution across your body systems
                </p>
                <Button onClick={startScan} className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Scan className="w-4 h-4 mr-2" />
                  Start Heatmap Scan
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Confidence Score */}
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">Heatmap Confidence</span>
              </div>
              <Badge className="bg-success/10 text-success">{confidenceScore}%</Badge>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {heatmapZones.map((zone, index) => (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${getIntensityColor(zone.intensity)} opacity-80`} />
                  <div className="relative p-4 text-white">
                    <p className="font-bold text-lg">{zone.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className="bg-white/20 text-white">
                        {getIntensityLabel(zone.intensity)}
                      </Badge>
                      <span className="text-2xl font-bold">{zone.intensity}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-600" />
                <span className="text-xs">Low (&lt;30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-400 to-yellow-600" />
                <span className="text-xs">Moderate (30-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-600" />
                <span className="text-xs">Elevated (50-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-red-400 to-red-600" />
                <span className="text-xs">High (&gt;70%)</span>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Contributing Factors</h4>
              <div className="grid grid-cols-2 gap-2">
                {heatmapZones.slice(0, 4).map((zone) => (
                  <div key={zone.name} className="text-sm">
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">{zone.factors.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Informational Visualization</p>
                <p className="text-muted-foreground">
                  This heatmap represents lifestyle-derived risk estimates, not medical diagnoses.
                </p>
              </div>
            </div>

            <Button onClick={startScan} variant="outline" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Regenerate Heatmap
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
