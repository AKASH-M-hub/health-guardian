import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface HealthScoreTooltipProps {
  score?: number;
  factors?: {
    sleep: number;
    stress: number;
    diet: number;
    activity: number;
    consistency: number;
  };
}

export function HealthScoreTooltip({ score, factors }: HealthScoreTooltipProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <Info className="w-4 h-4" />
          <span className="text-xs underline decoration-dotted">How is this calculated?</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Health Score Formula</h4>
          
          <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
            <p className="text-primary font-medium mb-2">Overall Score = (100 - Risk) %</p>
            <p className="text-muted-foreground">
              Risk = (SR + StR + DR + AR) / 4
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-medium">Where:</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between">
                <span>• <strong>SR</strong> (Sleep Risk):</span>
                <span>&lt;6h=70, &lt;7h=40, else=20</span>
              </li>
              <li className="flex justify-between">
                <span>• <strong>StR</strong> (Stress Risk):</span>
                <span>&gt;7=70, &gt;5=40, else=20</span>
              </li>
              <li className="flex justify-between">
                <span>• <strong>DR</strong> (Diet Risk):</span>
                <span>&lt;4=70, &lt;6=40, else=20</span>
              </li>
              <li className="flex justify-between">
                <span>• <strong>AR</strong> (Activity Risk):</span>
                <span>&lt;20m=70, &lt;40m=40, else=20</span>
              </li>
            </ul>
          </div>

          {factors && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-2">Your Current Factors:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span>Sleep: {(100 - factors.sleep)}%</span>
                <span>Stress: {(100 - factors.stress)}%</span>
                <span>Diet: {(100 - factors.diet)}%</span>
                <span>Activity: {(100 - factors.activity)}%</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2 border-t">
            Lower risk scores indicate better health metrics. The final score represents your overall wellness level.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
