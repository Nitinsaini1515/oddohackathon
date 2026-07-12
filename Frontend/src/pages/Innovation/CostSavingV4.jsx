import React, { useMemo } from 'react';
import { PiggyBank, Landmark, Sparkles, Building, CreditCard } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import { CostCard } from '../../components/ui/innovation/InnovationComponents';
import ChartCard from '../../components/ui/cards/ChartCard';

export default function CostSavingV4() {
  const { assets, departments } = useMockState();

  // Compute cost metrics
  const costReport = useMemo(() => {
    const idleCount = assets.filter(a => a.status === 'Available').length;
    const idleCapital = idleCount * 1250;
    const resolvedCheckoffs = assets.filter(a => a.status === 'Allocated').length;
    const savedSum = resolvedCheckoffs * 2400; // simulated saved costs instead of purchasing fresh devices

    const deptReport = departments.map((d, idx) => {
      const budgetNum = parseInt(d.budget.replace(/[^0-9]/g, '')) || 45000;
      const saved = Math.round(budgetNum * (0.04 + (idx * 0.02)));
      return {
        id: d.id,
        name: d.name,
        saved,
        efficiency: 60 + (idx * 6)
      };
    });

    return {
      savedSum,
      idleCapital,
      deptReport
    };
  }, [assets, departments]);

  // Chart data: purchase vs reuse savings
  const chartData = [
    { name: 'Laptops', NewAcquisition: 38000, ReassignmentSavings: 24000 },
    { name: 'Servers', NewAcquisition: 75000, ReassignmentSavings: 42000 },
    { name: 'Mobile', NewAcquisition: 16000, ReassignmentSavings: 9000 },
    { name: 'Monitors', NewAcquisition: 12000, ReassignmentSavings: 6500 }
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <PiggyBank className="w-5.5 h-5.5 text-brand-success animate-pulse" />
          <span>Capital Conservation Center</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Real-time statistics mapping cost optimizations, lifecycle reassignments, and storage budget saves.</p>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CostCard
          title="Money Conserved (Savings)"
          value={costReport.savedSum}
          trend="+14% YoY"
          description="Capital saved by reassigning stock"
        />
        <CostCard
          title="Idle Depreciation Leak"
          value={costReport.idleCapital}
          loss
          trend="Leakage"
          description="Acquisition value in storage"
        />
        <CostCard
          title="Reuse Opportunities"
          value={18500}
          opportunity
          trend="Available"
          description="Standard equipment recycling potential"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cost Comparatives Chart */}
        <div className="lg:col-span-3">
          <ChartCard
            title="Capital Optimization Chart"
            subtitle="Acquisition costs of buying fresh nodes vs reassigning locker reserves."
          >
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
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
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="NewAcquisition" fill="#EF4444" radius={[4, 4, 0, 0]} name="New Purchase Cost" />
                  <Bar dataKey="ReassignmentSavings" fill="#22C55E" radius={[4, 4, 0, 0]} name="Recycling Savings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Department Savings breakdown */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4 self-start w-full">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Building className="w-4 h-4 text-brand-primary" /> Department Optimizations
          </h3>
          
          <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {costReport.deptReport.map(d => (
              <div key={d.id} className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/40 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{d.name}</span>
                  <span className="text-[9px] text-brand-secondaryText block mt-0.5">{d.efficiency}% Asset efficiency rating</span>
                </div>
                <span className="font-mono text-brand-success font-bold text-sm shrink-0">
                  +${d.saved.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
