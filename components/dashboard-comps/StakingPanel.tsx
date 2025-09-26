import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp } from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';

interface StakingPanelProps {
  pztBalance?: string;
  currentAPY?: string;
  stakedAmount?: string;
}

export default function StakingPanel({
  pztBalance = '1,234.56',
  currentAPY = '12.45',
  stakedAmount = '567.89',
}: StakingPanelProps) {
  const [stakeAmount, setStakeAmount] = useState('');
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
      setStakeAmount('');
      console.log('Staked', stakeAmount, 'PZT tokens');
    }, 2000);
  };

  const calculateRewards = (amount: string) => {
    const value = parseFloat(amount) || 0;
    const apy = parseFloat(currentAPY) / 100;
    return ((value * apy) / 365).toFixed(4);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-5 w-5" />
            Stake $PZT Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md bg-neutral-900/50 p-3 text-center">
              <p className="text-body text-sm">Current APY</p>
              <p className="text-success font-mono text-xl font-bold text-white">
                {currentAPY}%
              </p>
            </div>
            <div className="rounded-md bg-neutral-900/50 p-3 text-center">
              <p className="text-body text-sm">Your Staked</p>
              <p className="font-mono text-xl font-bold text-white">
                {stakedAmount} PZT
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="stake-amount" className="text-body">
              Amount to Stake
            </Label>
            <div className="flex gap-2">
              <Input
                id="stake-amount"
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={e => setStakeAmount(e.target.value)}
                className="text-body font-mono"
              />
              <Button
                variant="outline"
                className="bg-main text-white"
                onClick={handleMaxClick}
              >
                Max
              </Button>
            </div>
            <p className="text-body text-sm">Available: {pztBalance} PZT</p>
          </div>

          {stakeAmount && parseFloat(stakeAmount) > 0 && (
            <div className="rounded-md border border-green-600/20 bg-green-600/5 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Estimated daily rewards</span>
                <span className="font-mono text-green-600">
                  +{calculateRewards(stakeAmount)} PZT
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="font-medium text-white">Auto-compound rewards</p>
              <p className="text-body text-sm">
                Automatically stake earned rewards
              </p>
            </div>
            <Switch
              checked={autoCompound}
              className="data-[state=checked]:bg-main data-[state=unchecked]:bg-main"
              onCheckedChange={setAutoCompound}
            />
          </div>

          <Button
            onClick={handleStake}
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking}
            className={cn('w-full', btnStyle)}
          >
            {isStaking ? 'Staking...' : 'Stake PZT'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-neutral-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            Staking Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* todo: remove mock functionality */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-white">Fee Discount</span>
              <Badge variant="secondary" className="bg-main text-white">
                5-10%
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-white">APY Boost</span>
              <Badge variant="secondary" className="bg-main text-white">
                +0.5%
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-white">Governance Power</span>
              <Badge variant="secondary" className="bg-main text-white">
                2x Voting
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-white">Protocol Fees Share</span>
              <Badge variant="secondary" className="bg-main text-white">
                60%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
