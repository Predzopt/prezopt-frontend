import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">How Prezopt Works</h3>
          <p className="text-lg text-muted-foreground">
            Simple, transparent, and efficient yield optimization
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Deposit Your USDC</h4>
              <p className="text-muted-foreground">
                Connect your wallet and deposit USDC to receive PYO shares representing your
                position.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">AI Monitors Markets</h4>
              <p className="text-muted-foreground">
                Our machine learning model continuously analyzes yield rates across Aave, Compound,
                and Curve.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Automatic Rebalancing</h4>
              <p className="text-muted-foreground">
                When profitable opportunities are identified, keeper bots execute rebalances to
                maximize your yields.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Earn & Compound</h4>
              <p className="text-muted-foreground">
                Your yields compound automatically. Stake $PZT tokens for additional benefits and
                fee discounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
