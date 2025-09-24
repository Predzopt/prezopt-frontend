import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { AppKit } from '../context/appkit';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: 'normal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Prezopt',
  description:
    'Prezopt is a non custodial yield optimization protocol that automatically reallocates user deposits across DeFi protocols including Aave, Compound, and Curve.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppKit>
        <SidebarProvider>
          <body className={`${manrope.className} antialiased`}>{children}</body>
        </SidebarProvider>
      </AppKit>
    </html>
  );
}
