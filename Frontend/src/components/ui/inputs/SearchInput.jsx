import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <div className="absolute left-3 text-brand-secondaryText pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full text-xs bg-slate-950/60 border border-brand-border rounded-xl pl-9 pr-8 py-2 text-white transition-all placeholder:text-slate-600 focus:bg-slate-950 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40'
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 text-brand-secondaryText hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
