import React, { useState } from 'react';
import { Wrench, ShieldAlert, Plus, User, Clock, Image, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import PriorityBadge from '../../components/ui/badges/PriorityBadge';
import Select from '../../components/ui/inputs/Select';
import Textarea from '../../components/ui/inputs/Textarea';
import Timeline from '../../components/ui/common/Timeline';
import toast from 'react-hot-toast';

export default function MaintenancePage() {
  const {
    maintenance,
    assets,
    employees,
    raiseMaintenance,
    updateMaintenanceStatus
  } = useMockState();

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form states
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [mockImgUploaded, setMockImgUploaded] = useState(false);

  // Workflow update states
  const [nextStatus, setNextStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [assignedTech, setAssignedTech] = useState('');

  const handleRaiseRequest = (e) => {
    e.preventDefault();
    if (!selectedAssetId || !description) {
      toast.error('Asset and description are required.');
      return;
    }

    const mockImage = mockImgUploaded ? 'https://images.unsplash.com/photo-1597872200969-2b65dffc0e33?auto=format&fit=crop&w=400&q=80' : null;
    raiseMaintenance(selectedAssetId, priority, description, mockImage);

    // Reset Form
    setSelectedAssetId('');
    setPriority('Medium');
    setDescription('');
    setMockImgUploaded(false);
    setIsRequestOpen(false);
    toast.success('Maintenance ticket created successfully!');
  };

  const handleUpdateWorkflow = (e) => {
    e.preventDefault();
    if (!selectedTicket || !nextStatus) return;

    updateMaintenanceStatus(selectedTicket.id, nextStatus, updateNotes, assignedTech);
    
    // Refresh modal info
    const updated = {
      ...selectedTicket,
      status: nextStatus,
      technician: assignedTech || selectedTicket.technician,
      timeline: [
        ...(selectedTicket.timeline || []),
        { date: new Date().toISOString().split('T')[0], status: nextStatus, notes: updateNotes }
      ]
    };
    setSelectedTicket(updated);
    
    setNextStatus('');
    setUpdateNotes('');
    setAssignedTech('');
    toast.success('Workflow ticket updated!');
  };

  // Assets that are available or allocated (meaning they can go into maintenance)
  const logicalAssets = assets.filter(a => a.status !== 'Under Maintenance');

  // Technician staff options (e.g. from engineering/IT department employees)
  const technicians = employees.filter(e => e.department === 'Information Technology' || e.department === 'Engineering');

  const columns = [
    {
      header: 'Asset Name',
      accessor: 'assetName',
      render: (row) => (
        <div>
          <div className="font-bold text-white hover:text-brand-primary transition-colors cursor-pointer" onClick={() => { setSelectedTicket(row); setIsDetailsOpen(true); }}>
            {row.assetName}
          </div>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{row.assetTag}</span>
        </div>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: 'Date Opened',
      accessor: 'requestDate',
      render: (row) => <span className="font-mono text-slate-400">{row.requestDate}</span>
    },
    {
      header: 'Assigned Tech',
      accessor: 'technician',
      render: (row) => (
        <span className="font-semibold text-white">{row.technician || 'Not Assigned'}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => { setSelectedTicket(row); setIsDetailsOpen(true); }}
          className="text-[10px] uppercase font-bold text-brand-primary hover:text-white transition-colors"
        >
          Track Workflow
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Maintenance Servicing</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Open repair tickets, route hardware to specialists, and track resolution timelines.</p>
        </div>
        <PrimaryButton onClick={() => setIsRequestOpen(true)} icon={Wrench} className="text-xs">
          Raise Ticket
        </PrimaryButton>
      </div>

      {/* Tickets List */}
      <DataTable
        columns={columns}
        data={maintenance}
        searchPlaceholder="Search maintenance tickets..."
        searchKeys={['assetName', 'assetTag', 'priority', 'status', 'technician']}
        itemsPerPage={6}
      />

      {/* Raise Ticket Drawer */}
      <Drawer
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        title="File Maintenance Ticket"
        size="md"
      >
        <form onSubmit={handleRaiseRequest} className="flex flex-col gap-5">
          <Select
            label="Select Impacted Asset"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            required
          >
            <option value="">-- Choose device --</option>
            {logicalAssets.map(ast => (
              <option key={ast.id} value={ast.id}>{ast.name} ({ast.assetTag})</option>
            ))}
          </Select>

          <Select
            label="Severity / Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="Low">Low (Minor casing scratches, cosmetic)</option>
            <option value="Medium">Medium (Software issues, battery wear)</option>
            <option value="High">High (Dead keys, port failure, flickering screen)</option>
            <option value="Critical">Critical (System won't boot, data loop)</option>
          </Select>

          <Textarea
            label="Describe Malfunction Details"
            placeholder="What steps lead to this failure? What symptoms are visible?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />

          {/* Simulate camera screenshot upload */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-brand-secondaryText">Attach Image / Screenshot</span>
            <button
              type="button"
              onClick={() => {
                setMockImgUploaded(true);
                toast.success('Simulated device photo uploaded!');
              }}
              className="flex items-center justify-center gap-2 p-3.5 border border-dashed border-brand-border hover:border-indigo-500 rounded-xl hover:bg-slate-900/40 text-brand-secondaryText hover:text-white transition-all"
            >
              <Image className="w-5 h-5 text-slate-500" />
              <span className="text-xs">
                {mockImgUploaded ? 'device_attachment_img.png Uploaded' : 'Upload photo of hardware fault (Click)'}
              </span>
            </button>
          </div>

          <div className="flex gap-2.5 mt-3">
            <SecondaryButton type="button" onClick={() => setIsRequestOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" className="flex-1 text-xs py-2">
              Open Ticket
            </PrimaryButton>
          </div>
        </form>
      </Drawer>

      {/* Ticket Details & Workflow Tracker Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTicket(null);
        }}
        title="Repair Lifecycle Tracker"
        size="lg"
      >
        {selectedTicket && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Left side: status & action forms */}
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-[#111827] rounded-xl border border-brand-border flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{selectedTicket.assetName}</h4>
                  <span className="text-[10px] text-brand-secondaryText font-mono block mt-0.5">{selectedTicket.assetTag}</span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={selectedTicket.status} />
                  <PriorityBadge priority={selectedTicket.priority} />
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Malfunction Description</h5>
                <p className="p-3.5 bg-slate-900/60 rounded-xl border border-brand-border/40 text-brand-secondaryText leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Show attached image preview if uploaded */}
              {selectedTicket.images && selectedTicket.images.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fault Screenshot</h5>
                  <div className="rounded-xl overflow-hidden border border-brand-border max-h-[160px]">
                    <img
                      src={selectedTicket.images[0]}
                      alt="Fault description screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Advance workflow status form (Only if not resolved) */}
              {selectedTicket.status !== 'Resolved' ? (
                <form onSubmit={handleUpdateWorkflow} className="flex flex-col gap-4 p-4 border border-brand-border/60 bg-slate-900/35 rounded-xl">
                  <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1">
                    Update Repair Workflow State
                  </h5>
                  
                  <Select
                    label="Transition State To"
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value)}
                    required
                  >
                    <option value="">-- Choose state transition --</option>
                    <option value="Approved">Approve (Ticket Confirmed)</option>
                    <option value="Technician Assigned">Assign Technician</option>
                    <option value="In Progress">Move to Repair Shop / In Progress</option>
                    <option value="Resolved">Resolved (Mark Asset Available)</option>
                    <option value="Rejected">Rejected</option>
                  </Select>

                  {nextStatus === 'Technician Assigned' && (
                    <Select
                      label="Assign IT Tech"
                      value={assignedTech}
                      onChange={(e) => setAssignedTech(e.target.value)}
                      required
                    >
                      <option value="">-- Choose specialist --</option>
                      {technicians.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                      ))}
                    </Select>
                  )}

                  <Textarea
                    label="Workflow Log Message"
                    placeholder="Update comments for this phase..."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    rows={2}
                    required
                  />

                  <PrimaryButton type="submit" className="text-xs py-1.5 w-full">
                    Confirm Transition
                  </PrimaryButton>
                </form>
              ) : (
                <div className="p-4 border border-brand-success/20 bg-brand-success/5 rounded-xl text-brand-success flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">This repair ticket has been resolved and closed.</span>
                </div>
              )}
            </div>

            {/* Right side: vertical repair timeline */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ticket Log Timeline</h5>
              <div className="overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
                <Timeline
                  items={(selectedTicket.timeline || []).map(t => ({
                    date: t.date,
                    title: `Transitioned: ${t.status}`,
                    description: t.notes,
                    user: selectedTicket.technician || 'Admin',
                    icon: Wrench,
                    status: t.status
                  }))}
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
