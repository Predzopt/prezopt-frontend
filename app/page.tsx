'use client';
import { useState } from 'react';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

interface LandingProps {
  onWalletConnect: (address: string) => void;
}

export default function Landing({ onWalletConnect }: LandingProps) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    // onWalletConnect(address);
  };

  return (
    <>
      <Header {...{ handleConnect, walletConnected, walletAddress }} />
      <Hero walletConnected={walletConnected} handleConnect={handleConnect} />
      <Stats />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
