import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 w-full max-w-5xl mx-auto text-center mt-10 mb-4 px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/20 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
        <span>{t.footer.developedBy}</span>
        <a
          href={t.footer.authorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-[length:200%_auto] hover:bg-gradient-to-r hover:from-red-500 hover:via-orange-500 hover:via-yellow-500 hover:via-green-500 hover:via-blue-500 hover:via-indigo-500 hover:to-violet-500 hover:animate-rainbow-text no-underline cursor-pointer transition-all"
        >
          {t.footer.authorName}
        </a>
      </div>
    </footer>
  );
};
