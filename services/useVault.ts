import { useState, useEffect } from 'react';
import { blockchainService } from '../services/blockchainService';

export function useVault() {
  const [vaultStats, setVaultStats] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await blockchainService.init();
        const [stats, balance] = await Promise.all([
          blockchainService.getVaultStats(),
          blockchainService.getVaultBalance()
        ]);
        setVaultStats(stats);
        setUserBalance(balance);
      } catch (error) {
        console.error("Failed to fetch vault data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { vaultStats, userBalance, loading };
}