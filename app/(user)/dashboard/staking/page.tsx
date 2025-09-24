'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StakingPanel from '@/components/dashboard-comps/StakingPanel';
import { TrendingUp, Users, DollarSign, Gift } from 'lucide-react';

export default function Staking() {
  // todo: remove mock functionality
  const stakingData = {
    totalStakedGlobal: '45,678,901',
    totalStakedUser: '567.89',
    userFeeShare: '0.0124',
    realtimeEarnings: '2.34',
    totalFeesDistributed: '1,234,567',
    stakedVsCirculating: '67.8',
    projectedReturn: '18.2',
  };

  return (
    <div className=" min-h-screen" data-testid="staking-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">$PZT Staking Center</h2>
          <p className="text-muted-foreground">
            Stake $PZT tokens to earn protocol fees, unlock benefits, and participate in governance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Staking Panel */}
          <div className="lg:col-span-1">
            <StakingPanel />
          </div>

          {/* Rewards Dashboard */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Rewards Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-md p-4 text-center">
                    <p className="text-muted-foreground text-sm">Total Staked (Global)</p>
                    <p className="font-mono text-xl font-bold">
                      {stakingData.totalStakedGlobal} PZT
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-md p-4 text-center">
                    <p className="text-muted-foreground text-sm">Your Staked</p>
                    <p className="font-mono text-xl font-bold">{stakingData.totalStakedUser} PZT</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">Your Fee Share</span>
                    <span className="font-mono font-semibold">{stakingData.userFeeShare}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">Real-time Earnings</span>
                    <span className="text-success font-mono font-semibold">
                      +{stakingData.realtimeEarnings} USDC
                    </span>
                  </div>
                </div>

                <Button className="mt-4 w-full" data-testid="button-claim-rewards">
                  <Gift className="mr-2 h-4 w-4" />
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Staking Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-muted-foreground text-sm">Total Fees Distributed</p>
                    <p className="font-mono text-lg font-bold">
                      ${stakingData.totalFeesDistributed}
                    </p>
                  </div>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-muted-foreground text-sm">Staked vs Circulating</p>
                    <p className="font-mono text-lg font-bold">
                      {stakingData.stakedVsCirculating}%
                    </p>
                  </div>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-muted-foreground text-sm">Projected Annual Return</p>
                    <p className="text-success font-mono text-lg font-bold">
                      {stakingData.projectedReturn}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Boost Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">Withdrawal Fee Discount</p>
                      <p className="text-muted-foreground text-sm">Reduce fees by up to 10%</p>
                    </div>
                    <Badge className="bg-success/10 text-success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">APY Boost</p>
                      <p className="text-muted-foreground text-sm">
                        Additional 0.5% yield on deposits
                      </p>
                    </div>
                    <Badge className="bg-success/10 text-success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">Governance Power</p>
                      <p className="text-muted-foreground text-sm">2x voting power in proposals</p>
                    </div>
                    <Badge className="bg-success/10 text-success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">Priority Access</p>
                      <p className="text-muted-foreground text-sm">Early access to new features</p>
                    </div>
                    <Badge className="bg-warning/10 text-warning">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
