import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`glass-panel relative rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
