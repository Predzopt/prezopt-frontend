import React, { useEffect, useState } from 'react';
import WalletConnection from '../WalletConnection';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideLayoutDashboard, LucideMenu } from 'lucide-react';
import { Button } from '../ui/button';

type HeaderProps = {
  handleConnect: (address: string) => void;
  walletConnected: boolean;
  walletAddress: string;
};

export default function Header({ handleConnect, walletConnected, walletAddress }: HeaderProps) {
  const [canShrink, setCanShrink] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      console.log('SCROLLER', window.scrollY >= 100, window);

      if (window.scrollY >= 100) {
        setCanShrink(true);
      } else {
        setCanShrink(false);
      }
    }

    document.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'z-50 sticky top-3 transition-all duration-700 max-w-full mx-auto ease-in-out',
        canShrink
          ? 'w-[90%] sm:max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl border-2'
          : 'w-full'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between ">
        <span className="text-2xl font-bold uppercase">Prezopt</span>
        <nav className="hidden md:flex gap-10">
          {navLink.map(link => (
            <Link className="hover:text-primary transition-colors" key={link.label} href={link.url}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <WalletConnection
            onConnect={handleConnect}
            connected={walletConnected}
            address={walletAddress}
          />

          <Button
            variant="ghost"
            className="inline-grid gap-2 px-0 cursor-pointer md:hidden"
            onClick={() => setOpen(o => !o)}
          >
            <hr
              className={cn(
                'border-2 w-6 border-black rounded-2xl transition-all duration-300',
                open ? 'rotate-45 translate-y-2.5' : ''
              )}
            />
            <hr
              className={cn(
                'border-2 w-6 border-black rounded-2xl transition-all duration-300',
                open ? '-rotate-45 -translate-[-1.9px_-2px]' : ''
              )}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

const navLink = [
  { url: '#features', label: 'Features' },
  { url: '#how-it-works', label: 'How it Works' },
  { url: '#docs', label: 'Docs' },
];
