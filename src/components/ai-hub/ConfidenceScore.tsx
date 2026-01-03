import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertCircle, HelpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  stats: any;
  entries: any[];
}

export function ConfidenceScore({ stats, entries }: Props) {
  const confidence = useMemo(() => {
    if (!entries || entries.length === 0) return null;

    // Calculate confidence based on data completeness and consistency
    const dataPoints = entries.length;
    const dataCompleteness = Math.min(100, (dataPoints / 14) * 100); // 2 weeks ideal

    // Check field completeness
    const fieldScores = entries.map(e => {
      let score = 0;
      if (e.sleep_hours !== null) score += 1;
      if (e.sleep_quality !== null) score += 1;
      if (e.stress_level !== null) score += 1;
      if (e.mood !== null) score += 1;
      if (e.diet_quality !== null) score += 1;
      if (e.physical_activity_minutes !== null) score += 1;
      if (e.water_intake_liters !== null) score += 1;
      return (score / 7) * 100;
    });

    const avgFieldCompleteness = fieldScores.reduce((a, b) => a + b, 0) / fieldScores.length;

    // Check consistency (low variance = high consistency)
    const sleepValues = entries.filter(e => e.sleep_hours).map(e => e.sleep_hours);
    const variance = sleepValues.length > 1 ? 
      sleepValues.reduce((acc, val) => acc + Math.pow(val - (sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length), 2), 0) / sleepValues.length : 0;
    const consistency = Math.max(0, 100 - variance * 10);

    const overallConfidence = (dataCompleteness * 0.4 + avgFieldCompleteness * 0.4 + consistency * 0.2);

    return {
      overall: Math.round(overallConfidence),
      dataCompleteness: Math.round(dataCompleteness),
      fieldCompleteness: Math.round(avgFieldCompleteness),
      consistency: Math.round(consistency),
      certainties: [
        { 
          aspect: 'Sleep Pattern Analysis',
          confidence: sleepValues.length >= 7 ? 85 : sleepValues.length >= 3 ? 60 : 30,
          status: sleepValues.length >= 7 ? 'high' : sleepValues.length >= 3 ? 'medium' : 'low'
        },
        {
          aspect: 'Stress Trend Detection',
          confidence: entries.filter(e => e.stress_level).length >= 7 ? 80 : 45,
          status: entries.filter(e => e.stress_level).length >= 7 ? 'high' : 'medium'
        },
        {
          aspect: 'Diet Impact Assessment',
          confidence: entries.filter(e => e.diet_quality).length >= 7 ? 75 : 40,
          status: entries.filter(e => e.diet_quality).length >= 7 ? 'medium' : 'low'
        },
        {
          aspect: 'Activity Correlation',
          confidence: entries.filter(e => e.physical_activity_minutes).length >= 7 ? 78 : 35,
          status: entries.filter(e => e.physical_activity_minutes).length >= 7 ? 'high' : 'low'
        },
      ],
      uncertainties: [
        overallConfidence < 50 && 'Limited data history',
        avgFieldCompleteness < 70 && 'Incomplete daily entries',
        consistency < 60 && 'High data variability',
        dataPoints < 7 && 'Insufficient trend data',
      ].filter(Boolean),
    };
  }, [entries]);

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'medium': return <HelpCircle className="w-4 h-4 text-warning" />;
      default: return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-success/10 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          Health Decision Confidence Score
        </CardTitle>
        <CardDescription>
          AI certainty and uncertainty levels for predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {confidence ? (
          <>
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Overall AI Confidence</p>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-5xl font-bold ${getConfidenceColor(confidence.overall)}`}
              >
                {confidence.overall}%
              </motion.div>
              <Badge className="mt-2" variant={confidence.overall >= 70 ? 'default' : 'secondary'}>
                {confidence.overall >= 70 ? 'High Reliability' : 
                 confidence.overall >= 50 ? 'Moderate Reliability' : 'Low Reliability'}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Data Volume', value: confidence.dataCompleteness },
                { label: 'Field Coverage', value: confidence.fieldCompleteness },
                { label: 'Consistency', value: confidence.consistency },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-3 bg-muted/30 rounded-lg"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-xl font-bold ${getConfidenceColor(item.value)}`}>
                    {item.value}%
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Certainties
              </p>
              {confidence.certainties.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{item.aspect}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={item.confidence} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground w-10">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>

            {confidence.uncertainties.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  Uncertainties
                </p>
                <div className="flex flex-wrap gap-2">
                  {confidence.uncertainties.map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <Info className="w-3 h-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Log health data to see confidence analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
