import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import { api } from '@/services/api';

// Types for API responses
export interface Pool {
  id: string;
  name: string;
  totalValue: number;
  apy: number;
}

export interface PoolsSummary {
  totalPools: number;
  totalValue: number;
  averageApy: number;
}

export interface Prediction {
  id: string;
  poolId: string;
  predictedMove: 'up' | 'down' | 'stable';
  confidence: number;
  timestamp: string;
}

export interface Activity {
  id: string;
  type: 'deposit' | 'withdraw' | 'rebalance' | 'claim';
  amount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastCheck: string;
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
  const activity = useActivity();
  const systemHealth = useSystemHealth();

  return {
    pools,
    poolsSummary,
    predictions,
    activity,
    systemHealth,
    isLoading: pools.isLoading || poolsSummary.isLoading || predictions.isLoading || activity.isLoading || systemHealth.isLoading,
    isError: pools.isError || poolsSummary.isError || predictions.isError || activity.isError || systemHealth.isError,
  };
};
