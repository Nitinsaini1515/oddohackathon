import React from 'react';
import { Heart, Activity, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import ProgressCircle from '../common/ProgressCircle';

export default function HealthScoreCard({
  asset,
  className = ''
}) {
  const { name, assetTag, condition, status } = asset;

  // Compute a mock health score based on condition and status
  const getHealthScore = () => {
    let score = 100;
    if (condition === 'Good') score = 85;
    else if (condition === 'Fair') score = 65;
    else if (condition === 'Poor') score = 40;
    else if (condition === 'Broken') score = 10;

    if (status === 'Under Maintenance') score -= 15;
    return Math.max(score, 5);
  };

  const score = getHealthScore();

  const getReliabilityRating = () => {
    if (score >= 80) return 'High Operational Reliability';
    if (score >= 50) return 'Moderate Wear Detected';
    return 'Immediate Service Required';
  };

  return (
    <div className={cn('glass-panel p-5 rounded-2xl border border-brand-border/40 flex items-center justify-between gap-5 bg-[#111827]', className)}>
      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight truncate">{name}</h4>
          <span className="text-[10px] text-brand-secondaryText font-mono mt-0.5 block">{assetTag}</span>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-brand-secondaryText">
            <Heart className="w-3.5 h-3.5 text-brand-danger shrink-0" />
            <span>Condition: <strong className="text-white">{condition}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-secondaryText">
            <Activity className="w-3.5 h-3.5 text-brand-success shrink-0" />
            <span className="truncate">{getReliabilityRating()}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-center">
        <ProgressCircle value={score} size={70} strokeWidth={7} />
        <span className="text-[9px] text-slate-500 font-extrabold uppercase mt-1 tracking-wider">Health Index</span>
      </div>
    </div>
  );
}
