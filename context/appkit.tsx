"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { ReactNode } from "react";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "70b42d517ef81ac275432f9a2aac01bc";

const metadata = {
  name: "Prezopt",
  description: "Non-custodial yield optimization protocol",
  url: "https://prezopt-frontend.vercel.app/",
  icons: ["/favicon.ico"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, arbitrum],
  projectId,
  features: {
    analytics: true,
  },
});

export function AppKit({ children }: { children: ReactNode }) {
  return <>{children}</>;
}