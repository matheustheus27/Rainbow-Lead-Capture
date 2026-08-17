import React from 'react';
import { Sparkles, UserPlus, BarChart3, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export type ActiveTab = 'form' | 'admin' | 'login';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="relative z-20 w-full max-w-5xl mx-auto mb-6 sm:mb-8">
      <div className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between gap-3 sm:gap-4 border border-slate-200 dark:border-white/10 shadow-lg flex-wrap sm:flex-nowrap">
        {/* Brand */}
        <div
          onClick={() => onTabChange('form')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-800 dark:text-white">
              Iris<span className="rainbow-text font-black">CRM</span>
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="flex items-center bg-slate-900/5 dark:bg-black/20 p-1 rounded-xl border border-slate-200 dark:border-white/10 order-3 sm:order-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => onTabChange('form')}
            type="button"
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.nav.formTab}</span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            type="button"
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.nav.adminTab}</span>
            {isAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        </nav>

        {/* User Auth Actions, Language & Theme Switchers */}
        <div className="flex items-center gap-2 order-2 sm:order-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{user?.name || t.nav.adminUser}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  onTabChange('login');
                }}
                type="button"
                title={t.nav.logout}
                className="glass-panel-subtle flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onTabChange('login')}
              type="button"
              className={`glass-panel-subtle flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-purple-600 text-white border-purple-500/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{t.nav.loginTab}</span>
            </button>
          )}

          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
