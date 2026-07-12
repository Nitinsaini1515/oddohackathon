import React from 'react';
import { BarChart2, TrendingUp, Cpu, PiggyBank, Users, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import MetricCard from '../../components/ui/cards/MetricCard';
import ChartCard from '../../components/ui/cards/ChartCard';
import StatusBadge from '../../components/ui/badges/StatusBadge';

export default function ExecutiveDashboard() {
  const { assets, departments } = useMockState();

  // replacement prediction forecast over next quarters
  const forecastData = [
    { name: 'Q3 26', replacementBudget: 15000 },
    { name: 'Q4 26', replacementBudget: 24000 },
    { name: 'Q1 27', replacementBudget: 18000 },
    { name: 'Q2 27', replacementBudget: 35000 }
  ];

  // top vs worst performers
  const topPerformers = assets.slice(0, 3);
  const worstPerformers = assets.filter(a => a.condition === 'Fair' || a.condition === 'Poor').slice(0, 2);

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5.5 h-5.5 text-brand-primary" />
          <span>Executive Insights Center</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">High-level executive overview of consolidated expenditures, asset efficiency indexes, and budget savings forecasts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Acquisition Value"
          value="$38,400"
          icon={Cpu}
          description="Consolidated hardware assets"
        />
        <MetricCard
          title="Corporate Savings"
          value="$12,800"
          icon={PiggyBank}
          iconColor="text-brand-success"
          trend="+15%"
          description="Saved from reassigned devices"
        />
        <MetricCard
          title="Active Users Coverage"
          value="98.2%"
          icon={Users}
          iconColor="text-brand-primary"
          description="On-demand deployment rate"
        />
        <MetricCard
          title="Critical Servicing Queue"
          value="2"
          icon={ShieldAlert}
          iconColor="text-brand-danger"
          description="anomalous devices in repair queue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Forecast Curve */}
        <div className="lg:col-span-3">
          <ChartCard
            title="Depreciating Capital Replacement Forecast"
            subtitle="Calculated future quarterly expenditure matching hardware cycle retirements ($)."
          >
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="replacementBudget" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#forecastColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Department performances */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4 self-start w-full text-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departmental Spend Ratings</h3>
          <div className="space-y-3.5 mt-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {departments.map((d, idx) => (
              <div key={d.id} className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/40 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{d.name}</span>
                  <span className="text-[9px] text-brand-secondaryText block mt-0.5">{d.employeeCount} custodian profiles</span>
                </div>
                <span className="font-mono text-brand-success font-bold text-sm shrink-0">
                  {80 + (idx * 3.5)}% Score
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performers grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
        {/* Top performers */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3.5 text-xs">
          <h3 className="text-xs font-bold text-brand-success uppercase tracking-wider">Top Performing Assets</h3>
          <div className="space-y-2">
            {topPerformers.map(a => (
              <div key={a.id} className="p-3 bg-slate-900/40 border border-brand-border/40 rounded-xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block leading-tight">{a.name}</span>
                  <span className="text-[9px] text-brand-secondaryText font-mono mt-0.5 block">{a.assetTag}</span>
                </div>
                <span className="text-[10px] bg-brand-success/15 border border-brand-success/20 text-brand-success px-2 py-0.5 rounded-full font-bold">
                  Zero Repairs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst Performers */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3.5 text-xs">
          <h3 className="text-xs font-bold text-brand-danger uppercase tracking-wider">Anomalous / Vulnerable Assets</h3>
          <div className="space-y-2">
            {worstPerformers.map(a => (
              <div key={a.id} className="p-3 bg-slate-900/40 border border-brand-border/40 rounded-xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block leading-tight">{a.name}</span>
                  <span className="text-[9px] text-brand-secondaryText font-mono mt-0.5 block">{a.assetTag}</span>
                </div>
                <span className="text-[10px] bg-brand-danger/15 border border-brand-danger/20 text-brand-danger px-2 py-0.5 rounded-full font-bold">
                  3+ Servicing Checks
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
