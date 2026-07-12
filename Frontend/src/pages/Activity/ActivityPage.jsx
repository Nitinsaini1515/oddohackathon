import React, { useState, useMemo } from 'react';
import { Activity, Search, Calendar, Shield, SlidersHorizontal } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import Timeline from '../../components/ui/common/Timeline';
import Pagination from '../../components/ui/common/Pagination';
import SearchInput from '../../components/ui/inputs/SearchInput';
import Select from '../../components/ui/inputs/Select';

export default function ActivityPage() {
  const { activities } = useMockState();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique users from activities for filter dropdown
  const uniqueUsers = useMemo(() => {
    const users = new Set(activities.map(a => a.user));
    return ['all', ...Array.from(users)];
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchSearch =
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.desc.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchType = filterType === 'all' || act.type === filterType;
      const matchUser = filterUser === 'all' || act.user === filterUser;
      
      return matchSearch && matchType && matchUser;
    });
  }, [activities, searchQuery, filterType, filterUser]);

  // Paginated activities
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, currentPage]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Map activities to Timeline items format
  const timelineItems = paginatedActivities.map(act => ({
    date: act.time,
    title: act.title,
    description: act.desc,
    user: act.user,
    status: act.type === 'maintenance' || act.type === 'status_change' ? 'Pending' : 'Completed'
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-primary" />
            <span>Activity Audit Logs</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Review chronological records of all operations performed in the workspace.</p>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="glass-panel border border-brand-border/40 p-4.5 rounded-2xl bg-slate-950/20 grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
        <div className="w-full">
          <SearchInput
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="py-1.5"
        >
          <option value="all">All Event Types</option>
          <option value="allocation">Allocations</option>
          <option value="registration">Registrations</option>
          <option value="maintenance">Maintenance</option>
          <option value="status_change">Status Changes</option>
          <option value="employee">Staff Logs</option>
        </Select>

        <Select
          value={filterUser}
          onChange={(e) => {
            setFilterUser(e.target.value);
            setCurrentPage(1);
          }}
          className="py-1.5"
        >
          <option value="all">All Users / Operators</option>
          {uniqueUsers.filter(u => u !== 'all').map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </Select>
      </div>

      {/* Timeline logs */}
      <div className="glass-panel border border-brand-border/40 rounded-2xl p-6 bg-[#111827]">
        {timelineItems.length > 0 ? (
          <div className="flex flex-col gap-6">
            <Timeline items={timelineItems} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredActivities.length}
                itemsPerPage={itemsPerPage}
                className="border-t border-brand-border/20 pt-4 mt-2"
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-brand-secondaryText text-xs">
            No activities matching current filter selection.
          </div>
        )}
      </div>
    </div>
  );
}
