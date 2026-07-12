import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Wrench,
  ArrowRightLeft,
  Undo2,
  FolderOpen,
  CalendarDays,
  Plus
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import StatsCard from '../../components/ui/cards/StatsCard';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const {
    assets,
    maintenance,
    transfers
  } = useMockState();

  const totalAssetsCount = assets.length;
  const maintenanceCount = maintenance.filter(m => m.status === 'Opened' || m.status === 'Assigned').length;
  const pendingTransfers = transfers.filter(t => t.status === 'Pending').length;

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Inventory Operations (Manager Dashboard)</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Review active inventory operations, maintenance logs, and trade requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/assets/new">
            <PrimaryButton className="text-xs" icon={Plus}>
              Add Asset
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Tracked Inventory" value={totalAssetsCount} icon={Package} description="total catalogued hardware" />
        <StatsCard title="Pending Repairs" value={maintenanceCount} icon={Wrench} iconColor="text-brand-warning" description="unresolved maintenance tasks" />
        <StatsCard title="Pending Transfers" value={pendingTransfers} icon={ArrowRightLeft} iconColor="text-indigo-400" description="trade approvals in queue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Shortcuts</h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-brand-secondaryText font-bold">
            <Link to="/dashboard/allocation" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <Plus className="w-5 h-5 text-brand-primary" />
              <span>Allocate Equipment</span>
            </Link>
            <Link to="/dashboard/returns" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <Undo2 className="w-5 h-5 text-brand-success" />
              <span>Return Checks</span>
            </Link>
            <Link to="/dashboard/transfers" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
              <span>Trade Approvals</span>
            </Link>
            <Link to="/dashboard/bookings" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <CalendarDays className="w-5 h-5 text-brand-warning" />
              <span>Reservations</span>
            </Link>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Locker Stock Available</h3>
            <div className="space-y-3.5">
              {assets.filter(a => a.status === 'Available').slice(0, 4).map(a => (
                <div key={a.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{a.name}</span>
                    <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{a.assetTag}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-brand-success/15 border border-brand-success/20 text-brand-success font-bold rounded-full">
                    {a.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
