import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function ProgressCircle({
  value = 0,
  size = 80,
  strokeWidth = 8,
  className = '',
  textColor = 'text-white',
  showLabel = true
}) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color mapping based on percentage
  const strokeColor =
    percentage >= 80
      ? 'stroke-brand-success'
      : percentage >= 50
      ? 'stroke-brand-warning'
      : 'stroke-brand-danger';

  const glowColor =
    percentage >= 80
      ? 'rgba(34, 197, 94, 0.2)'
      : percentage >= 50
      ? 'rgba(245, 158, 11, 0.2)'
      : 'rgba(239, 68, 68, 0.2)';

  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-800"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Foreground Colored Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn(strokeColor, 'transition-all duration-300')}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          fill="transparent"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn('text-sm font-black tracking-tight', textColor)}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}
