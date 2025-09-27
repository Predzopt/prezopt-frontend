import { Card } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import Image from 'next/image';

interface StatItem {
  label: string;
  value: string;
  change?: string;
  icon: string;
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
      icon: '/images/analytics.svg',
      trend: 'up',
    },
    {
      label: 'Average APY',
      value: '8.47%',
      change: '+0.23%',
      icon: '/images/padlock.svg',

      trend: 'up',
    },
    {
      label: 'Active Stakers',
      value: '12,847',
      change: '+156',
      icon: '/images/stakers.svg',
      trend: 'up',
    },
    {
      label: '$PZT Price',
      value: '$2.34',
      change: '+5.67%',
      icon: '/images/price-tag.svg',
      trend: 'up',
    },
  ];

  const statsToShow = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {statsToShow.map((stat, index) => (
        <Card
          key={index}
          className="bg-body-bg grid grid-cols-[2fr_1fr] items-center gap-[15px] border-2 !border-[#AFA1CD]/10 p-6"
        >
          <div>
            <p className="text-4xl font-semibold text-white">{stat.value}</p>
            <p className="text-white/70">{stat.label}</p>
          </div>

          <Image src={stat.icon} alt={stat.label} width={100} height={100} />
        </Card>
      ))}
    </div>
  );
}
