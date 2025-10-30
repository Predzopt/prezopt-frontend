import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { WalletProvider } from '@/context/WalletContext';
import QueryProvider from '@/context/QueryProvider';
import NextTopLoader from 'nextjs-toploader';
import AppKitProvider from '@/context/AppKitProvider';
import { headers } from 'next/headers';

const poppins = Poppins({
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" sizes="any" />
      </head>
      <body className={`${poppins.className} overflow-x-hidden antialiased`}>
        <AppKitProvider cookies={cookies}>
          <SidebarProvider>
            <NextTopLoader
              color="#9c6bff"
              crawl={true}
              showSpinner={true}
              easing="ease"
              speed={200}
            />
            {children}
          </SidebarProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
