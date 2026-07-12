import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, HelpCircle, Layers, MapPin, Zap } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import Select from '../../components/ui/inputs/Select';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import toast from 'react-hot-toast';

export default function RecommendationsV4() {
  const { assets } = useMockState();

  const [selectedAssetId, setSelectedAssetId] = useState('');

  // Find selected asset
  const targetAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId);
  }, [assets, selectedAssetId]);

  // Compute recommendation suggestions
  const recommendation = useMemo(() => {
    if (!targetAsset) return null;
    
    // Check if target asset is allocated or busy (i.e. unavailable)
    const isUnavailable = targetAsset.status !== 'Available';

    // Find similar assets in same category
    const categoryAlternatives = assets.filter(a => a.category === targetAsset.category && a.id !== targetAsset.id);
    const availableCategoryAlts = categoryAlternatives.filter(a => a.status === 'Available');

    // Pick recommendations
    const suggested = availableCategoryAlts[0] || categoryAlternatives[0] || null;
    const alternative = availableCategoryAlts[1] || categoryAlternatives[1] || null;
    
    // Proximity check: nearest device in same datacenter/branch
    const nearest = assets.find(a => a.location === targetAsset.location && a.status === 'Available' && a.id !== targetAsset.id);

    return {
      isUnavailable,
      suggested,
      alternative,
      nearest,
      confidence: isUnavailable ? 94 : 100,
      matchReason: `Matches specs of ${targetAsset.name} and is currently available at ${nearest?.location || 'New York Branch'}.`
    };
  }, [targetAsset, assets]);

  const handleCheckoutAlt = (altAsset) => {
    if (!altAsset) return;
    toast.success(`Alternative recommendation approved: Deploying ${altAsset.name}!`);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-brand-accent animate-pulse" />
            <span>AI Alternative Matching Engine</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Smart predictive replacement engine computes nearest coordinates and config matches when devices are fully deployed.</p>
        </div>
      </div>

      {/* Select target device */}
      <div className="glass-panel border border-brand-border/40 p-5 rounded-2xl bg-slate-950/20 max-w-xl">
        <Select
          label="Test Recommendation: Choose Target Hardware"
          value={selectedAssetId}
          onChange={(e) => setSelectedAssetId(e.target.value)}
        >
          <option value="">-- Choose device to query --</option>
          {assets.map(a => (
            <option key={a.id} value={a.id}>{a.name} ({a.assetTag} - {a.status})</option>
          ))}
        </Select>
      </div>

      <AnimatePresence mode="wait">
        {recommendation ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Core Recommendation Card */}
            <div className="lg:col-span-2 glass-panel p-5.5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4.5">
              <div className="flex items-center justify-between border-b border-brand-border/20 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-brand-accent" /> AI Suggestion Matching Report
                </h3>
                <span className="text-[10px] font-black text-brand-success bg-brand-success/10 border border-brand-success/20 px-2 py-0.5 rounded-full">
                  {recommendation.confidence}% Match Confidence
                </span>
              </div>

              {recommendation.isUnavailable ? (
                <div className="p-3.5 rounded-xl border border-brand-warning/20 bg-brand-warning/5 text-xs text-brand-secondaryText leading-relaxed">
                  <strong>Notice:</strong> The selected device is currently <span className="text-brand-warning font-bold">Allocated / Busy</span>. Suggesting alternative optimal reserve stock setups.
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-brand-success/20 bg-brand-success/5 text-xs text-brand-secondaryText leading-relaxed">
                  <strong>Ready:</strong> Target device is currently <span className="text-brand-success font-bold">Available</span>. No replacement override needed.
                </div>
              )}

              {/* Suggestions panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* 1. Category Alt */}
                {recommendation.suggested && (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 flex flex-col justify-between gap-3 group">
                    <div>
                      <span className="text-[8px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Standard Replacement</span>
                      <h4 className="font-bold text-white leading-tight truncate">{recommendation.suggested.name}</h4>
                      <span className="text-[9px] text-brand-secondaryText font-mono mt-0.5 block">{recommendation.suggested.assetTag}</span>
                    </div>
                    <button
                      onClick={() => handleCheckoutAlt(recommendation.suggested)}
                      className="w-full py-1.5 bg-brand-primary/10 hover:bg-brand-primary text-white border border-brand-primary/20 hover:border-transparent text-[10px] font-bold rounded-lg transition-all"
                    >
                      Assign this item
                    </button>
                  </div>
                )}

                {/* 2. Nearest Proximity */}
                {recommendation.nearest && (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-brand-border/40 flex flex-col justify-between gap-3 group">
                    <div>
                      <span className="text-[8px] font-bold text-brand-purple uppercase tracking-wider block mb-1">Nearest Location Match</span>
                      <h4 className="font-bold text-indigo-300 leading-tight truncate">{recommendation.nearest.name}</h4>
                      <span className="text-[9px] text-brand-secondaryText font-mono mt-0.5 block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        {recommendation.nearest.location}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCheckoutAlt(recommendation.nearest)}
                      className="w-full py-1.5 bg-brand-purple/10 hover:bg-brand-purple text-white border border-brand-purple/20 hover:border-transparent text-[10px] font-bold rounded-lg transition-all"
                    >
                      Assign this item
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison detail */}
            <div className="glass-panel p-5.5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4 self-start text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Matching Reasoning</h3>
              <p className="text-brand-secondaryText leading-relaxed p-3.5 bg-slate-900/60 rounded-xl border border-brand-border/40">
                {recommendation.matchReason}
              </p>
              
              <div className="space-y-3 mt-2 border-t border-brand-border/20 pt-4">
                <div className="flex justify-between items-center text-[10px] text-brand-secondaryText font-semibold">
                  <span>Target specs matches:</span>
                  <span className="text-brand-success">100% Core</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-brand-secondaryText font-semibold">
                  <span>Location Proximity:</span>
                  <span className="text-white font-mono">0.0 km (Same Lab)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-brand-secondaryText font-semibold">
                  <span>Condition index:</span>
                  <span className="text-white font-mono">Good or New</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl border border-brand-border/40 text-center text-xs text-brand-secondaryText bg-[#111827] max-w-2xl leading-relaxed">
            Please choose a target equipment to calculate alternate configurations, category fits, and confidence indicators.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
