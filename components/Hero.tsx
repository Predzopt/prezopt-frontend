'use client';

import React from 'react';
import WalletConnection from './WalletConnection';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';

const MotionImage = motion.create(Image);
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionH1 = motion.h1;
const MotionP = motion.p;

export default function Hero() {
  const { isConnected } = useWallet();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      className="relative h-screen w-full flex-col items-center justify-center overflow-hidden bg-none"
      style={{ y, opacity }}
    >
      <MotionImage
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: [0, 5, -5, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        src="/images/conelight.avif"
        alt="glow light"
        width={512}
        height={466}
        className="absolute -right-10 -bottom-24 h-[400px] w-[300px] rotate-45 object-cover mix-blend-difference"
      />
      <MotionImage
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: [0, -5, 5, 0],
          y: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 0.5,
        }}
        style={{ transformOrigin: 'bottom-left' }}
        src="/images/conelight.avif"
        alt="glow light"
        width={512}
        height={466}
        className="absolute -bottom-24 -left-10 h-[400px] w-[300px] rotate-[140deg] object-cover mix-blend-difference"
      />

      <MotionDiv
        className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center px-4 py-20 pt-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <MotionDiv
          className="bg-main/30 absolute top-1/2 left-1/2 size-[20rem] translate-[-50%] rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* <ParticleBackground /> */}
        <MotionDiv
          className="relative z-10 container mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MotionSpan
            className="border-main/50 inline-block rounded-full border bg-transparent px-4 py-1.5 text-sm text-white shadow-[inset_0px_-10px_10px_rgba(55,8,150,0.7)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            The Future of DeFi Yield Optimization
          </MotionSpan>
          <MotionH1
            className="mt-5 mb-6 text-5xl leading-[120%] font-normal text-white lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Smarter DeFi Returns, The{' '}
            <motion.span
              className="text-main font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 1,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.1,
                textShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
              }}
            >
              Prezopt
            </motion.span>{' '}
            Way
          </MotionH1>
          <MotionP
            className="mx-auto mb-8 max-w-2xl text-xl !text-white/80 sm:text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Harness machine learning, Layer 2 efficiency, and $PZT governance
            for better yield.
          </MotionP>

          {!isConnected ? (
            <MotionDiv
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <WalletConnection />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="h-11 rounded-[10px] px-4 py-3.5 text-white opacity-100 shadow-[inset_0_0.6px_0.6px_-1.58px_rgba(255,255,255,0.894),inset_0_2.28px_2.28px_-3.16px_rgba(255,255,255,0.745),inset_0_10px_10px_-4.75px_rgba(255,255,255,0.05)] backdrop-blur-[5px] duration-300 will-change-auto [background:linear-gradient(rgba(28,28,28,0.1)_0%,rgba(18,18,18,0.2)_100%)_rgba(0,0,0,0)] hover:text-white"
                >
                  Learn More
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </MotionDiv>
          ) : (
            <MotionDiv
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <MotionP
                className="text-success font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                Wallet connected! No existing positions found.
              </MotionP>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg">
                  <Link href="/dashboard" className="flex items-center gap-3">
                    Start Earning
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
            </MotionDiv>
          )}
        </MotionDiv>
      </MotionDiv>
    </motion.section>
  );
}
