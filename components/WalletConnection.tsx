'use client';

import { Button } from '@/components/ui/button';
import { Wallet, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';
import WalletConnectionModal from './WalletConnectionModal';

export default function WalletConnection() {
  const { isConnected, address } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div>
      {isConnected && address ? (
        <WalletConnectionModal
          trigger={
            <div className="bg-success/10 text-success border-success/20 hover:bg-success/20 flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors">
              <Check className="h-4 w-4" />
              <span className="font-mono text-sm">
                {formatAddress(address)}
              </span>
            </div>
          }
        />
      ) : (
        <WalletConnectionModal />
      )}
    </div>
  );
}
