import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import DangerButton from '../buttons/DangerButton';

export default function ConfirmationDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary' // 'primary' | 'danger'
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="w-full max-w-md glass-panel rounded-2xl border border-brand-border/40 shadow-premium overflow-hidden relative z-10 flex flex-col"
          >
            {/* Header / Info Section */}
            <div className="p-6 pb-4 flex gap-4">
              <div className={`p-3 rounded-xl border self-start ${
                variant === 'danger'
                  ? 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger shadow-glow-danger/5'
                  : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
                <p className="text-xs text-brand-secondaryText leading-relaxed mt-1.5">{message}</p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900/60 transition-all self-start focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CTA Actions Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4.5 bg-slate-950/40 border-t border-brand-border/25">
              <SecondaryButton onClick={onCancel} className="text-xs py-1.5 px-4">
                {cancelLabel}
              </SecondaryButton>
              {variant === 'danger' ? (
                <DangerButton onClick={onConfirm} className="text-xs py-1.5 px-4">
                  {confirmLabel}
                </DangerButton>
              ) : (
                <PrimaryButton onClick={onConfirm} className="text-xs py-1.5 px-4">
                  {confirmLabel}
                </PrimaryButton>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
