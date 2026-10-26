import React from 'react';

export type ActiveTab = 'workspace' | 'report' | 'optimizer' | 'history';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onPrimaryAction: () => void;
  isAnalyzing: boolean;
  savedCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onPrimaryAction,
  isAnalyzing,
  savedCount,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'report', label: 'Analysis Report' },
    { id: 'optimizer', label: 'Resume Optimizer' },
    { id: 'history', label: savedCount > 0 ? `History (${savedCount})` : 'History' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 backdrop-blur border-b border-slate-200 no-print">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#workspace"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('workspace');
        }}
        className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Calibre
      </a>

      {/* Zone 2: 4 concise single-line text navigation links */}
      <nav aria-label="Primary Workspace Navigation" className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                isActive
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={isAnalyzing}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {isAnalyzing ? 'Analyzing Match...' : 'Analyze Match'}
        </button>
      </div>
    </header>
  );
};
