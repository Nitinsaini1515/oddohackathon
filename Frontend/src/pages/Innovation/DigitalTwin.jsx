import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Maximize2, ZoomIn, ZoomOut, Info, MapPin, Laptop, Cpu, Phone, X } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';

export default function DigitalTwin() {
  const { assets, employees } = useMockState();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // SVG Room configurations
  const rooms = [
    { id: 'rm-reception', name: 'Reception Lobby', x: 20, y: 20, width: 180, height: 120, color: 'fill-indigo-900/10 stroke-indigo-500/20' },
    { id: 'rm-it', name: 'IT Server Room', x: 220, y: 20, width: 220, height: 120, color: 'fill-brand-primary/10 stroke-brand-primary/30' },
    { id: 'rm-hr', name: 'HR Department', x: 460, y: 20, width: 200, height: 120, color: 'fill-purple-900/10 stroke-purple-500/20' },
    { id: 'rm-conf', name: 'Conference Alpha', x: 20, y: 160, width: 240, height: 160, color: 'fill-blue-900/10 stroke-blue-500/25' },
    { id: 'rm-eng', name: 'Engineering Hall', x: 280, y: 160, width: 380, height: 160, color: 'fill-teal-900/10 stroke-teal-500/20' }
  ];

  // Map assets to room positions (x, y coordinate points) based on ID/categories
  const assetMarkers = [
    { id: 'ast-101', name: 'MacBook Pro 16"', x: 340, y: 220, status: 'Allocated', holder: 'Sarah Jenkins', type: 'Laptop' },
    { id: 'ast-102', name: 'ThinkPad P1 Gen 6', x: 450, y: 240, status: 'Allocated', holder: 'Alex Rivera', type: 'Laptop' },
    { id: 'ast-103', name: 'Dell PowerEdge Server', x: 260, y: 80, status: 'Available', holder: 'None', type: 'Server' },
    { id: 'ast-104', name: 'iPad Pro 12.9"', x: 100, y: 240, status: 'Allocated', holder: 'Jessica Taylor', type: 'Tablet' },
    { id: 'ast-105', name: 'Dell UltraSharp 38"', x: 400, y: 70, status: 'Allocated', holder: 'David Miller', type: 'Monitor' },
    { id: 'ast-106', name: 'Steelcase Ergonomic Chair', x: 550, y: 70, status: 'Allocated', holder: 'Emma Watson', type: 'Furniture' },
    { id: 'ast-107', name: 'UniFi Dream Machine', x: 300, y: 50, status: 'Under Maintenance', holder: 'None', type: 'Router' }
  ];

  const getMarkerColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-brand-success shadow-glow-success/40';
      case 'allocated': return 'bg-brand-darkBlue shadow-[0_0_10px_rgba(37,99,235,0.4)]';
      case 'under maintenance': return 'bg-brand-warning shadow-[0_0_10px_rgba(245,158,11,0.4)]';
      default: return 'bg-brand-danger shadow-[0_0_10px_rgba(239,68,68,0.4)]';
    }
  };

  const handleMarkerClick = (marker) => {
    // Find detailed info from context
    const fullAsset = assets.find(a => a.id === marker.id) || marker;
    setSelectedAsset(fullAsset);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5.5 h-5.5 text-brand-primary" />
            <span>Digital Twin Floor Map</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Futuristic interactive layout mapping scanned devices and staff workstations.</p>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomScale(prev => Math.max(prev - 0.2, 0.6))}
            className="p-1.5 border border-brand-border bg-slate-900/60 text-brand-secondaryText hover:text-white rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0 font-mono">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => setZoomScale(prev => Math.min(prev + 0.2, 1.8))}
            className="p-1.5 border border-brand-border bg-slate-900/60 text-brand-secondaryText hover:text-white rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Floor SVG */}
        <div className="lg:col-span-3 glass-panel p-4 rounded-2xl border border-brand-border/40 bg-slate-950/80 flex items-center justify-center min-h-[420px] overflow-hidden relative">
          
          <motion.div
            animate={{ scale: zoomScale }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-[680px] aspect-[680/340] shrink-0"
          >
            <svg viewBox="0 0 680 340" className="w-full h-full">
              {/* Rooms layout boxes */}
              {rooms.map((rm) => {
                const isHovered = hoveredRoom === rm.id;
                return (
                  <g
                    key={rm.id}
                    onMouseEnter={() => setHoveredRoom(rm.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-default"
                  >
                    <rect
                      x={rm.x}
                      y={rm.y}
                      width={rm.width}
                      height={rm.height}
                      rx={8}
                      className={cn(
                        rm.color,
                        'stroke-2 transition-all duration-300',
                        isHovered && 'fill-[#1e293b]/20 stroke-brand-primary'
                      )}
                    />
                    <text
                      x={rm.x + 12}
                      y={rm.y + rm.height - 12}
                      className={cn(
                        'text-[8px] font-black uppercase tracking-wider',
                        isHovered ? 'fill-white' : 'fill-slate-600'
                      )}
                    >
                      {rm.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Asset markers overlaid */}
            {assetMarkers.map((marker) => (
              <motion.div
                key={marker.id}
                style={{ left: marker.x, top: marker.y }}
                whileHover={{ scale: 1.25 }}
                onClick={() => handleMarkerClick(marker)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              >
                {/* Pulsing halo */}
                <span className={cn('absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75', getMarkerColor(marker.status))} />
                {/* Central pin dot */}
                <span className={cn('relative flex w-3.5 h-3.5 rounded-full border border-white/25', getMarkerColor(marker.status))} />
                
                {/* Hover bubble tag */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0b0f19] border border-brand-border/60 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-md pointer-events-none opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                  {marker.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Selected Asset details Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedAsset ? (
              <motion.div
                key={selectedAsset.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4.5 w-full text-xs"
              >
                <div className="flex justify-between items-start gap-2.5 border-b border-brand-border/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{selectedAsset.name}</h3>
                    <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{selectedAsset.assetTag}</span>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-1 rounded-lg hover:bg-slate-900 text-brand-secondaryText hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 uppercase font-bold text-[8px]">Status State</span>
                    <StatusBadge status={selectedAsset.status} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 uppercase font-bold text-[8px]">Current Holder</span>
                    <span className="text-white font-bold">
                      {selectedAsset.currentHolderId 
                        ? employees.find(e => e.id === selectedAsset.currentHolderId)?.name 
                        : selectedAsset.holder || 'None'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 uppercase font-bold text-[8px]">Physical Condition</span>
                    <span className="text-brand-success font-semibold">{selectedAsset.condition || 'New'}</span>
                  </div>
                </div>

                {/* Sub specifications grid */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/40 space-y-2 mt-1">
                  <h4 className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" /> Location Coordinates
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-brand-secondaryText">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">Category</span>
                      <span className="text-white font-sans font-semibold">{selectedAsset.category || 'Workstations'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">Location Code</span>
                      <span className="text-white font-sans font-semibold">{selectedAsset.location || 'HQ Server Room'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Servicing History</h4>
                  <div className="space-y-1.5 max-h-[110px] overflow-y-auto custom-scrollbar pr-1">
                    {(selectedAsset.history || []).slice(0, 2).map((h, idx) => (
                      <div key={idx} className="p-2 border border-brand-border/30 rounded-lg text-[9px] text-brand-secondaryText">
                        <div className="flex justify-between font-bold text-white mb-0.5">
                          <span>{h.event}</span>
                          <span className="font-mono">{h.date}</span>
                        </div>
                        <p className="truncate">{h.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-brand-border/40 text-center text-xs text-brand-secondaryText bg-[#111827] leading-relaxed">
                Click any floating marker pin on the office layout blueprint map to verify specifications, holder profile, and diagnostic history.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
