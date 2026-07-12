import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../utils/cn';

const TextInput = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  className = '',
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-brand-secondaryText flex items-center gap-0.5">
          {label}
          {required && <span className="text-brand-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-brand-secondaryText pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={cn(
            'w-full text-sm bg-slate-950/60 border border-brand-border rounded-xl px-3.5 py-2.5 text-white transition-all placeholder:text-slate-600 focus:bg-slate-950 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40',
            Icon ? 'pl-10' : '',
            isPassword ? 'pr-10' : '',
            error ? 'border-brand-danger/60 focus:ring-brand-danger/30' : ''
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-brand-secondaryText hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-brand-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
