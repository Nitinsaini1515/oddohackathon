import React from 'react';
import { cn } from '../../../utils/cn';

export default function Loader({ size = 'md', className = '', label }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-brand-primary border-brand-border',
          sizeClasses[size]
        )}
      />
      {label && <span className="text-xs font-semibold text-brand-secondaryText">{label}</span>}
    </div>
  );
}
