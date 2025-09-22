import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { FaDiscord, FaGithub, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-body-bg relative overflow-hidden px-4 py-20">
      {/* GLOW LINE */}
      <div
        className={cn(
          'via-main/30 absolute top-[1px] left-1/2 z-10 h-[1px] w-9/12 -translate-x-1/2 bg-linear-90 from-transparent from-0% via-50% to-transparent to-100%'
        )}
      />

      {/* GLOW CIRCLE */}
      <div className="bg-main/5 absolute -top-1/2 left-1/2 aspect-square w-5/12 -translate-1/2 -translate-x-1/2 scale-x-200 rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="w-full sm:w-1/2">
            <h5 className="mb-4 font-semibold">Prezopt</h5>
            <p className="text-white/60">
              Non-custodial DeFi yield optimization protocol powered by machine learning.
            </p>
            <div>
              {communities.map(social => (
                <Link
                  className={cn(
                    'size-10 rounded-xl shadow-[rgba(255,255,255,0.25)_0px_1px_2px_1px_inset]'
                  )}
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {footerLinks.map(link => (
              <div key={link.category}>
                <h4 className="mb-4 text-lg font-bold text-white">{link.category}</h4>
                <div className="grid gap-2">
                  {link.items.map(item => (
                    <Link
                      key={item.label}
                      href={item.url as string}
                      className="hover:text-main text-white/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; 2024 Prezopt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const footerLinks = [
  {
    category: 'Protocol',
    items: [
      { url: '/#docs', label: 'Documentation' },
      { url: '/#', label: 'Security Audit' },
      { url: '/#', label: 'Governance' },
    ],
  },
  {
    category: 'Token',
    items: [
      { url: '/#', label: 'PZT Contract' },
      { label: 'Tokenomics', url: '/#' },
      { label: 'Staking', url: '/#' },
    ],
  },
];

const communities = [
  { url: '/#', label: 'Discord', icon: FaDiscord },
  { url: '/#', label: 'Twitter', icon: FaXTwitter },
  { url: '/#', label: 'GitHub', icon: FaGithub },
  { url: '/#', label: 'Telegram', icon: FaTelegram },
];
