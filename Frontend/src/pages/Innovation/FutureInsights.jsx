import React from 'react';
import { ShieldAlert, Activity, AlertTriangle, Layers, Calendar } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import { PredictionCard } from '../../components/ui/innovation/InnovationComponents';
import MetricCard from '../../components/ui/cards/MetricCard';

export default function FutureInsights() {
  const { assets } = useMockState();

  // Mock forecast indices linked to assets
  const predictionList = [
    {
      id: 'ast-101',
      name: 'MacBook Pro 16" M3 Max',
      failureRisk: 12,
      replacementScore: 24,
      priority: 'Low',
      forecastDate: 'Jan 2029 (Lifecycle End)'
    },
    {
      id: 'ast-102',
      name: 'ThinkPad P1 Gen 6',
      failureRisk: 68,
      replacementScore: 78,
      priority: 'High',
      forecastDate: 'Feb 2027 (Screen Flicker)'
    },
    {
      id: 'ast-107',
      name: 'Ubiquiti UniFi Dream Machine',
      failureRisk: 82,
      replacementScore: 94,
      priority: 'Critical',
      forecastDate: 'Immediate (Firmware fail)'
    },
    {
      id: 'ast-104',
      name: 'iPad Pro 12.9" M2',
      failureRisk: 42,
      replacementScore: 56,
      priority: 'Medium',
      forecastDate: 'Sep 2027 (Battery degradation)'
    }
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5.5 h-5.5 text-brand-danger animate-pulse" />
          <span>Futuristic Prediction Center</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1">Smart prognostic matching algorithm simulates failure likelihoods, depreciation alerts, and replacement cycle indices (UI-only).</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Predicted Service Flags"
          value="4 Items"
          icon={AlertTriangle}
          iconColor="text-brand-warning"
          description="High likelihood of servicing checkups"
        />
        <MetricCard
          title="Lifecycle Expiry score"
          value="18.5%"
          icon={Layers}
          iconColor="text-brand-primary"
          description="Average fleet lifecycle depreciation"
        />
        <MetricCard
          title="Urgent Swap Priority"
          value="1 Item"
          icon={ShieldAlert}
          iconColor="text-brand-danger"
          trend="Critical"
          trendType="down"
          description="immediate replacements flagged"
        />
      </div>

      {/* Predictive Cards Grid */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-brand-primary" /> Forecast Prognostics Ledgers
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {predictionList.map((pred) => (
            <PredictionCard
              key={pred.id}
              title={pred.name}
              failureRisk={pred.failureRisk}
              replacementScore={pred.replacementScore}
              priority={pred.priority}
              forecastDate={pred.forecastDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
