import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-screen bg-[#060816] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background glow filters */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />

      {/* Brand logo header */}
      <div className="mb-6 flex flex-col items-center relative z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-purple flex items-center justify-center shadow-glow-primary">
            <Activity className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-secondaryText">
            Asset<span className="text-brand-accent">Flow</span>
          </span>
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-secondaryText mt-1.5">Enterprise Resources</span>
      </div>

      {/* Auth Card container */}
      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-6 md:p-8 shadow-premium border border-brand-border/40 relative z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-brand-secondaryText relative z-10">
        <span>© 2026 AssetFlow Corp. All rights reserved.</span>
      </div>
    </div>
  );
}
