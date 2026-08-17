import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, Shield, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../GlassCard';
import { Input } from '../Input';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage(t.errors.emailRequired);
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, informe a senha.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@iriscrm.com');
    setPassword('Admin@123');
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
      <GlassCard className="p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 mb-3 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            {t.login.title.split(' ')[0]} <span className="rainbow-text">{t.login.title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.login.subtitle}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <Input
            id="admin-email-input"
            label={t.login.emailLabel}
            type="email"
            placeholder="admin@iriscrm.com"
            required
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password with Show/Hide toggle */}
          <div className="relative">
            <Input
              id="admin-password-input"
              label={t.login.passwordLabel}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-[38px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="admin-login-btn"
            type="submit"
            disabled={isSubmitting}
            className="glass-button-primary w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 mt-5 cursor-pointer tracking-wide shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.login.submittingLogin}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t.login.submitLogin}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick-Fill Demo Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-center">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-500/20 dark:border-white/10 text-xs font-semibold text-purple-700 dark:text-purple-300 transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{t.login.quickFill}</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
