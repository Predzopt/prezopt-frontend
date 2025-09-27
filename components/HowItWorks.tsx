import Image from 'next/image';
import React from 'react';
import { motion } from 'motion/react';
import ScrollAnimation from './ScrollAnimation';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="mb-16 text-center">
            <motion.h3
              className="mb-4 text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              How <span className="text-main">Prezopt</span> Works
            </motion.h3>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Simple, transparent, and efficient yield optimization
            </motion.p>
          </div>
        </ScrollAnimation>

        <div className="space-y-8">
          {howItWorks.map((item, i) => (
            <ScrollAnimation
              key={i}
              direction="left"
              delay={i * 0.2}
              distance={50}
            >
              <motion.div
                className="flex items-center gap-6"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className=""
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="w-[90px]"
                  />
                </motion.div>
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            </ScrollAnimation>
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
    icon: '/images/deposit.svg',
  },
  {
    step: 2,
    title: 'AI Monitors Markets',
    description:
      'Our machine learning model continuously analyzes yield rates across Aave, Compound, and Curve.',
    icon: '/images/ai-monitor.svg',
  },
  {
    step: 3,
    title: 'Automatic Rebalancing',
    description:
      'When profitable opportunities are identified, keeper bots execute rebalances to maximize your yields.',
    icon: '/images/auto-rebalance.svg',
  },
  {
    step: 4,
    title: 'Earn & Compound',
    description:
      'Your yields compound automatically. Stake $PZT tokens for additional benefits and fee discounts.',
    icon: '/images/earn.svg',
  },
];
