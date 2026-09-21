import React from 'react';
import {
  LayoutDashboard,
  BookOpenCheck,
  Library,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeLoansCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  activeLoansCount,
}) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pinjaman' as TabType, label: 'Pinjaman Buku', icon: BookOpenCheck },
    { id: 'buku' as TabType, label: 'Senarai Buku', icon: Library },
    {
      id: 'rekod' as TabType,
      label: 'Rekod Pinjaman',
      icon: ClipboardList,
      badge: activeLoansCount > 0 ? activeLoansCount : undefined,
    },
    { id: 'analisis' as TabType, label: 'Analisis', icon: BarChart3 },
  ];

  return (
    <nav className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-500'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>

                {typeof tab.badge === 'number' && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-amber-100 text-amber-700 border border-amber-300/60'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
