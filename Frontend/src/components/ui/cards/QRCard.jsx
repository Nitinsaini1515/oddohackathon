import React from 'react';
import { QrCode, Download, Printer, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

export default function QRCard({
  asset,
  className = ''
}) {
  const { name, assetTag, category } = asset;
  
  // Use a public QR code API to render actual QR codes for asset tags!
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(assetTag)}&color=ffffff&bgcolor=111827`;

  const handleDownload = () => {
    toast.success(`Downloading QR code image for ${assetTag}...`);
  };

  const handlePrint = () => {
    toast.success(`Sending QR label for ${name} to printer network...`);
  };

  return (
    <div className={cn('glass-panel p-5 rounded-2xl border border-brand-border/40 flex flex-col items-center gap-4 bg-[#111827] text-center w-full max-w-[280px]', className)}>
      <div>
        <h4 className="text-xs font-bold text-white tracking-tight truncate max-w-[200px]">{name}</h4>
        <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{assetTag}</span>
      </div>

      {/* QR Code Container */}
      <div className="p-3 bg-slate-900 rounded-2xl border border-brand-border/60 flex items-center justify-center shadow-premium relative group">
        <img
          src={qrUrl}
          alt={`QR Code for ${assetTag}`}
          className="w-32 h-32 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'; // Fallback if offline
          }}
        />
        <div className="absolute inset-0 bg-[#060816]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <QrCode className="w-6 h-6 text-brand-primary" />
          <span className="text-[9px] font-mono text-white tracking-wider font-semibold">{assetTag}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full mt-1.5">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 py-2 border border-brand-border bg-slate-900/60 hover:bg-brand-cardHover text-brand-secondaryText hover:text-white rounded-xl text-[10px] font-bold transition-all"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 py-2 border border-brand-border bg-slate-900/60 hover:bg-brand-cardHover text-brand-secondaryText hover:text-white rounded-xl text-[10px] font-bold transition-all"
        >
          <Printer className="w-3 h-3" />
          Print Label
        </button>
      </div>
    </div>
  );
}
