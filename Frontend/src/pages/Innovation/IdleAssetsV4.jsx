import React, { useMemo } from 'react';
import { Flame, DollarSign, ArrowRight, Building, Layers } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import MetricCard from '../../components/ui/cards/MetricCard';
import StatusBadge from '../../components/ui/badges/StatusBadge';

export default function IdleAssetsV4() {
  const { assets } = useMockState();

  // Calculate idle asset metrics
  const idleAssets = useMemo(() => {
    return assets.filter(a => a.status === 'Available').map((a, idx) => {
      const costNumeric = parseInt(a.purchaseCost?.replace(/[^0-9]/g, '')) || 1200;
      const monthlyDepr = Math.round(costNumeric / 36);
      const unusedDays = 20 + (idx * 15);
      const costLoss = Math.round(monthlyDepr * (unusedDays / 30));

      let recommendation = 'Reassign to replace third-party rentals.';
      if (a.category.includes('Laptops')) {
        recommendation = 'Recycle for upcoming Engineering hire onboarding.';
      } else if (a.category.includes('Servers')) {
        recommendation = 'Deploy to QA test node virtualization clusters.';
      }

      return {
        ...a,
        unusedDays,
        costLoss: `$${costLoss.toLocaleString()}`,
        recommendation,
        owningDept: idx % 2 === 0 ? 'Engineering' : 'IT Operations'
      };
    }).sort((x, y) => y.unusedDays - x.unusedDays);
  }, [assets]);

  // Aggregate stats
  const totals = useMemo(() => {
    const count = idleAssets.length;
    const lossSum = idleAssets.reduce((acc, a) => acc + parseInt(a.costLoss.replace(/[^0-9]/g, '')), 0);
    return {
      count,
      lossSum
    };
  }, [idleAssets]);

  const columns = [
    {
      header: 'Idle Equipment',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.name}</div>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{row.assetTag}</span>
        </div>
      )
    },
    {
      header: 'Storage Department',
      accessor: 'owningDept',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <Building className="w-3.5 h-3.5 text-brand-primary" />
          {row.owningDept}
        </div>
      )
    },
    {
      header: 'Unused Days',
      accessor: 'unusedDays',
      render: (row) => <span className="font-bold text-brand-warning">{row.unusedDays} Days</span>
    },
    {
      header: 'Depreciation loss',
      accessor: 'costLoss',
      render: (row) => <span className="font-mono font-bold text-brand-danger">{row.costLoss}</span>
    },
    {
      header: 'Recycling suggestion',
      accessor: 'recommendation',
      render: (row) => <span className="text-[11px] leading-relaxed text-indigo-300">{row.recommendation}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Flame className="w-5.5 h-5.5 text-brand-warning animate-pulse" />
          <span>Smart Idle Asset Detector</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Audit storage lockers, compute depreciation leakages, and route idle devices to active workflows.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Idle Reserve Count"
          value={totals.count}
          icon={Flame}
          trend="-2 items"
          trendType="up"
          description="available in lockers"
        />
        <MetricCard
          title="Consolidated Cost Loss"
          value={`$${totals.lossSum.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-brand-danger"
          description="Depreciation value decay"
        />
        <MetricCard
          title="Recycling Buffer Opportunity"
          value="85.7%"
          icon={Layers}
          iconColor="text-brand-success"
          trend="High"
          trendType="neutral"
          description="Efficiency potential"
        />
      </div>

      {/* Main Table */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unused Storage Buffers Ledger</h3>
        <DataTable
          columns={columns}
          data={idleAssets}
          searchPlaceholder="Search idle locker stocks..."
          searchKeys={['name', 'assetTag', 'owningDept', 'recommendation']}
          itemsPerPage={6}
        />
      </div>
    </div>
  );
}
