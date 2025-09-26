'use client';

import React from 'react';
import WalletConnection from './WalletConnection';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useAppKitAccount } from '@reown/appkit/react';
import LiquidEther from './LiquidEther';

const MotionImage = motion.create(Image);

export default function Hero() {
  const { isConnected } = useAppKitAccount();
  return (
    <section className="relative h-auto w-full flex-col items-center justify-center overflow-hidden bg-none px-4 py-20 pt-40">
      {/* <Image
        className="absolute top-1/2 left-0 h-full w-full -translate-y-1/2 object-contain object-center"
        src="/images/geometrics.webp"
        width={915}
        height={1040}
        alt="geometrics"
      /> */}

      {/* <div style={{ width: '100%', height: 600, position: 'relative' }}>
       
      </div> */}

      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />

      <MotionImage
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        src="/images/conelight.avif"
        alt="glow light"
        width={512}
        height={466}
        className="absolute -right-10 -bottom-24 h-[400px] w-[300px] rotate-45 object-cover mix-blend-difference"
      />
      <MotionImage
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: 'bottom-left' }}
        src="/images/conelight.avif"
        alt="glow light"
        width={512}
        height={466}
        className="absolute -bottom-24 -left-10 h-[400px] w-[300px] rotate-[140deg] object-cover mix-blend-difference"
      />

      <div className="bg-main/30 absolute top-1/2 left-1/2 size-[20rem] translate-[-50%] rounded-full blur-[100px]" />
      {/* <ParticleBackground /> */}
      <div className="relative z-10 container mx-auto max-w-2xl text-center">
        <span className="border-main/50 rounded-full border bg-transparent px-4 py-1.5 text-sm text-white shadow-[inset_0px_-10px_10px_rgba(55,8,150,0.7)] backdrop-blur-xl">
          The Future of DeFi Yield Optimization
        </span>
        <h1 className="mt-5 mb-6 text-5xl leading-[120%] font-bold text-white lg:text-6xl">
          Smarter DeFi Returns, The Prezopt Way
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80 sm:text-balance">
          Harness machine learning, Layer 2 efficiency, and $PZT governance for
          better yield.
        </p>

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WalletConnection />
            <Button
              variant="outline"
              className="h-11 rounded-[10px] px-4 py-3.5 opacity-100 shadow-[inset_0_0.6px_0.6px_-1.58px_rgba(255,255,255,0.894),inset_0_2.28px_2.28px_-3.16px_rgba(255,255,255,0.745),inset_0_10px_10px_-4.75px_rgba(255,255,255,0.05)] backdrop-blur-[5px] duration-300 will-change-auto [background:linear-gradient(rgba(28,28,28,0.1)_0%,rgba(18,18,18,0.2)_100%)_rgba(0,0,0,0)]"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-success font-medium">
              Wallet connected! No existing positions found.
            </p>
            <Button size="lg">
              Start Earning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex w-full items-center justify-center pt-20">
        <MotionImage
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 6,
            ease: 'backIn',
          }}
          src="/images/AnimatingballJujora.svg"
          width={400}
          height={500}
          alt="globe"
          className="a"
        />
      </div>
    </section>
  );
}
