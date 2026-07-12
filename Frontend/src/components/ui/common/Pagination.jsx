import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  totalItems = 0,
  itemsPerPage = 10
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate numbered list
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn('flex items-center justify-between border-t border-brand-border/40 px-6 py-4 bg-slate-950/20 rounded-b-2xl', className)}>
      <div className="text-xs text-brand-secondaryText">
        Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
        <span className="font-semibold text-white">{endItem}</span> of{' '}
        <span className="font-semibold text-white">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-xl text-brand-secondaryText transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900/40 disabled:hover:text-brand-secondaryText"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page numbers */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold border transition-all',
                isActive
                  ? 'bg-gradient-to-r from-brand-primary to-brand-purple border-brand-primary text-white shadow-glow-primary'
                  : 'border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white text-brand-secondaryText'
              )}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-xl text-brand-secondaryText transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900/40 disabled:hover:text-brand-secondaryText"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
