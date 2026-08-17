import React from 'react';

interface GlassSkeletonTextProps {
  lines?: number;
  className?: string;
}

export const GlassSkeletonText: React.FC<GlassSkeletonTextProps> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-shimmer h-4 rounded-lg ${
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};
