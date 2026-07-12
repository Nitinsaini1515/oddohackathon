import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';
import StatusBadge from '../badges/StatusBadge';

export default function WarrantyCard({
  asset,
  className = ''
}) {
  const { name, assetTag, purchaseDate } = asset;
  
  // Calculate warranty metrics (e.g. standard 3-year warranty)
  const buyDate = dayjs(purchaseDate || '2024-01-01');
  const expiryDate = buyDate.add(3, 'year');
  const daysLeft = expiryDate.diff(dayjs(), 'day');
  
  const isExpired = daysLeft < 0;
  const isExpiringSoon = daysLeft >= 0 && daysLeft <= 180; // less than 6 months

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isExpiringSoon) return 'Expiring Soon';
    return 'Active Protection';
  };

  const getStatusColor = () => {
    if (isExpired) return 'text-brand-danger bg-brand-danger/10 border-brand-danger/20';
    if (isExpiringSoon) return 'text-brand-warning bg-brand-warning/10 border-brand-warning/20';
    return 'text-brand-success bg-brand-success/10 border-brand-success/20';
  };

  const Icon = isExpired ? ShieldAlert : isExpiringSoon ? Shield : ShieldCheck;

  return (
    <div className={cn('glass-panel p-5 rounded-2xl border border-brand-border/40 hover:border-slate-800 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827]', className)}>
      <div className="flex items-start gap-3">
        <div className={cn('p-3 rounded-xl border shrink-0', getStatusColor())}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white tracking-tight truncate">{name}</h4>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{assetTag}</span>
          
          <div className="flex items-center gap-1.5 text-xs text-brand-secondaryText mt-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Expires: <strong>{expiryDate.format('YYYY-MM-DD')}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border text-center', getStatusColor())}>
          {getStatusText()}
        </span>
        <span className="text-[10px] text-brand-secondaryText font-semibold">
          {isExpired ? 'Coverage Ended' : `${daysLeft} Days Coverage Remaining`}
        </span>
      </div>
    </div>
  );
}
