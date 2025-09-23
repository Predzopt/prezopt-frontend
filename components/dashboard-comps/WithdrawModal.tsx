import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, ArrowRight, CheckCircle } from "lucide-react";

interface WithdrawModalProps {
  trigger?: React.ReactNode;
  sharesBalance?: string;
  usdValue?: string;
  hasStakedPZT?: boolean;
}

export default function WithdrawModal({ 
  trigger, 
  sharesBalance = "1,234.56", 
  usdValue = "1,267.89",
  hasStakedPZT = true 
}: WithdrawModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [inputType, setInputType] = useState<"shares" | "usd">("shares");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleMaxClick = () => {
    setAmount(inputType === "shares" ? sharesBalance : usdValue);
  };

  const calculateOutput = (withdrawAmount: string) => {
    const value = parseFloat(withdrawAmount) || 0;
    const baseFee = 0.015; // 1.5% base fee
    const discountedFee = hasStakedPZT ? baseFee * 0.9 : baseFee; // 10% discount for PZT stakers
    
    if (inputType === "shares") {
      const usdAmount = value * 1.025; // Assume slight gain
      return {
        output: (usdAmount * (1 - discountedFee)).toFixed(2),
        fee: (usdAmount * discountedFee).toFixed(2),
        feePercent: (discountedFee * 100).toFixed(1)
      };
    } else {
      return {
        output: (value * (1 - discountedFee)).toFixed(2),
        fee: (value * discountedFee).toFixed(2),
        feePercent: (discountedFee * 100).toFixed(1)
      };
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    // Simulate withdrawal
    setTimeout(() => {
      setStep(3);
      setIsWithdrawing(false);
      console.log("Withdrawal completed:", amount, inputType);
    }, 2000);
  };

  const resetModal = () => {
    setStep(1);
    setAmount("");
    setOpen(false);
  };

  const output = calculateOutput(amount);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" data-testid="button-withdraw-trigger">
            <Minus className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="modal-withdraw">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Withdraw Funds"}
            {step === 2 && "Confirm Withdrawal"}
            {step === 3 && "Withdrawal Successful"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as "shares" | "usd")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="shares">Shares</TabsTrigger>
                  <TabsTrigger value="usd">USD Amount</TabsTrigger>
                </TabsList>
                
                <TabsContent value="shares" className="space-y-2">
                  <Label htmlFor="withdraw-shares">PYO Shares to Withdraw</Label>
                  <div className="flex gap-2">
                    <Input
                      id="withdraw-shares"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="font-mono"
                      data-testid="input-withdraw-shares"
                    />
                    <Button variant="outline" onClick={handleMaxClick} data-testid="button-max">
                      Max
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available: {sharesBalance} PYO shares
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
                      onChange={(e) => setAmount(e.target.value)}
                      className="font-mono"
                      data-testid="input-withdraw-usd"
                    />
                    <Button variant="outline" onClick={handleMaxClick} data-testid="button-max">
                      Max
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Portfolio Value: ${usdValue} USDC
                  </p>
                </TabsContent>
              </Tabs>
              
              {amount && parseFloat(amount) > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>You will receive</span>
                      <span className="font-mono font-semibold">${output.output} USDC</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Withdrawal fee ({output.feePercent}%)</span>
                      <span className="font-mono">${output.fee} USDC</span>
                    </div>
                    {hasStakedPZT && (
                      <Badge variant="secondary" className="text-xs w-fit">
                        10% fee discount applied (PZT staker)
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <Button 
                onClick={() => setStep(2)} 
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
                data-testid="button-review-withdrawal"
              >
                Review Withdrawal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {inputType === "shares" ? "PYO Shares" : "USD Amount"}
                    </span>
                    <span className="font-mono">
                      {amount} {inputType === "shares" ? "PYO" : "USD"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="font-mono text-success">${output.output} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Withdrawal fee</span>
                    <span className="font-mono">${output.fee} USDC</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleWithdraw} 
                  disabled={isWithdrawing}
                  className="flex-1" 
                  data-testid="button-confirm-withdrawal"
                >
                  {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Withdrawal Successful!</h3>
                <p className="text-muted-foreground">
                  ${output.output} USDC has been sent to your wallet
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                $PZT stakers earned ${output.fee} USDC from this transaction
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