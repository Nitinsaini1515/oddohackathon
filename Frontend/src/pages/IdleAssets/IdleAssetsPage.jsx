import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, DollarSign, RefreshCw, Layers } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import MetricCard from '../../components/ui/cards/MetricCard';
import StatusBadge from '../../components/ui/badges/StatusBadge';

export default function IdleAssetsPage() {
  const navigate = useNavigate();
  const { assets } = useMockState();

  // Filter idle assets (Available status)
  const idleAssetsList = useMemo(() => {
    return assets.filter(a => a.status === 'Available').map((a, idx) => {
      // Calculate mock idle cost (Purchase cost depreciated over 3 years)
      const costNumeric = parseInt(a.purchaseCost?.replace(/[^0-9]/g, '')) || 1000;
      const monthlyDepr = Math.round(costNumeric / 36);
      const unusedDays = 15 + (idx * 12);
      const idleCost = Math.round(monthlyDepr * (unusedDays / 30));

      // Reuse suggestion logic
      let suggestion = 'Deploy to upcoming onboarding batch.';
      if (a.category.includes('Laptops')) {
        suggestion = 'Deploy to new developer onboarding to save $2,500 new purchase cost.';
      } else if (a.category.includes('Servers')) {
        suggestion = 'Configure for QA testing cluster or virtual lab deployment.';
      } else if (a.category.includes('Mobile')) {
        suggestion = 'Route to Marketing department to replace outsourced test handsets.';
      }

      return {
        ...a,
        unusedDays,
        idleCost: `$${idleCost.toLocaleString()}`,
        reuseSuggestion: suggestion
      };
    });
  }, [assets]);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    const count = idleAssetsList.length;
    const totalCostSum = idleAssetsList.reduce((acc, a) => acc + (parseInt(a.purchaseCost?.replace(/[^0-9]/g, '')) || 0), 0);
    const monthlyDeprLoss = idleAssetsList.reduce((acc, a) => acc + (parseInt(a.idleCost.replace(/[^0-9]/g, '')) || 0), 0);

    return {
      count,
      totalCostSum,
      monthlyDeprLoss
    };
  }, [idleAssetsList]);

  const columns = [
    {
      header: 'Idle Asset',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.name}</div>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{row.assetTag}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category'
    },
    {
      header: 'Unused Duration',
      accessor: 'unusedDays',
      render: (row) => <span className="font-semibold text-brand-warning">{row.unusedDays} Days Idle</span>
    },
    {
      header: 'Idle Depreciation Cost',
      accessor: 'idleCost',
      render: (row) => <span className="font-mono text-brand-danger font-semibold">{row.idleCost}</span>
    },
    {
      header: 'Optimization Recommendation',
      accessor: 'reuseSuggestion',
      render: (row) => (
        <div className="max-w-xs text-[11px] leading-relaxed text-indigo-200">
          {row.reuseSuggestion}
        </div>
      )
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => navigate('/dashboard/allocation')}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:text-white uppercase tracking-wider transition-colors"
        >
          <span>Allocate</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Flame className="w-5.5 h-5.5 text-brand-warning animate-pulse" />
          <span>Idle Reserves Telemetry</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Audit unassigned assets, monitor depreciation leakages, and recycle stock configs.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Idle Stock"
          value={aggregateStats.count}
          icon={Flame}
          trend="-15% count"
          trendType="up"
          description="devices currently unallocated"
        />
        <MetricCard
          title="Capital Reserve Value"
          value={`$${aggregateStats.totalCostSum.toLocaleString()}`}
          icon={Layers}
          iconColor="text-brand-success"
          description="Acquisition value in storage"
        />
        <MetricCard
          title="Monthly Depr Leakage"
          value={`$${aggregateStats.monthlyDeprLoss.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-brand-danger"
          trend="Depreciation"
          trendType="down"
          description="Monthly asset value decay rate"
        />
      </div>

      {/* Main Table */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Buffers Inventory Ledger</h3>
        <DataTable
          columns={columns}
          data={idleAssetsList}
          searchPlaceholder="Search idle assets..."
          searchKeys={['name', 'assetTag', 'category', 'reuseSuggestion']}
          itemsPerPage={6}
        />
      </div>
    </div>
  );
}
