import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'teal' | 'blue' | 'emerald' | 'purple' | 'amber' | 'red';
  delay?: number;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const colorClasses = {
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
    border: 'border-teal-100',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-100',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    border: 'border-amber-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-100',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  delay = 0,
  subtitle 
}) => {
  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={`border ${classes.border} shadow-card hover:shadow-lg transition-shadow h-full`}>
        <CardContent className="p-3 md:pt-6 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${classes.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 md:w-6 md:h-6 ${classes.icon}`} />
            </div>
            <div className="min-w-0 w-full">
              <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
              <p className="text-lg md:text-2xl font-bold text-foreground truncate">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
