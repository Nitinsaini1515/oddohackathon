import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function AnalyticsCard({
  title,
  subtitle,
  metricValue,
  metricLabel,
  trendText,
  trendType = 'up',
  children,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'glass-panel rounded-2xl p-5 border border-brand-border/40 flex flex-col justify-between shadow-premium bg-[#111827]',
        className
      )}
    >
      {/* Analytics Card Header */}
      <div className="flex justify-between items-start mb-4.5 border-b border-brand-border/20 pb-3">
        <div>
          <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-brand-primary" />
            {title}
          </h3>
          {subtitle && <p className="text-[9px] text-brand-secondaryText mt-0.5">{subtitle}</p>}
        </div>

        {trendText && (
          <span className={cn(
            'px-2 py-0.5 rounded-md text-[9px] font-bold border',
            trendType === 'up' ? 'bg-brand-success/10 border-brand-success/20 text-brand-success' : 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning'
          )}>
            {trendText}
          </span>
        )}
      </div>

      {/* Main Display: value or custom charts */}
      <div className="flex-1 flex flex-col gap-4">
        {metricValue && (
          <div>
            <span className="text-2xl font-black text-white leading-none tracking-tight">{metricValue}</span>
            {metricLabel && <span className="text-[10px] text-brand-secondaryText ml-1.5 font-semibold">{metricLabel}</span>}
          </div>
        )}
        
        {children && (
          <div className="w-full flex-1">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}
