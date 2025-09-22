import { Card } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Percent } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}

interface ProtocolStatsProps {
  stats?: StatItem[];
}

export default function ProtocolStats({ stats }: ProtocolStatsProps) {
  // todo: remove mock functionality
  const defaultStats: StatItem[] = [
    {
      label: 'Total Value Locked',
      value: '$142.5M',
      change: '+12.3%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      label: 'Average APY',
      value: '8.47%',
      change: '+0.23%',
      icon: Percent,
      trend: 'up',
    },
    {
      label: 'Active Stakers',
      value: '12,847',
      change: '+156',
      icon: Users,
      trend: 'up',
    },
    {
      label: '$PZT Price',
      value: '$2.34',
      change: '+5.67%',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  const statsToShow = stats || defaultStats;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      data-testid="protocol-stats"
    >
      {statsToShow.map((stat, index) => (
        <Card key={index} className="p-6 hover-elevate">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold font-mono" data-testid={`stat-value-${index}`}>
                {stat.value}
              </p>
              {stat.change && (
                <p
                  className={`text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-success'
                      : stat.trend === 'down'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stat.change}
                </p>
              )}
            </div>
            <div
              className={`p-3 rounded-md ${
                stat.trend === 'up'
                  ? 'bg-success/10 text-success'
                  : stat.trend === 'down'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
