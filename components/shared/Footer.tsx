import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaDiscord, FaGithub, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'motion/react';
import ScrollAnimation from '../ScrollAnimation';

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
          <ScrollAnimation direction="right" delay={0.2}>
            <div className="w-full sm:w-1/2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/">
                  <Image
                    src="/images/brand/prezopt-new.svg"
                    width={1174}
                    height={263}
                    alt="Prezopt Logo"
                    className="w-[150px]"
                  />
                </Link>
              </motion.div>
              <motion.p
                className="pt-5 pb-3 text-white/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Non-custodial DeFi yield optimization protocol powered by
                machine learning.
              </motion.p>
              <div className="mt-4 flex gap-4">
                {communities.map((social, index) => (
                  <ScrollAnimation
                    key={social.label}
                    direction="up"
                    delay={0.6 + index * 0.1}
                    distance={20}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        className="hover:border-main/10 hover:text-main inline-flex size-11 items-center justify-center rounded-[10px] border-white/5 px-2.5 py-3.5 text-white opacity-100 shadow-[inset_0_0.6px_0.6px_-1.58px_rgba(255,255,255,0.894),inset_0_2.28px_2.28px_-3.16px_rgba(255,255,255,0.745),inset_0_10px_10px_-4.75px_rgba(255,255,255,0.05)] backdrop-blur-[5px] duration-300 will-change-auto [background:linear-gradient(rgba(28,28,28,0.1)_0%,rgba(18,18,18,0.2)_100%)_rgba(0,0,0,0)]"
                        href={social.url}
                        aria-label={social.label}
                      >
                        <social.icon size={32} />
                      </Link>
                    </motion.div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation direction="left" delay={0.4}>
            <div className="grid gap-4 sm:grid-cols-2">
              {footerLinks.map((link, linkIndex) => (
                <ScrollAnimation
                  key={link.category}
                  direction="up"
                  delay={0.6 + linkIndex * 0.2}
                  distance={30}
                >
                  <div>
                    <h4 className="mb-4 text-lg font-bold text-white">
                      {link.category}
                    </h4>
                    <div className="grid gap-2">
                      {link.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.8 + linkIndex * 0.2 + itemIndex * 0.1,
                          }}
                          viewport={{ once: true }}
                        >
                          <Link
                            href={item.url as string}
                            className="hover:text-main block text-white/60 transition-colors duration-300"
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </ScrollAnimation>
        </div>
        <ScrollAnimation direction="fade" delay={1.2}>
          <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Prezopt. All rights reserved.
            </p>
          </div>
        </ScrollAnimation>
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
