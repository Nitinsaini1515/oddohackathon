import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  Shield,
  Activity,
  Heart,
  FileText,
  DollarSign,
  Droplet,
  ShieldAlert,
  QrCode,
  Layers,
  BarChart2,
  Calendar,
  X,
  Compass,
  ArrowRight,
  TrendingDown,
  Flame
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// 1. Animated Counter Component
export function AnimatedCounter({ value = 0, prefix = '', suffix = '', duration = 1 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// 2. Futuristic Progress Ring (Radial Progress)
export function ProgressRing({
  value = 0,
  size = 100,
  strokeWidth = 10,
  colorClass = 'from-brand-primary to-brand-accent',
  label = '',
  showPercent = true
}) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#1e293b]"
          strokeWidth={strokeWidth - 2}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-brand-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          fill="transparent"
          strokeLinecap="round"
          style={{
            stroke: 'url(#ringGradient)',
            filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.35))'
          }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {showPercent && (
          <span className="text-base font-black text-white leading-none">
            <AnimatedCounter value={percentage} suffix="%" />
          </span>
        )}
        {label && <span className="text-[8px] font-bold text-brand-secondaryText uppercase mt-1 tracking-wider">{label}</span>}
      </div>
    </div>
  );
}

// 3. Health Card
export function HealthCard({ title, score, reliability, fatigue, trend = 'Stable', className = '' }) {
  const getStatusColor = () => {
    if (score >= 80) return 'text-brand-success';
    if (score >= 50) return 'text-brand-warning';
    return 'text-brand-danger';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        'glass-panel rounded-2xl p-5 border border-brand-border/40 bg-[#111827] shadow-premium flex items-center justify-between gap-4 group overflow-hidden relative',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-primary/5 before:to-brand-purple/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        className
      )}
    >
      <div className="flex-1 min-w-0 z-10">
        <span className="text-[9px] font-black text-brand-purple uppercase tracking-wider block mb-1">Health Center</span>
        <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-brand-accent transition-colors duration-300">{title}</h4>
        
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-2 mt-4 text-[10px] text-brand-secondaryText font-medium border-t border-brand-border/20 pt-3">
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Reliability Rating</span>
            <span className="text-white font-semibold">{reliability}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Fatigue Index</span>
            <span className="text-white font-semibold">{fatigue}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Health State</span>
            <span className={cn('font-bold', getStatusColor())}>{score >= 80 ? 'Excellent' : score >= 50 ? 'Moderate' : 'Critical'}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Log Trend</span>
            <span className="text-indigo-300 font-semibold">{trend}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 z-10">
        <ProgressRing value={score} size={76} strokeWidth={8} label="Health" />
      </div>
    </motion.div>
  );
}

// 4. AI Recommendation Card
export function RecommendationCard({ title, priority, reason, action, time, status = 'Open', onAction }) {
  const getPriorityColor = () => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger';
      case 'high': return 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning';
      case 'medium': return 'bg-brand-primary/10 border-brand-primary/20 text-indigo-400';
      default: return 'bg-slate-800 border-slate-700 text-brand-secondaryText';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] shadow-premium flex flex-col justify-between gap-4 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-3.5 bg-brand-primary/10 rounded-bl-2xl border-l border-b border-brand-border/40 text-brand-accent">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase border', getPriorityColor())}>
            {priority} Priority
          </span>
          <span className="text-[9px] text-slate-500 font-semibold uppercase">{time} Est</span>
        </div>
        <h4 className="text-xs font-black text-white tracking-tight leading-snug pr-6">{title}</h4>
        <p className="text-xs text-brand-secondaryText leading-relaxed mt-2.5">{reason}</p>
        
        <div className="mt-3.5 p-3 bg-slate-900/60 rounded-xl border border-brand-border/30 text-xs text-brand-secondaryText">
          <strong className="text-indigo-300 block mb-0.5">Suggested Action:</strong>
          {action}
        </div>
      </div>

      {onAction && status === 'Open' && (
        <button
          onClick={onAction}
          className="w-full py-2 border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-glow-primary/5"
        >
          Resolve Maintenance Check
        </button>
      )}
    </motion.div>
  );
}

// 5. Cost Card
export function CostCard({ title, value, loss = false, opportunity = false, description = '', trend = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] shadow-premium flex flex-col justify-between gap-4.5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{title}</span>
          <h3 className="text-2xl font-black text-white tracking-tight">
            <AnimatedCounter value={value} prefix="$" />
          </h3>
        </div>
        <div className={cn(
          'p-2 rounded-xl border shrink-0',
          loss ? 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger' : 
          opportunity ? 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning' : 
          'bg-brand-success/10 border-brand-success/20 text-brand-success'
        )}>
          {loss ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
        </div>
      </div>
      {(trend || description) && (
        <div className="flex items-center gap-1.5 text-[9px] font-bold border-t border-brand-border/10 pt-3 text-brand-secondaryText">
          {trend && (
            <span className={cn(
              'px-1.5 py-0.5 rounded-md',
              loss ? 'text-brand-danger bg-brand-danger/10' : 'text-brand-success bg-brand-success/10'
            )}>
              {trend}
            </span>
          )}
          <span>{description}</span>
        </div>
      )}
    </motion.div>
  );
}

