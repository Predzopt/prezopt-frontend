'use client';

import { usePools, usePoolsSummary, usePredictions, useActivity, useSystemHealth, useDashboardData } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Example 1: Individual hook usage
export function PoolsList() {
  const { data: pools, isLoading, error, refetch } = usePools();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading pools...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error loading pools
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pools ({pools?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {pools?.map(pool => (
          <div key={pool.id} className="border-b pb-2 mb-2 last:border-b-0">
            <h3 className="font-semibold">{pool.name}</h3>
            <p className="text-sm text-gray-500">APY: {pool.apy}%</p>
            <p className="text-sm text-gray-500">Value: ${pool.totalValue}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Example 2: Dashboard data usage
export function DashboardOverview() {
  const { 
    pools, 
    poolsSummary, 
    predictions, 
    activity, 
    systemHealth, 
    isLoading, 
    isError 
  } = useDashboardData();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading dashboard data...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error loading dashboard data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{poolsSummary.data?.totalPools || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${poolsSummary.data?.totalValue || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            systemHealth.data?.status === 'healthy' ? 'text-green-500' : 
            systemHealth.data?.status === 'degraded' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {systemHealth.data?.status || 'Unknown'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activity.data?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}

// Example 3: System health with auto-refresh
export function SystemStatus() {
  const { data: health, isLoading, error } = useSystemHealth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Checking system status...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error checking system status
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`status-${health?.status} p-4 rounded-lg ${
          health?.status === 'healthy' ? 'bg-green-100 text-green-800' :
          health?.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          <div className="font-semibold">Status: {health?.status}</div>
          <div className="text-sm">Uptime: {health?.uptime}%</div>
          <div className="text-sm">Last Check: {health?.lastCheck}</div>
        </div>
      </CardContent>
    </Card>
  );
}
