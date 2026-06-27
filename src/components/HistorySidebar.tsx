import { History, PanelRight, PanelRightClose, X } from 'lucide-react';
import { useState } from 'react';
import type { HistoryEntry } from '../types/history';
import HistoryEntryAccordion from './HistoryEntryAccordion';

interface HistorySidebarProps {
  entries: HistoryEntry[];
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onDeleteItem: (entryId: string, itemId: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

interface HistorySidebarContentProps {
  entries: HistoryEntry[];
  onDeleteItem: (entryId: string, itemId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onCollapse?: () => void;
}

const HistorySidebarContent = ({
  entries,
  onDeleteItem,
  onDeleteEntry,
  onCollapse,
}: HistorySidebarContentProps) => (
  <div className="flex flex-col gap-3">
    <div className="mb-2 flex items-start justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">History</h2>
        <p className="mt-1 text-sm text-gray-500">Submitted text and AI rewrites.</p>
      </div>
      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Collapse history sidebar"
        >
          <PanelRightClose size={20} />
        </button>
      )}
    </div>

    {entries.length === 0 ? (
      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
        No history yet. Submit text to save it here.
      </p>
    ) : (
      entries.map(entry => (
        <HistoryEntryAccordion
          key={entry.id}
          entry={entry}
          onDeleteItem={onDeleteItem}
          onDeleteEntry={onDeleteEntry}
        />
      ))
    )}
  </div>
);

const HistorySidebar = ({
  entries,
  isExpanded,
  onExpandedChange,
  onDeleteItem,
  onDeleteEntry,
}: HistorySidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50 md:hidden"
        aria-label="Open history menu"
      >
        <History size={18} />
        History
      </button>

      {!isExpanded && (
        <button
          type="button"
          onClick={() => onExpandedChange(true)}
          className="fixed right-4 top-4 z-40 hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50 md:flex"
          aria-label="Expand history sidebar"
        >
          <PanelRight size={18} />
          History
        </button>
      )}

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close history menu"
          />
          <aside className="absolute right-0 top-0 h-screen w-[min(100%,320px)] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">History</h2>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <HistorySidebarContent
              entries={entries}
              onDeleteItem={onDeleteItem}
              onDeleteEntry={onDeleteEntry}
            />
          </aside>
        </div>
      )}

      <aside
        className={`fixed right-0 top-0 z-30 hidden h-screen w-72 overflow-y-auto border-l border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-transform duration-300 md:block ${
          isExpanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <HistorySidebarContent
          entries={entries}
          onDeleteItem={onDeleteItem}
          onDeleteEntry={onDeleteEntry}
          onCollapse={() => onExpandedChange(false)}
        />
      </aside>
    </>
  );
};

export default HistorySidebar;
