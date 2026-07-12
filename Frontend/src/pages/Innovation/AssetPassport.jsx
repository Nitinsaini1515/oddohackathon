import React, { useState, useMemo } from 'react';
import { FileText, User, Building, Wrench, Shield, Calendar, Layers, QrCode, RefreshCw } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import Select from '../../components/ui/inputs/Select';
import Timeline from '../../components/ui/common/Timeline';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import ProgressRing from '../../components/ui/common/ProgressCircle';

export default function AssetPassport() {
  const { assets, allocations, transfers, bookings, maintenance, audits } = useMockState();
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'history' | 'maintenance'

  // Extract selected asset
  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId);
  }, [assets, selectedAssetId]);

  // Compute mock lists for the selected asset
  const details = useMemo(() => {
    if (!selectedAsset) return null;

    const assetAllocations = allocations.filter(al => al.assetId === selectedAsset.id);
    const assetTransfers = transfers.filter(t => t.assetId === selectedAsset.id);
    const assetBookings = bookings.filter(b => b.resourceId === selectedAsset.id || b.resourceName.includes(selectedAsset.name));
    const assetMaintenance = maintenance.filter(m => m.assetId === selectedAsset.id);

    // Compute health score
    let score = 95;
    if (selectedAsset.condition === 'Good') score = 85;
    else if (selectedAsset.condition === 'Fair') score = 65;
    else if (selectedAsset.condition === 'Poor') score = 40;
    else if (selectedAsset.condition === 'Broken') score = 10;
    if (selectedAsset.status === 'Under Maintenance') score -= 15;

    return {
      allocations: assetAllocations,
      transfers: assetTransfers,
      bookings: assetBookings,
      maintenance: assetMaintenance,
      healthScore: score
    };
  }, [selectedAsset, allocations, transfers, bookings, maintenance]);

  // Compile timeline logs
  const timelineLogs = useMemo(() => {
    if (!selectedAsset || !details) return [];

    const logs = [];
    
    // Add default registration
    logs.push({
      date: selectedAsset.purchaseDate || '2024-01-01',
      title: 'Initial Database Registration',
      description: `Asset registered into inventory. Cost: ${selectedAsset.purchaseCost || '$0'}`,
      user: 'IT Manager',
      icon: Shield,
      status: 'Completed'
    });

    // Add allocations
    details.allocations.forEach(a => {
      logs.push({
        date: a.allocatedDate,
        title: `Deployment: Assigned to ${a.employeeName}`,
        description: `Allocated to ${a.department} department. expected return: ${a.expectedReturnDate}`,
        user: 'IT Admin',
        icon: User,
        status: a.status
      });
    });

    // Add transfers
    details.transfers.forEach(t => {
      logs.push({
        date: t.requestDate,
        title: `Transfer: ${t.sourceEmployeeName} to ${t.targetEmployeeName}`,
        description: `Transferred between departments. Status: ${t.status}`,
        user: 'System Controller',
        icon: RefreshCw,
        status: t.status
      });
    });

    return logs.sort((x, y) => y.date.localeCompare(x.date));
  }, [selectedAsset, details]);

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-brand-primary animate-pulse" />
            <span>Digital Asset Passport</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Unified cryptographic ledger logging custodian logs, repair histories, audits, and health score telemetry.</p>
        </div>

        {/* Dropdown Selector */}
        <div className="w-64 shrink-0">
          <Select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="py-1.5"
          >
            <option value="">-- Choose asset to view dossier --</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
            ))}
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedAsset && details ? (
          <motion.div
            key={selectedAsset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Side: General Profile Information */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass-panel p-5.5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col items-center text-center gap-4.5">
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-brand-border/60">
                  <img
                    src={selectedAsset.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'}
                    alt={selectedAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{selectedAsset.name}</h3>
                  <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{selectedAsset.assetTag}</span>
                </div>

                <div className="flex justify-center items-center gap-6 border-t border-brand-border/20 pt-4 mt-1.5 w-full">
                  <div className="flex flex-col items-center">
                    <ProgressRing value={details.healthScore} size={64} strokeWidth={6} />
                    <span className="text-[8px] font-black text-slate-500 uppercase mt-1">Health Index</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[8px] font-black text-slate-500 uppercase">Coverage Status</span>
                    <StatusBadge status={selectedAsset.status} />
                    <span className="text-[8px] font-bold text-brand-success uppercase">Under Warranty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Tab Logs */}
            <div className="lg:col-span-2 glass-panel p-5.5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4.5">
              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-brand-border/20 pb-3 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('general')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl transition-all',
                    activeTab === 'general' ? 'bg-brand-primary/10 text-white border border-brand-primary/20' : 'text-brand-secondaryText hover:text-white'
                  )}
                >
                  General Specs
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl transition-all',
                    activeTab === 'history' ? 'bg-brand-primary/10 text-white border border-brand-primary/20' : 'text-brand-secondaryText hover:text-white'
                  )}
                >
                  Custody Timeline ({timelineLogs.length})
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl transition-all',
                    activeTab === 'maintenance' ? 'bg-brand-primary/10 text-white border border-brand-primary/20' : 'text-brand-secondaryText hover:text-white'
                  )}
                >
                  Servicing history ({details.maintenance.length})
                </button>
              </div>

              {/* General Specs Tab */}
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1.5">
                  <div className="space-y-3.5 p-3.5 bg-slate-900/60 rounded-xl border border-brand-border/40 text-brand-secondaryText">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-black">Purchase Date</span>
                      <span className="text-white font-mono">{selectedAsset.purchaseDate || '2024-01-01'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-black">Acquisition Value</span>
                      <span className="text-white font-mono font-bold">{selectedAsset.purchaseCost || '$1,200'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-black">Serial Number</span>
                      <span className="text-white font-mono">{selectedAsset.serialNumber || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 p-3.5 bg-slate-900/60 rounded-xl border border-brand-border/40 text-brand-secondaryText">
                    <span className="text-[9px] text-slate-500 block uppercase font-black">Specifications details</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {Object.entries(selectedAsset.specifications || {}).map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-[8px] text-slate-500 block uppercase font-bold">{k}</span>
                          <span className="text-[10px] text-white font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custody Timeline Tab */}
              {activeTab === 'history' && (
                <div className="mt-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  <Timeline items={timelineLogs} />
                </div>
              )}

              {/* Maintenance Tab */}
              {activeTab === 'maintenance' && (
                <div className="flex flex-col gap-3.5 mt-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 text-xs">
                  {details.maintenance.length > 0 ? (
                    details.maintenance.map(m => (
                      <div key={m.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-brand-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{m.description}</div>
                          <span className="text-[9px] text-brand-secondaryText font-mono mt-0.5 block">Opened: {m.requestDate}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-slate-500 font-semibold">{m.technician || 'General IT'}</span>
                          <StatusBadge status={m.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-brand-secondaryText">
                      No repair logs found for this device.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl border border-brand-border/40 text-center text-xs text-brand-secondaryText bg-[#111827] max-w-2xl leading-relaxed">
            Please choose a target equipment to load its compiled Digital Asset Passport dossier logs.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
