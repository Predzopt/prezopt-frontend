import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { blockchainService } from '@/services/blockchainServices';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function PortfolioDebug() {
  const { address, isConnected } = useWallet();
  const { portfolioData, refreshPortfolio } = usePortfolio();
  const [trackingSummary, setTrackingSummary] = useState<any>(null);

  const handleGetTrackingSummary = () => {
    if (!address) return;
    const summary = blockchainService.getTrackingSummary(address);
    setTrackingSummary(summary);
  };

  const handleResetTracking = () => {
    if (!address) return;
    blockchainService.resetTracking(address);
    refreshPortfolio();
    setTrackingSummary(null);
  };

  if (!isConnected) {
    return (
      <Card className="bg-neutral-950">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Connect wallet to view debug info</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-950">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Deposited:</p>
            <p className="font-mono text-white">
              ${portfolioData?.totalDeposited || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Current Value:</p>
            <p className="font-mono text-white">
              ${portfolioData?.currentValue || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Net Gain:</p>
            <p className="font-mono text-green-400">
              ${portfolioData?.netGain || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Net Gain %:</p>
            <p className="font-mono text-green-400">
              {portfolioData?.netGainPercent || '0.00'}%
            </p>
          </div>
        </div>

        {portfolioData && (
          <div className="text-sm">
            <p className="text-gray-400">Gross Deposited:</p>
            <p className="font-mono text-white">
              ${portfolioData.grossDeposited}
            </p>
            <p className="text-gray-400">Gross Withdrawn:</p>
            <p className="font-mono text-white">
              ${portfolioData.grossWithdrawn}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleGetTrackingSummary}
            variant="outline"
            size="sm"
          >
            Get Tracking Summary
          </Button>
          <Button onClick={handleResetTracking} variant="destructive" size="sm">
            Reset Tracking
          </Button>
        </div>

        {trackingSummary && (
          <div className="rounded bg-neutral-800 p-3 text-xs">
            <p className="text-gray-400">Tracking Summary:</p>
            <pre className="text-white">
              {JSON.stringify(trackingSummary, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
