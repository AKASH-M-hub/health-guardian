import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Scan, AlertTriangle, CheckCircle, Zap, Moon, Heart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface BrainZone {
  name: string;
  overloadLevel: number;
  description: string;
  icon: typeof Brain;
}

export function MentalBurnoutScan() {
  const { stats } = useHealthData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidenceScore] = useState(84);

  const calculateBurnoutZones = (): BrainZone[] => {
    const stressFactor = stats?.avgStressLevel ? stats.avgStressLevel * 10 : 50;
    const sleepFactor = stats?.avgSleepHours ? (8 - stats.avgSleepHours) * 15 : 40;
    const moodFactor = stats?.avgMood ? (10 - stats.avgMood) * 8 : 35;

    return [
      {
        name: 'Cognitive Load',
        icon: Brain,
        overloadLevel: Math.min(100, Math.round(stressFactor * 0.5 + sleepFactor * 0.3 + 20)),
        description: 'Mental processing and decision-making capacity'
      },
      {
        name: 'Emotional Drain',
        icon: Heart,
        overloadLevel: Math.min(100, Math.round(moodFactor * 0.5 + stressFactor * 0.3 + 15)),
        description: 'Emotional regulation and resilience'
      },
      {
        name: 'Focus Fatigue',
        icon: Zap,
        overloadLevel: Math.min(100, Math.round(sleepFactor * 0.5 + stressFactor * 0.3 + 20)),
        description: 'Attention span and concentration ability'
      },
      {
        name: 'Sleep Debt',
        icon: Moon,
        overloadLevel: Math.min(100, Math.round(sleepFactor * 0.7 + stressFactor * 0.2 + 10)),
        description: 'Accumulated rest deficit'
      },
      {
        name: 'Recovery Capacity',
        icon: Activity,
        overloadLevel: Math.min(100, Math.round(100 - (sleepFactor * 0.4 + moodFactor * 0.3 + stressFactor * 0.3))),
        description: 'Ability to bounce back from stress'
      }
    ];
  };

  const zones = calculateBurnoutZones();
  const overallBurnoutRisk = Math.round(zones.reduce((acc, z) => acc + z.overloadLevel, 0) / zones.length);

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3500);
  };

  const getOverloadColor = (level: number) => {
    if (level < 30) return 'text-success';
    if (level < 50) return 'text-yellow-500';
    if (level < 70) return 'text-orange-500';
    return 'text-destructive';
  };

  const getOverloadBg = (level: number) => {
    if (level < 30) return 'bg-success';
    if (level < 50) return 'bg-yellow-500';
    if (level < 70) return 'bg-orange-500';
    return 'bg-destructive';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={isScanning ? { 
              boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0.4)', '0 0 0 20px rgba(168, 85, 247, 0)']
            } : {}}
            transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          Mental Burnout Scan
        </CardTitle>
        <CardDescription>
          Brain-style visualization of cognitive and emotional overload zones
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
                {/* Brain scan animation */}
                <div className="relative w-48 h-48 mx-auto">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      borderColor: ['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0.8)', 'rgba(168, 85, 247, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-4 rounded-full border-4 border-pink-500/30"
                    animate={{ 
                      scale: [1.1, 1, 1.1],
                      borderColor: ['rgba(236, 72, 153, 0.3)', 'rgba(236, 72, 153, 0.8)', 'rgba(236, 72, 153, 0.3)']
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-20 h-20 text-purple-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-medium">Scanning mental load patterns...</p>
                <p className="text-sm text-muted-foreground">Analyzing cognitive and emotional data</p>
              </motion.div>
            ) : (
              <div className="py-8">
                <Brain className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Generate a mental burnout scan to visualize cognitive and emotional overload
                </p>
                <Button onClick={startScan} className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Scan className="w-4 h-4 mr-2" />
                  Start Burnout Scan
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
            {/* Overall Burnout Risk */}
            <div className="text-center bg-muted/30 p-6 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Overall Burnout Risk</p>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
                  <motion.circle
                    cx="64" cy="64" r="56"
                    stroke={overallBurnoutRisk < 50 ? '#22c55e' : overallBurnoutRisk < 70 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={352}
                    initial={{ strokeDashoffset: 352 }}
                    animate={{ strokeDashoffset: 352 - (352 * overallBurnoutRisk / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-3xl font-bold ${getOverloadColor(overallBurnoutRisk)}`}>
                    {overallBurnoutRisk}%
                  </span>
                </div>
              </div>
              <Badge className={`${getOverloadColor(overallBurnoutRisk)} bg-transparent text-lg px-4 py-1`}>
                {overallBurnoutRisk < 30 ? 'Low Risk' : overallBurnoutRisk < 50 ? 'Moderate' : overallBurnoutRisk < 70 ? 'Elevated' : 'High Risk'}
              </Badge>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">Scan Confidence</span>
              </div>
              <Badge className="bg-success/10 text-success">{confidenceScore}%</Badge>
            </div>

            {/* Zone Breakdown */}
            <div className="space-y-4">
              {zones.map((zone, index) => (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getOverloadBg(zone.overloadLevel)}/20`}>
                        <zone.icon className={`w-5 h-5 ${getOverloadColor(zone.overloadLevel)}`} />
                      </div>
                      <div>
                        <p className="font-semibold">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">{zone.description}</p>
                      </div>
                    </div>
                    <span className={`text-xl font-bold ${getOverloadColor(zone.overloadLevel)}`}>
                      {zone.overloadLevel}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.overloadLevel}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${getOverloadBg(zone.overloadLevel)}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            {overallBurnoutRisk >= 50 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Recommended Actions</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {overallBurnoutRisk >= 70 && <li>• Consider taking immediate rest breaks</li>}
                  <li>• Practice stress-reduction techniques</li>
                  <li>• Prioritize 7-8 hours of sleep</li>
                  <li>• Limit cognitive load where possible</li>
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Informational Only</p>
                <p className="text-muted-foreground">
                  This scan is based on lifestyle data patterns and is not a clinical assessment.
                </p>
              </div>
            </div>

            <Button onClick={startScan} variant="outline" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Rescan
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
