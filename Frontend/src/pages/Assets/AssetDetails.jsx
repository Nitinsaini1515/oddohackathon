import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  User,
  History,
  Settings,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import Badge from '../../components/ui/badges/Badge';
import Avatar from '../../components/ui/avatars/Avatar';

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, employees } = useMockState();

  // Find asset
  const asset = React.useMemo(() => {
    return assets.find(a => a.id === id);
  }, [assets, id]);

  // Find holder details
  const holder = React.useMemo(() => {
    if (!asset || !asset.currentHolderId) return null;
    return employees.find(e => e.id === asset.currentHolderId);
  }, [asset, employees]);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 glass-panel rounded-2xl max-w-md mx-auto my-12 border border-brand-border/40">
        <AlertCircle className="w-12 h-12 text-brand-danger mb-4 animate-bounce" />
        <h3 className="text-base font-bold text-white">Asset Not Found</h3>
        <p className="text-xs text-brand-secondaryText mt-2">
          The requested asset record ID <span className="font-mono text-white">"{id}"</span> does not exist or has been deleted.
        </p>
        <Link to="/dashboard/assets" className="mt-6">
          <SecondaryButton className="text-xs" icon={ArrowLeft}>Back to Asset List</SecondaryButton>
        </Link>
      </div>
    );
  }

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
          <h2 className="text-xl font-bold text-white tracking-tight">{asset.name}</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Detailed inventory record & lifecycle audit tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: LARGE GRAPHIC & SPECS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Card containing Image & details */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-brand-border/40 bg-slate-900/40">
            {/* Banner image */}
            <div className="h-64 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-brand-border/30 relative">
              <img
                src={asset.image || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80'}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={
                  asset.condition === 'New' || asset.condition === 'Good' ? 'success' :
                  asset.condition === 'Fair' ? 'warning' : 'danger'
                }>
                  {asset.condition}
                </Badge>
                <Badge variant={
                  asset.status === 'Available' ? 'success' :
                  asset.status === 'Allocated' ? 'info' :
                  asset.status === 'Under Maintenance' ? 'warning' : 'gray'
                }>
                  {asset.status}
                </Badge>
              </div>
            </div>

            {/* Core specs details row */}
            <div className="p-6">
              <span className="text-[10px] bg-slate-950 border border-brand-border text-brand-secondaryText px-2 py-0.5 rounded-md font-mono font-bold">
                {asset.assetTag}
              </span>
              <h3 className="text-lg font-extrabold text-white mt-2 leading-tight">{asset.name}</h3>
              <p className="text-xs text-brand-secondaryText mt-1.5 leading-relaxed">{asset.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-brand-border/20 text-xs font-semibold text-brand-secondaryText">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Serial Number</span>
                  <span className="text-white font-mono block">{asset.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Location</span>
                  <span className="text-white block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" /> {asset.location}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Purchase Cost</span>
                  <span className="text-white block flex items-center gap-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-brand-success" /> {asset.purchaseCost}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1">Procured Date</span>
                  <span className="text-white block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" /> {asset.purchaseDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical specifications table */}
          <div className="glass-panel rounded-2xl p-6 border border-brand-border/40 bg-slate-900/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" /> Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-brand-secondaryText">
              {Object.keys(asset.specifications || {}).map((specKey) => (
                <div key={specKey} className="p-3.5 bg-slate-950/40 border border-brand-border/40 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">{specKey}</span>
                  <span className="text-white font-bold">{asset.specifications[specKey]}</span>
                </div>
              ))}
              {(!asset.specifications || Object.keys(asset.specifications).length === 0) && (
                <div className="col-span-2 text-center py-4 text-slate-500 italic">
                  No technical configurations logged for this category.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CURRENT HOLDER & TIMELINE */}
        <div className="flex flex-col gap-6">
          
          {/* Holder status */}
          <div className="glass-panel rounded-2xl p-5 border border-brand-border/40 bg-slate-900/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-brand-primary" /> Allocation Status
            </h3>

            {holder ? (
              <div className="flex items-center gap-3.5 p-3 bg-slate-950/40 border border-brand-border/40 rounded-xl">
                <Avatar name={holder.name} size="lg" />
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{holder.name}</span>
                  <span className="text-[10px] text-brand-secondaryText font-medium block mt-1">{holder.role} • {holder.department}</span>
                  <span className="text-[9px] text-slate-500 font-medium block mt-1">{holder.email}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-brand-border/40 rounded-xl text-xs text-brand-secondaryText bg-slate-950/10">
                <p className="font-semibold text-brand-success">In Stock (Available)</p>
                <p className="text-[10px] mt-1">This equipment is ready for deployment.</p>
              </div>
            )}
          </div>

          {/* Audit Log timeline history */}
          <div className="glass-panel rounded-2xl p-5 border border-brand-border/40 bg-slate-900/40 flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-brand-primary" /> Audit Log Timeline
            </h3>

            <div className="flex-1 flex flex-col gap-5 overflow-y-auto max-h-[350px] custom-scrollbar pr-1 relative pl-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-brand-border/60">
              {(asset.history || []).map((step, idx) => (
                <div key={idx} className="relative text-xs">
                  {/* Stepper Dot */}
                  <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full border border-brand-bg bg-brand-primary shadow-glow-primary" />
                  
                  <div>
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{step.event}</span>
                      <span className="text-[9px] text-slate-500 font-semibold">{step.date}</span>
                    </div>
                    <p className="text-[10px] text-brand-secondaryText mt-1 leading-relaxed">
                      {step.notes}
                    </p>
                    <span className="text-[9px] text-brand-primary font-bold block mt-1">Operator: {step.user}</span>
                  </div>
                </div>
              ))}
              {(!asset.history || asset.history.length === 0) && (
                <div className="text-center py-6 text-slate-500 italic">
                  No logs available for this resource.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
