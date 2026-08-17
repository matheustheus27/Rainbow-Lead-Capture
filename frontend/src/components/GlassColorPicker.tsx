import React from 'react';
import { Check, Palette } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface GlassColorPickerProps {
  value: string;
  onChange: (colorValue: string) => void;
  availableColors: string[];
  error?: string;
  label?: string;
  hint?: string;
}

interface ColorTokenConfig {
  value: string;
  bgRgba: string;
  borderRgba: string;
  glowColor: string;
  hex: string;
}

const COLOR_CONFIG_MAP: Record<string, ColorTokenConfig> = {
  Red: {
    value: 'Red',
    bgRgba: 'rgba(239, 68, 68, 0.35)',
    borderRgba: 'rgba(248, 113, 113, 0.7)',
    glowColor: 'rgba(239, 68, 68, 0.65)',
    hex: '#ef4444',
  },
  Vermelho: {
    value: 'Red',
    bgRgba: 'rgba(239, 68, 68, 0.35)',
    borderRgba: 'rgba(248, 113, 113, 0.7)',
    glowColor: 'rgba(239, 68, 68, 0.65)',
    hex: '#ef4444',
  },
  Orange: {
    value: 'Orange',
    bgRgba: 'rgba(249, 115, 22, 0.35)',
    borderRgba: 'rgba(251, 146, 60, 0.7)',
    glowColor: 'rgba(249, 115, 22, 0.65)',
    hex: '#f97316',
  },
  Laranja: {
    value: 'Orange',
    bgRgba: 'rgba(249, 115, 22, 0.35)',
    borderRgba: 'rgba(251, 146, 60, 0.7)',
    glowColor: 'rgba(249, 115, 22, 0.65)',
    hex: '#f97316',
  },
  Yellow: {
    value: 'Yellow',
    bgRgba: 'rgba(234, 179, 8, 0.35)',
    borderRgba: 'rgba(250, 204, 21, 0.8)',
    glowColor: 'rgba(234, 179, 8, 0.65)',
    hex: '#eab308',
  },
  Amarelo: {
    value: 'Yellow',
    bgRgba: 'rgba(234, 179, 8, 0.35)',
    borderRgba: 'rgba(250, 204, 21, 0.8)',
    glowColor: 'rgba(234, 179, 8, 0.65)',
    hex: '#eab308',
  },
  Green: {
    value: 'Green',
    bgRgba: 'rgba(34, 197, 94, 0.35)',
    borderRgba: 'rgba(74, 222, 128, 0.7)',
    glowColor: 'rgba(34, 197, 94, 0.65)',
    hex: '#22c55e',
  },
  Verde: {
    value: 'Green',
    bgRgba: 'rgba(34, 197, 94, 0.35)',
    borderRgba: 'rgba(74, 222, 128, 0.7)',
    glowColor: 'rgba(34, 197, 94, 0.65)',
    hex: '#22c55e',
  },
  Blue: {
    value: 'Blue',
    bgRgba: 'rgba(59, 130, 246, 0.35)',
    borderRgba: 'rgba(96, 165, 250, 0.7)',
    glowColor: 'rgba(59, 130, 246, 0.65)',
    hex: '#3b82f6',
  },
  Azul: {
    value: 'Blue',
    bgRgba: 'rgba(59, 130, 246, 0.35)',
    borderRgba: 'rgba(96, 165, 250, 0.7)',
    glowColor: 'rgba(59, 130, 246, 0.65)',
    hex: '#3b82f6',
  },
  Indigo: {
    value: 'Indigo',
    bgRgba: 'rgba(99, 102, 241, 0.35)',
    borderRgba: 'rgba(129, 140, 248, 0.7)',
    glowColor: 'rgba(99, 102, 241, 0.65)',
    hex: '#6366f1',
  },
  Índigo: {
    value: 'Indigo',
    bgRgba: 'rgba(99, 102, 241, 0.35)',
    borderRgba: 'rgba(129, 140, 248, 0.7)',
    glowColor: 'rgba(99, 102, 241, 0.65)',
    hex: '#6366f1',
  },
  Anil: {
    value: 'Indigo',
    bgRgba: 'rgba(99, 102, 241, 0.35)',
    borderRgba: 'rgba(129, 140, 248, 0.7)',
    glowColor: 'rgba(99, 102, 241, 0.65)',
    hex: '#6366f1',
  },
  Violet: {
    value: 'Violet',
    bgRgba: 'rgba(168, 85, 247, 0.35)',
    borderRgba: 'rgba(192, 132, 252, 0.7)',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    hex: '#a855f7',
  },
  Violeta: {
    value: 'Violet',
    bgRgba: 'rgba(168, 85, 247, 0.35)',
    borderRgba: 'rgba(192, 132, 252, 0.7)',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    hex: '#a855f7',
  },
};

