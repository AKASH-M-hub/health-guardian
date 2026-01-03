import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Info } from 'lucide-react';

interface Props { stats: any; entries: any[]; }

export function PreDoctorTestEngine({ stats, entries }: Props) {
  const tests = useMemo(() => {
    if (!stats) return [];
    const suggestions = [];
    if (stats.avgSleepQuality < 6) suggestions.push({ name: 'Sleep Study', reason: 'Poor sleep quality detected', priority: 'Medium' });
    if (stats.avgStressLevel > 7) suggestions.push({ name: 'Cortisol Test', reason: 'High stress levels', priority: 'Medium' });
    if (stats.avgDietQuality < 5) suggestions.push({ name: 'Vitamin Panel', reason: 'Diet quality concerns', priority: 'Low' });
    suggestions.push({ name: 'Basic Metabolic Panel', reason: 'General health screening', priority: 'Routine' });
    return suggestions;
  }, [stats]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-ocean/10 to-primary/10">
        <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-ocean" />Pre-Doctor Test Awareness</CardTitle>
        <CardDescription>Possible tests doctors may consider (informational only)</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {tests.map((t, i) => (
          <div key={i} className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
            <div><p className="font-medium text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.reason}</p></div>
            <Badge variant="outline">{t.priority}</Badge>
          </div>
        ))}
        <p className="text-xs text-muted-foreground italic flex items-center gap-1"><Info className="w-3 h-3" />This is not medical advice. Consult your doctor.</p>
      </CardContent>
    </Card>
  );
}
