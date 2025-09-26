import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Clock, Loader, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import { api } from '@/services/api';
import { useEffect } from 'react';

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

export default function PredictedMove() {
  const { data, isLoading, isSuccess } = useQuery<any>({
    queryKey: ['rebalance'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.REBALANCE);
      return response.data;
    },
  });

  useEffect(() => {
    if (isSuccess && !isLoading) console.log(data);
  }, []);

  // todo: remove mock functionality
  const defaultPrediction = {
    source: data?.signal?.fromStrategy || 'Aave',
    destination: data?.signal?.toStrategy || 'Compound',
    expectedGain: data?.metrics?.estimated_profit?.toLocaleString() || 0,
    confidence: data?.metrics?.confidence * 100 || 0,
    executionTime: '~3 hours',
    keeperReward: '0.45',
    amount: data?.signal?.amount?.toLocaleString() || 0,
  };

  const pred = defaultPrediction;

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
    <Card className="relative overflow-hidden bg-neutral-950">
      {isLoading && (
        <div className="absolute top-0 left-0 z-20 flex h-full w-full flex-col items-center justify-center gap-4 bg-black/45 backdrop-blur-[1px]">
          <Loader size={24} />
          <span>Predicting...</span>
        </div>
      )}
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
            className="bg-main/30 [&>div]:bg-main z-0 h-2"
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
