import React from 'react';
import { cn } from '../../../utils/cn';

export default function Avatar({
  src,
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  ...props
}) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  // Generate a consistent pseudo-random gradient based on name hash
  const getGradient = (str) => {
    const colors = [
      'from-brand-primary to-brand-purple',
      'from-blue-600 to-indigo-500',
      'from-purple-600 to-pink-500',
      'from-brand-primary to-indigo-700',
      'from-violet-600 to-brand-accent'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center font-bold text-white overflow-hidden select-none border border-brand-border/30 bg-slate-900',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center bg-gradient-to-tr', getGradient(name))}>
          {initials}
        </div>
      )}
    </div>
  );
}
