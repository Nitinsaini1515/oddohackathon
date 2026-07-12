import React from 'react';
import { Archive } from 'lucide-react';
import PrimaryButton from '../buttons/PrimaryButton';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search filters or add a new record to get started.',
  icon: Icon = Archive,
  actionLabel,
  onActionClick
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 glass-panel rounded-2xl border border-brand-border/40 max-w-lg mx-auto my-6">
      <div className="p-4 bg-slate-900/60 rounded-full border border-brand-border/60 text-brand-secondaryText mb-4 animate-bounce">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs text-brand-secondaryText max-w-sm mt-2 leading-relaxed">
        {description}
      </p>
      {actionLabel && onActionClick && (
        <PrimaryButton
          onClick={onActionClick}
          className="mt-6 text-xs px-5 py-2"
        >
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
}
