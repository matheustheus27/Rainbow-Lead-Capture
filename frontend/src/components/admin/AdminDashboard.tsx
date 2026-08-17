import React from 'react';
import { Users, Palette, Clock, RefreshCw, AlertTriangle, ShieldCheck, LogOut } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../GlassCard';
import { ColorDistributionChart } from './ColorDistributionChart';
import { CustomerTable } from './CustomerTable';
import { GlassSkeletonTable } from '../skeletons/GlassSkeletonTable';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const {
    filteredCustomers,
    analytics,
    isLoading,
    isRefreshing,
    error,
    searchTerm,
    selectedColorFilter,
    setSearchTerm,
    setSelectedColorFilter,
    refreshData,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <GlassSkeletonTable />
      </div>
    );
  }

  const formatLatestDate = (isoString: string | null) => {
    if (!isoString) return t.admin.noneYet;
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language, {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const availableColors = analytics?.distribution.map((d) => d.color) || [
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Indigo',
    'Violet',
  ];

  const localizedTopColor = analytics?.topColor
    ? (t.colors[analytics.topColor] || analytics.topColor)
    : t.admin.noneYet;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.admin.title} • {user?.role || 'Admin'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            {t.admin.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>{t.admin.activeAdmin} <strong>{user?.name}</strong> ({user?.email})</span>
          </p>
        </div>

        {/* Header Actions: Refresh & Logout */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="glass-panel-subtle flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t.admin.refreshing : t.admin.refresh}</span>
          </button>

          <button
            onClick={logout}
            title={t.nav.logout}
            className="glass-panel-subtle flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 transition active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 3 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Leads */}
        <GlassCard className="p-5 border border-slate-200 dark:border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.admin.totalLeads}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">
              {analytics?.totalLeads ?? 0}
            </h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">PostgreSQL Database</p>
          </div>
        </GlassCard>

        {/* Metric 2: Top Color */}
        <GlassCard className="p-5 border border-slate-200 dark:border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.admin.topColor}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">
              {localizedTopColor}
            </h4>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">{analytics?.topColor ? 'Trending' : t.admin.noneYet}</p>
          </div>
        </GlassCard>

        {/* Metric 3: Latest Registration */}
        <GlassCard className="p-5 border border-slate-200 dark:border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.admin.latestLead}</p>
            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
              {formatLatestDate(analytics?.latestRegistration || null)}
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Live Timestamp</p>
          </div>
        </GlassCard>
      </div>

      {/* Color Analytics Distribution Chart */}
      <ColorDistributionChart
        distribution={analytics?.distribution || []}
        totalLeads={analytics?.totalLeads || 0}
        topColor={analytics?.topColor || null}
        selectedColor={selectedColorFilter}
        onColorSelect={(color) => setSelectedColorFilter(color)}
      />

      {/* Client List Data Table */}
      <CustomerTable
        customers={filteredCustomers}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedColor={selectedColorFilter}
        onColorFilterChange={setSelectedColorFilter}
        availableColors={availableColors}
      />
    </div>
  );
};
