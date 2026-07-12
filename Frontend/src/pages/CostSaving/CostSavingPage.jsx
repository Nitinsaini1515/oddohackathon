import React, { useMemo } from 'react';
import { DollarSign, Landmark, PiggyBank, RefreshCw, BarChart } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import ChartCard from '../../components/ui/cards/ChartCard';
import MetricCard from '../../components/ui/cards/MetricCard';

export default function CostSavingPage() {
  const { assets, departments } = useMockState();

  // Compute saving metrics
  const costSavingsStats = useMemo(() => {
    // Idle capital value (acquisition cost of unassigned assets)
    const idleAssets = assets.filter(a => a.status === 'Available');
    const idleCapitalValue = idleAssets.reduce((acc, a) => acc + (parseInt(a.purchaseCost?.replace(/[^0-9]/g, '')) || 0), 0);

    // Reassignment savings (simulated total savings calculated from reused assets)
    const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
    const reassignSavingsVal = allocatedCount * 1250; // mock saving per reassigned asset instead of new buy

    // Department savings dataset
    const deptSavings = departments.map((d, idx) => {
      const budgetVal = parseInt(d.budget.replace(/[^0-9]/g, '')) || 50000;
      const savedAmount = Math.round(budgetVal * (0.05 + (idx * 0.03)));
      const itemsReused = Math.round(d.employeeCount * 0.3) || 1;

      return {
        id: d.id,
        name: d.name,
        itemsReused,
        savedAmount: `$${savedAmount.toLocaleString()}`
      };
    });

    return {
      idleCapitalValue,
      reassignSavingsVal,
      deptSavings
    };
  }, [assets, departments]);

  // Bar Chart comparison: New Purchase vs Reassign reuse costs by Category
  const comparisonData = [
    { category: 'Laptops', NewPurchaseCost: 45000, ReassignmentCost: 1500 },
    { category: 'Servers', NewPurchaseCost: 82000, ReassignmentCost: 4500 },
    { category: 'Mobile', NewPurchaseCost: 18000, ReassignmentCost: 800 },
    { category: 'Displays', NewPurchaseCost: 15000, ReassignmentCost: 600 }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <PiggyBank className="w-5.5 h-5.5 text-brand-success" />
          <span>Cost Optimization Telemetry</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Audit capital conservation, evaluate depreciation leakages, and track reuse efficiencies.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Consolidated Savings"
          value={`$${costSavingsStats.reassignSavingsVal.toLocaleString()}`}
          icon={PiggyBank}
          iconColor="text-brand-success"
          trend="+18% YoY"
          description="Retained by reusing storage inventory"
        />
        <MetricCard
          title="Depreciating Idle Value"
          value={`$${costSavingsStats.idleCapitalValue.toLocaleString()}`}
          icon={Landmark}
          iconColor="text-brand-warning"
          trend="In Storage"
          trendType="neutral"
          description="Capital bound in available buffer stock"
        />
        <MetricCard
          title="Optimal Reuse Rate"
          value="84.5%"
          icon={DollarSign}
          iconColor="text-brand-primary"
          trend="+5.2%"
          description="Efficiency of hardware allocations"
        />
      </div>

      {/* Grid Comparison Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cost comparison chart */}
        <div className="lg:col-span-3">
          <ChartCard
            title="Capital Efficiency Audit"
            subtitle="Financial comparison of new hardware purchases vs recycling available stock ($)."
          >
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="category" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#060816',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="NewPurchaseCost" fill="#EF4444" radius={[4, 4, 0, 0]} name="New Purchase cost" />
                  <Bar dataKey="ReassignmentCost" fill="#22C55E" radius={[4, 4, 0, 0]} name="Reassignment cost" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Department Savings list */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departmental Cost Optimization</h3>
          <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
            {costSavingsStats.deptSavings.map((d) => (
              <div key={d.id} className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/40 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{d.name}</span>
                  <span className="text-[10px] text-brand-secondaryText block mt-0.5">{d.itemsReused} devices recycled</span>
                </div>
                <span className="font-mono text-brand-success font-bold text-sm shrink-0">
                  {d.savedAmount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
