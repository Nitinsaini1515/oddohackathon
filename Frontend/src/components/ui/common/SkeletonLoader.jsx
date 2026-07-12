import React from 'react';
import { cn } from '../../../utils/cn';

export default function SkeletonLoader({
  type = 'card', // 'card' | 'row' | 'chart' | 'detail'
  count = 1,
  className = ''
}) {
  const CardSkeleton = () => (
    <div className="glass-panel rounded-2xl p-5 animate-pulse flex flex-col gap-4 border border-brand-border/40">
      <div className="flex justify-between items-start">
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 bg-slate-800 rounded-md w-1/3" />
          <div className="h-6 bg-slate-800 rounded-md w-1/2" />
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-xl" />
      </div>
      <div className="h-3 bg-slate-800 rounded-md w-2/3 mt-2" />
    </div>
  );

  const RowSkeleton = () => (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-brand-border/20 animate-pulse">
      <div className="w-9 h-9 bg-slate-800 rounded-full" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 bg-slate-800 rounded-md w-1/4" />
        <div className="h-3 bg-slate-800 rounded-md w-1/3" />
      </div>
      <div className="h-3 bg-slate-800 rounded-md w-1/6" />
      <div className="h-7 bg-slate-800 rounded-lg w-20" />
    </div>
  );

  const ChartSkeleton = () => (
    <div className="glass-panel rounded-2xl p-6 animate-pulse flex flex-col gap-4 h-[300px] border border-brand-border/40">
      <div className="h-4 bg-slate-800 rounded-md w-1/4" />
      <div className="flex-1 flex items-end gap-3 pt-6">
        <div className="bg-slate-800 rounded-t-md flex-1 h-[40%]" />
        <div className="bg-slate-800 rounded-t-md flex-1 h-[70%]" />
        <div className="bg-slate-800 rounded-t-md flex-1 h-[55%]" />
        <div className="bg-slate-800 rounded-t-md flex-1 h-[85%]" />
        <div className="bg-slate-800 rounded-t-md flex-1 h-[30%]" />
      </div>
    </div>
  );

  const items = Array.from({ length: count });

  return (
    <div className={cn('grid gap-4', className)}>
      {items.map((_, idx) => (
        <React.Fragment key={idx}>
          {type === 'card' && <CardSkeleton />}
          {type === 'row' && <RowSkeleton />}
          {type === 'chart' && <ChartSkeleton />}
        </React.Fragment>
      ))}
    </div>
  );
}
