'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  Check,
  X,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';

interface WalletConnectionModalProps {
  trigger?: React.ReactNode;
}

export default function WalletConnectionModal({
  trigger,
}: WalletConnectionModalProps) {
  const { isConnected, address, connect, disconnect } = useWallet();
  const router = useRouter();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await connect();
      setOpen(false);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setError(null);

    try {
      await disconnect();
      setOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Disconnection error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to disconnect wallet'
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className={cn(
              'border-main/50 relative flex h-11 origin-center items-center gap-2 rounded-[10px] border px-4 py-3.5 text-white opacity-100 shadow-[inset_0_0_16px_0_rgb(55,8,150)] will-change-auto [background:linear-gradient(rgba(20,9,43,0.51)_0%,rgba(20,9,43,0.51)_50%,rgba(20,9,43,0.51)_100%)_rgba(20,9,43,0.51)] hover:bg-transparent hover:text-white hover:shadow-[inset_0_0_16px_0_rgb(95,35,217)]',
              "after:pointer-events-none after:absolute after:top-0 after:left-0 after:box-border after:h-full after:w-full after:rounded-[inherit] after:content-['']"
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <Wallet className="h-4 w-4" />
              <span className="sr-only font-normal sm:not-sr-only">
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </span>
            </div>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {isConnected ? 'Wallet Settings' : 'Connect Wallet'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
              <div className="text-destructive flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {!isConnected ? (
            // Connect Wallet State
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-main/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Wallet className="text-main h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Connect Your Wallet
                </h3>
                <p className="text-muted-foreground text-sm">
                  Connect your MetaMask wallet to interact with Prezopt
                </p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                        <Wallet className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">MetaMask</p>
                        <p className="text-muted-foreground text-sm">
                          Connect using MetaMask browser extension
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="min-w-[100px]"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-muted-foreground text-xs">
                  Don&apos;t have MetaMask?{' '}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-main hover:underline"
                  >
                    Download it here
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>
          ) : (
            // Connected Wallet State
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Wallet Connected</h3>
                <p className="text-muted-foreground text-sm">
                  Your wallet is successfully connected
                </p>
              </div>

              {/* Wallet Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Address</span>
                      <span className="font-mono text-sm">
                        {address ? formatAddress(address) : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge className="bg-green-600/10 text-green-600">
                        Connected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full"
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Disconnect
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
