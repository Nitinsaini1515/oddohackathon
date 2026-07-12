import React, { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Calendar, Layers, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import { useMockState } from '../../context/MockStateContext';
import MetricCard from '../../components/ui/cards/MetricCard';
import StatusBadge from '../../components/ui/badges/StatusBadge';

export default function WarrantyV4() {
  const { assets } = useMockState();

  // Compute warranty lifecycle metrics
  const lifecycleDetails = useMemo(() => {
    return assets.map((a, idx) => {
      const buyDate = dayjs(a.purchaseDate || '2024-01-01');
      const expiryDate = buyDate.add(3, 'year');
      const diffDays = expiryDate.diff(dayjs(), 'day');
      
      const isExpired = diffDays < 0;
      const isExpiringSoon = diffDays >= 0 && diffDays <= 180;

      // Lifecycle calculations
      const deviceAgeMonths = dayjs().diff(buyDate, 'month');
      let stage = 'Deployment'; // Onboarding, Active Service, Aging Support, Retirement
      let retirement = 'Expected 2027';

      if (deviceAgeMonths >= 30) {
        stage = 'Retirement Stage';
        retirement = 'Immediate Swap Action';
      } else if (deviceAgeMonths >= 18) {
        stage = 'Aging Support';
        retirement = 'Scheduled 2027';
      } else if (deviceAgeMonths >= 6) {
        stage = 'Active Service';
        retirement = 'Expected 2028';
      } else {
        stage = 'Onboarding Stage';
        retirement = 'Expected 2029';
      }

      return {
        ...a,
        expiryFormatted: expiryDate.format('YYYY-MM-DD'),
        diffDays,
        deviceAgeMonths,
        stage,
        retirement,
        isExpired,
        isExpiringSoon
      };
    });
  }, [assets]);

  // Aggregate stats
  const totals = useMemo(() => {
    let active = 0;
    let expired = 0;
    let soon = 0;
    lifecycleDetails.forEach(d => {
      if (d.isExpired) expired++;
      else if (d.isExpiringSoon) soon++;
      else active++;
    });
    return { active, expired, soon };
  }, [lifecycleDetails]);

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5.5 h-5.5 text-brand-success" />
          <span>Warranty & Lifecycle Center</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Monitor vendor coverage metrics, predict replacement schedules, and audit aging devices.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Coverage Pools"
          value={totals.active}
          icon={ShieldCheck}
          iconColor="text-brand-success"
          description="Protected under active warranties"
        />
        <MetricCard
          title="Expiring Under 180 Days"
          value={totals.soon}
          icon={AlertTriangle}
          iconColor="text-brand-warning"
          trend="Flagged"
          trendType="neutral"
          description="Prepare contract extensions"
        />
        <MetricCard
          title="Expired Coverage Ledger"
          value={totals.expired}
          icon={ShieldAlert}
          iconColor="text-brand-danger"
          trend="Action required"
          trendType="down"
          description="Self-serviced locker stocks"
        />
      </div>

      {/* Grid of hardware items */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Contracts Registry</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lifecycleDetails.map((item) => (
            <div key={item.id} className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3">
              <div className="flex justify-between items-start border-b border-brand-border/20 pb-2.5">
                <div>
                  <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                  <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{item.assetTag}</span>
                </div>
                <StatusBadge status={item.isExpired ? 'Expired' : item.isExpiringSoon ? 'Warning' : 'Active'} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-brand-secondaryText">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Age: <strong className="text-white">{item.deviceAgeMonths} Months</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Stage: <strong className="text-indigo-300">{item.stage}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Retire Date: <strong className="text-white">{item.retirement}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
                  <span>Expiry: <strong className="text-white">{item.expiryFormatted}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
