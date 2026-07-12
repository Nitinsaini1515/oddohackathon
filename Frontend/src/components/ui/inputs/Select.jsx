import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

const Select = forwardRef(({
  label,
  options = [],
  placeholder,
  error,
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
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full text-sm bg-slate-950/60 border border-brand-border rounded-xl px-3.5 py-2.5 text-white transition-all focus:bg-slate-950 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 appearance-none cursor-pointer',
            error ? 'border-brand-danger/60 focus:ring-brand-danger/30' : ''
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-slate-900 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-950 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-secondaryText">
          <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-brand-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
