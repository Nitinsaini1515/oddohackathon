import React, { useState, useMemo } from 'react';
import { CalendarDays, Wrench, RefreshCw, User, ClipboardList, CheckCircle } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import Select from '../../components/ui/inputs/Select';
import Timeline from '../../components/ui/common/Timeline';

export default function TimelinePage() {
  const { assets } = useMockState();
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId);
  }, [assets, selectedAssetId]);

  // Convert asset history to timeline nodes
  const timelineItems = useMemo(() => {
    if (!selectedAsset) return [];
    
    return (selectedAsset.history || []).map(h => {
      // Pick appropriate icon based on event term
      const eventName = h.event.toLowerCase();
      let icon = RefreshCw;
      let status = 'Completed';

      if (eventName.includes('registered') || eventName.includes('purchased')) {
        icon = CheckCircle;
      } else if (eventName.includes('allocate') || eventName.includes('assign')) {
        icon = User;
      } else if (eventName.includes('maintenance') || eventName.includes('repair') || eventName.includes('firmware')) {
        icon = Wrench;
        status = 'Pending';
      } else if (eventName.includes('audit') || eventName.includes('checkoff')) {
        icon = ClipboardList;
      }

      return {
        date: h.date,
        title: h.event,
        description: h.notes,
        user: h.user || 'System Telemetry',
        icon,
        status
      };
    });
  }, [selectedAsset]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5.5 h-5.5 text-brand-primary" />
            <span>Asset History Timeline</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Select an asset to trace all historical deployments, bookings, maintenance, and audit cycles.</p>
        </div>

        {/* Dropdown Selector */}
        <div className="w-64 shrink-0">
          <Select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="py-1.5"
          >
            <option value="">-- Choose asset to view history --</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        {selectedAsset ? (
          <div className="lg:col-span-1 glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4 self-start">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Profile Summary</h3>
            
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-brand-border/60">
              <img
                src={selectedAsset.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'}
                alt={selectedAsset.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3.5 text-xs text-brand-secondaryText">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Asset Tag</span>
                <span className="text-white font-mono font-bold text-sm">{selectedAsset.assetTag}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Serial Number</span>
                <span className="text-white font-mono">{selectedAsset.serialNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Specifications</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5 p-2 bg-slate-900/60 rounded-lg border border-brand-border/40">
                  {Object.entries(selectedAsset.specifications || {}).map(([key, val]) => (
                    <div key={key} className="truncate">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">{key}</span>
                      <span className="text-[10px] text-white font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1 glass-panel p-10 rounded-2xl border border-brand-border/40 text-center text-xs text-brand-secondaryText bg-[#111827]">
            Please choose an asset to display specifications.
          </div>
        )}

        {/* Right Side: Log timeline */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-brand-purple">Chronological Audit Log</h3>
          
          {selectedAsset && timelineItems.length > 0 ? (
            <div className="mt-2.5">
              <Timeline items={timelineItems} />
            </div>
          ) : (
            <div className="text-center py-12 text-brand-secondaryText text-xs">
              No historical log records matching this device.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
