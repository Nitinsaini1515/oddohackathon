import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

const Textarea = forwardRef(({
  label,
  placeholder,
  error,
  rows = 4,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-brand-secondaryText flex items-center gap-0.5">
          {label}
          {required && <span className="text-brand-danger">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          'w-full text-sm bg-slate-950/60 border border-brand-border rounded-xl px-3.5 py-2.5 text-white transition-all placeholder:text-slate-600 focus:bg-slate-950 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 resize-none',
          error ? 'border-brand-danger/60 focus:ring-brand-danger/30' : ''
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-brand-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
