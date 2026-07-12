import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  SlidersHorizontal,
  MapPin,
  Laptop,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import DangerButton from '../../components/ui/buttons/DangerButton';
import SearchInput from '../../components/ui/inputs/SearchInput';
import Select from '../../components/ui/inputs/Select';
import TextInput from '../../components/ui/inputs/TextInput';
import Textarea from '../../components/ui/inputs/Textarea';
import Modal from '../../components/ui/modals/Modal';
import Badge from '../../components/ui/badges/Badge';
import Pagination from '../../components/ui/common/Pagination';
import EmptyState from '../../components/ui/common/EmptyState';

export default function AssetList() {
  const navigate = useNavigate();
  const {
    assets,
    categories,
    employees,
    updateAsset,
    deleteAsset
  } = useMockState();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [condFilter, setCondFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState(null);

  // Edit form setup
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    watch: watchEdit,
    formState: { errors: errorsEdit }
  } = useForm();

  const watchEditStatus = watchEdit('status');

  // Filtered Assets logic
  const filteredAssets = React.useMemo(() => {
    return assets.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.assetTag.toLowerCase().includes(search.toLowerCase()) ||
                          a.serialNumber.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter ? a.category === catFilter : true;
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      const matchCond = condFilter ? a.condition === condFilter : true;
      return matchSearch && matchCat && matchStatus && matchCond;
    });
  }, [assets, search, catFilter, statusFilter, condFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAssets.slice(start, start + itemsPerPage);
  }, [filteredAssets, currentPage]);

  const onEditSubmit = (data) => {
    updateAsset({
      id: activeAsset.id,
      name: data.name,
      category: data.category,
      serialNumber: data.serialNumber,
      purchaseCost: data.purchaseCost,
      condition: data.condition,
      status: data.status,
      location: data.location,
      currentHolderId: data.status === 'Allocated' ? data.currentHolderId : null
    });
    setEditOpen(false);
    toast.success('Asset details updated!');
  };

  const openEditModal = (asset) => {
    setActiveAsset(asset);
    setEditValue('name', asset.name);
    setEditValue('category', asset.category);
    setEditValue('serialNumber', asset.serialNumber);
    setEditValue('purchaseCost', asset.purchaseCost);
    setEditValue('condition', asset.condition);
    setEditValue('status', asset.status);
    setEditValue('location', asset.location);
    setEditValue('currentHolderId', asset.currentHolderId || '');
    setEditOpen(true);
  };

  const openDeleteModal = (asset) => {
    setActiveAsset(asset);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteAsset(activeAsset.id);
    setDeleteOpen(false);
    toast.success('Asset removed from inventory database.');
  };

  // Option lists
  const categoryOptions = categories.map(c => ({ value: c.name, label: c.name }));
  const employeeOptions = employees.map(e => ({ value: e.id, label: e.name }));

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Assets List</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Audit, edit, and assign hardware inventories.</p>
        </div>
        <Link to="/dashboard/assets/new">
          <PrimaryButton className="text-xs" icon={Plus}>
            Register Asset
          </PrimaryButton>
        </Link>
      </div>

      {/* Toolbar Search / Filter */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-950/20 border border-brand-border/40 p-4 rounded-2xl">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          onClear={() => setSearch('')}
          placeholder="Search by model, tag, S/N..."
          className="w-full sm:w-64"
        />

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <Select
            placeholder="All Categories"
            options={categoryOptions}
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-40 text-xs py-2 bg-slate-900/60"
          />

          {/* Status Filter */}
          <Select
            placeholder="All Statuses"
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Allocated', label: 'Allocated' },
              { value: 'Under Maintenance', label: 'Under Maintenance' }
            ]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-36 text-xs py-2 bg-slate-900/60"
          />

          {/* Condition Filter */}
          <Select
            placeholder="All Conditions"
            options={[
              { value: 'New', label: 'New' },
              { value: 'Good', label: 'Good' },
              { value: 'Fair', label: 'Fair' },
              { value: 'Poor', label: 'Poor' },
              { value: 'Broken', label: 'Broken' }
            ]}
            value={condFilter}
            onChange={(e) => { setCondFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-36 text-xs py-2 bg-slate-900/60"
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredAssets.length > 0 ? (
        <div className="glass-panel border border-brand-border/40 rounded-2xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border/30 text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider bg-slate-900/20">
                  <th className="py-4 px-6">Asset Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Condition</th>
                  <th className="py-4 px-6">Assignee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/10 text-xs text-brand-secondaryText font-semibold">
                {paginatedAssets.map((a) => {
                  const assignee = employees.find(e => e.id === a.currentHolderId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <Link to={`/dashboard/assets/${a.id}`} className="font-bold text-white hover:text-brand-primary transition-colors block">
                            {a.name}
                          </Link>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{a.assetTag}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white">{a.category}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-600" />
                          <span>{a.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={
                          a.condition === 'New' || a.condition === 'Good' ? 'success' :
                          a.condition === 'Fair' ? 'warning' : 'danger'
                        }>
                          {a.condition}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-[9px] text-white">
                              {assignee.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <span className="text-white font-bold">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={
                          a.status === 'Available' ? 'success' :
                          a.status === 'Allocated' ? 'info' :
                          a.status === 'Under Maintenance' ? 'warning' : 'gray'
                        }>
                          {a.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/dashboard/assets/${a.id}`}
                            className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditModal(a)}
                            className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(a)}
                            className="p-1.5 border border-brand-border bg-red-950/10 hover:bg-brand-danger/20 text-brand-danger rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredAssets.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No assets matching filters"
          description="Adjust your search query, status filters, or add a new asset configuration record."
          actionLabel="Register Asset"
          onActionClick={() => navigate('/dashboard/assets/new')}
        />
      )}

      {/* EDIT ASSET DETAILS MODAL */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Modify Asset Records" size="md">
        <form onSubmit={handleEditSubmit(onEditSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Asset Model Name"
            placeholder="e.g. MacBook Pro 16"
            error={errorsEdit.name?.message}
            required
            {...registerEdit('name', { required: 'Name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              placeholder="Select Category..."
              options={categoryOptions}
              error={errorsEdit.category?.message}
              required
              {...registerEdit('category', { required: 'Category is required' })}
            />
            <TextInput
              label="Serial Number (S/N)"
              placeholder="e.g. C02F9X..."
              error={errorsEdit.serialNumber?.message}
              required
              {...registerEdit('serialNumber', { required: 'Serial number is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Location"
              options={[
                { value: 'HQ - New York', label: 'HQ - New York' },
                { value: 'Branch - San Francisco', label: 'Branch - San Francisco' },
                { value: 'Remote - UK', label: 'Remote - UK' },
                { value: 'Data Center - Virginia', label: 'Data Center - Virginia' }
              ]}
              error={errorsEdit.location?.message}
              {...registerEdit('location')}
            />
            <TextInput
              label="Valuation Cost ($)"
              placeholder="e.g. $2,499"
              error={errorsEdit.purchaseCost?.message}
              {...registerEdit('purchaseCost')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Condition"
              options={[
                { value: 'New', label: 'New' },
                { value: 'Good', label: 'Good' },
                { value: 'Fair', label: 'Fair' },
                { value: 'Poor', label: 'Poor' },
                { value: 'Broken', label: 'Broken' }
              ]}
              error={errorsEdit.condition?.message}
              {...registerEdit('condition')}
            />
            <Select
              label="Status"
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'Allocated', label: 'Allocated' },
                { value: 'Under Maintenance', label: 'Under Maintenance' }
              ]}
              error={errorsEdit.status?.message}
              {...registerEdit('status')}
            />
          </div>

          {watchEditStatus === 'Allocated' && (
            <Select
              label="Assigned Holder"
              placeholder="Select assignee..."
              options={employeeOptions}
              error={errorsEdit.currentHolderId?.message}
              required
              {...registerEdit('currentHolderId', { required: 'Please specify an assignee' })}
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setEditOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs">Save Changes</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="De-register Asset" size="sm">
        <div className="flex flex-col gap-4 text-center">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-brand-danger rounded-full w-fit mx-auto">
            <Trash2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">De-register Asset?</h4>
            <p className="text-xs text-brand-secondaryText mt-1.5 leading-relaxed">
              This will remove the item <span className="font-semibold text-white">"{activeAsset?.name}"</span> ({activeAsset?.assetTag}) 
              permanently from the inventory databases. This action cannot be reverted.
            </p>
          </div>
          <div className="flex gap-3.5 mt-4">
            <SecondaryButton onClick={() => setDeleteOpen(false)} className="w-full text-xs">Cancel</SecondaryButton>
            <DangerButton onClick={handleDeleteConfirm} className="w-full text-xs">Confirm Delete</DangerButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
