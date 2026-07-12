import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 bg-slate-950/60 border border-brand-border rounded-md flex items-center justify-center transition-all peer-checked:bg-brand-primary peer-checked:border-brand-primary peer-focus:ring-1 peer-focus:ring-brand-primary/50 text-white">
          <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2 hidden peer-checked:block" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && <span className="text-sm font-medium text-brand-secondaryText peer-checked:text-white transition-colors">{label}</span>}
      </label>
      {error && (
        <span className="text-xs text-brand-danger font-medium">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
