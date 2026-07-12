import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderTree,
  Users,
  Grid,
  Package,
  User,
  ChevronLeft,
  Menu,
  Activity,
  Layers,
  Settings,
  Link as LinkIcon,
  ArrowRightLeft,
  Undo2,
  CalendarDays,
  Wrench,
  ClipboardList,
  FileText,
  LineChart as LineChartIcon,
  CalendarRange,
  Heart,
  Sparkles,
  QrCode,
  Flame,
  ShieldCheck,
  PiggyBank,
  Bell
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navGroups = [
    {
      title: 'Core Management',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Departments', path: '/dashboard/departments', icon: FolderTree },
        { name: 'Employees', path: '/dashboard/employees', icon: Users },
        { name: 'Categories', path: '/dashboard/categories', icon: Grid },
        { name: 'Assets', path: '/dashboard/assets', icon: Package }
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Allocations', path: '/dashboard/allocation', icon: LinkIcon },
        { name: 'Transfers', path: '/dashboard/transfers', icon: ArrowRightLeft },
        { name: 'Returns', path: '/dashboard/returns', icon: Undo2 },
        { name: 'Bookings', path: '/dashboard/bookings', icon: CalendarDays },
        { name: 'Maintenance', path: '/dashboard/maintenance', icon: Wrench },
        { name: 'Audits', path: '/dashboard/audit', icon: ClipboardList }
      ]
    },
    {
      title: 'Insights & Utilities',
      items: [
        { name: 'Reports', path: '/dashboard/reports', icon: FileText },
        { name: 'Analytics', path: '/dashboard/analytics', icon: LineChartIcon },
        { name: 'History Timelines', path: '/dashboard/timeline', icon: CalendarRange },
        { name: 'Health Ledger', path: '/dashboard/health', icon: Heart },
        { name: 'Smart Suggestions', path: '/dashboard/recommendations', icon: Sparkles },
        { name: 'QR Tags', path: '/dashboard/qr', icon: QrCode },
        { name: 'Idle Buffer', path: '/dashboard/idle-assets', icon: Flame },
        { name: 'Warranty Expiry', path: '/dashboard/warranty', icon: ShieldCheck },
        { name: 'Cost Optimization', path: '/dashboard/cost-saving', icon: PiggyBank }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
        { name: 'Activity Trail', path: '/dashboard/activity', icon: Activity },
        { name: 'Profile Settings', path: '/dashboard/profile', icon: User }
      ]
    }
  ];

  return (
    <motion.div
      animate={{ width: isOpen ? 260 : 76 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 left-0 bg-[#070b18] border-r border-brand-border/40 select-none overflow-hidden z-20 flex-shrink-0'
      )}
    >
      {/* Brand logo header */}
      <div className="flex items-center justify-between px-5 h-[70px] border-b border-brand-border/30">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-purple flex items-center justify-center shadow-glow-primary flex-shrink-0">
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-secondaryText"
            >
              Asset<span className="text-brand-accent">Flow</span>
            </motion.span>
          )}
        </Link>
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-brand-secondaryText hover:text-white hover:bg-brand-cardHover border border-transparent hover:border-brand-border/50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-1.5">
            {isOpen && (
              <span className="px-3.5 text-[9px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                {group.title}
              </span>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive: localActive }) =>
                      cn(
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative group',
                        isActive
                          ? 'text-white bg-gradient-to-r from-brand-primary/20 to-brand-purple/5 border border-brand-primary/20'
                          : 'text-brand-secondaryText hover:text-white hover:bg-brand-cardHover border border-transparent'
                      )
                    }
                  >
                    <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-brand-accent' : 'text-brand-secondaryText group-hover:text-white transition-colors')} />
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute left-0 w-1 h-5 rounded-r bg-brand-primary top-1/2 -translate-y-1/2"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Toggle */}
      {!isOpen && (
        <div className="py-6 flex justify-center border-t border-brand-border/30">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl text-brand-secondaryText hover:text-white hover:bg-brand-cardHover border border-brand-border/40 transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
