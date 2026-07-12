import React from 'react';
import { cn } from '../../../utils/cn';

export default function Badge({
  children,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
  className = '',
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none border',
        variant === 'primary' && 'bg-brand-primary/10 border-brand-primary/20 text-indigo-400',
        variant === 'success' && 'bg-brand-success/10 border-brand-success/20 text-brand-success',
        variant === 'warning' && 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning',
        variant === 'danger' && 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger',
        variant === 'info' && 'bg-brand-darkBlue/10 border-brand-darkBlue/20 text-blue-400',
        variant === 'gray' && 'bg-slate-800/60 border-slate-700/50 text-brand-secondaryText',
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {children}
    </span>
  );
}
