'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StakingPanel from '@/components/dashboard-comps/StakingPanel';
import { TrendingUp, Users, DollarSign, Gift } from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';

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
    <div className="min-h-screen">
      <>
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-white">
            $PZT Staking Center
          </h2>
          <p className="text-body">
            Stake $PZT tokens to earn protocol fees, unlock benefits, and
            participate in governance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Staking Panel */}
          <div className="lg:col-span-1">
            <StakingPanel />
          </div>

          {/* Rewards Dashboard */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-neutral-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5" />
                  Rewards Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="bg-main/10 rounded-md p-4 text-center">
                    <p className="text-body text-sm">Total Staked (Global)</p>
                    <p className="font-mono text-xl font-bold text-white">
                      {stakingData.totalStakedGlobal} PZT
                    </p>
                  </div>
                  <div className="bg-main/10 rounded-md p-4 text-center">
                    <p className="text-body text-sm">Your Staked</p>
                    <p className="font-mono text-xl font-bold text-white">
                      {stakingData.totalStakedUser} PZT
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-body text-sm">Your Fee Share</span>
                    <span className="font-mono font-semibold text-white">
                      {stakingData.userFeeShare}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-body text-sm">
                      Real-time Earnings
                    </span>
                    <span className="font-mono font-semibold text-green-600">
                      +{stakingData.realtimeEarnings} USDC
                    </span>
                  </div>
                </div>

                <Button className={cn('mt-4 w-full bg-transparent', btnStyle)}>
                  <Gift className="mr-2 h-4 w-4" />
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Staking Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-body text-sm">Total Fees Distributed</p>
                    <p className="font-mono text-lg font-bold text-white">
                      ${stakingData.totalFeesDistributed}
                    </p>
                  </div>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-body text-sm">Staked vs Circulating</p>
                    <p className="font-mono text-lg font-bold text-white">
                      {stakingData.stakedVsCirculating}%
                    </p>
                  </div>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-body text-sm">Projected Annual Return</p>
                    <p className="font-mono text-lg font-bold text-green-600">
                      {stakingData.projectedReturn}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950">
              <CardHeader>
                <CardTitle className="text-white">Boost Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium text-white">
                        Withdrawal Fee Discount
                      </p>
                      <p className="text-body text-sm">
                        Reduce fees by up to 10%
                      </p>
                    </div>
                    <Badge className="bg-green-600/10 text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium text-white">APY Boost</p>
                      <p className="text-body text-sm">
                        Additional 0.5% yield on deposits
                      </p>
                    </div>
                    <Badge className="bg-green-600/10 text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium text-white">Governance Power</p>
                      <p className="text-body text-sm">
                        2x voting power in proposals
                      </p>
                    </div>
                    <Badge className="bg-green-600/10 text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium text-white">Priority Access</p>
                      <p className="text-body text-sm">
                        Early access to new features
                      </p>
                    </div>
                    <Badge className="bg-amber-300/10 text-amber-300">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    </div>
  );
}
