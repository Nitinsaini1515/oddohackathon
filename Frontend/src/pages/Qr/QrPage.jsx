import React, { useState, useMemo } from 'react';
import { QrCode, Scan, Camera, Download, Printer, Cpu } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import QRCard from '../../components/ui/cards/QRCard';
import Select from '../../components/ui/inputs/Select';
import toast from 'react-hot-toast';

export default function QrPage() {
  const { assets } = useMockState();
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId);
  }, [assets, selectedAssetId]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    toast.loading('Starting scanner camera lens...');
    setTimeout(() => {
      setIsScanning(false);
      toast.dismiss();
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      setSelectedAssetId(randomAsset.id);
      toast.success(`Scan matched: ${randomAsset.name} (${randomAsset.assetTag})`);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <QrCode className="w-5.5 h-5.5 text-brand-primary" />
            <span>QR Asset Labels</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Generate print sheets for equipment codes or simulate scans via system cameras.</p>
        </div>

        {/* Dropdown Selector */}
        <div className="w-64 shrink-0">
          <Select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="py-1.5"
          >
            <option value="">-- Choose device to tag --</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Scan Simulation Camera */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col justify-between gap-5 min-h-[350px] relative overflow-hidden group">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-brand-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulated Camera Scanner</h3>
          </div>

          {/* Camera display placeholder */}
          <div className="flex-1 rounded-xl border border-dashed border-brand-border/60 bg-slate-950/80 flex flex-col items-center justify-center relative overflow-hidden">
            {isScanning ? (
              <>
                <div className="w-48 h-48 border-2 border-brand-primary rounded-2xl relative flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-accent -translate-x-0.5 -translate-y-0.5" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-accent translate-x-0.5 -translate-y-0.5" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-accent -translate-x-0.5 translate-y-0.5" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-accent translate-x-0.5 translate-y-0.5" />
                  <Camera className="w-8 h-8 text-brand-primary animate-pulse" />
                </div>
                {/* Scanning red laser line animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-brand-danger shadow-[0_0_12px_rgba(239,68,68,1)] animate-[bounce_2s_infinite]" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <Camera className="w-10 h-10 text-slate-700" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Camera Lens Disengaged</span>
                  <span className="text-[10px] text-brand-secondaryText block mt-1">Initiate scanning simulator to search tags automatically.</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-purple rounded-xl hover:shadow-glow-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Scan className="w-4 h-4" />
            <span>{isScanning ? 'Scanner Active...' : 'Simulate Scanner Checkout'}</span>
          </button>
        </div>

        {/* Right Side: QR Label Preview Card */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider self-start">Active Tag Preview</h3>
          
          {selectedAsset ? (
            <QRCard asset={selectedAsset} />
          ) : (
            <div className="w-full glass-panel p-10 rounded-2xl border border-brand-border/40 text-center text-xs text-brand-secondaryText bg-[#111827]">
              Please choose an asset to load label specs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
