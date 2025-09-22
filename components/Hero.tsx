import React from 'react';
import WalletConnection from './WalletConnection';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

type HeroProps = {
  handleConnect: (address: string) => void;
  walletConnected: boolean;
};

export default function Hero({ walletConnected, handleConnect }: HeroProps) {
  return (
    <section className="py-20 px-4 h-screen w-full flex items-center justify-center">
      <Image
        className="w-full h-full object-contain absolute top-1/2 -translate-y-1/2 left-0 object-center"
        src="/images/geometrics.webp"
        width={915}
        height={1040}
        alt="geometrics"
      />
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-5xl font-bold mb-6 ">Maximize Your DeFi Yields Automatically</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Non-custodial yield optimization protocol that automatically reallocates your deposits
          across Aave, Compound, and Curve using AI-powered predictions.
        </p>

        {!walletConnected ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WalletConnection onConnect={handleConnect} />
            <Button variant="outline" data-testid="button-learn-more">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-success font-medium">
              Wallet connected! No existing positions found.
            </p>
            <Button size="lg" data-testid="button-start-earning">
              Start Earning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
