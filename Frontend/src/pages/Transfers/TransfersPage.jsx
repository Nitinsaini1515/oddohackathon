import React, { useState } from 'react';
import { Check, X, ArrowRightLeft, User, Building, Clock, HelpCircle, FileText } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import Select from '../../components/ui/inputs/Select';
import Textarea from '../../components/ui/inputs/Textarea';
import toast from 'react-hot-toast';

export default function TransfersPage() {
  const {
    transfers,
    assets,
    employees,
    requestTransfer,
    approveTransfer,
    rejectTransfer
  } = useMockState();

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedTargetEmpId, setSelectedTargetEmpId] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  // Handle Transfer request submission
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedTargetEmpId) {
      toast.error('Please choose both an asset and target recipient.');
      return;
    }

    const targetEmp = employees.find(emp => emp.id === selectedTargetEmpId);
    requestTransfer(selectedAssetId, selectedTargetEmpId, targetEmp?.department || 'Operations', transferNotes);

    // Reset Form
    setSelectedAssetId('');
    setSelectedTargetEmpId('');
    setTransferNotes('');
    setIsRequestOpen(false);
    toast.success('Transfer request successfully raised!');
  };

  const handleApprove = (id) => {
    approveTransfer(id);
    toast.success('Transfer request approved!');
  };

  const handleReject = (id) => {
    rejectTransfer(id);
    toast.error('Transfer request rejected.');
  };

  // Assets that are currently allocated and thus CAN be transferred
  const allocatedAssets = assets.filter(a => a.status === 'Allocated');

  const columns = [
    {
      header: 'Asset Details',
      accessor: 'assetName',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.assetName}</div>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{row.assetTag}</span>
        </div>
      )
    },
    {
      header: 'Source Custodian',
      accessor: 'sourceEmployeeName',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.sourceEmployeeName || 'Unassigned'}</div>
          <span className="text-[9px] text-brand-secondaryText block">{row.sourceDepartment}</span>
        </div>
      )
    },
    {
      header: 'Target Custodian',
      accessor: 'targetEmployeeName',
      render: (row) => (
        <div>
          <div className="font-semibold text-indigo-300">{row.targetEmployeeName}</div>
          <span className="text-[9px] text-brand-secondaryText block">{row.targetDepartment}</span>
        </div>
      )
    },
    {
      header: 'Request Date',
      accessor: 'requestDate',
      render: (row) => <span className="font-mono text-slate-400">{row.requestDate}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => {
        if (row.status !== 'Pending') {
          return <span className="text-[10px] text-slate-600 font-semibold italic">Processed</span>;
        }

        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleApprove(row.id)}
              className="p-1.5 bg-brand-success/15 border border-brand-success/20 text-brand-success hover:bg-brand-success hover:text-white rounded-lg transition-all"
              title="Approve Transfer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleReject(row.id)}
              className="p-1.5 bg-brand-danger/15 border border-brand-danger/20 text-brand-danger hover:bg-brand-danger hover:text-white rounded-lg transition-all"
              title="Reject Transfer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Transfer Management</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Review custodian trade requests or request device updates.</p>
        </div>
        <PrimaryButton onClick={() => setIsRequestOpen(true)} icon={ArrowRightLeft} className="text-xs">
          Request Transfer
        </PrimaryButton>
      </div>

      {/* Transfers Data Table */}
      <DataTable
        columns={columns}
        data={transfers}
        searchPlaceholder="Search transfers..."
        searchKeys={['assetName', 'assetTag', 'sourceEmployeeName', 'targetEmployeeName', 'status']}
        itemsPerPage={6}
      />

      {/* Drawer Form */}
      <Drawer
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        title="Create Transfer Request"
        size="md"
      >
        <form onSubmit={handleSubmitRequest} className="flex flex-col gap-5">
          <Select
            label="Select Active Asset"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            required
          >
            <option value="">-- Choose currently deployed device --</option>
            {allocatedAssets.map(ast => {
              const holder = employees.find(e => e.id === ast.currentHolderId);
              return (
                <option key={ast.id} value={ast.id}>
                  {ast.name} ({ast.assetTag}) - Held by {holder?.name || 'Unknown'}
                </option>
              );
            })}
          </Select>

          <Select
            label="Select Recipient Employee"
            value={selectedTargetEmpId}
            onChange={(e) => setSelectedTargetEmpId(e.target.value)}
            required
          >
            <option value="">-- Choose recipient --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department} - {emp.role})</option>
            ))}
          </Select>

          <Textarea
            label="Transfer Notes / Business Case"
            placeholder="Provide context on why this item is transferring..."
            value={transferNotes}
            onChange={(e) => setTransferNotes(e.target.value)}
            rows={4}
            required
          />

          <div className="flex gap-2.5 mt-3">
            <SecondaryButton type="button" onClick={() => setIsRequestOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" className="flex-1 text-xs py-2">
              Submit Request
            </PrimaryButton>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
