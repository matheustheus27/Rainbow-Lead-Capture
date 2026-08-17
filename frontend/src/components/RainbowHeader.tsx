import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RainbowHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="text-center mb-8 relative">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-white/5 border border-purple-500/20 dark:border-white/10 backdrop-blur-md text-xs font-semibold text-purple-600 dark:text-purple-300 mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>{t.common.brandTitle} • {t.common.brandSubtitle}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        {t.form.title.split(' ')[0]} <span className="rainbow-text">{t.form.title.split(' ').slice(1).join(' ')}</span>
      </h1>

      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        {t.form.subtitle}
      </p>
    </header>
  );
};
