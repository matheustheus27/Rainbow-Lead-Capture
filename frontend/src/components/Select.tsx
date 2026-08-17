import React from 'react';
import { Palette, ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
  hint?: string;
}

// Color palette mapping to provide vibrant color dots
const COLOR_MAP: Record<string, string> = {
  Red: '#ef4444',
  Vermelho: '#ef4444',
  Orange: '#f97316',
  Laranja: '#f97316',
  Yellow: '#eab308',
  Amarelo: '#eab308',
  Green: '#22c55e',
  Verde: '#22c55e',
  Blue: '#3b82f6',
  Azul: '#3b82f6',
  Indigo: '#6366f1',
  Índigo: '#6366f1',
  Anil: '#6366f1',
  Violet: '#a855f7',
  Violeta: '#a855f7',
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  hint,
  id,
  value,
  className = '',
  ...props
}) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  const selectedColorHex = typeof value === 'string' ? COLOR_MAP[value] : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left group">
      <div className="flex items-center justify-between">
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400"
        >
          {label} {props.required && <span className="text-purple-600 dark:text-purple-400">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{hint}</span>}
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-500 dark:text-slate-400 pointer-events-none transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 flex items-center gap-1.5">
          {selectedColorHex ? (
            <span
              className="w-4 h-4 rounded-full border border-white/30 shadow-sm inline-block transition-transform scale-110"
              style={{ backgroundColor: selectedColorHex, boxShadow: `0 0 10px ${selectedColorHex}80` }}
            />
          ) : (
            <Palette className="w-5 h-5" />
          )}
        </div>

        <select
          id={selectId}
          value={value}
          className={`glass-input w-full rounded-xl py-3 pl-11 pr-10 text-sm md:text-base font-normal appearance-none cursor-pointer ${
            error ? 'glass-input-error' : ''
          } ${className}`}
          {...props}
        >
          <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            Choose your favorite rainbow color...
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-2">
              {option}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 text-slate-500 dark:text-slate-400 pointer-events-none group-hover:text-slate-700 dark:group-hover:text-slate-200">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};
