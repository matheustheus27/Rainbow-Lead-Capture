import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={language === 'pt-BR' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
      aria-label="Toggle language"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 dark:bg-black/20 dark:hover:bg-black/40 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-white transition shadow-sm backdrop-blur-md cursor-pointer group"
    >
      <Languages className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
      <span className="tracking-wide uppercase font-bold text-xs">
        {language === 'pt-BR' ? 'PT' : 'EN'}
      </span>
    </button>
  );
};
