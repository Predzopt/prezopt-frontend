import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Clock, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictedMoveProps {
  prediction?: {
    source: string;
    destination: string;
    expectedGain: string;
    confidence: number;
    executionTime: string;
    keeperReward: string;
    amount: string;
  };
}

export default function PredictedMove({ prediction }: PredictedMoveProps) {
  // todo: remove mock functionality
  const defaultPrediction = {
    source: 'Aave USDC',
    destination: 'Compound USDC',
    expectedGain: '156.78',
    confidence: 87,
    executionTime: '~3 hours',
    keeperReward: '0.45',
    amount: '15,000',
  };

  const pred = prediction || defaultPrediction;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-600/10';
    if (confidence >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <Card className="bg-neutral-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="h-5 w-5" />
          Predicted Next Move
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-main/20 flex items-center justify-center gap-3 rounded-md p-4">
          <div className="text-center">
            <p className="text-body text-sm">From</p>
            <p className="font-medium text-white">{pred.source}</p>
          </div>
          <ArrowRight className="text-main h-5 w-5" />
          <div className="text-center">
            <p className="text-body text-sm">To</p>
            <p className="font-medium text-white">{pred.destination}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md border p-3 text-center">
            <p className="text-body text-sm">Amount</p>
            <p className="font-semibold text-white">${pred.amount}</p>
          </div>
          <div className="rounded-md border p-3 text-center">
            <p className="text-body text-sm">Expected Gain</p>
            <p className="font-semibold text-white">+${pred.expectedGain}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-sm">Confidence Score</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-white ${getConfidenceColor(pred.confidence)}`}
              >
                {pred.confidence}%
              </span>
              <Badge
                className={cn(
                  `text-xs ${getConfidenceBg(pred.confidence)} ${getConfidenceColor(pred.confidence)}`
                )}
              >
                {pred.confidence >= 80
                  ? 'High'
                  : pred.confidence >= 60
                    ? 'Medium'
                    : 'Low'}
              </Badge>
            </div>
          </div>
          <Progress
            value={pred.confidence}
            className="bg-main/30 [&>div]:bg-main h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="text-body h-4 w-4" />
            <div>
              <p className="text-body">Execution Time</p>
              <p className="font-medium text-white">{pred.executionTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-body h-4 w-4" />
            <div>
              <p className="text-body">Keeper Reward</p>
              <p className="font-medium text-white">+{pred.keeperReward} PZT</p>
            </div>
          </div>
        </div>

        <div className="text-body rounded-md bg-neutral-900/50 p-3 text-xs">
          <p>
            Our ML model analyzes yield differentials across DeFi protocols to
            predict optimal rebalancing opportunities. Keeper bots execute these
            moves automatically when conditions are met.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
