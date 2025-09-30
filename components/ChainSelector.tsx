'use client';

import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { SUPPORTED_CHAINS, type ChainConfig } from '../utils/CONSTANTS';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';

interface ChainSelectorProps {
  className?: string;
}

export function ChainSelector({ className }: ChainSelectorProps) {
  const { currentChain, currentChainKey, switchChain, isOnSupportedChain } =
    useWallet();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleChainSwitch = async (chainKey: string) => {
    if (chainKey === currentChainKey) return;

    setIsSwitching(true);
    try {
      await switchChain(chainKey);
    } catch (error) {
      console.error('Failed to switch chain:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSwitching(false);
    }
  };

  const getChainIcon = (chainKey: string) => {
    // You can add chain-specific icons here
    switch (chainKey) {
      case 'blockdag':
        return '🔗';
      case 'base-sepolia':
        return '🔵';
      case 'ethereum-sepolia':
        return '⚡';
      default:
        return '🔗';
    }
  };

  const getChainStatus = (chainConfig: ChainConfig) => {
    if (!chainConfig.simulatorAddress || chainConfig.simulatorAddress === '') {
      return {
        status: 'not-deployed',
        text: 'Not Deployed',
        color: 'destructive' as const,
      };
    }
    return { status: 'deployed', text: 'Deployed', color: 'default' as const };
  };

  if (!isOnSupportedChain()) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <span className="text-sm text-yellow-600">Unsupported Network</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
          disabled={isSwitching}
        >
          <span className="text-lg">{getChainIcon(currentChainKey)}</span>
          <span className="font-medium">
            {currentChain?.chainName || 'Select Network'}
          </span>
          {currentChain && (
            <Badge
              variant={getChainStatus(currentChain).color}
              className="text-xs"
            >
              {getChainStatus(currentChain).text}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {Object.entries(SUPPORTED_CHAINS).map(([key, chainConfig]) => {
          const isSelected = key === currentChainKey;
          const chainStatus = getChainStatus(chainConfig);

          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleChainSwitch(key)}
              disabled={isSwitching}
              className="flex cursor-pointer items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getChainIcon(key)}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{chainConfig.chainName}</span>
                  <span className="text-muted-foreground text-xs">
                    {chainConfig.isTestnet ? 'Testnet' : 'Mainnet'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={chainStatus.color} className="text-xs">
                  {chainStatus.text}
                </Badge>
                {isSelected && <Check className="h-4 w-4 text-green-500" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ChainSelector;
