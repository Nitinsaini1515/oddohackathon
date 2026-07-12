import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

const Toggle = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {label && <span className="text-sm font-semibold text-brand-secondaryText">{label}</span>}
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-slate-900 border border-brand-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-secondaryText peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary peer-checked:border-brand-primary"></div>
      </label>
    </div>
  );
});

Toggle.displayName = 'Toggle';
export default Toggle;
