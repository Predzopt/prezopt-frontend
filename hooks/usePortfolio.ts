import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/context/WalletContext';
import { blockchainService } from '@/services/blockchainServices';

export interface PortfolioData {
  totalDeposited: string;
  currentValue: string;
  netGain: string;
  netGainPercent: string;
  estimatedAPY: string;
  shares: string;
  sharePrice: string;
  totalAssets: string;
  totalSupply: string;
  grossDeposited: string;
  grossWithdrawn: string;
  strategies: Array<{
    id: number;
    name: string;
    allocation: number;
    apy: string;
    apyValue: number;
  }>;
}

export function usePortfolio() {
  const { isConnected, provider, signer } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: portfolioData,
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useQuery<PortfolioData>({
    queryKey: ['portfolio', isConnected],
    queryFn: async () => {
      if (!isConnected || !provider || !signer) {
        throw new Error('Wallet not connected');
      }

      const initialized = await blockchainService.init(provider, signer);
      if (!initialized) {
        throw new Error('Failed to initialize blockchain service');
      }

      // Initialize tracking for existing users
      await blockchainService.initializeTracking();

      return await blockchainService.getPortfolioData();
    },
    enabled: isConnected && !!provider && !!signer,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
  });

  useEffect(() => {
    setIsLoading(isQueryLoading);
    setError(queryError?.message || null);
  }, [isQueryLoading, queryError]);

  const refreshPortfolio = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
    }
  };

  return {
    portfolioData,
    isLoading,
    error,
    refreshPortfolio,
    isConnected,
  };
}

// Hook for getting individual portfolio metrics
export function usePortfolioMetrics() {
  const { portfolioData, isLoading, error } = usePortfolio();

  return {
    totalDeposited: portfolioData?.totalDeposited || '0.00',
    currentValue: portfolioData?.currentValue || '0.00',
    netGain: portfolioData?.netGain || '0.00',
    netGainPercent: portfolioData?.netGainPercent || '0.00',
    estimatedAPY: portfolioData?.estimatedAPY || '0.00',
    shares: portfolioData?.shares || '0.00',
    sharePrice: portfolioData?.sharePrice || '0.00',
    isLoading,
    error,
  };
}
