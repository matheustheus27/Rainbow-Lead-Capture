import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  hint,
  icon,
  id,
  className = '',
  ...props
}) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full text-left group">
      <div className="flex items-center justify-between">
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400"
        >
          {label} {props.required && <span className="text-purple-600 dark:text-purple-400">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{hint}</span>}
      </div>

      <div className="relative flex">
        {icon && (
          <div className="absolute top-3.5 left-3.5 text-slate-500 dark:text-slate-400 pointer-events-none transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400">
            {icon}
          </div>
        )}
        <textarea
          id={textareaId}
          rows={3}
          className={`glass-input w-full rounded-xl py-3 px-4 text-sm md:text-base font-normal placeholder:text-slate-500 shadow-inner resize-none ${
            icon ? 'pl-11' : ''
          } ${error ? 'glass-input-error' : ''} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};
