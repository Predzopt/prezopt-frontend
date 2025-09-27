'use client';

import React, { useEffect, useState } from 'react';
import WalletConnection from '../WalletConnection';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function Header() {
  const [canShrink, setCanShrink] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 100) {
        setCanShrink(true);
      } else {
        setCanShrink(false);
      }
    }

    document.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn('fixed top-3 z-50 w-full')}>
      <div
        className={cn(
          'relative mx-auto flex items-center justify-between border-2 px-4 py-4 duration-300 ease-in',
          canShrink
            ? 'bg-body-bg-light/30 border-main/10 max-w-4xl rounded-2xl backdrop-blur-xl'
            : 'max-w-7xl border-transparent'
        )}
      >
        <div
          className={cn(
            'via-main absolute -top-[1px] left-1/2 h-[1px] w-md -translate-x-1/2 bg-linear-90 from-transparent from-0% via-50% to-transparent to-100%',
            canShrink ? 'opacity-100' : 'opacity-0'
          )}
        ></div>

        <Link href="/">
          <Image
            src="/images/brand/prezopt-new.svg"
            width={1174}
            height={263}
            alt="Prezopt Logo"
            className="w-[150px]"
          />
        </Link>
        <nav className="hidden gap-10 md:flex">
          {navLink.map(link => (
            <Link
              className="hover:text-main text-base font-medium text-white/80 duration-300"
              key={link.label}
              href={link.url}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <WalletConnection />

          <Button
            variant="ghost"
            className="inline-grid cursor-pointer gap-2 px-0 md:hidden"
            onClick={() => setOpen(o => !o)}
          >
            <hr
              className={cn(
                'w-6 rounded-2xl border-2 border-black transition-all duration-300',
                open ? 'translate-y-2.5 rotate-45' : ''
              )}
            />
            <hr
              className={cn(
                'w-6 rounded-2xl border-2 border-black transition-all duration-300',
                open ? '-translate-[-1.9px_-2px] -rotate-45' : ''
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
