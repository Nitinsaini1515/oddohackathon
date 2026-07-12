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
  Settings
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Departments', path: '/dashboard/departments', icon: FolderTree },
    { name: 'Employees', path: '/dashboard/employees', icon: Users },
    { name: 'Categories', path: '/dashboard/categories', icon: Grid },
    { name: 'Assets', path: '/dashboard/assets', icon: Package },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: User }
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
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: localActive }) =>
                cn(
                  'flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative group',
                  isActive
                    ? 'text-white bg-gradient-to-r from-brand-primary/20 to-brand-purple/5 border border-brand-primary/20'
                    : 'text-brand-secondaryText hover:text-white hover:bg-brand-cardHover border border-transparent'
                )
              }
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-brand-accent' : 'text-brand-secondaryText group-hover:text-white transition-colors')} />
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
                  className="absolute left-0 w-1 h-6 rounded-r bg-brand-primary top-1/2 -translate-y-1/2"
                />
              )}
            </NavLink>
          );
        })}
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
