import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function IconButton({
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center p-2 rounded-xl text-brand-secondaryText hover:text-white border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover focus:outline-none focus:ring-1 focus:ring-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all',
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}
