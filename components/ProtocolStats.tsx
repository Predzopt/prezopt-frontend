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
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      data-testid="protocol-stats"
    >
      {statsToShow.map((stat, index) => (
        <Card key={index} className="hover-elevate bg-body-bg border-main/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body mb-1 text-sm">{stat.label}</p>
              <p className="font-mono text-2xl font-bold text-white">{stat.value}</p>
              {/* {stat.change && (
                <p
                  className={`text-sm font-medium text-white ${
                    stat.trend === 'up'
                      ? 'text-success'
                      : stat.trend === 'down'
                        ? 'text-destructive'
                        : ''
                  }`}
                >
                  {stat.change}
                </p>
              )} */}
            </div>
            <div
              className={`rounded-md p-3 ${
                stat.trend === 'up'
                  ? 'bg-success/10 text-success'
                  : stat.trend === 'down'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
