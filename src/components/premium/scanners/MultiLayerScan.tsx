import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Layers, Activity, Brain, Heart, AlertTriangle, Eye, Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const LAYERS = [
  { id: 'lifestyle', name: 'Lifestyle', icon: Activity, color: 'bg-success', data: { sleep: 72, exercise: 58, diet: 65, hydration: 80 } },
  { id: 'mental', name: 'Mental', icon: Brain, color: 'bg-lavender-dark', data: { stress: 45, focus: 62, mood: 70, anxiety: 35 } },
  { id: 'physiological', name: 'Physiological', icon: Heart, color: 'bg-coral', data: { cardiovascular: 78, metabolic: 65, immune: 72, respiratory: 85 } },
  { id: 'risk', name: 'Risk Interaction', icon: AlertTriangle, color: 'bg-warning', data: { diabetesRisk: 25, heartRisk: 18, stressImpact: 40, sleepDebt: 32 } }
];

export function MultiLayerScan() {
  const [activeLayers, setActiveLayers] = useState<string[]>(['lifestyle', 'physiological']);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(l => l !== layerId)
        : [...prev, layerId]
    );
  };

  const runScan = () => {
    setScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Multi-Layer Human System Scan
        </CardTitle>
        <CardDescription>Toggle layers to view different health dimensions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layer Toggles */}
        <div className="grid grid-cols-2 gap-3">
          {LAYERS.map(layer => (
            <div 
              key={layer.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                activeLayers.includes(layer.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleLayer(layer.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${layer.color} flex items-center justify-center`}>
                  <layer.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{layer.name}</span>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={runScan} disabled={scanning || activeLayers.length === 0} className="w-full">
          {scanning ? 'Scanning...' : 'Run Multi-Layer Scan'}
        </Button>

        {scanComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {LAYERS.filter(l => activeLayers.includes(l.id)).map(layer => (
              <div key={layer.id} className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <layer.icon className="w-4 h-4" />
                  {layer.name} Layer
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(layer.data).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded p-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                      <Progress value={value} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Badge variant="outline" className="w-full justify-center py-2">
              <Info className="w-3 h-3 mr-1" />
              Confidence: 87% | Data Quality: High
            </Badge>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
