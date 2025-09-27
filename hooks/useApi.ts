import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import { api } from '@/services/api';

// Types for API responses
export interface Pool {
  timestamp: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number | null;
  il7d: number | null;
  apyBase7d: number | null;
  apy_vol: number;
  tvl_growth: number;
  apy_lag_1: number;
  tvl_lag_1: number;
}

export interface PoolsSummary {
  pool_count: number;
  total_tvl: number;
  avg_apy: number;
  max_apy: number;
  min_apy: number;
}

export interface Prediction {
  pool_id: string;
  predicted_apy: number;
  confidence_interval: [number, number];
  confidence: number;
  tvl: number;
  estimated_profit: number;
  risk_score: number;
  timestamp: string;
}

export interface Rebalance {
  pool_id: string;
  amount: number;
  from_token: string;
  to_token: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Activity {
  last_activity: any[]; // The API returns an empty array for now
}

export interface SystemHealth {
  status: 'ok' | 'error';
  time: string;
}

// Custom hooks for each API endpoint
export const usePools = () => {
  return useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.POOL);
      return response.data;
    },
  });
};

export const usePoolsSummary = () => {
  return useQuery<PoolsSummary>({
    queryKey: ['pools', 'summary'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.POOLS_SUMMARY);
      return response.data;
    },
  });
};

export const usePredictions = () => {
  return useQuery<Prediction[]>({
    queryKey: ['predictions'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.PREDICTIONS);
      return response.data;
    },
  });
};

export const useRebalance = () => {
  return useQuery<Rebalance[]>({
    queryKey: ['rebalance'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.REBALANCE);
      return response.data;
    },
  });
};

export const useActivity = () => {
  return useQuery<Activity[]>({
    queryKey: ['activity'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.ACTIVITY);
      return response.data;
    },
  });
};

export const useSystemHealth = () => {
  return useQuery<SystemHealth>({
    queryKey: ['system', 'health'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.SYS_HEALTH);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Combined hook for dashboard data
export const useDashboardData = () => {
  const pools = usePools();
  const poolsSummary = usePoolsSummary();
  const predictions = usePredictions();
  const rebalance = useRebalance();
  const activity = useActivity();
  const systemHealth = useSystemHealth();

  return {
    pools,
    poolsSummary,
    predictions,
    rebalance,
    activity,
    systemHealth,
    isLoading:
      pools.isLoading ||
      poolsSummary.isLoading ||
      predictions.isLoading ||
      rebalance.isLoading ||
      activity.isLoading ||
      systemHealth.isLoading,
    isError:
      pools.isError ||
      poolsSummary.isError ||
      predictions.isError ||
      rebalance.isError ||
      activity.isError ||
      systemHealth.isError,
  };
};
