import React from 'react';
import { Bell, Calendar, Wrench, RefreshCw, LogIn, LogOut, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '../../../utils/cn';

dayjs.extend(relativeTime);

export default function NotificationCard({
  notification,
  onMarkRead,
  className = ''
}) {
  const { id, type, title, message, timestamp, read } = notification;

  const getIcon = () => {
    switch (type) {
      case 'Booking Reminder':
        return Calendar;
      case 'Maintenance Reminder':
        return Wrench;
      case 'Transfer Approved':
      case 'Transfer Rejected':
        return RefreshCw;
      case 'Asset Assigned':
        return LogIn;
      case 'Asset Returned':
        return LogOut;
      default:
        return Bell;
    }
  };

  const Icon = getIcon();

  return (
    <div
      className={cn(
        'glass-panel p-4 rounded-xl border border-brand-border/40 transition-all duration-300 flex items-start gap-3.5 relative overflow-hidden group bg-[#111827]',
        !read && 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-primary border-l-brand-primary/20',
        className
      )}
    >
      <div className={cn(
        'p-2 rounded-lg text-white border flex-shrink-0',
        !read ? 'bg-brand-primary/20 border-brand-primary/30 text-indigo-400' : 'bg-slate-900/60 border-brand-border text-slate-500'
      )}>
        <Icon className="w-4.5 h-4.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-1.5 mb-0.5">
          <h4 className={cn('text-xs font-bold truncate leading-tight', !read ? 'text-white' : 'text-brand-secondaryText')}>
            {title}
          </h4>
          <span className="text-[9px] text-slate-500 font-medium shrink-0">
            {dayjs(timestamp).fromNow()}
          </span>
        </div>
        <p className="text-xs text-brand-secondaryText leading-relaxed mb-2.5">
          {message}
        </p>

        {!read && onMarkRead && (
          <button
            onClick={() => onMarkRead(id)}
            className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide text-brand-primary hover:text-white transition-colors"
          >
            <CheckCircle className="w-3 h-3" />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
