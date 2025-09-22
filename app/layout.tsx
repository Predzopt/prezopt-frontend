import type { Metadata } from 'next';
import { Parkinsans } from 'next/font/google';
import './globals.css';

const parkinsans = Parkinsans({
  variable: '--font-parkinsans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      <body className={`${parkinsans.className} antialiased`}>{children}</body>
    </html>
  );
}
