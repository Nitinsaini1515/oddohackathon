import React, { useMemo } from 'react';
import { Heart, Activity, LineChart as ChartIcon, CheckSquare, Settings } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import HealthScoreCard from '../../components/ui/cards/HealthScoreCard';
import ChartCard from '../../components/ui/cards/ChartCard';
import ProgressCircle from '../../components/ui/common/ProgressCircle';

export default function HealthPage() {
  const { assets } = useMockState();

  // Compute average fleet health score
  const fleetStats = useMemo(() => {
    const scores = assets.map(a => {
      let val = 100;
      if (a.condition === 'Good') val = 85;
      else if (a.condition === 'Fair') val = 65;
      else if (a.condition === 'Poor') val = 40;
      else if (a.condition === 'Broken') val = 10;
      if (a.status === 'Under Maintenance') val -= 15;
      return Math.max(val, 5);
    });

    const average = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;
    return {
      average,
      itemsScanned: assets.length
    };
  }, [assets]);

  // Mock health history data
  const healthHistoryData = [
    { month: 'Jan', AverageScore: 92 },
    { month: 'Feb', AverageScore: 89 },
    { month: 'Mar', AverageScore: 90 },
    { month: 'Apr', AverageScore: 86 },
    { month: 'May', AverageScore: 88 },
    { month: 'Jun', AverageScore: fleetStats.average }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Heart className="w-5.5 h-5.5 text-brand-danger animate-pulse" />
          <span>Asset Health Ledger</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Real-time condition diagnostics, fatigue ratios, and reliability indexes across active devices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Fleet Average KPI */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col items-center justify-center text-center gap-4 self-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Quality Index</h3>
          
          <ProgressCircle value={fleetStats.average} size={110} strokeWidth={9} />
          
          <div className="space-y-1">
            <span className="text-sm font-bold text-white block">Average Fleet Health</span>
            <p className="text-xs text-brand-secondaryText leading-relaxed px-4">
              Diagnostic checklist computes fleet performance rating based on release age, wear, and repair logs.
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 border-t border-brand-border/20 pt-4 font-mono text-xs">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Scanned Items</span>
              <span className="text-white font-bold">{fleetStats.itemsScanned}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Rating</span>
              <span className="text-brand-success font-bold">{fleetStats.average >= 80 ? 'Optimal' : 'Needs Servicing'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Health Curve Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Reliability Curve history"
            subtitle="Diagnostic average fleet health score progression over 6 months."
          >
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: '#060816',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Line type="monotone" dataKey="AverageScore" stroke="#EF4444" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Fleet cards lists */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Condition Checklists</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((ast) => (
            <HealthScoreCard key={ast.id} asset={ast} />
          ))}
        </div>
      </div>
    </div>
  );
}
