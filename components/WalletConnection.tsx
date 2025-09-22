import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="bg-success/10 text-success border-success/20 flex items-center gap-2 rounded-md border px-4 py-2">
          <Check className="h-4 w-4" />
          <span className="font-mono text-sm" data-testid="text-wallet-address">
            {address && formatAddress(address)}
          </span>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className={cn(
            'border-main/50 relative flex h-11 origin-center items-center gap-2 rounded-[10px] border px-4 py-3.5 opacity-100 shadow-[inset_0_0_16px_0_rgb(55,8,150)] will-change-auto [background:linear-gradient(rgba(20,9,43,0.51)_0%,rgba(20,9,43,0.51)_50%,rgba(20,9,43,0.51)_100%)_rgba(20,9,43,0.51)] hover:shadow-[inset_0_0_16px_0_rgb(95,35,217)]',
            "after:pointer-events-none after:absolute after:top-0 after:left-0 after:box-border after:h-full after:w-full after:rounded-[inherit] after:content-['']"
          )}
        >
          <div className="flex items-center justify-center gap-3">
            <Wallet className="h-4 w-4" />
            <span className="sr-only font-normal sm:not-sr-only">
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </span>
          </div>
        </Button>
      )}
    </div>
  );
}
