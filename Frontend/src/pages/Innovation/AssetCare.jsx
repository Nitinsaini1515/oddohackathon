import React, { useState } from 'react';
import { Sparkles, Sliders, CalendarDays, CheckCircle, Clock } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import { RecommendationCard } from '../../components/ui/innovation/InnovationComponents';
import Timeline from '../../components/ui/common/Timeline';
import toast from 'react-hot-toast';

export default function AssetCare() {
  const { assets } = useMockState();

  // Mock static list of AI recommendations linked to assets
  const [recommendations, setRecommendations] = useState([
    {
      id: 'rec-1',
      title: 'Cooling Fan Cleaning & Lubrication',
      assetName: 'ThinkPad P1 Gen 6',
      priority: 'High',
      reason: 'Average core temperatures reached 82°C during 3D compilation workloads, suggesting vent blockage.',
      suggestedAction: 'Power down device, open chassis, use compressed air to clear fans, and verify vent airflow.',
      estimatedTime: '25 min',
      status: 'Open'
    },
    {
      id: 'rec-2',
      title: 'Battery Cell Calibration / Replacement',
      assetName: 'MacBook Pro 16" M3 Max',
      priority: 'Critical',
      reason: 'Battery diagnostics reports maximum capacity is at 74% health after 420 cycle counts.',
      suggestedAction: 'Execute system calibration reset. If capacity remains under 75%, book a battery replacement block.',
      estimatedTime: '45 min',
      status: 'Open'
    },
    {
      id: 'rec-3',
      title: 'Network Port Firmware Security Patch',
      assetName: 'Dell PowerEdge R760 Server',
      priority: 'Medium',
      reason: 'Active network ports require patch release ver 1.89-b to mitigate critical virtualization vulnerabilities.',
      suggestedAction: 'Schedule backup node migration and flash the server motherboard ROM via console shell.',
      estimatedTime: '1.5 hrs',
      status: 'Open'
    },
    {
      id: 'rec-4',
      title: 'General Dusting & Inspection',
      assetName: 'Ubiquiti UniFi Dream Machine SE',
      priority: 'Low',
      reason: 'Chassis has been continuously operational in Rack B for 180 days without a diagnostics check.',
      suggestedAction: 'Schedule standard physical inspection and clean the device console ports.',
      estimatedTime: '15 min',
      status: 'Open'
    }
  ]);

  const handleResolve = (id) => {
    setRecommendations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r)
    );
    toast.success('AI preventive maintenance task resolved and logged in asset profile!');
  };

  const activeRecs = recommendations.filter(r => r.status === 'Open');
  const resolvedRecs = recommendations.filter(r => r.status === 'Resolved');

  // Convert resolved suggestions to timeline format
  const resolvedTimeline = resolvedRecs.map((r, idx) => ({
    date: 'Just now',
    title: `Resolved: ${r.title}`,
    description: `Preventive wellness check completed for ${r.assetName}. ${r.reason}`,
    user: 'IT Manager',
    icon: CheckCircle,
    status: 'Completed'
  }));

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-brand-accent animate-pulse" />
            <span>AI Asset wellness & Care Center</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Smart predictive algorithm flags physical degradation risks and recommends optimizations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: list of AI recommendations */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Recommendation Tickets ({activeRecs.length})</h3>
          
          {activeRecs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {activeRecs.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  title={`${rec.title} (${rec.assetName})`}
                  priority={rec.priority}
                  reason={rec.reason}
                  action={rec.suggestedAction}
                  time={rec.estimatedTime}
                  status={rec.status}
                  onAction={() => handleResolve(rec.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel border border-brand-border/40 rounded-xl text-brand-secondaryText text-xs">
              All AI wellness checks are completed! No critical anomalies detected.
            </div>
          )}
        </div>

        {/* Right: historical timeline of fixes */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4 self-start w-full">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-primary" /> Resolution Timeline
          </h3>

          {resolvedTimeline.length > 0 ? (
            <Timeline items={resolvedTimeline} />
          ) : (
            <div className="text-center py-8 text-brand-secondaryText text-[11px] leading-relaxed">
              No recommendations resolved in this session. Click <strong>Resolve Maintenance Check</strong> on cards.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
