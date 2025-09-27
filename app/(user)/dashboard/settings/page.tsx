'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, Settings as SettingsIcon, Bell, Shield } from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';

type BoostProp = 'medium' | 'conservative' | 'aggressive';

export default function Settings() {
  const [autoCompound, setAutoCompound] = useState(true);
  const [notifications, setNotifications] = useState({
    rebalances: true,
    governance: false,
    rewards: true,
  });
  const [defaultBoost, setDefaultBoost] = useState<BoostProp>('medium');

  const handleExportCSV = () => {
    // todo: remove mock functionality
    const csvData = [
      'Type,Amount,Date,Profit,PZT Rewards,Fee Discount',
      'Deposit,5000.00,2024-01-15,0,3.00,0',
      'Rebalance,15000.00,2024-01-16,156.78,0.45,0',
      'Withdraw,2000.00,2024-01-20,0,1.20,5%',
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'prezopt-tax-export.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    console.log('Tax data exported to CSV');
  };

  return (
    <div className="min-h-screen w-full">
      <>
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-white">Settings</h2>
          <p className="text-muted-foreground">
            Manage your preferences and export transaction data for tax
            purposes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tax Export */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Download className="h-5 w-5" />
                Tax Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body text-sm">
                Export your transaction history for tax reporting purposes. The
                CSV includes all deposits, withdrawals, rebalances, $PZT
                rewards, and fee discounts.
              </p>

              <div className="rounded-md bg-neutral-900/30 p-4">
                <p className="mb-2 text-sm font-medium text-white">
                  Export includes:
                </p>
                <ul className="text-body space-y-1 text-sm">
                  <li>• Deposit and withdrawal transactions</li>
                  <li>• Rebalance profits and losses</li>
                  <li>• $PZT rewards earned</li>
                  <li>• Fee discounts applied</li>
                  <li>• Transaction timestamps and amounts</li>
                </ul>
              </div>

              <Button onClick={handleExportCSV} className={cn(btnStyle)}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <SettingsIcon className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-main/5 border-main/20 flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium text-white">
                    Auto-compound staking rewards
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Automatically stake earned $PZT rewards
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-main data-[state=unchecked]:bg-neutral-400"
                  checked={autoCompound}
                  onCheckedChange={setAutoCompound}
                />
              </div>

              <div className="rounded-md border p-4">
                <p className="mb-3 font-medium text-white">
                  Default APY Boost Level
                </p>
                <p className="text-muted-foreground mb-3 text-sm">
                  Choose your preferred risk/reward level for yield optimization
                </p>
                <div className="flex flex-wrap gap-2">
                  {['conservative', 'medium', 'aggressive'].map(type => (
                    <Button
                      key={type}
                      className={cn(
                        '!h-10 px-4 py-3.5',
                        defaultBoost === type
                          ? btnStyle
                          : 'hover:bg-main/10 hover:text-main border bg-transparent text-neutral-500'
                      )}
                      variant={defaultBoost === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDefaultBoost(type as BoostProp)}
                    >
                      <span className="capitalize">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-main/5 border-main/20 flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium text-white">
                    Rebalance notifications
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Get notified when keeper bots execute rebalances
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-main data-[state=unchecked]:bg-neutral-400"
                  checked={notifications.rebalances}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, rebalances: checked }))
                  }
                />
              </div>

              <div className="bg-main/5 border-main/20 flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium text-white">
                    Governance notifications
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Get notified about new proposals and voting deadlines
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-main data-[state=unchecked]:bg-neutral-400"
                  checked={notifications.governance}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, governance: checked }))
                  }
                />
              </div>

              <div className="bg-main/5 border-main/20 flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium text-white">Reward notifications</p>
                  <p className="text-muted-foreground text-sm">
                    Get notified when you earn $PZT rewards
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-main data-[state=unchecked]:bg-neutral-400"
                  checked={notifications.rewards}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, rewards: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-neutral-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <p className="mb-2 font-medium text-white">Smart Contract</p>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Prezopt Protocol v2.1.0
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-500"
                  >
                    Audited by CertiK
                  </Badge>
                </div>

                <div className="rounded-md border p-4">
                  <p className="mb-2 font-medium text-white">
                    Insurance Coverage
                  </p>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Protected by Nexus Mutual
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-chart-1/10 text-chart-1"
                  >
                    $10M Coverage
                  </Badge>
                </div>
              </div>

              <div className="rounded-md bg-neutral-900/50 p-4">
                <p className="mb-2 text-sm font-medium text-white">
                  Security Features:
                </p>
                <ul className="text-body space-y-1 text-sm">
                  <li>• Non-custodial protocol - you control your funds</li>
                  <li>• Multi-signature treasury management</li>
                  <li>• Time-locked governance execution</li>
                  <li>• Emergency pause functionality</li>
                  <li>• Regular security audits and bug bounty program</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    </div>
  );
}
