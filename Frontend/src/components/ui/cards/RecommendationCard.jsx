import React from 'react';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function RecommendationCard({
  recommendation,
  onActionClick,
  className = ''
}) {
  const { title, reason, suggestedAsset, alternativeAsset, type } = recommendation;

  return (
    <div className={cn('glass-panel p-5 rounded-2xl border border-brand-border/40 hover:border-slate-800 transition-all flex flex-col justify-between gap-4 bg-[#111827] relative overflow-hidden group', className)}>
      <div className="absolute top-0 right-0 p-3 bg-brand-primary/10 rounded-bl-2xl border-l border-b border-brand-border/40 text-brand-primary">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div className="flex-1">
        <span className="text-[9px] font-bold text-brand-purple uppercase tracking-wider block mb-1">
          {type || 'Replacement Alert'}
        </span>
        <h4 className="text-sm font-bold text-white tracking-tight leading-snug pr-6">{title}</h4>
        <p className="text-xs text-brand-secondaryText leading-relaxed mt-2">{reason}</p>

        {/* Suggestion detail nodes */}
        <div className="mt-4 space-y-2 border-t border-brand-border/20 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-secondaryText">Target Option:</span>
            <span className="text-white font-semibold">{suggestedAsset}</span>
          </div>
          {alternativeAsset && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-secondaryText">Alternative:</span>
              <span className="text-slate-400 font-semibold">{alternativeAsset}</span>
            </div>
          )}
        </div>
      </div>

      {onActionClick && (
        <button
          onClick={() => onActionClick(recommendation)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-purple rounded-xl hover:shadow-glow-primary transition-all duration-300"
        >
          <span>Select Recommendation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
