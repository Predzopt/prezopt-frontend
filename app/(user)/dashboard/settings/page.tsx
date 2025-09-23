'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, Settings as SettingsIcon, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const [autoCompound, setAutoCompound] = useState(true);
  const [notifications, setNotifications] = useState({
    rebalances: true,
    governance: false,
    rewards: true,
  });
  const [defaultBoost, setDefaultBoost] = useState('medium');

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
    <div className="bg-background min-h-screen" data-testid="settings-page">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your preferences and export transaction data for tax purposes.
          </p>
        </div>

        <div className="space-y-8">
          {/* Tax Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Tax Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Export your transaction history for tax reporting purposes. The CSV includes all
                deposits, withdrawals, rebalances, $PZT rewards, and fee discounts.
              </p>

              <div className="bg-muted/50 rounded-md p-4">
                <p className="mb-2 text-sm font-medium">Export includes:</p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Deposit and withdrawal transactions</li>
                  <li>• Rebalance profits and losses</li>
                  <li>• $PZT rewards earned</li>
                  <li>• Fee discounts applied</li>
                  <li>• Transaction timestamps and amounts</li>
                </ul>
              </div>

              <Button onClick={handleExportCSV} data-testid="button-export-csv">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Auto-compound staking rewards</p>
                  <p className="text-muted-foreground text-sm">
                    Automatically stake earned $PZT rewards
                  </p>
                </div>
                <Switch
                  checked={autoCompound}
                  onCheckedChange={setAutoCompound}
                  data-testid="switch-auto-compound-settings"
                />
              </div>

              <div className="rounded-md border p-4">
                <p className="mb-3 font-medium">Default APY Boost Level</p>
                <p className="text-muted-foreground mb-3 text-sm">
                  Choose your preferred risk/reward level for yield optimization
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={defaultBoost === 'conservative' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDefaultBoost('conservative')}
                    data-testid="button-conservative-boost"
                  >
                    Conservative
                  </Button>
                  <Button
                    variant={defaultBoost === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDefaultBoost('medium')}
                    data-testid="button-medium-boost"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={defaultBoost === 'aggressive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDefaultBoost('aggressive')}
                    data-testid="button-aggressive-boost"
                  >
                    Aggressive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Rebalance notifications</p>
                  <p className="text-muted-foreground text-sm">
                    Get notified when keeper bots execute rebalances
                  </p>
                </div>
                <Switch
                  checked={notifications.rebalances}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, rebalances: checked }))
                  }
                  data-testid="switch-rebalance-notifications"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Governance notifications</p>
                  <p className="text-muted-foreground text-sm">
                    Get notified about new proposals and voting deadlines
                  </p>
                </div>
                <Switch
                  checked={notifications.governance}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, governance: checked }))
                  }
                  data-testid="switch-governance-notifications"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">Reward notifications</p>
                  <p className="text-muted-foreground text-sm">
                    Get notified when you earn $PZT rewards
                  </p>
                </div>
                <Switch
                  checked={notifications.rewards}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, rewards: checked }))
                  }
                  data-testid="switch-reward-notifications"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <p className="mb-2 font-medium">Smart Contract</p>
                  <p className="text-muted-foreground mb-2 text-sm">Prezopt Protocol v2.1.0</p>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Audited by CertiK
                  </Badge>
                </div>

                <div className="rounded-md border p-4">
                  <p className="mb-2 font-medium">Insurance Coverage</p>
                  <p className="text-muted-foreground mb-2 text-sm">Protected by Nexus Mutual</p>
                  <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
                    $10M Coverage
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/50 rounded-md p-4">
                <p className="mb-2 text-sm font-medium">Security Features:</p>
                <ul className="text-muted-foreground space-y-1 text-sm">
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
      </div>
    </div>
  );
}
