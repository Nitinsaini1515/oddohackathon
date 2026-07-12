import React from 'react';
import { TrendingUp, BarChart2, PieChart as PieIcon, Activity, Flame, ShieldAlert, Cpu } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import ChartCard from '../../components/ui/cards/ChartCard';
import MetricCard from '../../components/ui/cards/MetricCard';
import AnalyticsCard from '../../components/ui/cards/AnalyticsCard';

export default function AnalyticsPage() {
  const { assets, bookings, departments, maintenance } = useMockState();

  // Compute dynamic stats
  const totalAssetsCount = assets.length;
  const idleAssetsCount = assets.filter(a => a.status === 'Available').length;
  const underServiceCount = assets.filter(a => a.status === 'Under Maintenance').length;

  // Chart data 1: Monthly Asset Growth (Area Chart)
  const growthData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 18 },
    { month: 'Apr', count: 22 },
    { month: 'May', count: 29 },
    { month: 'Jun', count: totalAssetsCount }
  ];

  // Chart data 2: Department Utilization (Bar Chart)
  const deptUtilizationData = departments.map((d, idx) => ({
    name: d.name.substring(0, 8),
    utilization: 40 + (idx * 12) + (d.employeeCount || 2),
    color: idx % 2 === 0 ? '#4F46E5' : '#7C3AED'
  }));

  // Chart data 3: Condition Share (Pie Chart)
  const conditionShareData = React.useMemo(() => {
    const counts = {};
    assets.forEach(a => {
      counts[a.condition] = (counts[a.condition] || 0) + 1;
    });
    const colors = ['#22C55E', '#2563EB', '#F59E0B', '#EF4444', '#64748B'];
    return Object.keys(counts).map((cond, idx) => ({
      name: cond,
      value: counts[cond],
      color: colors[idx % colors.length]
    }));
  }, [assets]);

  // Heatmap dataset simulation: Weekdays vs Hours
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeslots = ['09:00', '11:00', '13:00', '15:00', '17:00'];
  // Density grid: 0 (light) to 10 (intense) bookings
  const bookingHeatData = [
    [2, 5, 8, 4, 1], // Mon
    [3, 8, 9, 6, 2], // Tue
    [5, 9, 7, 8, 3], // Wed
    [4, 7, 8, 5, 2], // Thu
    [1, 3, 4, 2, 0]  // Fri
  ];

  // Most used / Least used / Idle
  const mostUsed = assets.slice(0, 2);
  const leastUsed = assets.filter(a => a.condition === 'Fair' || a.condition === 'Poor').slice(0, 2);
  const idleAssets = assets.filter(a => a.status === 'Available').slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-5.5 h-5.5 text-brand-primary" />
          <span>Analytics Telemetry</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Deep analytics on resource distribution, life-cycles, and workspace density.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Telemetry Assets"
          value={totalAssetsCount}
          icon={Cpu}
          trend="+12%"
          description="active devices monitored"
        />
        <MetricCard
          title="Idle Reserve"
          value={idleAssetsCount}
          icon={Flame}
          iconColor="text-brand-warning"
          trend="Available"
          trendType="neutral"
          description="unallocated buffer stock"
        />
        <MetricCard
          title="Servicing Queue"
          value={underServiceCount}
          icon={ShieldAlert}
          iconColor="text-brand-danger"
          trend={`${underServiceCount} active`}
          trendType={underServiceCount > 0 ? 'down' : 'neutral'}
          description="devices in repair workflow"
        />
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth curve */}
        <ChartCard
          title="Hardware Inventory Expansion"
          subtitle="Cumulative growth curves for registered hardware assets."
        >
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
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
                <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Department Utilization */}
        <ChartCard
          title="Department Allocation Densities"
          subtitle="Percentage utilization rates by business department."
        >
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptUtilizationData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                  {deptUtilizationData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Heatmap: Booking Density */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Booking Hour Heatmap</h3>
            <p className="text-[10px] text-brand-secondaryText mt-0.5">Booking density matrix across workdays and timeslots.</p>
          </div>

          {/* Matrix Grid */}
          <div className="flex flex-col gap-2 mt-2">
            {/* Hour header */}
            <div className="grid grid-cols-6 gap-2 text-center text-[9px] font-bold text-brand-secondaryText uppercase tracking-wider pl-10">
              {timeslots.map((t, idx) => <span key={idx}>{t}</span>)}
            </div>

            {/* Matrix row */}
            <div className="space-y-2">
              {weekdays.map((day, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-2 text-[10px] font-bold text-brand-secondaryText">
                  <span className="w-10 text-left shrink-0 uppercase">{day}</span>
                  <div className="grid grid-cols-5 gap-2 flex-1">
                    {bookingHeatData[rowIdx].map((density, colIdx) => {
                      const opacity = Math.max(density / 10, 0.05);
                      return (
                        <div
                          key={colIdx}
                          className="h-7 rounded-lg border border-brand-border flex items-center justify-center font-bold text-[8px] text-white hover:border-white transition-all cursor-default"
                          style={{
                            backgroundColor: `rgba(79, 70, 229, ${opacity})`,
                            boxShadow: density > 7 ? '0 0 10px rgba(79, 70, 229, 0.2)' : 'none'
                          }}
                          title={`${density} bookings scheduled`}
                        >
                          {density}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Condition Pie Chart */}
        <ChartCard
          title="Physical Condition Distribution"
          subtitle="Quality share distributions calculated across total inventory items."
        >
          <div className="h-[180px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {conditionShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-black text-white">{totalAssetsCount}</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Items</span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 justify-center mt-2.5 text-[9px] font-bold text-brand-secondaryText">
            {conditionShareData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white">{item.name}</span>
                <span>({item.value})</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Utilization Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Used */}
        <div className="glass-panel p-4.5 rounded-xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-success uppercase tracking-wider">Most Deployed Hardware</h4>
          <div className="space-y-2 text-xs text-brand-secondaryText">
            {mostUsed.map(a => (
              <div key={a.id} className="p-2.5 bg-slate-950/40 rounded-lg border border-brand-border/50 flex justify-between items-center">
                <span className="font-bold text-white truncate max-w-[120px]">{a.name}</span>
                <span className="text-[9px] bg-brand-success/15 border border-brand-success/20 text-brand-success px-1.5 py-0.5 rounded-md font-bold">120 Days Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Least Used */}
        <div className="glass-panel p-4.5 rounded-xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-danger uppercase tracking-wider">High Wear / Serviced</h4>
          <div className="space-y-2 text-xs text-brand-secondaryText">
            {leastUsed.map(a => (
              <div key={a.id} className="p-2.5 bg-slate-950/40 rounded-lg border border-brand-border/50 flex justify-between items-center">
                <span className="font-bold text-slate-300 truncate max-w-[120px]">{a.name}</span>
                <span className="text-[9px] bg-brand-danger/15 border border-brand-danger/20 text-brand-danger px-1.5 py-0.5 rounded-md font-bold">3 Repairs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Idle reserve */}
        <div className="glass-panel p-4.5 rounded-xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-warning uppercase tracking-wider">Idle Stock Buffer</h4>
          <div className="space-y-2 text-xs text-brand-secondaryText">
            {idleAssets.map(a => (
              <div key={a.id} className="p-2.5 bg-slate-950/40 rounded-lg border border-brand-border/50 flex justify-between items-center">
                <span className="font-bold text-slate-300 truncate max-w-[120px]">{a.name}</span>
                <span className="text-[9px] bg-brand-warning/15 border border-brand-warning/20 text-brand-warning px-1.5 py-0.5 rounded-md font-bold">Unused</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
