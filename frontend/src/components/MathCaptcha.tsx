import React from 'react';
import { ShieldCheck, RefreshCw, Calculator } from 'lucide-react';
import { CaptchaChallenge } from '../types/customer';
import { useLanguage } from '../context/LanguageContext';

interface MathCaptchaProps {
  challenge: CaptchaChallenge | null;
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  error?: string;
}

export const MathCaptcha: React.FC<MathCaptchaProps> = ({
  challenge,
  value,
  onChange,
  onRefresh,
  isLoading = false,
  error,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2 w-full p-4 rounded-2xl bg-white/60 dark:bg-black/20 border border-slate-200 dark:border-white/10 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{t.form.botVerificationTitle}</span>
          <span className="text-purple-600 dark:text-purple-400">*</span>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title={t.form.botVerificationNew}
          className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{t.form.botVerificationNew}</span>
        </button>
      </div>

      {/* Challenge Display & Answer Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        {/* Visual Math Puzzle Badge / SVG */}
        <div className="flex-shrink-0 flex items-center justify-center min-w-[140px] h-11 rounded-xl bg-slate-900/90 border border-slate-700/50 overflow-hidden shadow-inner">
          {isLoading || !challenge ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 animate-pulse px-3">
              <Calculator className="w-4 h-4 text-purple-400" />
              <span>{t.form.botVerificationLoading}</span>
            </div>
          ) : challenge.svg ? (
            <div
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: challenge.svg }}
            />
          ) : (
            <span className="font-extrabold text-base tracking-widest text-white px-4">
              {challenge.equation} = ?
            </span>
          )}
        </div>

        {/* User Answer Input */}
        <div className="flex-1 relative">
          <input
            id="captcha-answer-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder={t.form.botVerificationPlaceholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`glass-input w-full rounded-xl py-2.5 px-4 text-sm sm:text-base font-semibold text-center sm:text-left placeholder:text-slate-500 shadow-inner ${
              error ? 'glass-input-error' : ''
            }`}
          />
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
