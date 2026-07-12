import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  Package,
  Users,
  FolderTree
} from 'lucide-react';
import { useMockState } from '../../../context/MockStateContext';
import Avatar from '../avatars/Avatar';
import { cn } from '../../../utils/cn';

export default function Navbar({ onMenuToggle, sidebarOpen }) {
  const navigate = useNavigate();
  const { currentUser, resetDatabase, assets, employees, departments } = useMockState();
  
  // Dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { assets: [], employees: [], departments: [] };
    const query = searchQuery.toLowerCase();
    
    return {
      assets: assets.filter(a => a.name.toLowerCase().includes(query) || a.assetTag.toLowerCase().includes(query)).slice(0, 3),
      employees: employees.filter(e => e.name.toLowerCase().includes(query) || e.department.toLowerCase().includes(query)).slice(0, 3),
      departments: departments.filter(d => d.name.toLowerCase().includes(query) || d.code.toLowerCase().includes(query)).slice(0, 3)
    };
  }, [searchQuery, assets, employees, departments]);

  const handleLogout = () => {
    // Navigate to Login page
    navigate('/login');
  };

  return (
    <header className="h-[70px] border-b border-brand-border/40 bg-[#060816]/70 backdrop-blur-md sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
      {/* Left side: Hamburger (mobile) + search button */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-brand-secondaryText hover:text-white hover:bg-brand-cardHover border border-brand-border/40 transition-all md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondaryText">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search assets, tag, serial number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full text-xs bg-slate-900/60 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-white transition-all focus:bg-slate-950 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40"
          />
          
          {/* Quick Search Palette Dropdown */}
          <AnimatePresence>
            {searchOpen && searchQuery && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setSearchOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-slate-950 border border-brand-border rounded-2xl p-4 shadow-premium z-30 max-h-[350px] overflow-y-auto custom-scrollbar"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-brand-border/30 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondaryText">Search Results</span>
                    <button onClick={() => setSearchQuery('')} className="text-xs text-brand-primary hover:underline">Clear</button>
                  </div>
                  
                  {/* Assets */}
                  {searchResults.assets.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold text-brand-primary uppercase mb-1.5 flex items-center gap-1">
                        <Package className="w-3 h-3" /> Assets
                      </h4>
                      <div className="flex flex-col gap-1">
                        {searchResults.assets.map(a => (
                          <Link
                            key={a.id}
                            to={`/dashboard/assets/${a.id}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-cardHover transition-colors"
                          >
                            <span className="text-xs font-semibold text-white">{a.name}</span>
                            <span className="text-[10px] bg-slate-800 text-brand-secondaryText px-1.5 py-0.5 rounded-md font-mono">{a.assetTag}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Employees */}
                  {searchResults.employees.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold text-brand-purple uppercase mb-1.5 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Employees
                      </h4>
                      <div className="flex flex-col gap-1">
                        {searchResults.employees.map(e => (
                          <Link
                            key={e.id}
                            to={`/dashboard/employees`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-cardHover transition-colors"
                          >
                            <span className="text-xs font-semibold text-white">{e.name}</span>
                            <span className="text-[10px] text-brand-secondaryText">{e.department}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Departments */}
                  {searchResults.departments.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-brand-success uppercase mb-1.5 flex items-center gap-1">
                        <FolderTree className="w-3 h-3" /> Departments
                      </h4>
                      <div className="flex flex-col gap-1">
                        {searchResults.departments.map(d => (
                          <Link
                            key={d.id}
                            to={`/dashboard/departments`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-cardHover transition-colors"
                          >
                            <span className="text-xs font-semibold text-white">{d.name}</span>
                            <span className="text-[10px] text-brand-secondaryText font-mono">{d.code}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.assets.length === 0 && searchResults.employees.length === 0 && searchResults.departments.length === 0 && (
                    <div className="text-center py-6 text-xs text-brand-secondaryText">
                      No matching records for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Notifications + User Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 rounded-xl border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover text-brand-secondaryText hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent shadow-glow-purple animate-pulse" />
          </button>

          {/* Notifications Drawer/Menu */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="absolute right-0 mt-3 w-80 bg-slate-950 border border-brand-border rounded-2xl p-4 shadow-premium z-30"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/30 mb-3">
                  <h4 className="text-xs font-bold text-white">Recent Activities</h4>
                  <span className="text-[9px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-1.5 py-0.5 rounded-md font-semibold">5 Alerts</span>
                </div>
                
                <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  <div className="flex gap-2.5 text-xs text-brand-secondaryText">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold">MacBook Pro Allocated</p>
                      <p className="text-[10px] mt-0.5">Assigned to Sarah Jenkins (Engineering)</p>
                      <span className="text-[9px] text-slate-600">2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 text-xs text-brand-secondaryText">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold">ThinkPad Screen Flicker</p>
                      <p className="text-[10px] mt-0.5">Alex Rivera reported a hardware fault</p>
                      <span className="text-[9px] text-slate-600">1 day ago</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 text-xs text-brand-secondaryText">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-success mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold">RMA Dream Machine</p>
                      <p className="text-[10px] mt-0.5">Sent for firmware replacement</p>
                      <span className="text-[9px] text-slate-600">2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border/30 mt-3 text-center">
                  <Link to="/dashboard" onClick={() => setNotifOpen(false)} className="text-[10px] text-brand-primary font-bold hover:underline">View Dashboard Dashboard</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <Avatar name={currentUser.name} size="md" className="cursor-pointer hover:border-brand-primary transition-colors" />
            <div className="hidden lg:flex flex-col items-start select-none">
              <span className="text-xs font-bold text-white leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-brand-secondaryText leading-none mt-1">{currentUser.role}</span>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="absolute right-0 mt-3 w-56 bg-slate-950 border border-brand-border rounded-2xl p-2.5 shadow-premium z-30"
              >
                <div className="px-3 py-2 border-b border-brand-border/30 mb-1.5 select-none">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-brand-secondaryText mt-0.5 truncate">{currentUser.email}</p>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-secondaryText hover:text-white hover:bg-brand-cardHover rounded-xl transition-all"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      resetDatabase();
                      setProfileOpen(false);
                      window.location.reload();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-secondaryText hover:text-white hover:bg-brand-cardHover rounded-xl transition-all text-left"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Reset Database Seed</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-danger hover:bg-red-500/10 rounded-xl transition-all text-left mt-1 border-t border-brand-border/30 pt-2.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
