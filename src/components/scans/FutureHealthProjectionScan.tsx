import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Scan, AlertTriangle, CheckCircle, Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface ProjectionScenario {
  timeframe: string;
  noChange: number;
  withImprovement: number;
  keyDifferences: string[];
}

export function FutureHealthProjectionScan() {
  const { stats } = useHealthData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidenceScore] = useState(79);
  const [activeTab, setActiveTab] = useState('3month');

  const generateProjections = (): ProjectionScenario[] => {
    const baseScore = stats ? 
      Math.round((stats.avgMood + (10 - stats.avgStressLevel) + stats.avgDietQuality + stats.avgSleepQuality) / 4 * 10) : 60;

    return [
      {
        timeframe: '3 months',
        noChange: Math.max(20, baseScore - 8),
        withImprovement: Math.min(95, baseScore + 12),
        keyDifferences: ['Energy levels', 'Sleep quality', 'Stress resilience']
      },
      {
        timeframe: '6 months',
        noChange: Math.max(15, baseScore - 15),
        withImprovement: Math.min(95, baseScore + 20),
        keyDifferences: ['Cardiovascular health', 'Mental clarity', 'Immune function']
      },
      {
        timeframe: '1 year',
        noChange: Math.max(10, baseScore - 25),
        withImprovement: Math.min(95, baseScore + 30),
        keyDifferences: ['Disease risk reduction', 'Overall vitality', 'Life quality']
      }
    ];
  };

  const projections = generateProjections();

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 4000);
  };

  const getCurrentProjection = () => {
    switch (activeTab) {
      case '6month': return projections[1];
      case '1year': return projections[2];
      default: return projections[0];
    }
  };

  const current = getCurrentProjection();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={isScanning ? { rotate: [0, 180, 360] } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
          >
            <Target className="w-6 h-6 text-white" />
          </motion.div>
          Future Health Projection Scan
        </CardTitle>
        <CardDescription>
          Comparative visualization of future health states under different scenarios
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
                <div className="relative w-48 h-32 mx-auto">
                  {/* Two parallel timelines */}
                  <motion.div
                    className="absolute top-4 left-0 right-0 h-1 bg-gradient-to-r from-destructive to-destructive/50 rounded"
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-success to-success/50 rounded"
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <div className="absolute top-0 left-0 text-xs text-destructive">No Change</div>
                  <div className="absolute bottom-0 left-0 text-xs text-success">With Improvement</div>
                </div>
                <p className="text-lg font-medium">Projecting future health states...</p>
                <p className="text-sm text-muted-foreground">Comparing scenarios</p>
              </motion.div>
            ) : (
              <div className="py-8">
                <Target className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Generate a projection scan to visualize future health under different scenarios
                </p>
                <Button onClick={startScan} className="bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Scan className="w-4 h-4 mr-2" />
                  Start Projection Scan
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
                <span className="font-medium">Projection Confidence</span>
              </div>
              <Badge className="bg-success/10 text-success">{confidenceScore}%</Badge>
            </div>

            {/* Timeframe Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="3month">3 Months</TabsTrigger>
                <TabsTrigger value="6month">6 Months</TabsTrigger>
                <TabsTrigger value="1year">1 Year</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6 mt-4">
                {/* Comparison Visualization */}
                <div className="grid grid-cols-2 gap-4">
                  {/* No Change Scenario */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center"
                  >
                    <TrendingDown className="w-10 h-10 mx-auto text-destructive mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">No Change</p>
                    <p className="text-4xl font-bold text-destructive mb-2">{current.noChange}%</p>
                    <Badge variant="outline" className="text-destructive border-destructive">
                      Declining Health
                    </Badge>
                  </motion.div>

                  {/* With Improvement Scenario */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-success/10 border border-success/30 rounded-xl p-6 text-center"
                  >
                    <TrendingUp className="w-10 h-10 mx-auto text-success mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">With Improvement</p>
                    <p className="text-4xl font-bold text-success mb-2">{current.withImprovement}%</p>
                    <Badge variant="outline" className="text-success border-success">
                      Improving Health
                    </Badge>
                  </motion.div>
                </div>

                {/* Difference */}
                <div className="text-center bg-primary/10 rounded-lg p-4">
                  <Sparkles className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Potential Improvement</p>
                  <p className="text-3xl font-bold text-primary">
                    +{current.withImprovement - current.noChange}%
                  </p>
                </div>

                {/* Key Differences */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Key Improvement Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {current.keyDifferences.map((diff, i) => (
                      <Badge key={i} variant="outline" className="bg-background">
                        {diff}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Visual Bar Comparison */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm w-32 text-muted-foreground">No Change</span>
                    <div className="flex-1 bg-muted/30 h-6 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${current.noChange}%` }}
                        className="h-full bg-gradient-to-r from-destructive to-orange-500 rounded-full flex items-center justify-end px-2"
                      >
                        <span className="text-xs text-white font-bold">{current.noChange}%</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm w-32 text-muted-foreground">With Improvement</span>
                    <div className="flex-1 bg-muted/30 h-6 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${current.withImprovement}%` }}
                        className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full flex items-center justify-end px-2"
                      >
                        <span className="text-xs text-white font-bold">{current.withImprovement}%</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Projection Disclaimer</p>
                <p className="text-muted-foreground">
                  Projections are estimates based on current data and typical outcomes. Individual results vary.
                </p>
              </div>
            </div>

            <Button onClick={startScan} variant="outline" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Regenerate Projections
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
