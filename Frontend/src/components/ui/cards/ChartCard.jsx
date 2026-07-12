import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function ChartCard({
  title,
  subtitle,
  children,
  actions,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'glass-panel rounded-2xl p-5 md:p-6 border border-brand-border/40 flex flex-col justify-between shadow-premium bg-[#111827]',
        className
      )}
    >
      {/* Chart Header */}
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between mb-5">
          <div>
            {title && <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[10px] text-brand-secondaryText mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[220px]">
        {children}
      </div>
    </motion.div>
  );
}
