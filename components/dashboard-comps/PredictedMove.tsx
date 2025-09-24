import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, Target, TrendingUp } from "lucide-react";

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
    source: "Aave USDC",
    destination: "Compound USDC", 
    expectedGain: "156.78",
    confidence: 87,
    executionTime: "~3 hours",
    keeperReward: "0.45",
    amount: "15,000"
  };

  const pred = prediction || defaultPrediction;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-warning";
    return "text-destructive";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return "bg-success/10";
    if (confidence >= 60) return "bg-warning/10";
    return "bg-destructive/10";
  };

  return (
    <Card data-testid="predicted-move">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Predicted Next Move
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-md">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="font-medium">{pred.source}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-medium">{pred.destination}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border rounded-md">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-mono font-semibold">${pred.amount}</p>
          </div>
          <div className="text-center p-3 border rounded-md">
            <p className="text-sm text-muted-foreground">Expected Gain</p>
            <p className="font-mono font-semibold text-success">+${pred.expectedGain}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence Score</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-medium ${getConfidenceColor(pred.confidence)}`}>
                {pred.confidence}%
              </span>
              <Badge className={`text-xs ${getConfidenceBg(pred.confidence)} ${getConfidenceColor(pred.confidence)}`}>
                {pred.confidence >= 80 ? "High" : pred.confidence >= 60 ? "Medium" : "Low"}
              </Badge>
            </div>
          </div>
          <Progress value={pred.confidence} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Execution Time</p>
              <p className="font-medium">{pred.executionTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Keeper Reward</p>
              <p className="font-mono font-medium">+{pred.keeperReward} PZT</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
          <p>
            Our ML model analyzes yield differentials across DeFi protocols to predict optimal rebalancing opportunities.
            Keeper bots execute these moves automatically when conditions are met.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}