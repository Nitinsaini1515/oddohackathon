import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Heart,
  Sparkles,
  Sliders,
  Zap,
  Flame,
  DollarSign,
  Droplet,
  Shield,
  FileText,
  BarChart2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function InnovationHub() {
  const cards = [
    {
      name: 'Smart Health Center',
      desc: 'Real-time asset hardware health indices, fatigue thresholds, and circular telemetry tracks.',
      path: '/dashboard/health-center',
      icon: Heart,
      color: 'text-brand-danger',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]'
    },
    {
      name: 'Asset Care (AI Wellness)',
      desc: 'Predictive health triggers, automated checklists (fans, paste, batteries) and resolutions tracker.',
      path: '/dashboard/asset-care',
      icon: Sparkles,
      color: 'text-brand-accent',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]'
    },
    {
      name: 'Digital Twin Office Map',
      desc: 'A complete responsive office floor layout mapping active room devices and custodian tags.',
      path: '/dashboard/digital-twin',
      icon: Sliders,
      color: 'text-brand-primary',
      glow: 'shadow-[0_0_15px_rgba(79,70,229,0.25)]'
    },
    {
      name: 'Alternatives Matcher',
      desc: 'Intelligent replacement recommendation suggestions when target categories are fully checked out.',
      path: '/dashboard/recommendations',
      icon: Zap,
      color: 'text-indigo-300',
      glow: 'shadow-[0_0_15px_rgba(129,140,248,0.25)]'
    },
    {
      name: 'Idle Stock Detector',
      desc: 'Audit storage reserves, measure depreciation costs, and get automatic reallocation routes.',
      path: '/dashboard/idle-assets',
      icon: Flame,
      color: 'text-brand-warning',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]'
    },
    {
      name: 'Cost Savings Center',
      desc: 'Capital conservation balances, waste indicators, and savings counters grouped by departments.',
      path: '/dashboard/cost-saving',
      icon: DollarSign,
      color: 'text-brand-success',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.25)]'
    },
    {
      name: 'Sustainability Index (ESG)',
      desc: 'Eco performance tracker showing ESG health scores, carbon offsets, and repair ratios.',
      path: '/dashboard/sustainability',
      icon: Droplet,
      color: 'text-brand-success',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.25)]'
    },
    {
      name: 'Lifecycle & Warranty',
      desc: 'Asset warranty timelines, lifecycle stages, and prediction trackers for upcoming retirements.',
      path: '/dashboard/warranty',
      icon: Shield,
      color: 'text-brand-primary',
      glow: 'shadow-[0_0_15px_rgba(79,70,229,0.25)]'
    },
    {
      name: 'Smart Asset Passport',
      desc: 'Complete asset profile dossier mapping custody transfers, repairs, audits, and specifications.',
      path: '/dashboard/asset-passport',
      icon: FileText,
      color: 'text-indigo-400',
      glow: 'shadow-[0_0_15px_rgba(129,140,248,0.25)]'
    },
    {
      name: 'CEO Executive Insights',
      desc: 'High-level dashboard mapping top/worst performers, department budgets, and future forecast curves.',
      path: '/dashboard/executive-dashboard',
      icon: BarChart2,
      color: 'text-brand-accent',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]'
    },
    {
      name: 'Failure Predictions',
      desc: 'Probability matrices forecasting expected failure rates, replacement priority scores, and actions.',
      path: '/dashboard/future-insights',
      icon: ShieldAlert,
      color: 'text-brand-danger',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]'
    }
  ];

  return (
    <div className="flex flex-col gap-7 select-none">
      {/* Hub Title Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Compass className="w-6.5 h-6.5 text-brand-primary animate-spin-slow" />
          <span>V4 Innovation Showcase Suite</span>
        </h2>
        <p className="text-xs text-brand-secondaryText mt-1.5 leading-relaxed">
          Futuristic telemetry dashboards designed to showcase next-gen asset lifecycle optimization features.
        </p>
      </div>

      {/* Grid of Innovation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.01 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`glass-panel border border-brand-border/40 p-5.5 rounded-2xl flex flex-col justify-between gap-5 bg-[#111827] relative group ${c.glow}`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 bg-[#060816]/75 rounded-2xl border border-brand-border shrink-0 ${c.color}`}>
                  <Icon className="w-5.5 h-5.5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <Link
                  to={c.path}
                  className="p-1.5 rounded-lg border border-brand-border bg-slate-900/60 hover:bg-slate-900 text-brand-secondaryText hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-brand-accent transition-colors duration-300">
                  {c.name}
                </h3>
                <p className="text-xs text-brand-secondaryText leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
