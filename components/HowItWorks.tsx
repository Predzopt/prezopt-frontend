import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h3 className="mb-4 text-3xl font-bold">How Prezopt Works</h3>
          <p className="text-muted-foreground text-lg">
            Simple, transparent, and efficient yield optimization
          </p>
        </div>

        <div className="space-y-8">
          {howItWorks.map((item, i) => (
            <div key={i} className="flex items-start gap-6">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
                {item.step}
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const howItWorks = [
  {
    step: 1,
    title: 'Deposit Your USDC',
    description:
      'Connect your wallet and deposit USDC to receive PYO shares representing your position.',
  },
  {
    step: 2,
    title: 'AI Monitors Markets',
    description:
      'Our machine learning model continuously analyzes yield rates across Aave, Compound, and Curve.',
  },
  {
    step: 3,
    title: 'Automatic Rebalancing',
    description:
      'When profitable opportunities are identified, keeper bots execute rebalances to maximize your yields.',
  },
  {
    step: 4,
    title: 'Earn & Compound',
    description:
      'Your yields compound automatically. Stake $PZT tokens for additional benefits and fee discounts.',
  },
];