// 6. Sustainability Card
export function SustainabilityCard({ title, value, carbonSaved, repairRatio, grade }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] shadow-premium flex items-center justify-between gap-4 overflow-hidden relative group"
    >
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-black text-brand-success uppercase tracking-wider block mb-1">ESG Performance</span>
        <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-brand-success transition-all duration-300">{title}</h4>
        
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-2 mt-4 text-[10px] text-brand-secondaryText font-semibold border-t border-brand-border/20 pt-3">
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Carbon Saved</span>
            <span className="text-brand-success">{carbonSaved} kg CO₂</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Repair vs Replace</span>
            <span className="text-white">{repairRatio}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Environmental Rating</span>
            <span className="text-indigo-300 font-extrabold">{grade} Grade</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[8px]">Sustainability Index</span>
            <span className="text-white font-bold">{value}%</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <ProgressRing value={value} size={76} strokeWidth={8} label="ESG" />
      </div>
    </motion.div>
  );
}

// 7. Prediction Card
export function PredictionCard({ title, failureRisk, replacementScore, priority, forecastDate }) {
  const getRiskColor = () => {
    if (failureRisk >= 75) return 'text-brand-danger';
    if (failureRisk >= 40) return 'text-brand-warning';
    return 'text-brand-success';
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] shadow-premium flex flex-col gap-3 relative overflow-hidden"
    >
      <div>
        <h4 className="text-xs font-black text-white tracking-tight">{title}</h4>
        <span className="text-[9px] text-brand-secondaryText font-mono mt-0.5 block">Estimated Fault: {forecastDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] text-brand-secondaryText font-semibold border-t border-brand-border/20 pt-2.5 mt-1">
        <div>
          <span className="text-slate-500 block uppercase font-bold text-[8px]">Failure Probability</span>
          <span className={cn('font-black text-sm', getRiskColor())}>{failureRisk}%</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-bold text-[8px]">Replacement Priority</span>
          <span className={cn(
            'font-black text-sm block mt-0.5',
            priority === 'Critical' ? 'text-brand-danger' : priority === 'High' ? 'text-brand-warning' : 'text-slate-300'
          )}>{priority}</span>
        </div>
      </div>
      
      <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mt-1">
        <div className="bg-brand-primary h-full rounded-full" style={{ width: `${replacementScore}%` }} />
      </div>
    </motion.div>
  );
}

// 8. Global Futuristic "Innovation Center Portal" Launcher Widget
export function InnovationLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Innovation Hub', path: '/dashboard/innovation', icon: Compass, color: 'text-indigo-400' },
    { name: 'Health Center', path: '/dashboard/health-center', icon: Heart, color: 'text-brand-danger' },
    { name: 'AI wellness Care', path: '/dashboard/asset-care', icon: Sparkles, color: 'text-brand-accent' },
    { name: 'Digital Twin office', path: '/dashboard/digital-twin', icon: Sliders, color: 'text-brand-primary' },
    { name: 'Alternatives Engine', path: '/dashboard/recommendations', icon: Zap, color: 'text-indigo-300' },
    { name: 'Idle Detector', path: '/dashboard/idle-assets', icon: Flame, color: 'text-brand-warning' },
    { name: 'Saving Center', path: '/dashboard/cost-saving', icon: DollarSign, color: 'text-brand-success' },
    { name: 'Sustainability (ESG)', path: '/dashboard/sustainability', icon: Droplet, color: 'text-brand-success' },
    { name: 'Warranty Tracker', path: '/dashboard/warranty', icon: Shield, color: 'text-brand-primary' },
    { name: 'Asset Passport', path: '/dashboard/asset-passport', icon: FileText, color: 'text-indigo-400' },
    { name: 'CEO Insights', path: '/dashboard/executive-dashboard', icon: BarChart2, color: 'text-brand-accent' },
    { name: 'Future Predictions', path: '/dashboard/future-insights', icon: ShieldAlert, color: 'text-brand-danger' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating launcher trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-white/15 focus:outline-none"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Compass className="w-5.5 h-5.5 animate-spin-slow" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="absolute bottom-16 right-0 w-80 glass-panel border border-brand-border/60 bg-[#070b18]/95 p-5 rounded-2xl shadow-premium flex flex-col gap-4.5"
          >
            <div className="flex items-center gap-2 border-b border-brand-border/30 pb-2.5">
              <Compass className="w-4 h-4 text-brand-primary animate-pulse" />
              <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Version 4 Innovation Hub</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all text-left relative overflow-hidden group',
                      isActive 
                        ? 'bg-gradient-to-tr from-brand-primary/20 to-brand-purple/5 border-brand-primary/40 text-white' 
                        : 'bg-[#111827]/40 border-brand-border hover:border-slate-800 text-brand-secondaryText hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-4.5 h-4.5 shrink-0', link.color, 'group-hover:scale-110 transition-transform duration-300')} />
                    <span className="text-[9px] font-bold tracking-tight leading-tight block">{link.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <Link
              to="/dashboard/innovation"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1 py-1.5 bg-[#111827]/60 hover:bg-slate-900 border border-brand-border text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-white rounded-xl transition-all"
            >
              <span>Explore Dashboard Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
