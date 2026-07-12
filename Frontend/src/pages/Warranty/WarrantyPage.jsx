import React, { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Calendar, Search } from 'lucide-react';
import dayjs from 'dayjs';
import { useMockState } from '../../context/MockStateContext';
import WarrantyCard from '../../components/ui/cards/WarrantyCard';
import MetricCard from '../../components/ui/cards/MetricCard';

export default function WarrantyPage() {
  const { assets } = useMockState();

  // Compute warranty statistics
  const stats = useMemo(() => {
    let active = 0;
    let expired = 0;
    let expiringSoon = 0;

    assets.forEach(a => {
      const purchase = dayjs(a.purchaseDate || '2024-01-01');
      const expiry = purchase.add(3, 'year');
      const diff = expiry.diff(dayjs(), 'day');

      if (diff < 0) {
        expired++;
      } else if (diff <= 180) {
        expiringSoon++;
      } else {
        active++;
      }
    });

    return {
      active,
      expired,
      expiringSoon
    };
  }, [assets]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5.5 h-5.5 text-brand-success" />
          <span>Warranty Coverage Registry</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Review vendor agreement contracts, coverage timelines, and service expiration alerts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Under Warranty"
          value={stats.active}
          icon={ShieldCheck}
          iconColor="text-brand-success"
          description="Protected by active coverage"
        />
        <MetricCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={AlertTriangle}
          iconColor="text-brand-warning"
          trend="Within 180 Days"
          trendType="neutral"
          description="Prepare renewals or lifecycle cycle swaps"
        />
        <MetricCard
          title="Coverage Expired"
          value={stats.expired}
          icon={ShieldAlert}
          iconColor="text-brand-danger"
          trend="Self-serviced"
          trendType="down"
          description="Out-of-warranty hardware inventory"
        />
      </div>

      {/* Coverage Ledger Lists */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Contracts Registry</h3>
        <div className="flex flex-col gap-3.5">
          {assets.map((ast) => (
            <WarrantyCard key={ast.id} asset={ast} />
          ))}
        </div>
      </div>
    </div>
  );
}
