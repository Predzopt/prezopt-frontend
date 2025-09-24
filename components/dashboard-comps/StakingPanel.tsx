import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp } from "lucide-react";

interface StakingPanelProps {
  pztBalance?: string;
  currentAPY?: string;
  stakedAmount?: string;
}

export default function StakingPanel({ 
  pztBalance = "1,234.56", 
  currentAPY = "12.45",
  stakedAmount = "567.89"
}: StakingPanelProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [autoCompound, setAutoCompound] = useState(true);
  const [isStaking, setIsStaking] = useState(false);

  const handleMaxClick = () => {
    setStakeAmount(pztBalance);
  };

  const handleStake = async () => {
    setIsStaking(true);
    // Simulate staking
    setTimeout(() => {
      setIsStaking(false);
      setStakeAmount("");
      console.log("Staked", stakeAmount, "PZT tokens");
    }, 2000);
  };

  const calculateRewards = (amount: string) => {
    const value = parseFloat(amount) || 0;
    const apy = parseFloat(currentAPY) / 100;
    return (value * apy / 365).toFixed(4); // Daily rewards
  };

  return (
    <div className="space-y-6" >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Stake $PZT Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Current APY</p>
              <p className="text-xl font-bold font-mono text-success">{currentAPY}%</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Your Staked</p>
              <p className="text-xl font-bold font-mono">{stakedAmount} PZT</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="stake-amount">Amount to Stake</Label>
            <div className="flex gap-2">
              <Input
                id="stake-amount"
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="font-mono"
               
              />
              <Button variant="outline" onClick={handleMaxClick}  >
                Max
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Available: {pztBalance} PZT
            </p>
          </div>

          {stakeAmount && parseFloat(stakeAmount) > 0 && (
            <div className="p-3 bg-success/5 rounded-md border border-success/20">
              <div className="flex justify-between text-sm">
                <span>Estimated daily rewards</span>
                <span className="font-mono text-success">+{calculateRewards(stakeAmount)} PZT</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <p className="font-medium">Auto-compound rewards</p>
              <p className="text-sm text-muted-foreground">Automatically stake earned rewards</p>
            </div>
            <Switch 
              checked={autoCompound} 
              onCheckedChange={setAutoCompound}
             
            />
          </div>

          <Button 
            onClick={handleStake}
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking}
            className="w-full"
           
          >
            {isStaking ? "Staking..." : "Stake PZT"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Staking Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* todo: remove mock functionality */}
            <div className="flex items-center justify-between p-3 border rounded-md">
              <span className="text-sm">Fee Discount</span>
              <Badge variant="secondary">5-10%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <span className="text-sm">APY Boost</span>
              <Badge variant="secondary">+0.5%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <span className="text-sm">Governance Power</span>
              <Badge variant="secondary">2x Voting</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <span className="text-sm">Protocol Fees Share</span>
              <Badge variant="secondary">60%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}