import React from 'react';
import { Search, UserCheck, Mail, FileText, Filter } from 'lucide-react';
import { CustomerRecord } from '../../types/customer';
import { useLanguage } from '../../context/LanguageContext';
import { GlassCard } from '../GlassCard';

interface CustomerTableProps {
  customers: CustomerRecord[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedColor: string;
  onColorFilterChange: (color: string) => void;
  availableColors: string[];
}

const COLOR_CHIP_MAP: Record<string, { bg: string }> = {
  Red: { bg: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30' },
  Vermelho: { bg: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30' },
  Orange: { bg: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30' },
  Laranja: { bg: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30' },
  Yellow: { bg: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30' },
  Amarelo: { bg: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30' },
  Green: { bg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  Verde: { bg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  Blue: { bg: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30' },
  Azul: { bg: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30' },
  Indigo: { bg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  Índigo: { bg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  Anil: { bg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  Violet: { bg: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30' },
  Violeta: { bg: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30' },
};

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  searchTerm,
  onSearchChange,
  selectedColor,
  onColorFilterChange,
  availableColors,
}) => {
  const { language, t } = useLanguage();

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-6">
      {/* Controls Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t.admin.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="glass-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-500"
          />
        </div>

        {/* Color Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedColor}
            onChange={(e) => onColorFilterChange(e.target.value)}
            aria-label={t.admin.filterBy}
            className="glass-input rounded-xl py-2.5 px-3 text-xs sm:text-sm appearance-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">
              {t.admin.allColors}
            </option>
            {availableColors.map((color) => {
              const displayName = t.colors[color] || color;
              return (
                <option key={color} value={color} className="bg-slate-900 text-white">
                  {displayName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/5 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <th className="py-3.5 px-4">{t.admin.colCustomer}</th>
              <th className="py-3.5 px-4">{t.admin.colCpf}</th>
              <th className="py-3.5 px-4">{t.admin.colEmail}</th>
              <th className="py-3.5 px-4">{t.admin.colColor}</th>
              <th className="py-3.5 px-4">{t.admin.colNotes}</th>
              <th className="py-3.5 px-4">{t.admin.colRegisteredAt}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm">
            {customers.length > 0 ? (
              customers.map((customer) => {
                const colorBadge =
                  COLOR_CHIP_MAP[customer.favoriteRainbowColor] || {
                    bg: 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30',
                  };
                const displayName = t.colors[customer.favoriteRainbowColor] || customer.favoriteRainbowColor;

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors duration-150 group"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 opacity-80" />
                      <span>{customer.fullName}</span>
                    </td>

                    {/* CPF */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-mono text-xs">
                      {customer.cpf}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>

                    {/* Color Preference Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorBadge.bg}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {displayName}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {customer.notes ? (
                        <span title={customer.notes}>{customer.notes}</span>
                      ) : (
                        <span className="opacity-40 italic">{t.admin.noNotes}</span>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-10 h-10 opacity-30 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.admin.noRecordsTitle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 opacity-75">
                      {t.admin.noRecordsDesc}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong>{customers.length}</strong> {customers.length === 1 ? t.admin.recordFound : t.admin.recordsFound}
        </span>
      </div>
    </GlassCard>
  );
};
