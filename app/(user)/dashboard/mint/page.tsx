'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Coins,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';
import { blockchainService } from '@/services/blockchainServices';
import { safeContractCall } from '@/utils/error';

export default function MintPage() {
  const { isConnected, address, provider, signer } = useWallet();
  const [amount, setAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnBlockDAG, setIsOnBlockDAG] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isContractDeployed, setIsContractDeployed] = useState(false);

  // Fetch user balance and check network when component mounts or wallet connects
  useEffect(() => {
    if (isConnected && provider && signer) {
      fetchUserBalance();
      checkNetwork();
      checkContractDeployment();
    }
  }, [isConnected, provider, signer]);

  const checkNetwork = async () => {
    try {
      const onBlockDAG = await blockchainService.isOnBlockDAG();
      console.log('Network check result:', onBlockDAG);
      setIsOnBlockDAG(onBlockDAG);

      if (!onBlockDAG) {
        setError('Please switch to BlockDAG network to mint USDC tokens');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error checking network:', err);
      setIsOnBlockDAG(false);
      setError('Failed to check network connection');
    }
  };

  const checkContractDeployment = async () => {
    try {
      const initialized = await blockchainService.init(provider!, signer!);
      if (!initialized) {
        setIsContractDeployed(false);
        setError('Failed to initialize blockchain service');
        return;
      }

      const deployed = await blockchainService.isContractDeployed();
      console.log('Contract deployment check:', deployed);
      setIsContractDeployed(deployed);

      if (!deployed) {
        setError(
          'Contract not deployed on this network. Please check if you are on the correct BlockDAG testnet.'
        );
      }
    } catch (err) {
      console.error('Error checking contract deployment:', err);
      setIsContractDeployed(false);
      setError('Failed to verify contract deployment');
    }
  };

  const fetchUserBalance = async () => {
    if (!provider || !signer) return;

    setIsLoading(true);
    try {
      const initialized = await blockchainService.init(provider, signer);
      if (!initialized) {
        setError('Failed to initialize blockchain service');
        return;
      }

      const userData = await blockchainService.getUserData();
      setUserBalance(userData.usdcBalance);
    } catch (err) {
      console.error('Error fetching user balance:', err);
      setError('Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isOnBlockDAG) {
      setError('Please switch to BlockDAG network first');
      return;
    }

    if (!isContractDeployed) {
      setError('Contract not deployed on this network');
      return;
    }

    if (!provider || !signer) {
      setError('Wallet not properly connected');
      return;
    }

    setIsMinting(true);
    setError(null);
    setSuccess(null);

    try {
      const initialized = await blockchainService.init(provider, signer);
      if (!initialized) {
        throw new Error('Failed to initialize blockchain service');
      }

      await safeContractCall(async () => {
        await blockchainService.mintUSDC(amount);
      });

      setSuccess(`Successfully minted ${amount} USDC!`);
      setAmount('');
      // Refresh balance
      await fetchUserBalance();
    } catch (err) {
      console.error('Minting error:', err);
      setError(err instanceof Error ? err.message : 'Minting failed');
    } finally {
      setIsMinting(false);
    }
  };

  const handleMaxAmount = () => {
    setAmount('1000'); // Set a reasonable max for testing
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    setError(null);

    try {
      await blockchainService.switchToBlockDAG();
      await checkNetwork();
      setSuccess('Switched to BlockDAG network! You can now mint USDC.');
    } catch (err) {
      console.error('Network switch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Wallet className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Connect Your Wallet
          </h2>
          <p className="mb-6 text-gray-400">
            Please connect your wallet to mint USDC tokens.
          </p>
          <p className="text-sm text-gray-500">
            Use the wallet connection button in the top right corner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-white">USDC Minting</h2>
        <p className="text-body">
          Mint USDC tokens for testing and development purposes.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Minting Form */}
        <div className="lg:col-span-2">
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Coins className="text-main h-5 w-5" />
                Mint USDC Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Balance */}
              <div className="bg-main/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-main h-4 w-4" />
                    <span className="text-sm text-white">
                      Current USDC Balance
                    </span>
                  </div>
                  <div className="text-right">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="font-mono text-lg font-bold text-white">
                        {userBalance} USDC
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Network Status */}
              {!isOnBlockDAG && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">
                      Wrong Network
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-yellow-400">
                    Please switch to BlockDAG network to mint USDC tokens.
                  </p>
                  <Button
                    onClick={handleSwitchNetwork}
                    disabled={isSwitching}
                    variant="outline"
                    className="w-full"
                  >
                    {isSwitching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Switching...
                      </>
                    ) : (
                      'Switch to BlockDAG Network'
                    )}
                  </Button>
                </div>
              )}

              {/* Contract Status */}
              {isOnBlockDAG && !isContractDeployed && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-500">
                      Contract Not Deployed
                    </span>
                  </div>
                  <p className="text-sm text-red-400">
                    The simulator contract is not deployed on this network.
                    Please check if you are on the correct BlockDAG testnet.
                  </p>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">
                  Amount to Mint
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="flex-1"
                    disabled={isMinting || !isOnBlockDAG}
                  />
                  <Button
                    variant="outline"
                    onClick={handleMaxAmount}
                    disabled={isMinting || !isOnBlockDAG}
                    className="px-4"
                  >
                    Max
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Enter the amount of USDC you want to mint (max 1000 USDC)
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Mint Button */}
              <Button
                onClick={handleMint}
                disabled={
                  isMinting ||
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  !isOnBlockDAG ||
                  !isContractDeployed
                }
                className={cn(btnStyle, 'w-full')}
              >
                {isMinting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting USDC...
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Mint USDC
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Wallet Info */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="text-white">Wallet Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Address</span>
                <span className="font-mono text-xs text-white">
                  {address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <Badge className="bg-green-600/10 text-green-600">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Network</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">
                    {isOnBlockDAG ? 'BlockDAG' : 'Other Network'}
                  </span>
                  {isOnBlockDAG ? (
                    <Badge className="bg-green-600/10 text-xs text-green-600">
                      ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-600/10 text-xs text-yellow-600">
                      !
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minting Info */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="text-main h-5 w-5" />
                Minting Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Token</span>
                  <span className="text-sm text-white">USDC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Decimals</span>
                  <span className="text-sm text-white">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Max Amount</span>
                  <span className="text-sm text-white">1,000 USDC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Network</span>
                  <span className="text-sm text-white">BlockDAG Testnet</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="text-white">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-400">
                <p>1. Make sure you're on BlockDAG network</p>
                <p>2. Enter the amount of USDC you want to mint</p>
                <p>3. Click "Mint USDC" to execute the transaction</p>
                <p>4. Confirm the transaction in your wallet</p>
                <p>5. Wait for the transaction to be confirmed</p>
                <p>6. Your balance will be updated automatically</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
