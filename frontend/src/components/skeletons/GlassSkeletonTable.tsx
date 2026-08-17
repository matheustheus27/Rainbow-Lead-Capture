import React from 'react';
import { GlassCard } from '../GlassCard';

export const GlassSkeletonTable: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="p-5 border border-white/10 flex flex-col gap-2">
            <div className="skeleton-shimmer h-3.5 w-24 rounded" />
            <div className="skeleton-shimmer h-8 w-16 rounded-lg" />
            <div className="skeleton-shimmer h-3 w-32 rounded" />
          </GlassCard>
        ))}
      </div>

      {/* Chart Skeleton Box */}
      <GlassCard className="p-6 border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <div className="skeleton-shimmer h-5 w-48 rounded" />
          <div className="skeleton-shimmer h-4 w-28 rounded" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton-shimmer h-4 w-16 rounded" />
              <div className="skeleton-shimmer h-5 flex-1 rounded-full" />
              <div className="skeleton-shimmer h-4 w-12 rounded" />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Table Skeleton */}
      <GlassCard className="p-6 border border-white/10 space-y-4">
        <div className="flex justify-between items-center pb-2">
          <div className="skeleton-shimmer h-5 w-40 rounded" />
          <div className="skeleton-shimmer h-9 w-60 rounded-xl" />
        </div>

        <div className="space-y-3">
          <div className="skeleton-shimmer h-8 w-full rounded-lg" />
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="skeleton-shimmer h-12 w-full rounded-xl" />
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
