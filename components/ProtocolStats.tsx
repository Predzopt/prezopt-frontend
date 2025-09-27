import { Card } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import ScrollAnimation from './ScrollAnimation';

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
        <ScrollAnimation
          key={index}
          direction="up"
          delay={index * 0.1}
          distance={30}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-body-bg grid grid-cols-[2fr_1fr] items-center gap-[15px] border-2 !border-[#AFA1CD]/10 p-6">
              <div>
                <motion.p
                  className="text-4xl font-semibold text-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-white/70">{stat.label}</p>
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={100}
                  height={100}
                />
              </motion.div>
            </Card>
          </motion.div>
        </ScrollAnimation>
      ))}
    </div>
  );
}
