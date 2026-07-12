import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PackagePlus,
  ArrowRight,
  ArrowLeft,
  Upload,
  Eye,
  Settings,
  Calendar,
  DollarSign,
  Tag,
  MapPin,
  Laptop
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import TextInput from '../../components/ui/inputs/TextInput';
import Select from '../../components/ui/inputs/Select';
import Textarea from '../../components/ui/inputs/Textarea';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import Badge from '../../components/ui/badges/Badge';

export default function AssetRegistration() {
  const navigate = useNavigate();
  const { categories, employees, addAsset } = useMockState();
  const [section, setSection] = useState(1); // 1 = Basics, 2 = Purchase Info, 3 = Assignment
  const [imgPreview, setImgPreview] = useState('');

  // Setup form values
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      serialNumber: '',
      purchaseCost: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      condition: 'New',
      status: 'Available',
      location: 'HQ - New York',
      currentHolderId: ''
    }
  });

  // Watch fields for live preview card updating
  const watchName = watch('name');
  const watchCategory = watch('category');
  const watchCondition = watch('condition');
  const watchStatus = watch('status');
  const watchLocation = watch('location');
  const watchSerial = watch('serialNumber');
  const watchCost = watch('purchaseCost');

  // Set default sample image based on category selection
  useEffect(() => {
    if (!watchCategory) return;
    const catImages = {
      'Laptops & Workstations': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'Servers & Networking': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      'Mobile & Tablet Devices': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      'Monitors & Displays': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'Office Furniture': 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    };
    setImgPreview(catImages[watchCategory] || '');
  }, [watchCategory]);

  const onSubmit = (data) => {
    const code = categories.find(c => c.name === data.category)?.code || 'GEN';
    const tag = `AST-${code}-${Math.floor(100 + Math.random() * 900)}`;

    addAsset({
      name: data.name,
      category: data.category,
      description: data.description,
      serialNumber: data.serialNumber,
      purchaseCost: data.purchaseCost ? `$${data.purchaseCost}` : '$0',
      purchaseDate: data.purchaseDate,
      condition: data.condition,
      status: data.status,
      location: data.location,
      currentHolderId: data.currentHolderId || null,
      image: imgPreview || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
      specifications: {
        Processor: data.category === 'Laptops & Workstations' ? 'Intel i7 / Apple M3' : 'Enterprise Standard',
        Memory: 'Standard Profile'
      }
    });

    toast.success('Asset registered successfully in local database!', {
      style: {
        background: '#111827',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }
    });
    navigate('/dashboard/assets');
  };

  const nextSection = (e) => {
    e.preventDefault();
    if (section === 1) {
      if (!watchName || !watchCategory) {
        toast.error('Please enter name and category');
        return;
      }
    }
    setSection(s => s + 1);
  };

  const prevSection = (e) => {
    e.preventDefault();
    setSection(s => s - 1);
  };

  const categoryOptions = categories.map(c => ({ value: c.name, label: c.name }));
  const employeeOptions = employees.map(e => ({ value: e.id, label: `${e.name} (${e.department})` }));

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/assets"
          className="p-2 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover rounded-xl text-brand-secondaryText hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Register Asset</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Enroll new equipment, serial logs, and locations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* WIZARD FORM COLUMN */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 md:p-6 border border-brand-border/40 bg-[#0F172A]/40">
          
          {/* Progress Indicators */}
          <div className="flex items-center gap-4 mb-8">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              section >= 1 ? 'bg-brand-primary border-brand-primary text-white shadow-glow-primary' : 'border-slate-800 text-brand-secondaryText'
            }`}>
              1. Basics
            </span>
            <div className="h-px bg-brand-border/40 flex-1" />
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              section >= 2 ? 'bg-brand-primary border-brand-primary text-white shadow-glow-primary' : 'border-slate-800 text-brand-secondaryText'
            }`}>
              2. Specs
            </span>
            <div className="h-px bg-brand-border/40 flex-1" />
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              section >= 3 ? 'bg-brand-primary border-brand-primary text-white shadow-glow-primary' : 'border-slate-800 text-brand-secondaryText'
            }`}>
              3. Assign
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* SECTION 1: BASICS */}
            {section === 1 && (
              <div className="flex flex-col gap-4">
                <TextInput
                  label="Asset Model Name"
                  placeholder="e.g. MacBook Pro 16"
                  required
                  error={errors.name?.message}
                  {...register('name', { required: 'Asset name is required' })}
                />
                
                <Select
                  label="Asset Category"
                  placeholder="Select Category..."
                  options={categoryOptions}
                  required
                  error={errors.category?.message}
                  {...register('category', { required: 'Category is required' })}
                />

                <TextInput
                  label="Simulated Image Link (URL)"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={imgPreview}
                  onChange={(e) => setImgPreview(e.target.value)}
                />

                <Textarea
                  label="Asset Description"
                  placeholder="Details, spec logs, hardware tags..."
                  error={errors.description?.message}
                  {...register('description')}
                />
                
                <div className="flex justify-end mt-4">
                  <PrimaryButton onClick={nextSection} className="text-xs px-6" icon={ArrowRight}>
                    Next Specs
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* SECTION 2: PURCHASE & SPECS */}
            {section === 2 && (
              <div className="flex flex-col gap-4">
                <TextInput
                  label="Serial Number (S/N)"
                  placeholder="e.g. C02F9X8GMD6T"
                  error={errors.serialNumber?.message}
                  required
                  {...register('serialNumber', { required: 'Serial number is required' })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Purchase Price ($)"
                    type="number"
                    placeholder="e.g. 2499"
                    error={errors.purchaseCost?.message}
                    {...register('purchaseCost')}
                  />
                  <TextInput
                    label="Procured Date"
                    type="date"
                    error={errors.purchaseDate?.message}
                    {...register('purchaseDate')}
                  />
                </div>

                <Select
                  label="Asset Condition"
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'Good', label: 'Good' },
                    { value: 'Fair', label: 'Fair' },
                    { value: 'Poor', label: 'Poor' },
                    { value: 'Broken', label: 'Broken' }
                  ]}
                  error={errors.condition?.message}
                  {...register('condition')}
                />

                <div className="flex justify-between mt-4">
                  <SecondaryButton onClick={prevSection} className="text-xs px-5">Back</SecondaryButton>
                  <PrimaryButton onClick={nextSection} className="text-xs px-5" icon={ArrowRight}>Next Allocation</PrimaryButton>
                </div>
              </div>
            )}

            {/* SECTION 3: ALLOCATION & LOCATION */}
            {section === 3 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Warehouse / Location"
                    options={[
                      { value: 'HQ - New York', label: 'HQ - New York' },
                      { value: 'Branch - San Francisco', label: 'Branch - San Francisco' },
                      { value: 'Remote - UK', label: 'Remote - UK' },
                      { value: 'Data Center - Virginia', label: 'Data Center - Virginia' }
                    ]}
                    error={errors.location?.message}
                    {...register('location')}
                  />
                  <Select
                    label="Asset Status"
                    options={[
                      { value: 'Available', label: 'Available' },
                      { value: 'Allocated', label: 'Allocated' },
                      { value: 'Under Maintenance', label: 'Under Maintenance' }
                    ]}
                    error={errors.status?.message}
                    {...register('status')}
                  />
                </div>

                {watchStatus === 'Allocated' && (
                  <Select
                    label="Assign to Employee"
                    placeholder="Select assignee..."
                    options={employeeOptions}
                    error={errors.currentHolderId?.message}
                    required
                    {...register('currentHolderId', { required: 'Please specify an assignee' })}
                  />
                )}

                <div className="flex justify-between mt-4">
                  <SecondaryButton onClick={prevSection} className="text-xs px-5">Back</SecondaryButton>
                  <PrimaryButton type="submit" className="text-xs px-6 font-bold" icon={PackagePlus}>
                    Register Record
                  </PrimaryButton>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* LIVE PREVIEW COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-4 sticky top-6">
          <div className="flex items-center gap-1.5 text-xs text-brand-secondaryText font-bold uppercase tracking-widest pl-1">
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </div>

          <div className="glass-panel border border-brand-border/40 rounded-2xl overflow-hidden bg-slate-900/60 shadow-premium">
            {/* Image banner */}
            <div className="h-44 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-brand-border/30 relative">
              {imgPreview ? (
                <img src={imgPreview} alt="Asset" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-700">
                  <Laptop className="w-12 h-12" />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-wider">No image specified</span>
                </div>
              )}
              <div className="absolute top-3.5 left-3.5">
                <Badge variant={
                  watchCondition === 'New' || watchCondition === 'Good' ? 'success' :
                  watchCondition === 'Fair' ? 'warning' : 'danger'
                }>
                  {watchCondition}
                </Badge>
              </div>
              <div className="absolute top-3.5 right-3.5">
                <Badge variant={
                  watchStatus === 'Available' ? 'success' :
                  watchStatus === 'Allocated' ? 'info' : 'warning'
                }>
                  {watchStatus}
                </Badge>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex flex-col gap-4.5">
              <div>
                <span className="text-[10px] bg-slate-950 border border-brand-border text-brand-secondaryText px-2 py-0.5 rounded-md font-mono w-fit font-bold">
                  {watchCategory ? `AST-${categories.find(c => c.name === watchCategory)?.code || 'GEN'}-###` : 'AST-GEN-###'}
                </span>
                <h3 className="text-base font-bold text-white mt-2 truncate leading-tight">
                  {watchName || 'Untitled Asset Model'}
                </h3>
                <p className="text-[10px] text-brand-secondaryText font-medium mt-1 uppercase tracking-wide">
                  {watchCategory || 'Uncategorized Group'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-[11px] font-semibold text-brand-secondaryText border-t border-brand-border/30 pt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>{watchLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-600" />
                  <span className="truncate">{watchSerial || 'No S/N Logged'}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <DollarSign className="w-3.5 h-3.5 text-brand-success" />
                  <span className="text-white font-bold">${watchCost || '0'} purchase valuation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
