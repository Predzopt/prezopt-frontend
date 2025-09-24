import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

export default function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
