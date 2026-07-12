import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, User, Building, Calendar, ArrowRightLeft, Undo2, ClipboardList, Eye } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import TextInput from '../../components/ui/inputs/TextInput';
import Select from '../../components/ui/inputs/Select';
import Textarea from '../../components/ui/inputs/Textarea';
import toast from 'react-hot-toast';

export default function AllocationDashboard() {
  const navigate = useNavigate();
  const {
    assets,
    employees,
    departments,
    allocations,
    allocateAsset,
    returnAsset,
    requestTransfer
  } = useMockState();

  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [selectedAlloc, setSelectedAlloc] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form states
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [allocationNotes, setAllocationNotes] = useState('');

  // Quick Action States
  const [isQuickTransferOpen, setIsQuickTransferOpen] = useState(false);
  const [isQuickReturnOpen, setIsQuickReturnOpen] = useState(false);
  const [quickTargetEmpId, setQuickTargetEmpId] = useState('');
  const [quickTransferNotes, setQuickTransferNotes] = useState('');
  const [quickReturnCondition, setQuickReturnCondition] = useState('Good');

  // Filter available assets for the allocation form (Prevents double allocation)
  const availableAssets = assets.filter(a => a.status === 'Available');

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedEmployeeId || !expectedReturnDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const emp = employees.find(e => e.id === selectedEmployeeId);
    allocateAsset(selectedAssetId, selectedEmployeeId, emp?.department || 'Engineering', expectedReturnDate, allocationNotes);
    
    // Reset Form
    setSelectedAssetId('');
    setSelectedEmployeeId('');
    setExpectedReturnDate('');
    setAllocationNotes('');
    setIsAllocateOpen(false);
    toast.success('Asset successfully allocated!');
  };

  const handleQuickTransfer = (e) => {
    e.preventDefault();
    if (!selectedAlloc || !quickTargetEmpId) {
      toast.error('Please select a target employee.');
      return;
    }

    const targetEmp = employees.find(emp => emp.id === quickTargetEmpId);
    requestTransfer(selectedAlloc.assetId, quickTargetEmpId, targetEmp?.department || 'Operations', quickTransferNotes);
    
    setQuickTargetEmpId('');
    setQuickTransferNotes('');
    setIsQuickTransferOpen(false);
    setSelectedAlloc(null);
    toast.success('Transfer request successfully submitted!');
  };

  const handleQuickReturn = (e) => {
    e.preventDefault();
    if (!selectedAlloc) return;

    returnAsset(selectedAlloc.assetId, quickReturnCondition, 'Returned via Allocation quick action.', '', null);
    
    setIsQuickReturnOpen(false);
    setSelectedAlloc(null);
    toast.success('Asset successfully checked in!');
  };

  const columns = [
    {
      header: 'Asset Info',
      accessor: 'assetName',
      render: (row) => (
        <div>
          <div className="font-bold text-white hover:text-brand-primary transition-colors cursor-pointer" onClick={() => { setSelectedAlloc(row); setIsDetailsOpen(true); }}>
            {row.assetName}
          </div>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{row.assetTag}</span>
        </div>
      )
    },
    {
      header: 'Assigned To',
      accessor: 'employeeName',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-[10px]">
            {row.employeeName?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-white font-bold">{row.employeeName}</div>
            <div className="text-[9px] text-brand-secondaryText">{row.department}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Allocation Date',
      accessor: 'allocatedDate',
      render: (row) => (
        <div className="font-mono text-slate-400">{row.allocatedDate}</div>
      )
    },
    {
      header: 'Expected Return',
      accessor: 'expectedReturnDate',
      render: (row) => (
        <div className="font-mono text-slate-400">{row.expectedReturnDate || 'N/A'}</div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Active' && (
            <>
              <button
                onClick={() => { setSelectedAlloc(row); setIsQuickTransferOpen(true); }}
                title="Transfer Asset"
                className="p-1.5 border border-brand-border bg-slate-900/60 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setSelectedAlloc(row); setIsQuickReturnOpen(true); }}
                title="Return Asset"
                className="p-1.5 border border-brand-border bg-slate-900/60 text-brand-success hover:bg-brand-success/10 rounded-lg transition-all"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => { setSelectedAlloc(row); setIsDetailsOpen(true); }}
            title="View Details"
            className="p-1.5 border border-brand-border bg-slate-900/60 text-brand-secondaryText hover:text-white rounded-lg transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Asset Allocations</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Deploy, transfer, or return hardware across staff profiles.</p>
        </div>
        <PrimaryButton onClick={() => setIsAllocateOpen(true)} icon={Plus} className="text-xs shrink-0">
          Allocate Asset
        </PrimaryButton>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={allocations}
        searchPlaceholder="Search allocations (name, tags, employees)..."
        searchKeys={['assetName', 'assetTag', 'employeeName', 'department', 'status']}
        itemsPerPage={8}
      />

      {/* Slide 1: Allocate Asset Drawer */}
      <Drawer
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        title="Deploy Asset to Employee"
        size="md"
      >
        <form onSubmit={handleAllocate} className="flex flex-col gap-5">
          {/* Prevent Double Allocation: list only Available assets */}
          <Select
            label="Select Available Asset"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            required
          >
            <option value="">-- Choose available device --</option>
            {availableAssets.map(ast => (
              <option key={ast.id} value={ast.id}>{ast.name} ({ast.assetTag})</option>
            ))}
          </Select>

          {/* Double Allocation Alert Warning */}
          {availableAssets.length === 0 && (
            <div className="p-3.5 rounded-xl border border-brand-danger/20 bg-brand-danger/5 text-brand-danger text-[10px] leading-relaxed">
              <strong>Warning:</strong> No assets are currently available. Check-in or repair items first.
            </div>
          )}

          <Select
            label="Select Employee"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            required
          >
            <option value="">-- Choose employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department} - {emp.role})</option>
            ))}
          </Select>

          <TextInput
            label="Expected Return Date"
            type="date"
            value={expectedReturnDate}
            onChange={(e) => setExpectedReturnDate(e.target.value)}
            required
          />

          <Textarea
            label="Allocation Notes"
            placeholder="Condition at release, standard accessories check, etc..."
            value={allocationNotes}
            onChange={(e) => setAllocationNotes(e.target.value)}
            rows={3}
          />

          <div className="flex gap-2.5 mt-4">
            <SecondaryButton type="button" onClick={() => setIsAllocateOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={availableAssets.length === 0} className="flex-1 text-xs py-2">
              Deploy Device
            </PrimaryButton>
          </div>
        </form>
      </Drawer>

      {/* Slide 2: Quick Transfer Modal Drawer */}
      <Drawer
        isOpen={isQuickTransferOpen}
        onClose={() => setIsQuickTransferOpen(false)}
        title="Initiate Asset Transfer"
        size="md"
      >
        {selectedAlloc && (
          <form onSubmit={handleQuickTransfer} className="flex flex-col gap-4">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-brand-border text-xs text-brand-secondaryText">
              Transferring: <strong className="text-white">{selectedAlloc.assetName}</strong> ({selectedAlloc.assetTag})<br />
              Current Holder: <strong className="text-white">{selectedAlloc.employeeName}</strong>
            </div>

            <Select
              label="Transfer Target Employee"
              value={quickTargetEmpId}
              onChange={(e) => setQuickTargetEmpId(e.target.value)}
              required
            >
              <option value="">-- Select target recipient --</option>
              {employees.filter(emp => emp.id !== selectedAlloc.employeeId).map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </Select>

            <Textarea
              label="Transfer Justification"
              placeholder="Why is this transfer requested?"
              value={quickTransferNotes}
              onChange={(e) => setQuickTransferNotes(e.target.value)}
              rows={3}
            />

            <div className="flex gap-2.5 mt-3">
              <SecondaryButton type="button" onClick={() => setIsQuickTransferOpen(false)} className="flex-1 text-xs py-2">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" className="flex-1 text-xs py-2">
                Request Transfer
              </PrimaryButton>
            </div>
          </form>
        )}
      </Drawer>

      {/* Slide 3: Quick Return Modal Drawer */}
      <Drawer
        isOpen={isQuickReturnOpen}
        onClose={() => setIsQuickReturnOpen(false)}
        title="Check-In / Return Asset"
        size="md"
      >
        {selectedAlloc && (
          <form onSubmit={handleQuickReturn} className="flex flex-col gap-4">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-brand-border text-xs text-brand-secondaryText">
              Returning: <strong className="text-white">{selectedAlloc.assetName}</strong> ({selectedAlloc.assetTag})<br />
              Assigned Holder: <strong className="text-white">{selectedAlloc.employeeName}</strong>
            </div>

            <Select
              label="Returned Condition Check"
              value={quickReturnCondition}
              onChange={(e) => setQuickReturnCondition(e.target.value)}
              required
            >
              <option value="New">New / Unused</option>
              <option value="Good">Good (No functional defects)</option>
              <option value="Fair">Fair (Scratch / signs of wear)</option>
              <option value="Poor">Poor (Major defects / service needed)</option>
              <option value="Broken">Broken (Inoperable)</option>
            </Select>

            <div className="flex gap-2.5 mt-3">
              <SecondaryButton type="button" onClick={() => setIsQuickReturnOpen(false)} className="flex-1 text-xs py-2">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" className="flex-1 text-xs py-2">
                Confirm Return
              </PrimaryButton>
            </div>
          </form>
        )}
      </Drawer>

      {/* Slide 4: Allocation Details Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Allocation Record Details"
        size="md"
      >
        {selectedAlloc && (
          <div className="flex flex-col gap-5 text-xs">
            {/* Header info */}
            <div className="glass-panel p-4 rounded-xl border border-brand-border flex justify-between items-center bg-slate-900/20">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{selectedAlloc.assetName}</h4>
                <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{selectedAlloc.assetTag}</span>
              </div>
              <StatusBadge status={selectedAlloc.status} />
            </div>

            {/* Employee info */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Custodian Profile</h5>
              <div className="p-3.5 bg-[#111827] rounded-xl border border-brand-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {selectedAlloc.employeeName?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-bold">{selectedAlloc.employeeName}</div>
                  <div className="text-brand-secondaryText mt-0.5">{selectedAlloc.department}</div>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Checkout Dates</h5>
              <div className="grid grid-cols-2 gap-3.5 p-3.5 bg-[#111827] rounded-xl border border-brand-border font-mono text-brand-secondaryText">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Check Out</span>
                  <span className="text-white">{selectedAlloc.allocatedDate}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Expected Return</span>
                  <span className="text-white">{selectedAlloc.expectedReturnDate || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Allocation Notes</h5>
              <div className="p-3.5 bg-[#111827] rounded-xl border border-brand-border text-brand-secondaryText leading-relaxed">
                {selectedAlloc.notes || 'No description notes attached to this deployment cycle.'}
              </div>
            </div>

            <SecondaryButton onClick={() => setIsDetailsOpen(false)} className="mt-4 text-xs py-2">
              Close Panel
            </SecondaryButton>
          </div>
        )}
      </Drawer>
    </div>
  );
}
