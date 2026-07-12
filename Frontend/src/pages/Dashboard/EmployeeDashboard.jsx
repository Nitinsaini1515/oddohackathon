import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Wrench,
  CalendarDays,
  ArrowRightLeft,
  Undo2,
  FileText
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/ui/cards/StatsCard';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { assets, maintenance, bookings } = useMockState();

  // Find assets assigned to this user
  const myAssets = useMemo(() => {
    // Search by currentHolderId or matching standard name if mock
    return assets.filter(a => a.currentHolderId === user?.id || a.holder === user?.name);
  }, [assets, user]);

  // Find maintenance tickets raised by/for this user's assets
  const myTickets = useMemo(() => {
    const myAssetIds = myAssets.map(a => a.id);
    return maintenance.filter(m => myAssetIds.includes(m.assetId));
  }, [maintenance, myAssets]);

  // Find bookings made by this user
  const myBookings = useMemo(() => {
    return bookings.filter(b => b.userName === user?.name);
  }, [bookings, user]);

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">My Workspace (Employee Dashboard)</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Manage your active hardware assignments, raise maintenance logs, and check reservations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="My Allocated Assets" value={myAssets.length} icon={Laptop} iconColor="text-brand-success" description="Devices under your custody" />
        <StatsCard title="My Repair Requests" value={myTickets.length} icon={Wrench} iconColor="text-brand-warning" description="Active maintenance tickets" />
        <StatsCard title="My Reservations" value={myBookings.length} icon={CalendarDays} iconColor="text-indigo-400" description="Meeting rooms & vehicle bookings" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allocated Items List */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Hardware Assets</h3>
          <div className="space-y-3.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {myAssets.length > 0 ? (
              myAssets.map(a => (
                <div key={a.id} className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/40 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{a.name}</span>
                    <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{a.assetTag}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-brand-success/15 border border-brand-success/20 text-brand-success font-bold rounded-full">
                    {a.condition}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-brand-secondaryText text-xs">
                You have no active hardware allocations.
              </div>
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Self Service Center</h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-brand-secondaryText font-bold">
            <Link to="/dashboard/maintenance" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <Wrench className="w-5 h-5 text-brand-warning" />
              <span>Raise Repair Log</span>
            </Link>
            <Link to="/dashboard/bookings" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-400" />
              <span>Reserve Room / Vehicle</span>
            </Link>
            <Link to="/dashboard/transfers" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <ArrowRightLeft className="w-5 h-5 text-brand-primary" />
              <span>Initiate Custody Transfer</span>
            </Link>
            <Link to="/dashboard/returns" className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 hover:border-brand-primary hover:text-white transition-all flex flex-col gap-2">
              <Undo2 className="w-5 h-5 text-brand-success" />
              <span>Initiate Return Check-In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
