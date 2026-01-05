import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Activity, Wind, Droplets, Scan, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface OrganStress {
  name: string;
  icon: typeof Heart;
  stressLevel: number;
  status: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
}

export function VirtualOrganStressScan() {
  const { stats, entries } = useHealthData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidenceScore] = useState(85);

  const calculateStressLevels = (): OrganStress[] => {
    const sleepFactor = stats?.avgSleepHours ? (stats.avgSleepHours < 6 ? 70 : stats.avgSleepHours < 7 ? 40 : 20) : 50;
    const stressFactor = stats?.avgStressLevel ? stats.avgStressLevel * 10 : 50;
    const activityFactor = stats?.avgActivityMinutes ? (stats.avgActivityMinutes < 20 ? 60 : stats.avgActivityMinutes < 30 ? 30 : 15) : 40;
    const dietFactor = stats?.avgDietQuality ? (10 - stats.avgDietQuality) * 8 : 40;

    const getStatus = (level: number): 'low' | 'moderate' | 'high' | 'critical' => {
      if (level < 30) return 'low';
      if (level < 50) return 'moderate';
      if (level < 70) return 'high';
      return 'critical';
    };

    return [
      {
        name: 'Heart',
        icon: Heart,
        stressLevel: Math.min(100, Math.round(stressFactor * 0.4 + activityFactor * 0.4 + dietFactor * 0.2)),
        status: getStatus(Math.round(stressFactor * 0.4 + activityFactor * 0.4 + dietFactor * 0.2)),
        factors: stressFactor > 50 ? ['High stress detected', 'Consider relaxation'] : ['Stress well managed']
      },
      {
        name: 'Brain',
        icon: Brain,
        stressLevel: Math.min(100, Math.round(sleepFactor * 0.4 + stressFactor * 0.4 + (stats?.avgMood ? (10 - stats.avgMood) * 2 : 20))),
        status: getStatus(Math.round(sleepFactor * 0.4 + stressFactor * 0.4)),
        factors: sleepFactor > 50 ? ['Sleep deficit detected', 'Cognitive load high'] : ['Good mental rest']
      },
      {
        name: 'Lungs',
        icon: Wind,
        stressLevel: Math.min(100, Math.round(activityFactor * 0.5 + stressFactor * 0.3 + 20)),
        status: getStatus(Math.round(activityFactor * 0.5 + stressFactor * 0.3)),
        factors: activityFactor > 40 ? ['Low oxygen intake', 'Increase cardio'] : ['Respiratory function good']
      },
      {
        name: 'Liver',
        icon: Activity,
        stressLevel: Math.min(100, Math.round(dietFactor * 0.6 + stressFactor * 0.2 + 15)),
        status: getStatus(Math.round(dietFactor * 0.6 + stressFactor * 0.2)),
        factors: dietFactor > 40 ? ['Diet quality concern', 'Consider cleanse'] : ['Metabolic function stable']
      },
      {
        name: 'Kidneys',
        icon: Droplets,
        stressLevel: Math.min(100, Math.round((stats?.latestEntry?.water_intake_liters ? (3 - stats.latestEntry.water_intake_liters) * 20 : 40) + dietFactor * 0.3)),
        status: getStatus(stats?.latestEntry?.water_intake_liters ? (3 - stats.latestEntry.water_intake_liters) * 20 : 40),
        factors: (stats?.latestEntry?.water_intake_liters || 0) < 2 ? ['Hydration low', 'Drink more water'] : ['Hydration adequate']
      }
    ];
  };

  const organStress = calculateStressLevels();

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-success bg-success/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'critical': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressColor = (level: number) => {
    if (level < 30) return 'bg-success';
    if (level < 50) return 'bg-warning';
    if (level < 70) return 'bg-orange-500';
    return 'bg-destructive';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
          >
            <Scan className="w-6 h-6 text-white" />
          </motion.div>
          Virtual Organ Stress Scan
        </CardTitle>
        <CardDescription>
          AI-generated visualization of internal organ stress based on your health data
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
                <div className="relative w-48 h-48 mx-auto">
                  <motion.div
                    className="absolute inset-0 border-4 border-primary/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-4 border-4 border-coral/40 rounded-full"
                    animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan className="w-16 h-16 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-medium">Scanning organ stress levels...</p>
                <p className="text-sm text-muted-foreground">Analyzing lifestyle patterns and physiological data</p>
              </motion.div>
            ) : (
              <div className="py-8">
                <Scan className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Generate a virtual scan to visualize organ stress levels based on your health data
                </p>
                <Button onClick={startScan} className="bg-gradient-to-r from-red-500 to-orange-500">
                  <Scan className="w-4 h-4 mr-2" />
                  Start Organ Stress Scan
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
                <span className="font-medium">Scan Confidence Score</span>
              </div>
              <Badge className="bg-success/10 text-success">{confidenceScore}%</Badge>
            </div>

            {/* Organ Stress List */}
            <div className="space-y-4">
              {organStress.map((organ, index) => (
                <motion.div
                  key={organ.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(organ.status)}`}>
                        <organ.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{organ.name}</p>
                        <Badge variant="outline" className={getStatusColor(organ.status)}>
                          {organ.status.charAt(0).toUpperCase() + organ.status.slice(1)} Stress
                        </Badge>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${
                      organ.stressLevel < 30 ? 'text-success' :
                      organ.stressLevel < 50 ? 'text-warning' :
                      organ.stressLevel < 70 ? 'text-orange-500' : 'text-destructive'
                    }`}>
                      {organ.stressLevel}%
                    </span>
                  </div>
                  
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${organ.stressLevel}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${getProgressColor(organ.stressLevel)}`}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {organ.factors.map((factor, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Informational Only</p>
                <p className="text-muted-foreground">
                  This virtual scan is generated from lifestyle data and is not a medical diagnosis. 
                  Consult healthcare professionals for actual health assessments.
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