const DEFAULT_RAINBOW_LIST = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];

export const GlassColorPicker: React.FC<GlassColorPickerProps> = ({
  value,
  onChange,
  availableColors = DEFAULT_RAINBOW_LIST,
  error,
  label,
  hint,
}) => {
  const { t } = useLanguage();

  // Deduplicate and map canonical color list
  const uniqueColorKeys = React.useMemo(() => {
    const rawList = availableColors.length > 0 ? availableColors : DEFAULT_RAINBOW_LIST;
    const seen = new Set<string>();
    const list: string[] = [];

    rawList.forEach((c) => {
      const config = COLOR_CONFIG_MAP[c];
      const canonical = config ? config.value : c;
      if (!seen.has(canonical)) {
        seen.add(canonical);
        list.push(c);
      }
    });

    return list.length > 0 ? list : DEFAULT_RAINBOW_LIST;
  }, [availableColors]);

  const selectedConfig = value ? COLOR_CONFIG_MAP[value] : undefined;
  const localizedSelectedName = value ? (t.colors[value] || value) : null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label and Header */}
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{label || t.form.colorLabel}</span>
          <span className="text-purple-600 dark:text-purple-400">*</span>
        </label>
        <span className="text-slate-500 dark:text-slate-400 font-medium lowercase text-xs">
          {hint || t.form.colorHint}
        </span>
      </div>

      {/* Glassmorphic Container for Color Tokens */}
      <div
        role="radiogroup"
        aria-label={label || t.form.colorLabel}
        className={`w-full p-4 rounded-2xl bg-white/60 dark:bg-black/20 border backdrop-blur-md transition-all duration-300 shadow-inner flex flex-col gap-3.5 ${
          error
            ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            : 'border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20'
        }`}
      >
        {/* Token Row / Grid */}
        <div className="flex items-center justify-between sm:justify-around gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {uniqueColorKeys.map((colorName) => {
            const config = COLOR_CONFIG_MAP[colorName] || {
              value: colorName,
              bgRgba: 'rgba(168, 85, 247, 0.35)',
              borderRgba: 'rgba(192, 132, 252, 0.7)',
              glowColor: 'rgba(168, 85, 247, 0.65)',
              hex: '#a855f7',
            };

            const isSelected =
              value.toLowerCase() === config.value.toLowerCase() ||
              value.toLowerCase() === colorName.toLowerCase();

            const displayName = t.colors[colorName] || colorName;

            return (
              <button
                key={colorName}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={displayName}
                title={displayName}
                onClick={() => onChange(config.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(config.value);
                  }
                }}
                style={{
                  backgroundColor: config.bgRgba,
                  borderColor: isSelected ? '#ffffff' : config.borderRgba,
                  boxShadow: isSelected
                    ? `0 0 16px rgba(255, 255, 255, 0.8), 0 0 25px ${config.glowColor}, inset 0 0 10px rgba(255, 255, 255, 0.5)`
                    : `0 4px 10px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)`,
                }}
                className={`group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-300 flex items-center justify-center cursor-pointer outline-none ${
                  isSelected
                    ? 'scale-115 sm:scale-120 z-10'
                    : 'hover:scale-110 hover:-translate-y-0.5 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Visual Checkmark indicator when selected */}
                {isSelected ? (
                  <Check
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-in zoom-in-50 duration-200 stroke-[3]"
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white/90 group-hover:scale-150 transition-all duration-200" />
                )}

                {/* Micro Tooltip on Hover */}
                <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 z-30 shadow-lg border border-white/15">
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Color Feedback Badge */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {t.form.selectedColorLabel}
          </span>

          {selectedConfig && localizedSelectedName ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/10 dark:bg-black/30 border border-slate-300 dark:border-white/15 backdrop-blur-md shadow-sm animate-in fade-in">
              <span
                className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: selectedConfig.hex, color: selectedConfig.hex }}
              />
              <span className="font-bold text-slate-800 dark:text-white tracking-wide">
                {localizedSelectedName}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 italic text-xs font-medium">
              {t.form.selectColorPrompt}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};
