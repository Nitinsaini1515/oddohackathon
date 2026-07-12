import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  description,
  className = '',
  iconColor = 'text-brand-primary',
  ...props
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className={cn(
        'glass-panel rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-primary/5 before:to-brand-purple/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-xs font-semibold text-brand-secondaryText tracking-wide uppercase">{title}</span>
          <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-secondaryText transition-all">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={cn('p-2.5 bg-slate-950/80 rounded-xl border border-brand-border group-hover:border-slate-800 transition-all', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(trend || description) && (
        <div className="flex items-center gap-2 mt-4 text-xs relative z-10">
          {trend && (
            <span className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold',
              trendType === 'up' && 'text-brand-success bg-brand-success/10',
              trendType === 'down' && 'text-brand-danger bg-brand-danger/10',
              trendType === 'neutral' && 'text-brand-secondaryText bg-slate-800'
            )}>
              {trendType === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trendType === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
          {description && <span className="text-brand-secondaryText">{description}</span>}
        </div>
      )}
    </motion.div>
  );
}
