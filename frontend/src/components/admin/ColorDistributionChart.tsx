import React from 'react';
import { Palette, BarChart3, TrendingUp } from 'lucide-react';
import { ColorDistributionItem } from '../../types/customer';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../GlassCard';

interface ColorDistributionChartProps {
  distribution: ColorDistributionItem[];
  totalLeads: number;
  topColor: string | null;
  onColorSelect?: (color: string) => void;
  selectedColor?: string;
}

const COLOR_MAP: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  Red: { bg: '#ef4444', border: '#f87171', glow: 'rgba(239, 68, 68, 0.4)', text: '#fca5a5' },
  Vermelho: { bg: '#ef4444', border: '#f87171', glow: 'rgba(239, 68, 68, 0.4)', text: '#fca5a5' },
  Orange: { bg: '#f97316', border: '#fb923c', glow: 'rgba(249, 115, 22, 0.4)', text: '#fdba74' },
  Laranja: { bg: '#f97316', border: '#fb923c', glow: 'rgba(249, 115, 22, 0.4)', text: '#fdba74' },
  Yellow: { bg: '#eab308', border: '#facc15', glow: 'rgba(234, 179, 8, 0.4)', text: '#fde047' },
  Amarelo: { bg: '#eab308', border: '#facc15', glow: 'rgba(234, 179, 8, 0.4)', text: '#fde047' },
  Green: { bg: '#22c55e', border: '#4ade80', glow: 'rgba(34, 197, 94, 0.4)', text: '#86efac' },
  Verde: { bg: '#22c55e', border: '#4ade80', glow: 'rgba(34, 197, 94, 0.4)', text: '#86efac' },
  Blue: { bg: '#3b82f6', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)', text: '#93c5fd' },
  Azul: { bg: '#3b82f6', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)', text: '#93c5fd' },
  Indigo: { bg: '#6366f1', border: '#818cf8', glow: 'rgba(99, 102, 241, 0.4)', text: '#c7d2fe' },
  Índigo: { bg: '#6366f1', border: '#818cf8', glow: 'rgba(99, 102, 241, 0.4)', text: '#c7d2fe' },
  Anil: { bg: '#6366f1', border: '#818cf8', glow: 'rgba(99, 102, 241, 0.4)', text: '#c7d2fe' },
  Violet: { bg: '#a855f7', border: '#c084fc', glow: 'rgba(168, 85, 247, 0.4)', text: '#e9d5ff' },
  Violeta: { bg: '#a855f7', border: '#c084fc', glow: 'rgba(168, 85, 247, 0.4)', text: '#e9d5ff' },
};

const DEFAULT_COLOR = {
  bg: '#8b5cf6',
  border: '#a78bfa',
  glow: 'rgba(139, 92, 246, 0.4)',
  text: '#ddd6fe',
};

export const ColorDistributionChart: React.FC<ColorDistributionChartProps> = ({
  distribution,
  totalLeads,
  topColor,
  onColorSelect,
  selectedColor = 'ALL',
}) => {
  const { t } = useLanguage();

  if (distribution.length === 0 || totalLeads === 0) {
    return (
      <GlassCard className="p-6 sm:p-8 text-center border border-slate-200 dark:border-white/10">
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Palette className="w-12 h-12 mb-3 opacity-40 text-purple-600 dark:text-purple-400 animate-pulse" />
          <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">{t.admin.noRecordsTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            {t.admin.noRecordsDesc}
          </p>
        </div>
      </GlassCard>
    );
  }

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);
  const localizedTopColor = topColor ? (t.colors[topColor] || topColor) : null;

  return (
    <GlassCard className="p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{t.admin.analyticsTitle}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {t.admin.analyticsTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.admin.analyticsSubtitle}
          </p>
        </div>

        {localizedTopColor && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{t.admin.topColor}: <strong>{localizedTopColor}</strong></span>
          </div>
        )}
      </div>

      {/* Visual Multi-Color Stack Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>{t.admin.analyticsSubtitle}</span>
          <span>{totalLeads} {t.admin.leads}</span>
        </div>
        <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-800/40 p-0.5 border border-white/10 shadow-inner">
          {distribution.map((item) => {
            const styleInfo = COLOR_MAP[item.color] || DEFAULT_COLOR;
            const displayName = t.colors[item.color] || item.color;
            return (
              <div
                key={item.color}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: styleInfo.bg,
                  boxShadow: `0 0 10px ${styleInfo.glow}`,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:brightness-125"
                title={`${displayName}: ${item.count} (${item.percentage}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Semantic Breakdown Bars */}
      <div className="space-y-3.5 pt-2">
        {distribution.map((item) => {
          const styleInfo = COLOR_MAP[item.color] || DEFAULT_COLOR;
          const isSelected = selectedColor.toLowerCase() === item.color.toLowerCase();
          const relativeWidth = Math.max((item.count / maxCount) * 100, 6);
          const displayName = t.colors[item.color] || item.color;

          return (
            <div
              key={item.color}
              onClick={() => onColorSelect?.(isSelected ? 'ALL' : item.color)}
              className={`group flex items-center gap-3.5 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/10 dark:bg-white/10 ring-1 ring-purple-500/50'
                  : 'hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              {/* Color Label & Dot */}
              <div className="w-24 sm:w-28 flex items-center gap-2 flex-shrink-0">
                <span
                  className="w-3 h-3 rounded-full border border-white/40 shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: styleInfo.bg,
                    boxShadow: `0 0 8px ${styleInfo.glow}`,
                  }}
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {displayName}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="flex-1 h-6 bg-slate-900/40 dark:bg-slate-950/50 rounded-lg p-1 border border-white/5 relative overflow-hidden flex items-center">
                <div
                  style={{
                    width: `${relativeWidth}%`,
                    backgroundColor: styleInfo.bg,
                    boxShadow: `0 0 15px ${styleInfo.glow}`,
                  }}
                  className="h-full rounded-md transition-all duration-700 ease-out"
                />
                <span className="absolute right-2 text-xs font-semibold text-slate-300 dark:text-slate-200">
                  {item.count}
                </span>
              </div>

              {/* Percentage Badge */}
              <div className="w-12 text-right">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {onColorSelect && selectedColor !== 'ALL' && (
        <div className="pt-2 text-center">
          <button
            onClick={() => onColorSelect('ALL')}
            type="button"
            className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline font-medium cursor-pointer"
          >
            {t.admin.allColors} ({t.admin.customerDirectory})
          </button>
        </div>
      )}
    </GlassCard>
  );
};
