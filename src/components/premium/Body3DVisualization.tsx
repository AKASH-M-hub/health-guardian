import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scan, Heart, Brain, Activity, Zap, Eye, Wind, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface OrganData {
  name: string;
  icon: typeof Heart;
  color: string;
  health: number;
  position: { top: string; left: string };
}

export function Body3DVisualization() {
  const { stats, entries } = useHealthData();
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'normal' | 'xray' | 'thermal'>('normal');

  // Calculate organ health based on health data
  const calculateOrganHealth = () => {
    if (!stats || entries.length === 0) {
      return {
        heart: 75,
        brain: 70,
        lungs: 80,
        liver: 72,
        kidneys: 78,
        stomach: 74
      };
    }

    const sleepFactor = ((stats.avgSleepHours || 7) / 8) * 100;
    const stressFactor = 100 - ((stats.avgStressLevel || 5) * 10);
    const activityFactor = Math.min(100, ((stats.avgActivityMinutes || 30) / 60) * 100);
    const dietFactor = (stats.avgDietQuality || 5) * 10;
    const moodFactor = (stats.avgMood || 5) * 10;

    return {
      heart: Math.round(activityFactor * 0.4 + stressFactor * 0.4 + dietFactor * 0.2),
      brain: Math.round(sleepFactor * 0.4 + stressFactor * 0.3 + moodFactor * 0.3),
      lungs: Math.round(activityFactor * 0.6 + stressFactor * 0.2 + sleepFactor * 0.2),
      liver: Math.round(dietFactor * 0.5 + stressFactor * 0.3 + sleepFactor * 0.2),
      kidneys: Math.round(dietFactor * 0.4 + sleepFactor * 0.3 + stressFactor * 0.3),
      stomach: Math.round(dietFactor * 0.6 + stressFactor * 0.2 + moodFactor * 0.2)
    };
  };

  const organHealth = calculateOrganHealth();

  const organs: OrganData[] = [
    { name: 'Brain', icon: Brain, color: '#f472b6', health: organHealth.brain, position: { top: '8%', left: '50%' } },
    { name: 'Heart', icon: Heart, color: '#ef4444', health: organHealth.heart, position: { top: '30%', left: '45%' } },
    { name: 'Lungs', icon: Wind, color: '#60a5fa', health: organHealth.lungs, position: { top: '28%', left: '60%' } },
    { name: 'Liver', icon: Activity, color: '#a78bfa', health: organHealth.liver, position: { top: '42%', left: '40%' } },
    { name: 'Kidneys', icon: Droplets, color: '#fbbf24', health: organHealth.kidneys, position: { top: '50%', left: '55%' } },
    { name: 'Stomach', icon: Zap, color: '#34d399', health: organHealth.stomach, position: { top: '45%', left: '50%' } }
  ];

  const selectedOrganData = organs.find(o => o.name === selectedOrgan);

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthBg = (health: number) => {
    if (health >= 80) return 'bg-success';
    if (health >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const getScanModeStyles = () => {
    switch (scanMode) {
      case 'xray':
        return 'from-slate-900 via-blue-950 to-slate-900 [filter:contrast(1.2)]';
      case 'thermal':
        return 'from-orange-950 via-red-950 to-yellow-950';
      default:
        return 'from-primary/20 via-violet-500/20 to-pink-500/20';
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-violet-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center"
          >
            <Scan className="w-6 h-6 text-white" />
          </motion.div>
          3D Body Visualization
        </CardTitle>
        <CardDescription>
          Interactive body model showing organ health status
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Scan Mode Buttons */}
        <div className="flex justify-center gap-2">
          <Button 
            size="sm" 
            variant={scanMode === 'normal' ? 'default' : 'outline'}
            onClick={() => setScanMode('normal')}
          >
            <Eye className="w-4 h-4 mr-1" />
            Normal
          </Button>
          <Button 
            size="sm" 
            variant={scanMode === 'xray' ? 'default' : 'outline'}
            onClick={() => setScanMode('xray')}
          >
            <Scan className="w-4 h-4 mr-1" />
            X-Ray
          </Button>
          <Button 
            size="sm" 
            variant={scanMode === 'thermal' ? 'default' : 'outline'}
            onClick={() => setScanMode('thermal')}
          >
            <Zap className="w-4 h-4 mr-1" />
            Thermal
          </Button>
        </div>

        {/* Body Visualization */}
        <div className={`relative h-[350px] bg-gradient-to-b ${getScanModeStyles()} rounded-xl overflow-hidden`}>
          {/* Human Body SVG Outline */}
          <svg 
            viewBox="0 0 200 400" 
            className="absolute inset-0 w-full h-full opacity-30"
          >
            {/* Body outline */}
            <ellipse cx="100" cy="50" rx="35" ry="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <path 
              d="M65 90 Q50 120 45 180 L40 250 Q35 280 50 300 L55 350 Q60 380 75 390 L90 390 L95 350 L100 320 L105 350 L110 390 L125 390 Q140 380 145 350 L150 300 Q165 280 160 250 L155 180 Q150 120 135 90" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-primary"
            />
            {/* Arms */}
            <path d="M45 100 Q20 130 15 200 Q10 230 20 260" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <path d="M155 100 Q180 130 185 200 Q190 230 180 260" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
          </svg>

          {/* Organs */}
          {organs.map((organ) => {
            const Icon = organ.icon;
            const isSelected = selectedOrgan === organ.name;
            return (
              <motion.button
                key={organ.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ top: organ.position.top, left: organ.position.left }}
                onClick={() => setSelectedOrgan(organ.name)}
                animate={{
                  scale: isSelected ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isSelected ? Infinity : 0,
                }}
                whileHover={{ scale: 1.15 }}
              >
                <div 
                  className={`p-3 rounded-full transition-all ${
                    isSelected ? 'ring-4 ring-white/50 shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: scanMode === 'thermal' 
                      ? organ.health >= 80 ? '#22c55e' : organ.health >= 60 ? '#f59e0b' : '#ef4444'
                      : scanMode === 'xray' 
                      ? '#3b82f6' 
                      : organ.color,
                    opacity: scanMode === 'xray' ? 0.8 : 1
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border whitespace-nowrap z-10"
                  >
                    <p className="font-bold text-sm">{organ.name}</p>
                    <p className={`text-xs ${getHealthColor(organ.health)}`}>{organ.health}% Health</p>
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Scan animation overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ height: '50%' }}
          />
        </div>

        {/* Instructions */}
        <p className="text-xs text-center text-muted-foreground">
          Click on organs to view health status
        </p>

        {/* Selected Organ Details */}
        {selectedOrganData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <selectedOrganData.icon className="w-5 h-5 text-coral" />
                <span className="font-semibold">{selectedOrganData.name}</span>
              </div>
              <Badge className={getHealthColor(selectedOrganData.health) + ' bg-transparent'}>
                {selectedOrganData.health}% Health
              </Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${selectedOrganData.health}%` }}
                className={`h-full ${getHealthBg(selectedOrganData.health)}`}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {selectedOrganData.health >= 80 
                ? 'Excellent condition - keep up your healthy habits!'
                : selectedOrganData.health >= 60
                ? 'Good condition - some improvements recommended'
                : 'Needs attention - focus on lifestyle changes'}
            </p>
          </motion.div>
        )}

        {/* Organ Grid */}
        <div className="grid grid-cols-3 gap-2">
          {organs.map((organ) => (
            <Button
              key={organ.name}
              variant={selectedOrgan === organ.name ? 'default' : 'outline'}
              size="sm"
              className="flex flex-col h-auto py-2"
              onClick={() => setSelectedOrgan(organ.name)}
            >
              <span className="text-xs">{organ.name}</span>
              <span className={`text-lg font-bold ${getHealthColor(organ.health)}`}>
                {organ.health}%
              </span>
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          ⚕️ Organ health is estimated based on lifestyle data. Consult healthcare professionals for medical assessment.
        </p>
      </CardContent>
    </Card>
  );
}
