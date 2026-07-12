import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  BarChart3,
  CheckCircle,
  Menu,
  X,
  Package,
  Users,
  Compass
} from 'lucide-react';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#060816] text-white flex flex-col relative overflow-hidden select-none">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
      
      {/* 1. Header Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[70px] flex items-center px-4 md:px-12 justify-between border-b ${
        scrolled ? 'bg-[#060816]/75 backdrop-blur-md border-brand-border/40' : 'bg-transparent border-transparent'
      }`}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-purple flex items-center justify-center shadow-glow-primary">
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-secondaryText">
            Asset<span className="text-brand-accent">Flow</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-brand-secondaryText">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats" className="hover:text-white transition-colors">Metrics</a>
          <a href="#about" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </nav>

        {/* Desktop Auth CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-xs font-semibold text-brand-secondaryText hover:text-white transition-colors">Sign In</Link>
          <Link to="/register">
            <PrimaryButton className="text-xs px-4 py-2">Get Started</PrimaryButton>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-brand-secondaryText hover:text-white hover:bg-brand-cardHover border border-brand-border/40 transition-all md:hidden"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="fixed top-[70px] left-0 right-0 bg-[#060816]/95 border-b border-brand-border z-40 overflow-hidden md:hidden"
      >
        <div className="flex flex-col gap-4 px-6 py-6 text-sm font-semibold">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-brand-secondaryText hover:text-white">Features</a>
          <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="text-brand-secondaryText hover:text-white">Metrics</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-brand-secondaryText hover:text-white">Enterprise</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-brand-secondaryText hover:text-white">Reviews</a>
          <div className="h-px bg-brand-border/30 my-2" />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-brand-secondaryText hover:text-white">Sign In</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
            <PrimaryButton className="w-full text-xs">Get Started</PrimaryButton>
          </Link>
        </div>
      </motion.div>

      {/* 2. Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 md:pt-40 md:pb-24 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-6 animate-pulse"
        >
          <Zap className="w-3.5 h-3.5" /> Next Gen ERP Asset Registry
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-secondaryText"
        >
          Streamline Enterprise <br className="hidden md:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-purple to-brand-accent">
            Asset Lifecycle Management
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-brand-secondaryText max-w-2xl mt-6 leading-relaxed"
        >
          Centralize your hardware inventories, track allocation states, govern departments, and monitor employee resource histories on a single, glassmorphic ERP dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <PrimaryButton className="w-full sm:w-auto text-sm px-6 py-3" icon={ArrowRight}>
              Deploy AssetFlow
            </PrimaryButton>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <SecondaryButton className="w-full sm:w-auto text-sm px-6 py-3">
              Explore Demo Environment
            </SecondaryButton>
          </Link>
        </motion.div>
      </section>

      {/* Dashboard Preview Graphic */}
      <section className="px-4 md:px-12 max-w-5xl mx-auto mb-24 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-2 rounded-2xl border border-brand-border/40 shadow-premium bg-gradient-to-tr from-slate-900/60 to-brand-card/40"
        >
          <div className="rounded-xl border border-brand-border/30 bg-brand-bg/80 aspect-[16/9] overflow-hidden flex items-center justify-center p-6 relative group">
            <div className="absolute inset-0 bg-[#060816] flex flex-col p-4 select-none">
              {/* Fake dashboard shell */}
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[10px] text-brand-secondaryText font-mono ml-2">https://app.assetflow.io/dashboard</span>
                </div>
                <div className="w-20 h-4 bg-slate-900 rounded-md border border-brand-border/50" />
              </div>
              <div className="flex-1 grid grid-cols-4 gap-3">
                <div className="col-span-1 bg-slate-950/60 border border-brand-border/30 rounded-xl p-3 flex flex-col gap-2">
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                  <div className="h-5 bg-brand-primary/20 border border-brand-primary/30 rounded w-1/2" />
                  <div className="h-3 bg-slate-800 rounded w-3/4" />
                </div>
                <div className="col-span-3 bg-slate-950/40 border border-brand-border/30 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-24 h-4 bg-slate-800 rounded" />
                    <div className="w-12 h-4 bg-brand-success/20 border border-brand-success/30 rounded" />
                  </div>
                  <div className="flex-1 flex items-end gap-2 pt-6">
                    <div className="bg-slate-800 rounded-t h-[40%] flex-1" />
                    <div className="bg-brand-primary/40 rounded-t h-[75%] flex-1" />
                    <div className="bg-slate-800 rounded-t h-[55%] flex-1" />
                    <div className="bg-brand-purple/40 rounded-t h-[80%] flex-1" />
                  </div>
                </div>
              </div>
            </div>
            {/* Centered click visual overlay */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-xs">
              <Link to="/dashboard">
                <PrimaryButton className="text-xs">Launch Interactive System</PrimaryButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="px-4 md:px-12 max-w-5xl mx-auto py-16 border-t border-brand-border/20 w-full relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Enterprise Core Capabilities</span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white">Full Lifecycle Visibility</h2>
          <p className="text-xs text-brand-secondaryText mt-3">From onboarding procurement registry logs down to retirement and transfers metadata, govern assets safely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-6 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl w-fit mb-4">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Structured Asset Registry</h3>
              <p className="text-xs text-brand-secondaryText mt-2 leading-relaxed">
                Log hardware properties, category schemas, custom specs, serial records, and tag generation tools directly inside Vite.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-6 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded-xl w-fit mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Department & Team Hub</h3>
              <p className="text-xs text-brand-secondaryText mt-2 leading-relaxed">
                Map assets to divisions (IT, Engineering, Accounts) and team members. Control employee records and check current holding states.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-6 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-brand-success/10 border border-brand-success/20 text-brand-success rounded-xl w-fit mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Interactive Telemetry</h3>
              <p className="text-xs text-brand-secondaryText mt-2 leading-relaxed">
                Monitor category item metrics, check status ratios with pie charts, and view purchase valuations using Recharts widgets.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Statistics Metrics Row */}
      <section id="stats" className="px-4 md:px-12 max-w-5xl mx-auto py-16 border-t border-brand-border/20 w-full relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-950/40 border border-brand-border/30 rounded-2xl p-8 text-center backdrop-blur-xs">
          <div>
            <h4 className="text-3xl font-extrabold text-white">$1.2M+</h4>
            <p className="text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider mt-1">Managed Value</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-white">99.8%</h4>
            <p className="text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider mt-1">Registry Uptime</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-white">450+</h4>
            <p className="text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider mt-1">Assigned Assets</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-white">15m</h4>
            <p className="text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider mt-1">Onboarding Time</p>
          </div>
        </div>
      </section>

      {/* 5. Testimonial Section */}
      <section id="testimonials" className="px-4 md:px-12 max-w-5xl mx-auto py-16 border-t border-brand-border/20 w-full relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Industry Endorsements</span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white">Loved by Operations Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between">
            <p className="text-xs text-brand-secondaryText italic leading-relaxed">
              "We replaced our slow, legacy spreadsheet database with AssetFlow. Our IT department can audit and register custom server racks, assign developer MacBooks, and review timelines in a third of the time."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-xs">AM</div>
              <div>
                <p className="text-xs font-bold text-white">Arthur Pendragon</p>
                <p className="text-[10px] text-brand-secondaryText">VP of IT Operations, Camelot Ltd</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between">
            <p className="text-xs text-brand-secondaryText italic leading-relaxed">
              "The React UI feels extremely fast. Being able to toggle between employee asset folders, filters, and dynamic dashboard metrics has completely solved our team allocation visibility problem."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center font-bold text-xs">EL</div>
              <div>
                <p className="text-xs font-bold text-white">Esther Laurent</p>
                <p className="text-[10px] text-brand-secondaryText">Director of Resources, Helios Space</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto border-t border-brand-border/40 bg-slate-950/60 py-12 px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-purple flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-extrabold text-white">AssetFlow</span>
          </div>
          <div className="flex gap-8 text-[11px] text-brand-secondaryText font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-white transition-colors">Metrics</a>
            <a href="#about" className="hover:text-white transition-colors">Enterprise</a>
            <a href="/login" className="hover:text-white transition-colors">Dashboard Portal</a>
          </div>
          <div className="text-[11px] text-brand-secondaryText">
            © 2026 AssetFlow Inc. For Odoo Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}
