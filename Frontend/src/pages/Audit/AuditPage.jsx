import React, { useState, useMemo } from 'react';
import { ClipboardCheck, Plus, User, Calendar, ShieldCheck, AlertOctagon, CheckSquare, Search } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import AuditCard from '../../components/ui/cards/AuditCard';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import TextInput from '../../components/ui/inputs/TextInput';
import Select from '../../components/ui/inputs/Select';
import SearchInput from '../../components/ui/inputs/SearchInput';
import toast from 'react-hot-toast';

export default function AuditPage() {
  const {
    audits,
    assets,
    employees,
    createAuditCycle,
    verifyAuditAsset
  } = useMockState();

  const [isCycleOpen, setIsCycleOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  // Create cycle form states
  const [cycleName, setCycleName] = useState('');
  const [auditorId, setAuditorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Asset search state inside verification panel
  const [assetSearchQuery, setAssetSearchQuery] = useState('');

  // Auditor selection options
  const managers = employees.filter(e => e.role === 'Manager' || e.role === 'Team Lead');

  const handleCreateCycle = (e) => {
    e.preventDefault();
    if (!cycleName || !auditorId || !startDate || !endDate) {
      toast.error('All fields are required.');
      return;
    }

    const auditor = employees.find(emp => emp.id === auditorId);
    createAuditCycle(cycleName, auditor?.name || 'David Miller', startDate, endDate);

    // Reset Form
    setCycleName('');
    setAuditorId('');
    setStartDate('');
    setEndDate('');
    setIsCycleOpen(false);
    toast.success('Audit cycle created successfully!');
  };

  const handleVerifyAsset = (assetId, status) => {
    if (!selectedAudit) return;
    verifyAuditAsset(selectedAudit.id, assetId, status, 'Verified during cycle audit.');
    toast.success(`Asset marked as ${status}`);
  };

  // Compute stats for selected audit (Discrepancy Report)
  const discrepancyReport = useMemo(() => {
    if (!selectedAudit) return null;
    const verifiedList = selectedAudit.verifiedAssets || [];
    
    const verified = verifiedList.filter(a => a.status === 'Verified').length;
    const damaged = verifiedList.filter(a => a.status === 'Damaged').length;
    const missing = verifiedList.filter(a => a.status === 'Missing').length;
    const unverified = assets.length - verifiedList.length;

    return {
      verified,
      damaged,
      missing,
      unverified
    };
  }, [selectedAudit, assets]);

  // Filter assets inside verification drawer
  const filteredAssetsForVerify = useMemo(() => {
    return assets.filter(a =>
      a.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(assetSearchQuery.toLowerCase())
    );
  }, [assets, assetSearchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5.5 h-5.5 text-brand-primary" />
            <span>Audit Management</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Deploy verification checkoffs to match warehouse ledgers with active staff hardware.</p>
        </div>
        <PrimaryButton onClick={() => setIsCycleOpen(true)} icon={Plus} className="text-xs">
          New Audit Cycle
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Audit Cycles Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active & Archived Cycles</h3>
          <div className="flex flex-col gap-4">
            {audits.map((aud) => (
              <AuditCard
                key={aud.id}
                audit={aud}
                totalAssetsCount={assets.length}
                onVerifyClick={(selected) => {
                  setSelectedAudit(selected);
                  setIsVerifyOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Quick Discrepancy Status View */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Discrepancy Report</h3>
            
            {selectedAudit ? (
              <div className="flex flex-col gap-4 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-brand-border text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Selected Audit</span>
                  <span className="text-white font-bold">{selectedAudit.cycleName}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-brand-success font-semibold">
                    <span>Verified Items</span>
                    <span>{discrepancyReport.verified} / {assets.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-brand-warning font-semibold">
                    <span>Damaged Items</span>
                    <span>{discrepancyReport.damaged}</span>
                  </div>
                  <div className="flex justify-between items-center text-brand-danger font-semibold">
                    <span>Missing Items</span>
                    <span>{discrepancyReport.missing}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-semibold border-t border-brand-border/20 pt-2.5">
                    <span>Remaining Unverified</span>
                    <span>{discrepancyReport.unverified}</span>
                  </div>
                </div>

                {/* Progress bar stack */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-brand-success" style={{ width: `${(discrepancyReport.verified / assets.length) * 100}%` }} />
                  <div className="bg-brand-warning" style={{ width: `${(discrepancyReport.damaged / assets.length) * 100}%` }} />
                  <div className="bg-brand-danger" style={{ width: `${(discrepancyReport.missing / assets.length) * 100}%` }} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-brand-secondaryText text-xs leading-relaxed">
                Click <strong>Perform Verification</strong> on any cycle to check discrepancy details.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cycle Creation Drawer */}
      <Drawer
        isOpen={isCycleOpen}
        onClose={() => setIsCycleOpen(false)}
        title="Schedule Cycle Inventory Audit"
        size="md"
      >
        <form onSubmit={handleCreateCycle} className="flex flex-col gap-5">
          <TextInput
            label="Audit Cycle Name"
            placeholder="e.g., Q3 Developer Workstation Audit 2026"
            value={cycleName}
            onChange={(e) => setCycleName(e.target.value)}
            required
          />

          <Select
            label="Assigned Auditor"
            value={auditorId}
            onChange={(e) => setAuditorId(e.target.value)}
            required
          >
            <option value="">-- Choose manager/auditor --</option>
            {managers.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3.5">
            <TextInput
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <TextInput
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2.5 mt-3">
            <SecondaryButton type="button" onClick={() => setIsCycleOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" className="flex-1 text-xs py-2">
              Begin Cycle
            </PrimaryButton>
          </div>
        </form>
      </Drawer>

      {/* Perform Verification Drawer */}
      <Drawer
        isOpen={isVerifyOpen}
        onClose={() => {
          setIsVerifyOpen(false);
          setSelectedAudit(null);
        }}
        title={`Inventory Checkoff: ${selectedAudit?.cycleName}`}
        size="xl"
      >
        {selectedAudit && (
          <div className="flex flex-col gap-5">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                placeholder="Search assets inside audit..."
                value={assetSearchQuery}
                onChange={(e) => setAssetSearchQuery(e.target.value)}
              />
            </div>

            {/* Asset checklist verification mapping */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-2.5">
              {filteredAssetsForVerify.map((ast) => {
                const verifiedStatus = selectedAudit.verifiedAssets?.find(va => va.assetId === ast.id);
                return (
                  <div key={ast.id} className="p-3.5 bg-[#111827] rounded-xl border border-brand-border flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-white leading-tight">{ast.name}</h4>
                      <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{ast.assetTag}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {verifiedStatus ? (
                        <div className="flex items-center gap-2.5">
                          <StatusBadge status={verifiedStatus.status} />
                          <button
                            onClick={() => handleVerifyAsset(ast.id, 'Verified')}
                            className="text-[9px] uppercase font-bold text-slate-500 hover:text-white"
                          >
                            Re-verify
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleVerifyAsset(ast.id, 'Verified')}
                            className="px-3 py-1.5 bg-brand-success/10 border border-brand-success/20 text-brand-success hover:bg-brand-success hover:text-white rounded-lg font-bold text-[10px] transition-all"
                          >
                            Verify Ok
                          </button>
                          <button
                            onClick={() => handleVerifyAsset(ast.id, 'Damaged')}
                            className="px-3 py-1.5 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning hover:bg-brand-warning hover:text-white rounded-lg font-bold text-[10px] transition-all"
                          >
                            Damaged
                          </button>
                          <button
                            onClick={() => handleVerifyAsset(ast.id, 'Missing')}
                            className="px-3 py-1.5 bg-brand-danger/10 border border-brand-danger/20 text-brand-danger hover:bg-brand-danger hover:text-white rounded-lg font-bold text-[10px] transition-all"
                          >
                            Missing
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <SecondaryButton
              onClick={() => {
                setIsVerifyOpen(false);
                setSelectedAudit(null);
              }}
              className="text-xs py-2 w-full"
            >
              Finish Checkoff Session
            </SecondaryButton>
          </div>
        )}
      </Drawer>
    </div>
  );
}
