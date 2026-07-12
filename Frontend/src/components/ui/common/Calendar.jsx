import React, { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function Calendar({
  events = [],
  onDateSelect,
  onEventClick,
  className = ''
}) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const daysInMonth = currentDate.daysInMonth();
  const startOfMonth = currentDate.startOf('month');
  const startDayOfWeek = startOfMonth.day(); // 0 is Sunday, 6 is Saturday

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleDateClick = (day) => {
    const fullDate = currentDate.date(day);
    setSelectedDate(fullDate);
    if (onDateSelect) {
      onDateSelect(fullDate.format('YYYY-MM-DD'));
    }
  };

  // Generate calendar grid array
  const gridCells = React.useMemo(() => {
    const cells = [];
    
    // Add empty spacer cells for the start of the week
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ isCurrentMonth: false, dayNum: null });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = currentDate.date(i).format('YYYY-MM-DD');
      const dayEvents = events.filter(e => e.date === dateStr);
      cells.push({
        isCurrentMonth: true,
        dayNum: i,
        dateString: dateStr,
        events: dayEvents
      });
    }

    return cells;
  }, [currentDate, daysInMonth, startDayOfWeek, events]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('glass-panel border border-brand-border/40 rounded-2xl p-5 md:p-6 w-full flex flex-col gap-4', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-brand-border/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {currentDate.format('MMMM YYYY')}
            </h3>
            <p className="text-[10px] text-brand-secondaryText">Resource Reservation Log</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg text-brand-secondaryText transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentDate(dayjs());
              setSelectedDate(dayjs());
            }}
            className="text-[10px] px-2.5 py-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg text-white font-semibold transition-all"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg text-brand-secondaryText transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid cells */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 auto-rows-fr">
        {gridCells.map((cell, idx) => {
          const isSelected = cell.isCurrentMonth && cell.dateString === selectedDate.format('YYYY-MM-DD');
          const isToday = cell.isCurrentMonth && cell.dateString === dayjs().format('YYYY-MM-DD');

          return (
            <div
              key={idx}
              onClick={() => cell.isCurrentMonth && handleDateClick(cell.dayNum)}
              className={cn(
                'min-h-[70px] md:min-h-[90px] p-1.5 rounded-xl border border-transparent flex flex-col gap-1 transition-all select-none',
                cell.isCurrentMonth
                  ? 'bg-slate-900/10 hover:bg-slate-900/35 border-brand-border/25 cursor-pointer'
                  : 'bg-transparent text-slate-800 pointer-events-none',
                isSelected && 'border-brand-primary/50 bg-brand-primary/5',
                isToday && 'border-brand-accent/40 bg-brand-accent/5'
              )}
            >
              {cell.isCurrentMonth && (
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      'text-xs font-bold w-5 h-5 flex items-center justify-center rounded-md',
                      isToday ? 'bg-brand-accent text-white font-extrabold shadow-glow-purple/20' : 'text-white'
                    )}
                  >
                    {cell.dayNum}
                  </span>
                  {cell.events.length > 0 && (
                    <span className="text-[8px] bg-slate-800 border border-brand-border/40 text-brand-secondaryText px-1 py-0.5 rounded-md font-semibold">
                      {cell.events.length}
                    </span>
                  )}
                </div>
              )}

              {/* Event listings inside cells (Desktop only) */}
              {cell.isCurrentMonth && (
                <div className="hidden md:flex flex-col gap-1 overflow-y-auto max-h-[50px] custom-scrollbar">
                  {cell.events.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEventClick) onEventClick(ev);
                      }}
                      className={cn(
                        'text-[8px] p-1 rounded-md border truncate font-bold text-white',
                        ev.status === 'Cancelled'
                          ? 'bg-slate-800/40 border-slate-700 text-brand-secondaryText line-through'
                          : ev.resourceType === 'Meeting Rooms'
                          ? 'bg-brand-primary/20 border-brand-primary/30 text-indigo-300'
                          : ev.resourceType === 'Vehicles'
                          ? 'bg-brand-purple/20 border-brand-purple/30 text-brand-accent'
                          : 'bg-brand-success/20 border-brand-success/30 text-brand-success'
                      )}
                      title={`${ev.resourceName} (${ev.startTime}-${ev.endTime})`}
                    >
                      {ev.startTime} - {ev.resourceName}
                    </div>
                  ))}
                  {cell.events.length > 2 && (
                    <div className="text-[7px] text-center text-slate-500 font-extrabold uppercase">
                      + {cell.events.length - 2} More
                    </div>
                  )}
                </div>
              )}

              {/* Event Dots (Mobile only) */}
              {cell.isCurrentMonth && cell.events.length > 0 && (
                <div className="flex md:hidden justify-center gap-0.5 mt-auto">
                  {cell.events.slice(0, 3).map((ev, eIdx) => (
                    <span
                      key={eIdx}
                      className={cn(
                        'w-1 h-1 rounded-full',
                        ev.status === 'Cancelled'
                          ? 'bg-slate-500'
                          : ev.resourceType === 'Meeting Rooms'
                          ? 'bg-brand-primary'
                          : ev.resourceType === 'Vehicles'
                          ? 'bg-brand-purple'
                          : 'bg-brand-success'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
