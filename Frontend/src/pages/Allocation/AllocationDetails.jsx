import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Building, Calendar, Wrench, RefreshCw, LogOut } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import Timeline from '../../components/ui/common/Timeline';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import EmptyState from '../../components/ui/common/EmptyState';
import toast from 'react-hot-toast';

export default function AllocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allocations, assets, returnAsset } = useMockState();

  const allocation = allocations.find(al => al.id === id);
  const asset = allocation ? assets.find(a => a.id === allocation.assetId) : null;

  if (!allocation) {
    return (
      <EmptyState
        title="Allocation Record Not Found"
        description="The requested allocation record ID does not exist in the database."
        actionLabel="Back to Allocations"
        onActionClick={() => navigate('/dashboard/allocation')}
      />
    );
  }

  const handleReturn = () => {
    returnAsset(allocation.assetId, 'Good', 'Checked-in directly from allocation details view.', '', null);
    toast.success('Asset successfully checked in!');
    navigate('/dashboard/allocation');
  };

  // Build a custom timeline list based on the asset history
  const timelineItems = (asset?.history || []).map(h => ({
    date: h.date,
    title: h.event,
    description: h.notes,
    user: h.user,
    icon: h.event.includes('Registered') ? Wrench : h.event.includes('Allocated') ? User : RefreshCw,
    status: h.event.includes('Servicing') ? 'Pending' : 'Completed'
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/allocation"
          className="p-2 border border-brand-border bg-slate-900/60 hover:bg-brand-cardHover hover:text-white rounded-xl text-brand-secondaryText transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">{allocation.assetName}</h2>
            <StatusBadge status={allocation.status} />
          </div>
          <p className="text-xs text-brand-secondaryText mt-1">Detailed allocation metrics and custody log.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Custody Cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Custodian details */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white tracking-tight uppercase text-brand-primary">Custodian Profile</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center font-bold text-sm">
                {allocation.employeeName?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{allocation.employeeName}</h4>
                <div className="flex items-center gap-1.5 text-xs text-brand-secondaryText mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{allocation.department} Department</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-border/20 pt-4 mt-2 font-mono text-xs text-brand-secondaryText">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deployment Date</span>
                <span className="text-white font-semibold">{allocation.allocatedDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Expected Return Date</span>
                <span className="text-white font-semibold">{allocation.expectedReturnDate || 'Indefinite'}</span>
              </div>
            </div>

            {allocation.status === 'Active' && (
              <div className="flex justify-end gap-2.5 border-t border-brand-border/20 pt-4 mt-2">
                <SecondaryButton onClick={() => navigate('/dashboard/transfers')} className="text-xs py-1.5 px-4">
                  Request Transfer
                </SecondaryButton>
                <PrimaryButton onClick={handleReturn} className="text-xs py-1.5 px-4" icon={LogOut}>
                  Release Custody
                </PrimaryButton>
              </div>
            )}
          </div>

          {/* Notes description */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase text-brand-primary">Deployment Log Comments</h3>
            <p className="text-xs text-brand-secondaryText leading-relaxed">
              {allocation.notes || 'No description notes attached to this deployment cycle.'}
            </p>
          </div>
        </div>

        {/* Right Side: Timeline of Asset */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4.5">
          <h3 className="text-xs font-bold text-white uppercase text-brand-purple">Asset Event History</h3>
          <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
