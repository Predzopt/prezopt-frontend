import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-semibold mb-4">Prezopt</h5>
            <p className="text-sm text-muted-foreground">
              Non-custodial DeFi yield optimization protocol powered by machine learning.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Protocol</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#docs" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#audit" className="hover:text-foreground transition-colors">
                  Security Audit
                </a>
              </li>
              <li>
                <a href="#governance" className="hover:text-foreground transition-colors">
                  Governance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Community</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#discord" className="hover:text-foreground transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#twitter" className="hover:text-foreground transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#github" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Token</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#contract" className="hover:text-foreground transition-colors">
                  PZT Contract
                </a>
              </li>
              <li>
                <a href="#tokenomics" className="hover:text-foreground transition-colors">
                  Tokenomics
                </a>
              </li>
              <li>
                <a href="#staking" className="hover:text-foreground transition-colors">
                  Staking
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Prezopt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
