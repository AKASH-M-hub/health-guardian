import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Environment } from '@react-three/drei';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scan, Heart, Brain, Activity, Zap, Eye, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';
import * as THREE from 'three';

interface OrganData {
  name: string;
  position: [number, number, number];
  color: string;
  health: number;
  size: number;
}

function Organ({ name, position, color, health, size, onClick, isSelected }: OrganData & { onClick: () => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (isSelected) {
        meshRef.current.scale.setScalar(size * 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      } else {
        meshRef.current.scale.setScalar(size);
      }
    }
  });

  const getHealthColor = () => {
    if (health >= 80) return '#22c55e';
    if (health >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.3, 32, 32]} onClick={onClick}>
        <meshStandardMaterial
          color={isSelected ? getHealthColor() : color}
          emissive={isSelected ? getHealthColor() : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
          roughness={0.4}
          metalness={0.3}
        />
      </Sphere>
      {isSelected && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border text-center whitespace-nowrap">
            <p className="font-bold text-sm">{name}</p>
            <p className="text-xs" style={{ color: getHealthColor() }}>{health}% Health</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Body3D({ organs, selectedOrgan, onSelectOrgan }: { organs: OrganData[]; selectedOrgan: string | null; onSelectOrgan: (name: string) => void }) {
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Body outline */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 2, 16, 32]} />
        <meshStandardMaterial 
          color="#6366f1" 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Head */}
      <Sphere args={[0.35, 32, 32]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color="#a78bfa" transparent opacity={0.2} />
      </Sphere>

      {/* Organs */}
      {organs.map((organ) => (
        <Organ
          key={organ.name}
          {...organ}
          onClick={() => onSelectOrgan(organ.name)}
          isSelected={selectedOrgan === organ.name}
        />
      ))}
    </group>
  );
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
    { name: 'Brain', position: [0, 1.4, 0.1], color: '#f472b6', health: organHealth.brain, size: 0.25 },
    { name: 'Heart', position: [0.15, 0.5, 0.2], color: '#ef4444', health: organHealth.heart, size: 0.22 },
    { name: 'Lungs', position: [-0.25, 0.5, 0.1], color: '#60a5fa', health: organHealth.lungs, size: 0.28 },
    { name: 'Liver', position: [0.2, 0, 0.15], color: '#a78bfa', health: organHealth.liver, size: 0.25 },
    { name: 'Kidneys', position: [0, -0.3, 0.1], color: '#fbbf24', health: organHealth.kidneys, size: 0.18 },
    { name: 'Stomach', position: [-0.1, 0.1, 0.2], color: '#34d399', health: organHealth.stomach, size: 0.2 }
  ];

  const selectedOrganData = organs.find(o => o.name === selectedOrgan);

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-destructive';
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
          Interactive 3D body model showing organ health status
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

        {/* 3D Canvas */}
        <div className="h-[350px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Suspense fallback={null}>
              <Body3D 
                organs={organs} 
                selectedOrgan={selectedOrgan}
                onSelectOrgan={setSelectedOrgan}
              />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              minDistance={2}
              maxDistance={6}
              autoRotate={!selectedOrgan}
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>

        {/* Instructions */}
        <p className="text-xs text-center text-muted-foreground">
          Click on organs to view health status • Drag to rotate • Scroll to zoom
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
                <Heart className="w-5 h-5 text-coral" />
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
                className={`h-full ${
                  selectedOrganData.health >= 80 ? 'bg-success' :
                  selectedOrganData.health >= 60 ? 'bg-warning' : 'bg-destructive'
                }`}
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
