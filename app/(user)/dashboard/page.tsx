'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import AllocationChart from '@/components/dashboard-comps/AllocationChart';
import PredictedMove from '@/components/dashboard-comps/PredictedMove';
import ActivityHistory from '@/components/dashboard-comps/ActivityHistory';
import DepositModal from '@/components/dashboard-comps/DepositModal';
import WithdrawModal from '@/components/dashboard-comps/WithdrawModal';
import { TrendingUp, DollarSign, Percent, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  // todo: remove mock functionality
  const portfolioData = {
    totalDeposited: '45,000.00',
    currentValue: '47,234.56',
    netGain: '2,234.56',
    gainPercentage: '4.97',
    estimatedAPY: '8.47',
    pztBoost: '0.5',
    sharesBalance: '46,156.78',
  };

  return (
    <div className="min-h-screen"  >
      {/* Header */}

      <>
        {/* Portfolio Summary */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              Portfolio Overview
            </h2>
            <div className="flex gap-2">
              <DepositModal />
              <WithdrawModal />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Total Deposited
                  </span>
                </div>
                <p
                  className="font-mono text-2xl font-bold"
                
                >
                  ${portfolioData.totalDeposited}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Current Value
                  </span>
                </div>
                <p
                  className="text-success font-mono text-2xl font-bold"
                 
                >
                  ${portfolioData.currentValue}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Net Gain
                  </span>
                </div>
                <p
                  className="text-success font-mono text-2xl font-bold"
                 
                >
                  +${portfolioData.netGain}
                </p>
                <p className="text-success text-sm">
                  +{portfolioData.gainPercentage}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Percent className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Estimated APY
                  </span>
                </div>
                <p
                  className="font-mono text-2xl font-bold"
                  
                >
                  {portfolioData.estimatedAPY}%
                </p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    +{portfolioData.pztBoost}% PZT Boost
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AllocationChart totalValue={`$${portfolioData.currentValue}`} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <PredictedMove />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Rebalance Settings</span>
                  <Switch defaultChecked   />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Rebalance</span>
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success"
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Automatic rebalancing is enabled. The protocol will execute
                    profitable moves when opportunities are detected by our ML
                    model.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity History */}
        <ActivityHistory />
      </>
    </div>
  );
}
