import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderTree,
  Users,
  Link as LinkIcon,
  DollarSign,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/ui/cards/StatsCard';

export default function HeadDashboard() {
  const { user } = useAuth();
  const { assets, employees, departments } = useMockState();

  // Find department of this head
  const deptName = user?.department || 'Engineering';

  const stats = useMemo(() => {
    const deptInfo = departments.find(d => d.name === deptName) || { budget: '$80,000', employeeCount: 12 };
    
    // Filter employees in this department
    const deptEmployees = employees.filter(e => e.department === deptName);
    const employeeIds = deptEmployees.map(e => e.id);

    // Allocated assets inside this department
    const deptAllocated = assets.filter(a => a.status === 'Allocated' && employeeIds.includes(a.currentHolderId));

    return {
      deptInfo,
      deptEmployeesCount: deptEmployees.length,
      allocatedCount: deptAllocated.length,
      budget: deptInfo.budget
    };
  }, [deptName, employees, departments, assets]);

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{deptName} Portal (Department Head)</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Audit department allocations, budget expenditures, and staff devices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Department Budget" value={stats.budget} icon={DollarSign} iconColor="text-brand-success" description="Allocated annual budget limit" />
        <StatsCard title="Staff Members" value={stats.deptEmployeesCount} icon={Users} iconColor="text-brand-primary" description="Total headcounts registered" />
        <StatsCard title="Active Allocations" value={stats.allocatedCount} icon={LinkIcon} iconColor="text-indigo-400" description="Hardware items checked out" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department staff details */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department Staff</h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {employees.filter(e => e.department === deptName).map(e => (
              <div key={e.id} className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/40 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{e.name}</span>
                  <span className="text-[10px] text-brand-secondaryText block mt-0.5">{e.email}</span>
                </div>
                <span className="text-[10px] text-brand-secondaryText">{e.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic usage list */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recycled Reserves</h3>
            <div className="space-y-3">
              {assets.filter(a => a.status === 'Available').slice(0, 3).map(a => (
                <div key={a.id} className="p-2.5 bg-slate-900/40 border border-brand-border/40 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{a.name}</span>
                    <span className="text-[9px] text-brand-secondaryText mt-0.5 block">{a.category}</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-success font-bold">Available</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
