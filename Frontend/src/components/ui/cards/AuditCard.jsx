import React from 'react';
import { ClipboardList, User, Calendar } from 'lucide-react';
import { cn } from '../../../utils/cn';
import StatusBadge from '../badges/StatusBadge';
import ProgressCircle from '../common/ProgressCircle';

export default function AuditCard({
  audit,
  totalAssetsCount = 1,
  onVerifyClick,
  className = ''
}) {
  const { id, cycleName, auditorName, startDate, endDate, status, verifiedAssets = [] } = audit;

  const progressPercent = Math.round((verifiedAssets.length / totalAssetsCount) * 100);

  return (
    <div className={cn('glass-panel p-5 rounded-2xl border border-brand-border/40 hover:border-slate-800 transition-all flex items-center justify-between gap-4 bg-[#111827]', className)}>
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Title & Status */}
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-bold text-white tracking-tight truncate">{cycleName}</h4>
          <StatusBadge status={status} />
        </div>

        {/* Auditor & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-brand-secondaryText">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-primary" />
            <span>Auditor: <strong>{auditorName}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-purple" />
            <span>{startDate} to {endDate}</span>
          </div>
        </div>

        {/* Action Button */}
        {onVerifyClick && status === 'In Progress' && (
          <button
            onClick={() => onVerifyClick(audit)}
            className="self-start text-[10px] uppercase font-bold tracking-wider text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary hover:text-white px-3.5 py-1.5 rounded-xl transition-all"
          >
            Perform Verification
          </button>
        )}
      </div>

      {/* Progress display */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <ProgressCircle value={progressPercent} size={64} strokeWidth={6} />
        <span className="text-[9px] text-slate-500 font-extrabold uppercase mt-1">Verified</span>
      </div>
    </div>
  );
}
