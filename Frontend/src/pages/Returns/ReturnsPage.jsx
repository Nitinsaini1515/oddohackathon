import React, { useState } from 'react';
import { Undo2, CheckSquare, Image, MessageSquare, ShieldAlert } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import Select from '../../components/ui/inputs/Select';
import Textarea from '../../components/ui/inputs/Textarea';
import Checkbox from '../../components/ui/inputs/Checkbox';
import toast from 'react-hot-toast';

export default function ReturnsPage() {
  const {
    assets,
    employees,
    allocations,
    returnAsset
  } = useMockState();

  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [returnCondition, setReturnCondition] = useState('Good');
  const [conditionNotes, setConditionNotes] = useState('');
  const [damageNotes, setDamageNotes] = useState('');
  const [mockImageUploaded, setMockImageUploaded] = useState(false);

  // Return checklist checkboxes
  const [accessoriesIncluded, setAccessoriesIncluded] = useState(true);
  const [powerAdapterIncluded, setPowerAdapterIncluded] = useState(true);
  const [cleanlinessVerified, setCleanlinessVerified] = useState(true);

  // Return handler
  const handleReturn = (e) => {
    e.preventDefault();
    if (!selectedAssetId) {
      toast.error('Please select an asset to return.');
      return;
    }

    const compiledNotes = `Accessories: ${accessoriesIncluded ? 'Yes' : 'No'}, Power Adapter: ${powerAdapterIncluded ? 'Yes' : 'No'}, Cleanliness: ${cleanlinessVerified ? 'Yes' : 'No'}. Notes: ${conditionNotes}`;
    
    // Call Context action
    returnAsset(selectedAssetId, returnCondition, compiledNotes, damageNotes, mockImageUploaded ? 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80' : null);

    // Reset Form
    setSelectedAssetId('');
    setReturnCondition('Good');
    setConditionNotes('');
    setDamageNotes('');
    setMockImageUploaded(false);
    setAccessoriesIncluded(true);
    setPowerAdapterIncluded(true);
    setCleanlinessVerified(true);
    setIsReturnOpen(false);

    toast.success('Asset return logged and processed!');
  };

  // Only allocated assets can be returned
  const allocatedAssets = assets.filter(a => a.status === 'Allocated');

  // Load returned allocations history
  const returnedAllocations = allocations.filter(a => a.status === 'Returned');

  const columns = [
    {
      header: 'Returned Asset',
      accessor: 'assetName',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.assetName}</div>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{row.assetTag}</span>
        </div>
      )
    },
    {
      header: 'Returned By',
      accessor: 'employeeName',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.employeeName}</div>
          <span className="text-[9px] text-brand-secondaryText block">{row.department}</span>
        </div>
      )
    },
    {
      header: 'Check-In Date',
      accessor: 'actualReturnDate',
      render: (row) => <span className="font-mono text-slate-400">{row.actualReturnDate}</span>
    },
    {
      header: 'Status',
      render: () => <StatusBadge status="Returned" />
    },
    {
      header: 'Comments / Notes',
      accessor: 'notes',
      render: (row) => (
        <div className="max-w-xs truncate text-[11px] text-brand-secondaryText" title={row.notes}>
          {row.notes}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Returns Management</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Audit returned hardware configurations, check condition logs, and file damage notes.</p>
        </div>
        <PrimaryButton onClick={() => setIsReturnOpen(true)} icon={Undo2} className="text-xs">
          Process Return
        </PrimaryButton>
      </div>

      {/* Return History Table */}
      <DataTable
        columns={columns}
        data={returnedAllocations}
        searchPlaceholder="Search returned assets..."
        searchKeys={['assetName', 'assetTag', 'employeeName', 'notes']}
        itemsPerPage={6}
      />

      {/* Return Drawer */}
      <Drawer
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        title="Check-In Return Receipt"
        size="md"
      >
        <form onSubmit={handleReturn} className="flex flex-col gap-5">
          <Select
            label="Select Active Allocation"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            required
          >
            <option value="">-- Choose active allocation to return --</option>
            {allocatedAssets.map(ast => {
              const holder = employees.find(e => e.id === ast.currentHolderId);
              return (
                <option key={ast.id} value={ast.id}>
                  {ast.name} ({ast.assetTag}) - Held by {holder?.name || 'Unknown'}
                </option>
              );
            })}
          </Select>

          {/* Checklist */}
          <div className="space-y-3 p-4 bg-slate-900/60 rounded-xl border border-brand-border/40">
            <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" /> Return Checklist
            </h5>
            <div className="space-y-2 text-xs">
              <Checkbox
                label="Standard accessories returned (mouse, case, cables)"
                checked={accessoriesIncluded}
                onChange={(e) => setAccessoriesIncluded(e.target.checked)}
              />
              <Checkbox
                label="OEM Power Adapter / Charger included"
                checked={powerAdapterIncluded}
                onChange={(e) => setPowerAdapterIncluded(e.target.checked)}
              />
              <Checkbox
                label="Device physically cleaned and disinfected"
                checked={cleanlinessVerified}
                onChange={(e) => setCleanlinessVerified(e.target.checked)}
              />
            </div>
          </div>

          <Select
            label="Condition Verification"
            value={returnCondition}
            onChange={(e) => setReturnCondition(e.target.value)}
            required
          >
            <option value="New">New / Unused</option>
            <option value="Good">Good (Standard wear)</option>
            <option value="Fair">Fair (Noticeable scratching)</option>
            <option value="Poor">Poor (Operational defects / damaged)</option>
            <option value="Broken">Broken (Non-operational)</option>
          </Select>

          <Textarea
            label="Check-In Condition Comments"
            placeholder="Describe screen wear, keys status, battery performance..."
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
            rows={2.5}
          />

          {(returnCondition === 'Poor' || returnCondition === 'Broken') && (
            <div className="flex flex-col gap-4 border border-brand-danger/30 p-4 bg-brand-danger/5 rounded-xl">
              <h5 className="text-[10px] font-bold text-brand-danger uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-brand-danger" /> Damage Report Needed
              </h5>
              <Textarea
                label="Damage Notes"
                placeholder="Describe screen cracks, water damage, frame bending..."
                value={damageNotes}
                onChange={(e) => setDamageNotes(e.target.value)}
                rows={3}
                required
              />

              {/* Simulated Camera upload */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-brand-secondaryText">Upload Photo of Damage</span>
                <button
                  type="button"
                  onClick={() => {
                    setMockImageUploaded(true);
                    toast.success('Simulation: Screen damage photo uploaded.');
                  }}
                  className="flex items-center justify-center gap-2 p-4 border border-dashed border-brand-border hover:border-brand-danger rounded-xl hover:bg-slate-900/40 text-brand-secondaryText hover:text-white transition-all"
                >
                  <Image className="w-5 h-5 text-brand-secondaryText" />
                  <span className="text-xs font-medium">
                    {mockImageUploaded ? 'damage_screenshot_102.jpg Uploaded' : 'Upload Image (Click to simulate)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2.5 mt-3">
            <SecondaryButton type="button" onClick={() => setIsReturnOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" className="flex-1 text-xs py-2">
              Process Return
            </PrimaryButton>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
