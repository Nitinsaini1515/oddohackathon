import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Pagination from './Pagination';
import SearchInput from '../inputs/SearchInput';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKeys = [], // e.g., ['name', 'tag']
  itemsPerPage = 6,
  onRowClick,
  actionButton,
  className = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when search query changes
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Filtered data based on search keys
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    
    return data.filter(item => {
      // If search keys are not provided, search everything
      const keys = searchKeys.length > 0 ? searchKeys : Object.keys(item);
      return keys.some(key => {
        const val = item[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(lower);
      });
    });
  }, [data, searchQuery, searchKeys]);

  // Paginated records
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className={`glass-panel border border-brand-border/40 rounded-2xl flex flex-col overflow-hidden w-full ${className}`}>
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-950/20 border-b border-brand-border/30">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        {actionButton && <div className="w-full sm:w-auto flex justify-end">{actionButton}</div>}
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        {filteredData.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-brand-border/20 text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider bg-slate-900/10">
                {columns.map((col, idx) => (
                  <th key={idx} className="py-4 px-6 font-bold uppercase select-none">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/10 text-xs text-brand-secondaryText">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, rowIdx) => (
                  <motion.tr
                    key={row.id || rowIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: rowIdx * 0.03 }}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors duration-150 hover:bg-slate-900/30 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="py-3.5 px-6 font-medium">
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <div className="p-8">
            <EmptyState
              title="No matches found"
              description={`We couldn't find any results for "${searchQuery}". Try editing your keywords.`}
            />
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
