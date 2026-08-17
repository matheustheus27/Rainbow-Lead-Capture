import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export type ValidationState = 'valid' | 'invalid' | 'neutral';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
  validationState?: ValidationState;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  hint,
  validationState = 'neutral',
  id,
  className = '',
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  const getValidationClass = () => {
    if (error || validationState === 'invalid') return 'glass-input-error';
    if (validationState === 'valid') return 'glass-input-valid';
    return '';
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left group">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400"
        >
          {label} {props.required && <span className="text-purple-600 dark:text-purple-400">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{hint}</span>}
      </div>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-500 dark:text-slate-400 pointer-events-none transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`glass-input w-full rounded-xl py-3 px-4 text-sm md:text-base font-normal shadow-inner ${
            icon ? 'pl-11' : ''
          } ${validationState !== 'neutral' || error ? 'pr-11' : ''} ${getValidationClass()} ${className}`}
          {...props}
        />

        {/* Validation Status Indicator Icons */}
        {validationState === 'valid' && !error && (
          <div className="absolute right-3.5 text-emerald-500 dark:text-emerald-400 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
        {(validationState === 'invalid' || error) && (
          <div className="absolute right-3.5 text-rose-500 dark:text-rose-400 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};
