import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function Timeline({ items = [], className = '' }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-brand-secondaryText">
        No history or timeline events recorded.
      </div>
    );
  }

  return (
    <div className={cn('relative pl-6 border-l-2 border-brand-border/40 space-y-6 py-2', className)}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="relative"
          >
            {/* Timeline Dot/Icon */}
            <span
              className={cn(
                'absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full border bg-[#060816] text-[10px] font-bold shadow-premium',
                item.status === 'Completed' || item.status === 'Resolved' || item.status === 'Approved'
                  ? 'border-brand-success text-brand-success shadow-glow-success/10'
                  : item.status === 'Pending' || item.status === 'In Progress'
                  ? 'border-brand-warning text-brand-warning'
                  : item.status === 'Rejected' || item.status === 'Damaged' || item.status === 'Missing'
                  ? 'border-brand-danger text-brand-danger'
                  : 'border-brand-primary text-brand-primary'
              )}
            >
              {Icon ? <Icon className="w-3 h-3" /> : (idx + 1)}
            </span>

            {/* Timeline Content */}
            <div className="glass-panel p-4 rounded-xl border border-brand-border/30 bg-slate-900/10 hover:border-brand-border/60 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                <h4 className="text-xs font-bold text-white tracking-tight">{item.title}</h4>
                <span className="text-[10px] font-semibold text-brand-secondaryText font-mono">{item.date}</span>
              </div>
              
              {item.description && (
                <p className="text-xs text-brand-secondaryText leading-relaxed">{item.description}</p>
              )}
              
              {item.user && (
                <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-slate-500 font-semibold uppercase">
                  <span>Operator:</span>
                  <span className="text-white normal-case">{item.user}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
