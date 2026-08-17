import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`glass-panel-subtle relative flex items-center justify-center p-2.5 rounded-2xl text-slate-300 hover:text-white transition-all duration-300 active:scale-95 group cursor-pointer ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <Sun
          className={`w-5 h-5 text-amber-400 absolute transition-all duration-500 transform ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`w-5 h-5 text-purple-300 absolute transition-all duration-500 transform ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
