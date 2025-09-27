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
import {
  TrendingUp,
  DollarSign,
  Percent,
  Settings,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useDashboardData } from '@/hooks/useApi';
import { usePortfolioMetrics } from '@/hooks/usePortfolio';

export default function Dashboard() {
  const {
    totalDeposited,
    currentValue,
    netGain,
    netGainPercent,
    estimatedAPY,
    shares,
    isLoading,
    error,
  } = usePortfolioMetrics();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-white">Loading portfolio data...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-white">
            Failed to load portfolio data
          </h2>
          <p className="mb-4 text-gray-400">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <>
        {/* System Health Status */}
        {/* {systemHealth.data && (
          <div className="mb-4">
            <Badge
              variant={
                systemHealth.data.status === 'healthy'
                  ? 'default'
                  : 'destructive'
              }
              className="mb-2"
            >
              System Status: {systemHealth.data.status}
            </Badge>
          </div>
        )} */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Portfolio Summary
          </h2>
          <div className="flex items-center gap-4">
            <DepositModal />
            <WithdrawModal />
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-neutral-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Deposited
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${totalDeposited}
              </div>
              <p className="text-muted-foreground text-xs">
                Total amount deposited
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Current Value
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${currentValue}
              </div>
              <p className="text-xs text-green-600">
                +{netGainPercent}% from deposits
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Net Gain
              </CardTitle>
              <Percent className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${netGain}
              </div>
              <p className="text-muted-foreground text-xs">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Estimated APY
              </CardTitle>
              <Settings className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {estimatedAPY}%
              </div>
              <p className="text-muted-foreground text-xs">
                Weighted average APY
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}

        {/* Main Content Grid */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AllocationChart totalValue={`${currentValue}`} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <PredictedMove />

            <Card className="bg-neutral-950">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Rebalance Settings</span>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-main data-[state=unchecked]:bg-neutral-400"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">Auto Rebalance</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-600/10 text-green-600"
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-body text-sm">
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
