import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Link as LinkIcon,
  FolderTree,
  Users,
  Wrench,
  Bookmark,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import StatsCard from '../../components/ui/cards/StatsCard';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import Badge from '../../components/ui/badges/Badge';
import Avatar from '../../components/ui/avatars/Avatar';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    assets,
    employees,
    departments,
    categories,
    activities
  } = useMockState();

  // Compute dynamic stats
  const totalAssetsCount = assets.length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;
  const deptsCount = departments.length;
  const employeesCount = employees.length;
  const bookingsCount = 5; // Static V1 bookings count

  // Recharts Chart configurations
  const monthlyData = [
    { name: 'Jan', Registered: 5, Allocated: 3 },
    { name: 'Feb', Registered: 12, Allocated: 8 },
    { name: 'Mar', Registered: 18, Allocated: 14 },
    { name: 'Apr', Registered: 22, Allocated: 18 },
    { name: 'May', Registered: 29, Allocated: 23 },
    { name: 'Jun', Registered: totalAssetsCount, Allocated: allocatedCount }
  ];

  // Pie chart category count
  const pieData = React.useMemo(() => {
    const counts = {};
    assets.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });

    const colors = ['#4F46E5', '#7C3AED', '#2563EB', '#A855F7', '#22C55E', '#F59E0B'];
    
    return Object.keys(counts).map((catName, idx) => ({
      name: catName.split(' ')[0], // Keep name short
      value: counts[catName],
      color: colors[idx % colors.length]
    }));
  }, [assets]);

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Telemetry</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Real-time status overview of organizational inventories.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link to="/dashboard/assets/new" className="w-full md:w-auto">
            <PrimaryButton className="w-full text-xs" icon={Plus}>
              Register New Asset
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assets"
          value={totalAssetsCount}
          icon={Package}
          trend="+8%"
          trendType="up"
          description="since last quarter"
        />
        <StatsCard
          title="Available Assets"
          value={availableCount}
          icon={CheckCircle}
          iconColor="text-brand-success"
          trend="40.7%"
          trendType="neutral"
          description="of inventory active"
        />
        <StatsCard
          title="Allocated Assets"
          value={allocatedCount}
          icon={LinkIcon}
          iconColor="text-blue-400"
          trend="+15%"
          trendType="up"
          description="assigned to employees"
        />
        <StatsCard
          title="Under Maintenance"
          value={maintenanceCount}
          icon={Wrench}
          iconColor={maintenanceCount > 0 ? 'text-brand-warning' : 'text-brand-secondaryText'}
          trend={maintenanceCount > 0 ? 'Needs audit' : 'All clear'}
          trendType={maintenanceCount > 0 ? 'down' : 'neutral'}
          description="equipment servicing"
        />
      </div>

      {/* Extra KPI list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4.5 rounded-xl border border-brand-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/20">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-brand-secondaryText uppercase font-bold">Departments</p>
              <h4 className="text-lg font-extrabold text-white mt-0.5">{deptsCount} Active</h4>
            </div>
          </div>
          <Link to="/dashboard/departments" className="text-brand-secondaryText hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-panel p-4.5 rounded-xl border border-brand-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple border border-brand-purple/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-brand-secondaryText uppercase font-bold">Employees</p>
              <h4 className="text-lg font-extrabold text-white mt-0.5">{employeesCount} Staff</h4>
            </div>
          </div>
          <Link to="/dashboard/employees" className="text-brand-secondaryText hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-panel p-4.5 rounded-xl border border-brand-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-warning/10 rounded-lg text-brand-warning border border-brand-warning/20">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-brand-secondaryText uppercase font-bold">Reservations</p>
              <h4 className="text-lg font-extrabold text-white mt-0.5">{bookingsCount} Bookings</h4>
            </div>
          </div>
          <span className="text-brand-secondaryText text-[10px] font-semibold border border-brand-border rounded-md px-1.5 py-0.5">V2 Prep</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Line Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 md:p-6 border border-brand-border/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-primary" /> Monthly Allocation Curve
              </h3>
              <p className="text-[10px] text-brand-secondaryText mt-0.5">Registered vs. Allocated trends in inventory database.</p>
            </div>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    background: '#060816',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="Registered" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorRegistered)" />
                <Area type="monotone" dataKey="Allocated" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorAllocated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Category Chart */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-border/40 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">Category Distribution</h3>
            <p className="text-[10px] text-brand-secondaryText mt-0.5">Asset quantities divided by registered categories.</p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      background: '#060816',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-brand-secondaryText">No category data</span>
            )}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white">{totalAssetsCount}</span>
              <span className="text-[9px] uppercase font-bold text-brand-secondaryText tracking-wide">Assets</span>
            </div>
          </div>

          {/* Custom legends */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[10px] font-semibold text-brand-secondaryText justify-center">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-white">{d.name}</span>
                <span>({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lists Row: Recent Activity & Recent Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Assets Table */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 border border-brand-border/40 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-white">Recently Registered</h3>
                <p className="text-[10px] text-brand-secondaryText mt-0.5">Newly tracked asset records.</p>
              </div>
              <Link to="/dashboard/assets" className="text-xs font-bold text-brand-primary hover:text-brand-purple hover:underline transition-all">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/20 text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider">
                    <th className="pb-3 pl-2">Asset Details</th>
                    <th className="pb-3">Condition</th>
                    <th className="pb-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/10 text-xs">
                  {assets.slice(0, 4).map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 pl-2">
                        <Link to={`/dashboard/assets/${a.id}`} className="font-bold text-white hover:text-brand-primary transition-colors block">
                          {a.name}
                        </Link>
                        <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{a.assetTag}</span>
                      </td>
                      <td className="py-3">
                        <Badge variant={
                          a.condition === 'New' || a.condition === 'Good' ? 'success' :
                          a.condition === 'Fair' ? 'warning' : 'danger'
                        }>
                          {a.condition}
                        </Badge>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <Badge variant={
                          a.status === 'Available' ? 'success' :
                          a.status === 'Allocated' ? 'info' :
                          a.status === 'Under Maintenance' ? 'warning' : 'gray'
                        }>
                          {a.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-brand-border/40 flex flex-col">
          <div className="mb-5">
            <h3 className="text-sm font-bold text-white">System Logs</h3>
            <p className="text-[10px] text-brand-secondaryText mt-0.5">Audit records from recent operations.</p>
          </div>
          
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[280px] custom-scrollbar pr-1 flex-1">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex gap-3 text-xs">
                <div className="mt-1 flex-shrink-0">
                  <span className="flex w-2 h-2 rounded-full bg-brand-primary shadow-glow-primary" />
                </div>
                <div>
                  <p className="font-bold text-white leading-snug">{act.title}</p>
                  <p className="text-[10px] text-brand-secondaryText mt-0.5">{act.desc}</p>
                  <div className="flex gap-2 text-[9px] text-slate-500 mt-1">
                    <span>By {act.user}</span>
                    <span>•</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
