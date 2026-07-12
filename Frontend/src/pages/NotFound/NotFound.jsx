import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, ArrowRight } from 'lucide-react';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';

export default function NotFound() {
  return (
    <div className="min-h-screen w-screen bg-[#060816] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none" />

      <div className="text-center flex flex-col items-center max-w-md relative z-10">
        
        {/* Animated Compass Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="p-4.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full mb-6 w-fit shadow-glow-primary"
        >
          <Compass className="w-10 h-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-primary to-brand-purple tracking-tighter"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base font-bold text-white mt-4 tracking-tight"
        >
          Lost in Space
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs text-brand-secondaryText mt-2.5 leading-relaxed"
        >
          The page route you are seeking doesn't exist in our registry database. It may have been unallocated or retired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Link to="/dashboard">
            <PrimaryButton className="text-xs px-6 py-2.5" icon={ArrowRight}>
              Back to Dashboard
            </PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
