import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function SecondaryButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-secondaryText transition-all border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white focus:outline-none focus:ring-1 focus:ring-slate-700 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-secondaryText" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </span>
      )}
    </motion.button>
  );
}
