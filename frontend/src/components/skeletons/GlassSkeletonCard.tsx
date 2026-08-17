import React from 'react';
import { GlassCard } from '../GlassCard';

export const GlassSkeletonCard: React.FC = () => {
  return (
    <GlassCard className="border border-white/10 shadow-2xl backdrop-blur-xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center mb-8">
        <div className="skeleton-shimmer h-6 w-44 rounded-full mb-4" />
        <div className="skeleton-shimmer h-9 w-64 rounded-xl mb-3" />
        <div className="skeleton-shimmer h-4 w-80 rounded-lg" />
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <div className="skeleton-shimmer h-3.5 w-24 rounded" />
          <div className="skeleton-shimmer h-12 w-full rounded-xl" />
        </div>

        {/* CPF and Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="skeleton-shimmer h-3.5 w-20 rounded" />
            <div className="skeleton-shimmer h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <div className="skeleton-shimmer h-3.5 w-20 rounded" />
            <div className="skeleton-shimmer h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Favorite Rainbow Color */}
        <div className="space-y-1.5">
          <div className="skeleton-shimmer h-3.5 w-36 rounded" />
          <div className="skeleton-shimmer h-12 w-full rounded-xl" />
        </div>

        {/* Observations */}
        <div className="space-y-1.5">
          <div className="skeleton-shimmer h-3.5 w-28 rounded" />
          <div className="skeleton-shimmer h-24 w-full rounded-xl" />
        </div>

        {/* Submit Button */}
        <div className="skeleton-shimmer h-14 w-full rounded-2xl mt-6" />
      </div>
    </GlassCard>
  );
};
