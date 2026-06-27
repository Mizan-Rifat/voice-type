import { Check, ChevronDown, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { HistoryEntry } from '../types/history';

const truncateTitle = (text: string, maxLength = 48) => {
  const singleLine = text.replace(/\s+/g, ' ').trim();
  if (singleLine.length <= maxLength) return singleLine;
  return `${singleLine.slice(0, maxLength)}...`;
};

interface HistoryEntryAccordionProps {
  entry: HistoryEntry;
  onDeleteItem: (entryId: string, itemId: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

const HistoryEntryAccordion = ({
  entry,
  onDeleteItem,
  onDeleteEntry,
}: HistoryEntryAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (itemId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sortedItems = (() => {
    if (entry.items.length === 0) return [];
    const [original, ...rewrites] = entry.items;
    const sortedRewrites = [...rewrites].sort((a, b) => b.createdAt - a.createdAt);
    return original ? [original, ...sortedRewrites] : sortedRewrites;
  })();

  return (
    <div className="rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="min-w-0 flex-1 truncate font-medium text-gray-800" title={entry.originalText}>
          {truncateTitle(entry.originalText)}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {index === 0 ? 'Original' : item.promptTitle ?? 'Rewrite'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.text)}
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                    title="Copy"
                  >
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (entry.items.length === 1) {
                        onDeleteEntry(entry.id);
                      } else {
                        onDeleteItem(entry.id, item.id);
                      }
                    }}
                    className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryEntryAccordion;
