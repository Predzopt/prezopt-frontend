import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Check } from 'lucide-react';

interface WalletConnectionProps {
  onConnect: (address: string) => void;
  connected?: boolean;
  address?: string;
}

export default function WalletConnection({
  onConnect,
  connected = false,
  address,
}: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = '0x1234...5678';
      onConnect(mockAddress);
      setIsConnecting(false);
      console.log('Wallet connected:', mockAddress);
    }, 1000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div data-testid="wallet-connection">
      {connected ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-md border border-success/20">
          <Check className="w-4 h-4" />
          <span className="font-mono text-sm" data-testid="text-wallet-address">
            {address && formatAddress(address)}
          </span>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2"
          data-testid="button-connect-wallet"
        >
          <Wallet className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </span>
        </Button>
      )}
    </div>
  );
}
