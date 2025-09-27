import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Minus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { btnStyle2, cn } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';
import { blockchainService } from '@/services/blockchainServices';
import { safeContractCall } from '@/utils/error';
import { usePortfolioMetrics } from '@/hooks/usePortfolio';

interface WithdrawModalProps {
  trigger?: React.ReactNode;
  sharesBalance?: string;
  usdValue?: string;
  hasStakedPZT?: boolean;
}

export default function WithdrawModal({
  trigger,
  sharesBalance,
  usdValue,
  hasStakedPZT = true,
}: WithdrawModalProps) {
  const { isConnected, provider, signer } = useWallet();
  const { shares, currentValue } = usePortfolioMetrics();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [inputType, setInputType] = useState<'shares' | 'usd'>('shares');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnBlockDAG, setIsOnBlockDAG] = useState(false);
  const [isContractDeployed, setIsContractDeployed] = useState(false);

  // Use real data or fallback to props
  const userShares = sharesBalance || shares;
  const portfolioValue = usdValue || currentValue;

  // Initialize and fetch data when modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !provider || !signer) {
        setError('Wallet not connected');
        return;
      }

      try {
        const initialized = await blockchainService.init(provider, signer);
        if (!initialized) {
          setError('Failed to initialize blockchain service');
          return;
        }

        // Check network
        const onBlockDAG = await blockchainService.isOnBlockDAG();
        setIsOnBlockDAG(onBlockDAG);

        // Check contract deployment
        const deployed = await blockchainService.isContractDeployed();
        setIsContractDeployed(deployed);

        // User data is now fetched via usePortfolioMetrics hook
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load user data');
      }
    };

    if (open && isConnected) {
      fetchData();
    }
  }, [open, isConnected, provider, signer]);

  const handleMaxClick = () => {
    setAmount(inputType === 'shares' ? userShares : portfolioValue);
  };

  const calculateOutput = (withdrawAmount: string) => {
    const value = parseFloat(withdrawAmount) || 0;
    const baseFee = 0.015; // 1.5% base fee
    const discountedFee = hasStakedPZT ? baseFee * 0.9 : baseFee; // 10% discount for PZT stakers

    if (inputType === 'shares') {
      const usdAmount = value * 1.025; // Assume slight gain
      return {
        output: (usdAmount * (1 - discountedFee)).toFixed(2),
        fee: (usdAmount * discountedFee).toFixed(2),
        feePercent: (discountedFee * 100).toFixed(1),
      };
    } else {
      return {
        output: (value * (1 - discountedFee)).toFixed(2),
        fee: (value * discountedFee).toFixed(2),
        feePercent: (discountedFee * 100).toFixed(1),
      };
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !provider || !signer) {
      setError('Wallet not connected');
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

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsWithdrawing(true);
    setError(null);

    try {
      const initialized = await blockchainService.init(provider, signer);
      if (!initialized) {
        throw new Error('Failed to initialize blockchain service');
      }

      console.log('Withdrawing:', {
        amount,
        inputType,
        userShares,
      });

      await safeContractCall(async () => {
        await blockchainService.withdraw(amount);
      });

      setStep(3);
      console.log('Withdrawal completed:', amount, inputType);
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount('');
    setError(null);
    setOpen(false);
  };

  const output = calculateOutput(amount);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className={cn(btnStyle2)}>
            <Minus className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && 'Withdraw Funds'}
            {step === 2 && 'Confirm Withdrawal'}
            {step === 3 && 'Withdrawal Successful'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Network Status */}
          {!isOnBlockDAG && isConnected && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  Please switch to BlockDAG network to withdraw funds
                </span>
              </div>
            </div>
          )}

          {/* Contract Status */}
          {isOnBlockDAG && !isContractDeployed && isConnected && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">
                  Contract not deployed on this network
                </span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Tabs
                value={inputType}
                onValueChange={v => setInputType(v as 'shares' | 'usd')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="shares">Shares</TabsTrigger>
                  <TabsTrigger value="usd">USD Amount</TabsTrigger>
                </TabsList>

                <TabsContent value="shares" className="space-y-2">
                  <Label htmlFor="withdraw-shares">
                    PYO Shares to Withdraw
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="withdraw-shares"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={handleMaxClick}>
                      Max
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Available: {userShares} PYO shares
                  </p>
                </TabsContent>

                <TabsContent value="usd" className="space-y-2">
                  <Label htmlFor="withdraw-usd">USD Amount to Withdraw</Label>
                  <div className="flex gap-2">
                    <Input
                      id="withdraw-usd"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={handleMaxClick}>
                      Max
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Portfolio Value: ${portfolioValue} USDC
                  </p>
                </TabsContent>
              </Tabs>

              {amount && parseFloat(amount) > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex justify-between text-sm">
                      <span>You will receive</span>
                      <span className="font-mono font-semibold">
                        ${output.output} USDC
                      </span>
                    </div>
                    <div className="text-muted-foreground flex justify-between text-sm">
                      <span>Withdrawal fee ({output.feePercent}%)</span>
                      <span className="font-mono">${output.fee} USDC</span>
                    </div>
                    {hasStakedPZT && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        10% fee discount applied (PZT staker)
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  !isConnected ||
                  !isOnBlockDAG ||
                  !isContractDeployed
                }
                className="w-full"
              >
                Review Withdrawal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {inputType === 'shares' ? 'PYO Shares' : 'USD Amount'}
                    </span>
                    <span className="font-mono">
                      {amount} {inputType === 'shares' ? 'PYO' : 'USD'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      You will receive
                    </span>
                    <span className="text-success font-mono">
                      ${output.output} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Withdrawal fee
                    </span>
                    <span className="font-mono">${output.fee} USDC</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Withdrawal'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="bg-success/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <CheckCircle className="text-success h-8 w-8" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Withdrawal Successful!
                </h3>
                <p className="text-muted-foreground">
                  ${output.output} USDC has been sent to your wallet
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                $PZT stakers earned ${output.fee} USDC from this transaction
              </Badge>
              <Button onClick={resetModal} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
