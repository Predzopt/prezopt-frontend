// DepositModal.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers'; // Only import ethers for utils if needed
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';
import { blockchainService } from '@/services/blockchainService';
import { safeContractCall } from '@/utils/error';

interface DepositModalProps {
  trigger?: React.ReactNode;
  walletBalance?: string; // This is now simulated balance from getUserData()
  onSuccess?: () => void;
}

export default function DepositModal({
  trigger,
  walletBalance = '0.00',
  onSuccess,
}: DepositModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultStats, setVaultStats] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<string>('0.00');

  // Initialize and fetch data when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialized = await blockchainService.init();
        if (!initialized) {
          setError('Wallet not connected');
          return;
        }

        const [stats, userData] = await Promise.all([
          blockchainService.getVaultStats(),
          blockchainService.getUserData(),
        ]);
        setVaultStats(stats);
        setUserBalance(userData.usdcBalance);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load vault data');
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleMaxClick = () => {
    setAmount(userBalance);
  };

  const calculateShares = (depositAmount: string) => {
    if (!vaultStats || !depositAmount) return '0.00';
    const value = parseFloat(depositAmount) || 0;
    // sharePrice is in 18 decimals (as per your service), but represents USDC/share
    const sharePrice = parseFloat(vaultStats.sharePrice); // already formatted to string
    if (sharePrice <= 0) return '0.00';
    return (value / sharePrice).toFixed(6);
  };

  const calculateFees = (depositAmount: string) => {
    const value = parseFloat(depositAmount) || 0;
    const totalFee = value * 0.02;
    return {
      total: totalFee.toFixed(2),
      stakers: (totalFee * 0.6).toFixed(2),
      treasury: (totalFee * 0.3).toFixed(2),
      keepers: (totalFee * 0.1).toFixed(2),
    };
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsDepositing(true);
    setError(null);

    try {
      // Optional: Mint USDC first if this is a simulator (only for demo!)
      // Remove this in production if users bring real USDC
      await safeContractCall(async () => {
        await blockchainService.mintUSDC(amount); // Gives user USDC
      });

      // Then deposit it
      await safeContractCall(async () => {
        await blockchainService.deposit(amount);
      });

      setStep(2); // Go directly to success
      onSuccess?.();
    } catch (err: any) {
      setError(`Deposit failed: ${err.message}`);
      console.error('Deposit error:', err);
    } finally {
      setIsDepositing(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount('');
    setError(null);
    setOpen(false);
  };

  const fees = calculateFees(amount);
  const sharesToReceive = calculateShares(amount);

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen);
        if (!isOpen) resetModal();
      }}
    >
      <DialogTrigger asChild className={cn(btnStyle)}>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Deposit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && 'Deposit USDC'}
            {step === 2 && 'Deposit Successful'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
            <div className="text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="deposit-amount">Amount (USDC)</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="font-mono"
                    step="0.01"
                    min="0"
                  />
                  <Button variant="outline" onClick={handleMaxClick}>
                    Max
                  </Button>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wallet Balance: {userBalance} USDC
                </p>
              </div>

              {vaultStats && (
                <Card>
                  <CardContent className="p-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Current Share Price:</span>
                        <span className="font-mono">
                          {vaultStats.sharePrice} USDC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Assets:</span>
                        <span className="font-mono">
                          {vaultStats.totalAssets} USDC
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0 || isDepositing}
                className="w-full"
              >
                {isDepositing ? 'Depositing...' : 'Confirm Deposit'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="bg-success/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <CheckCircle className="text-success h-8 w-8" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Deposit Successful!</h3>
                <p className="text-muted-foreground">
                  You received {sharesToReceive} PYO shares
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                $PZT stakers earned {fees.stakers} USDC from this transaction
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
