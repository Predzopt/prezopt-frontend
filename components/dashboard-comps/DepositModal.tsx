import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, CheckCircle } from "lucide-react";

interface DepositModalProps {
  trigger?: React.ReactNode;
  walletBalance?: string;
}

export default function DepositModal({ trigger, walletBalance = "1,234.56" }: DepositModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleMaxClick = () => {
    setAmount(walletBalance);
  };

  const calculateShares = (depositAmount: string) => {
    const value = parseFloat(depositAmount) || 0;
    return (value * 0.98).toFixed(2); // 2% fee
  };

  const calculateFees = (depositAmount: string) => {
    const value = parseFloat(depositAmount) || 0;
    const totalFee = value * 0.02;
    return {
      total: totalFee.toFixed(2),
      stakers: (totalFee * 0.6).toFixed(2),
      treasury: (totalFee * 0.3).toFixed(2),
      keepers: (totalFee * 0.1).toFixed(2)
    };
  };

  const handleApprove = async () => {
    setIsApproving(true);
    // Simulate approval
    setTimeout(() => {
      setApproved(true);
      setIsApproving(false);
      console.log("USDC spending approved");
    }, 2000);
  };

  const handleDeposit = async () => {
    setIsDepositing(true);
    // Simulate deposit
    setTimeout(() => {
      setStep(4);
      setIsDepositing(false);
      console.log("Deposit completed:", amount, "USDC");
    }, 2000);
  };

  const resetModal = () => {
    setStep(1);
    setAmount("");
    setApproved(false);
    setOpen(false);
  };

  const fees = calculateFees(amount);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-deposit-trigger">
            <Plus className="w-4 h-4 mr-2" />
            Deposit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="modal-deposit">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Deposit USDC"}
            {step === 2 && "Review Deposit"}
            {step === 3 && "Confirm Transaction"}
            {step === 4 && "Deposit Successful"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="deposit-amount">Amount (USDC)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono"
                    data-testid="input-deposit-amount"
                  />
                  <Button variant="outline" onClick={handleMaxClick} data-testid="button-max">
                    Max
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Wallet Balance: {walletBalance} USDC
                </p>
              </div>
              
              <Button 
                onClick={() => setStep(2)} 
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
                data-testid="button-review-deposit"
              >
                Review Deposit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit Amount</span>
                    <span className="font-mono">{amount} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PYO Shares Received</span>
                    <span className="font-mono text-success">{calculateShares(amount)} PYO</span>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Fee Breakdown (2%)</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>$PZT Stakers (60%)</span>
                        <span className="font-mono">{fees.stakers} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Treasury (30%)</span>
                        <span className="font-mono">{fees.treasury} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keepers (10%)</span>
                        <span className="font-mono">{fees.keepers} USDC</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" data-testid="button-proceed">
                  Proceed
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {!approved ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    First, approve USDC spending allowance for the Prezopt contract.
                  </p>
                  <Button 
                    onClick={handleApprove} 
                    disabled={isApproving}
                    className="w-full"
                    data-testid="button-approve-usdc"
                  >
                    {isApproving ? "Approving..." : "Approve USDC"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">USDC spending approved</span>
                  </div>
                  <Button 
                    onClick={handleDeposit} 
                    disabled={isDepositing}
                    className="w-full"
                    data-testid="button-confirm-deposit"
                  >
                    {isDepositing ? "Depositing..." : "Confirm Deposit"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Deposit Successful!</h3>
                <p className="text-muted-foreground">
                  You received {calculateShares(amount)} PYO shares
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                $PZT stakers earned {fees.stakers} USDC from this transaction
              </Badge>
              <Button onClick={resetModal} className="w-full" data-testid="button-close-modal">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}