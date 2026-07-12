import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  description,
  className = '',
  iconColor = 'text-brand-primary'
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'glass-panel rounded-2xl p-5 border border-brand-border/40 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-premium bg-[#111827]',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-primary/5 before:to-brand-purple/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl font-black text-white mt-1 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-300 transition-all duration-300">
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
        <div className="flex items-center gap-2 mt-4 text-[10px] font-semibold relative z-10">
          {trend && (
            <span className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md',
              trendType === 'up' && 'text-brand-success bg-brand-success/10',
              trendType === 'down' && 'text-brand-danger bg-brand-danger/10',
              trendType === 'neutral' && 'text-brand-secondaryText bg-slate-800'
            )}>
              {trendType === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {trendType === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
          {description && <span className="text-brand-secondaryText">{description}</span>}
        </div>
      )}
    </motion.div>
  );
}
