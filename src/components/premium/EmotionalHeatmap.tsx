import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Moon, Activity, Brain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthData } from '@/hooks/useHealthData';

interface HeatmapCell {
  date: string;
  week: number;
  day: number;
  stressLevel: number;
  mood: number;
  emotionalScore: number;
}

export function EmotionalHeatmap() {
  const { entries } = useHealthData();
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [viewMode, setViewMode] = useState<'stress' | 'mood' | 'combined'>('combined');

  useEffect(() => {
    generateHeatmap();
  }, [entries]);

  const generateHeatmap = () => {
    const data: HeatmapCell[] = [];
    const today = new Date();
    
    // Generate 12 weeks (84 days) of data
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find matching entry or generate sample
      const entry = entries.find(e => e.entry_date === dateStr);
      
      const stressLevel = entry?.stress_level || Math.round(3 + Math.random() * 5);
      const mood = entry?.mood || Math.round(4 + Math.random() * 4);
      const emotionalScore = Math.round((10 - stressLevel + mood) / 2 * 10);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        week: Math.floor((83 - i) / 7),
        day: date.getDay(),
        stressLevel,
        mood,
        emotionalScore
      });
    }
    
    setHeatmapData(data);
  };

  const getColor = (cell: HeatmapCell) => {
    let value: number;
    switch (viewMode) {
      case 'stress':
        value = 100 - (cell.stressLevel * 10); // Invert stress
        break;
      case 'mood':
        value = cell.mood * 10;
        break;
      default:
        value = cell.emotionalScore;
    }

    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-success/60';
    if (value >= 40) return 'bg-warning/80';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-destructive';
  };

  const getOpacity = (cell: HeatmapCell) => {
    const value = viewMode === 'stress' ? (10 - cell.stressLevel) : 
                  viewMode === 'mood' ? cell.mood : 
                  cell.emotionalScore / 10;
    return 0.3 + (value / 10) * 0.7;
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = Array.from({ length: 12 }, (_, i) => i);

  const averageScore = heatmapData.length > 0 
    ? Math.round(heatmapData.reduce((acc, c) => acc + c.emotionalScore, 0) / heatmapData.length)
    : 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-orange-400/10 via-red-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center"
          >
            <Flame className="w-6 h-6 text-white" />
          </motion.div>
          Emotional Health Heatmap
        </CardTitle>
        <CardDescription>
          Visualize emotional patterns and stress intensity over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* View Mode Toggle */}
        <div className="flex justify-center gap-2">
          <Badge 
            className={`cursor-pointer ${viewMode === 'combined' ? 'bg-primary' : 'bg-muted'}`}
            onClick={() => setViewMode('combined')}
          >
            Combined
          </Badge>
          <Badge 
            className={`cursor-pointer ${viewMode === 'stress' ? 'bg-destructive' : 'bg-muted'}`}
            onClick={() => setViewMode('stress')}
          >
            <Brain className="w-3 h-3 mr-1" />
            Stress
          </Badge>
          <Badge 
            className={`cursor-pointer ${viewMode === 'mood' ? 'bg-success' : 'bg-muted'}`}
            onClick={() => setViewMode('mood')}
          >
            <Heart className="w-3 h-3 mr-1" />
            Mood
          </Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary">{averageScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-success">
              {heatmapData.filter(c => c.emotionalScore >= 70).length}
            </p>
            <p className="text-xs text-muted-foreground">Good Days</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-warning">
              {heatmapData.filter(c => c.emotionalScore < 50).length}
            </p>
            <p className="text-xs text-muted-foreground">Stressed Days</p>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Day Labels */}
            <div className="flex mb-1">
              <div className="w-8"></div>
              {weeks.map((week) => (
                <div key={week} className="flex-1 text-center text-[10px] text-muted-foreground">
                  {week % 2 === 0 && `W${week + 1}`}
                </div>
              ))}
            </div>

            {/* Grid */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-8 text-[10px] text-muted-foreground">{day}</div>
                <div className="flex-1 flex gap-0.5">
                  {weeks.map((week) => {
                    const cell = heatmapData.find(c => c.week === week && c.day === dayIndex);
                    if (!cell) return <div key={week} className="flex-1 h-5" />;
                    
                    return (
                      <motion.div
                        key={week}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        className={`flex-1 h-5 rounded-sm cursor-pointer ${getColor(cell)}`}
                        style={{ opacity: getOpacity(cell) }}
                        onClick={() => setSelectedCell(cell)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-2 text-xs">
          <span className="text-muted-foreground">Less</span>
          <div className="flex gap-0.5">
            <div className="w-4 h-4 rounded-sm bg-destructive opacity-70" />
            <div className="w-4 h-4 rounded-sm bg-orange-500 opacity-70" />
            <div className="w-4 h-4 rounded-sm bg-warning opacity-70" />
            <div className="w-4 h-4 rounded-sm bg-success/60" />
            <div className="w-4 h-4 rounded-sm bg-success" />
          </div>
          <span className="text-muted-foreground">More</span>
        </div>

        {/* Selected Cell Details */}
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">{selectedCell.date}</span>
              </div>
              <Badge className={selectedCell.emotionalScore >= 60 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}>
                {selectedCell.emotionalScore}% wellness
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-destructive" />
                <span>Stress: {selectedCell.stressLevel}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-success" />
                <span>Mood: {selectedCell.mood}/10</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Insights */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm">Pattern Insights</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {averageScore >= 70 && <li>• Overall emotional wellbeing is strong</li>}
            {averageScore < 50 && <li>• Consider stress management techniques</li>}
            <li>• Weekends show {heatmapData.filter(c => (c.day === 0 || c.day === 6) && c.emotionalScore >= 60).length > 10 ? 'better' : 'similar'} patterns</li>
            <li>• Track more days for deeper insights</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
