'use client';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <ScrollAnimation>
        <Stats />
      </ScrollAnimation>
      <ScrollAnimation delay={0.2}>
        <Features />
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <HowItWorks />
      </ScrollAnimation>
      <ScrollAnimation delay={0.6}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
