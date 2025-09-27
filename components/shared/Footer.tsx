import { cn } from '@/lib/utils';
import Image from 'next/image';
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
      <div className="bg-main/10 absolute -top-1/2 left-1/2 aspect-square w-5/12 -translate-1/2 -translate-x-1/2 scale-x-200 rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="w-full sm:w-1/2">
             <Link href="/">
                      <Image
                        src="/images/brand/prezopt-new.svg"
                        width={1174}
                        height={263}
                        alt="Prezopt Logo"
                        className="w-[150px]"
                      />
                    </Link>
            <p className="text-white/60 pt-5 pb-3">
              Non-custodial DeFi yield optimization protocol powered by machine learning.
            </p>
            <div className="mt-4 flex gap-4">
              {communities.map(social => (
                <Link
                   className="size-11 inline-flex justify-center items-center rounded-[10px] px-2.5 text-white border-white/5 hover:border-main/10 hover:text-main  py-3.5 opacity-100 shadow-[inset_0_0.6px_0.6px_-1.58px_rgba(255,255,255,0.894),inset_0_2.28px_2.28px_-3.16px_rgba(255,255,255,0.745),inset_0_10px_10px_-4.75px_rgba(255,255,255,0.05)] backdrop-blur-[5px] duration-300 will-change-auto [background:linear-gradient(rgba(28,28,28,0.1)_0%,rgba(18,18,18,0.2)_100%)_rgba(0,0,0,0)]"
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                >
                  <social.icon size={32} />
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
          <p>&copy; {new Date().getFullYear()} Prezopt. All rights reserved.</p>
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
