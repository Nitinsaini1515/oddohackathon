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
  Cell
} from 'recharts';
import { useMockState } from '../../context/MockStateContext';
import StatsCard from '../../components/ui/cards/StatsCard';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    assets,
    employees,
    departments,
    activities
  } = useMockState();

  const totalAssetsCount = assets.length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;
  const deptsCount = departments.length;
  const employeesCount = employees.length;

  const monthlyData = [
    { name: 'Jan', Registered: 5, Allocated: 3 },
    { name: 'Feb', Registered: 12, Allocated: 8 },
    { name: 'Mar', Registered: 18, Allocated: 14 },
    { name: 'Apr', Registered: 22, Allocated: 18 },
    { name: 'May', Registered: 29, Allocated: 23 },
    { name: 'Jun', Registered: totalAssetsCount, Allocated: allocatedCount }
  ];

  const pieData = React.useMemo(() => {
    const counts = {};
    assets.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    const colors = ['#4F46E5', '#7C3AED', '#2563EB', '#A855F7', '#22C55E', '#F59E0B'];
    return Object.keys(counts).map((catName, idx) => ({
      name: catName.split(' ')[0],
      value: counts[catName],
      color: colors[idx % colors.length]
    }));
  }, [assets]);

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Telemetry (Admin Dashboard)</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Real-time status overview of organizational inventories.</p>
        </div>
        <Link to="/dashboard/assets/new" className="w-full md:w-auto">
          <PrimaryButton className="w-full text-xs" icon={Plus}>
            Register New Asset
          </PrimaryButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Assets" value={totalAssetsCount} icon={Package} trend="+8%" trendType="up" description="since last quarter" />
        <StatsCard title="Available Assets" value={availableCount} icon={CheckCircle} iconColor="text-brand-success" trend="40%" trendType="neutral" description="of inventory active" />
        <StatsCard title="Allocated Assets" value={allocatedCount} icon={LinkIcon} iconColor="text-blue-400" trend="+15%" trendType="up" description="assigned to employees" />
        <StatsCard title="Under Maintenance" value={maintenanceCount} icon={Wrench} iconColor="text-brand-warning" trend="Needs audit" trendType="down" description="equipment servicing" />
      </div>

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 md:p-6 border border-brand-border/40">
          <h3 className="text-sm font-bold text-white mb-4">Monthly Allocation Curve</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <RechartsTooltip contentStyle={{ background: '#060816', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="Registered" stroke="#4F46E5" strokeWidth={2} fill="rgba(79, 70, 233, 0.1)" />
                <Area type="monotone" dataKey="Allocated" stroke="#7C3AED" strokeWidth={2} fill="rgba(124, 58, 237, 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-border/40 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white">Category Distribution</h3>
          <div className="h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ background: '#060816', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white">{totalAssetsCount}</span>
              <span className="text-[9px] uppercase font-bold text-brand-secondaryText tracking-wide">Assets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
