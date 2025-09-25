import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
      
    >
      {statsToShow.map((stat, index) => (
        <Card key={index} className="hover-elevate bg-body-bg border-main/40 p-6">
          <p className="text-4xl font-semibold text-white">{stat.value}</p>
          <p className="text-white/70">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
