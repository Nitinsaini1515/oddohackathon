import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, UserPlus, ShieldAlert, Cpu } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import RecommendationCard from '../../components/ui/cards/RecommendationCard';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import Select from '../../components/ui/inputs/Select';
import toast from 'react-hot-toast';

export default function RecommendationsPage() {
  const { employees } = useMockState();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [recommendationType, setRecommendationType] = useState('Upgrade'); // 'Upgrade' | 'Replacement' | 'Onboarding'

  // Form submit handler
  const handleRequestRecommendation = (e) => {
    e.preventDefault();
    if (!selectedEmpId) {
      toast.error('Please choose an employee.');
      return;
    }
    const emp = employees.find(e => e.id === selectedEmpId);
    toast.success(`Generated recommendations for ${emp.name}!`);
    setIsDrawerOpen(false);
    setSelectedEmpId('');
  };

  // Mock static recommendations dataset
  const recommendationsList = [
    {
      id: 'rec-1',
      title: 'Upgrade Workstation for Sarah Jenkins',
      reason: 'Sarah manages Engineering and runs Docker/VM local servers. Current device (MacBook Pro) is approaching 3 years usage.',
      suggestedAsset: 'MacBook Pro 16" (M3 Max, 64GB RAM)',
      alternativeAsset: 'ThinkPad P1 Gen 6 (Intel i9, 32GB RAM)',
      type: 'Performance Upgrade'
    },
    {
      id: 'rec-2',
      title: 'Replacement Alert: Ubiquiti Dream Machine',
      reason: 'Asset is currently under maintenance due to persistent firmware issues. Replacing with a backup is recommended to prevent core network downtime.',
      suggestedAsset: 'Ubiquiti Dream Machine SE (Backup)',
      alternativeAsset: 'Cisco Meraki MX85 Security Appliance',
      type: 'Downtime Mitigation'
    },
    {
      id: 'rec-3',
      title: 'Standard Deployment: Jessica Taylor',
      reason: 'Jessica manages Operations and requires tablet devices for client reviews and floor checkoffs.',
      suggestedAsset: 'iPad Pro 12.9" M2',
      alternativeAsset: 'Galaxy Tab S9 Ultra',
      type: 'Workflow Optimization'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-brand-accent animate-pulse" />
            <span>Smart Recommendations</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Smart matching engine predicts onboarding setups, replacement cycles, and device upgrades.</p>
        </div>
        <PrimaryButton onClick={() => setIsDrawerOpen(true)} icon={Sparkles} className="text-xs shrink-0">
          Request Recommendation
        </PrimaryButton>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendationsList.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onActionClick={(r) => {
              toast.success(`Approved recommendation: ${r.suggestedAsset}`);
            }}
          />
        ))}
      </div>

      {/* Request Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Request Smart Configuration Recommendation"
        size="md"
      >
        <form onSubmit={handleRequestRecommendation} className="flex flex-col gap-5">
          <Select
            label="Target Recipient"
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            required
          >
            <option value="">-- Choose employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department} - {emp.role})</option>
            ))}
          </Select>

          <Select
            label="Recommendation Purpose"
            value={recommendationType}
            onChange={(e) => setRecommendationType(e.target.value)}
            required
          >
            <option value="Upgrade">Performance Upgrade (Aging hardware)</option>
            <option value="Replacement">Broken / Faulty replacement routing</option>
            <option value="Onboarding">Standard Onboarding Configuration</option>
          </Select>

          <div className="p-3.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 text-xs text-brand-secondaryText leading-relaxed">
            <strong>System Engine:</strong> Evaluates role, department allocations, software profiles, and ticket history of selected employee to compute the ideal hardware layout.
          </div>

          <div className="flex gap-2.5 mt-3">
            <SecondaryButton type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" className="flex-1 text-xs py-2">
              Generate Configs
            </PrimaryButton>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
