import React from 'react';
import { Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

export default function ExportButton({
  format = 'CSV', // 'CSV' | 'Excel' | 'PDF'
  data = [],
  filename = 'export',
  className = '',
  ...props
}) {
  const getIcon = () => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return FileText;
      case 'EXCEL':
        return FileSpreadsheet;
      case 'CSV':
      default:
        return FileDown;
    }
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Trigger a dummy file download
          const csvContent = "data:text/csv;charset=utf-8,ID,Name,Details\n" + 
            data.map((row, i) => `${row.id || i},"${row.name || ''}","${row.status || ''}"`).join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${filename}_${Date.now()}.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        }, 1500);
      }),
      {
        loading: `Preparing ${format} export...`,
        success: `${format} export downloaded successfully!`,
        error: 'Failed to export document.'
      }
    );
  };

  const Icon = getIcon();

  return (
    <button
      onClick={handleExport}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-brand-border bg-slate-900/60 text-brand-secondaryText hover:text-white hover:bg-brand-cardHover hover:border-slate-700 transition-all shadow-premium',
        className
      )}
      {...props}
    >
      <Icon className="w-3.5 h-3.5 text-brand-primary group-hover:text-white transition-colors" />
      <span>Export {format}</span>
    </button>
  );
}
