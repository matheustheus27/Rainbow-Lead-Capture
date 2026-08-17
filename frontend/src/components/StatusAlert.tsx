import React from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface StatusAlertProps {
  type: 'success' | 'error' | null;
  message: string;
  onDismiss?: () => void;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({ type, message, onDismiss }) => {
  if (!type || !message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      className={`w-full p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 transform animate-in fade-in slide-in-from-top-2 relative overflow-hidden flex items-start gap-3.5 ${
        isSuccess
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          : 'bg-rose-950/40 border-rose-500/30 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
      }`}
    >
      <div
        className={`p-2 rounded-xl flex-shrink-0 ${
          isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>

      <div className="flex-1 pt-0.5">
        <h4 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
          {isSuccess ? (
            <>
              Registration Successful <Sparkles className="w-4 h-4 text-emerald-400" />
            </>
          ) : (
            'Registration Notice'
          )}
        </h4>
        <p className="text-xs md:text-sm mt-0.5 opacity-90 leading-relaxed">{message}</p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          type="button"
          aria-label="Dismiss message"
          className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
