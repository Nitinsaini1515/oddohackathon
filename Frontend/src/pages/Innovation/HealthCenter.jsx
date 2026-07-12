import React, { useMemo } from 'react';
import { Heart, Activity, LineChart, Cpu, Zap, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import { HealthCard, ProgressRing } from '../../components/ui/innovation/InnovationComponents';
import ChartCard from '../../components/ui/cards/ChartCard';

export default function HealthCenter() {
  const { assets } = useMockState();

  // Compute fleet diagnostics stats
  const fleetHealth = useMemo(() => {
    const scoredAssets = assets.map(a => {
      let score = 95;
      if (a.condition === 'Good') score = 85;
      else if (a.condition === 'Fair') score = 65;
      else if (a.condition === 'Poor') score = 42;
      else if (a.condition === 'Broken') score = 15;
      if (a.status === 'Under Maintenance') score -= 18;
      return Math.max(score, 5);
    });

    const average = scoredAssets.length > 0 ? Math.round(scoredAssets.reduce((x, y) => x + y, 0) / scoredAssets.length) : 90;
    return {
      average,
      scanned: assets.length,
      faults: assets.filter(a => a.status === 'Under Maintenance' || a.condition === 'Broken').length
    };
  }, [assets]);

  // Health progression trends
  const trendData = [
    { name: 'W1', score: 91 },
    { name: 'W2', score: 88 },
    { name: 'W3', score: 89 },
    { name: 'W4', score: fleetHealth.average }
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Heart className="w-5.5 h-5.5 text-brand-danger animate-pulse" />
          <span>Smart Asset Health Center</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Real-time status diagnostics, physical wear metrics, and system-wide reliability curves.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet health score */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col items-center justify-center text-center gap-4 self-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Core Health Index</h3>
          
          <ProgressRing value={fleetHealth.average} size={110} strokeWidth={9} label="Average" />
          
          <div className="space-y-1">
            <span className="text-sm font-bold text-white block">Optimal Operational Index</span>
            <p className="text-xs text-brand-secondaryText px-3 leading-relaxed">
              Consolidated score based on active lifecycle stage, release age, and technician servicing logs.
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-2.5 border-t border-brand-border/20 pt-4 font-mono text-xs text-brand-secondaryText">
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Scanned Assets</span>
              <span className="text-white font-bold">{fleetHealth.scanned} Devices</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Active Faults</span>
              <span className="text-brand-danger font-bold">{fleetHealth.faults} Critical</span>
            </div>
          </div>
        </div>

        {/* Health trend history */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Telemetry Diagnostic History"
            subtitle="Calculated average hardware health score index plotted weekly."
          >
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="healthColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: '#060816',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#healthColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Grid of Scanned Asset diagnostics */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scanned Hardware Diagnostics</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((a, idx) => {
            let score = 95;
            let rel = 'High (Optimal)';
            let fat = 'Low (6%)';
            let trend = 'Excellent';

            if (a.condition === 'Good') {
              score = 86;
              rel = 'Good (Standard)';
              fat = 'Mild (12%)';
              trend = 'Stable';
            } else if (a.condition === 'Fair') {
              score = 68;
              rel = 'Moderate Wear';
              fat = 'Wear detected (28%)';
              trend = 'Degrading';
            } else if (a.condition === 'Poor' || a.status === 'Under Maintenance') {
              score = 38;
              rel = 'Low (Vulnerable)';
              fat = 'Fatigued (62%)';
              trend = 'Critical';
            } else if (a.condition === 'Broken') {
              score = 12;
              rel = 'Non-operational';
              fat = 'Structural failure (92%)';
              trend = 'Failed';
            }

            return (
              <HealthCard
                key={a.id}
                title={a.name}
                score={score}
                reliability={rel}
                fatigue={fat}
                trend={trend}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
