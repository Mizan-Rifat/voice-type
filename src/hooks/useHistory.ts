import { useCallback, useEffect, useState } from 'react';
import type { HistoryEntry, HistoryItem } from '../types/history';

const STORAGE_KEY = 'voice-type-history';

const loadEntries = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryEntry[];
  } catch {
    return [];
  }
};

const createItem = (text: string, promptTitle?: string): HistoryItem => ({
  id: crypto.randomUUID(),
  text,
  promptTitle,
  createdAt: Date.now(),
});

const sortEntriesDesc = (entries: HistoryEntry[]) =>
  [...entries].sort((a, b) => b.createdAt - a.createdAt);

const useHistory = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => sortEntriesDesc(loadEntries()));
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const submitEntry = useCallback((originalText: string) => {
    const trimmed = originalText.trim();
    if (!trimmed) return;

    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      originalText: trimmed,
      items: [createItem(trimmed)],
      createdAt: Date.now(),
    };

    setEntries(prev => sortEntriesDesc([entry, ...prev]));
    setActiveEntryId(entry.id);
  }, []);

  const addRewriteItem = useCallback(
    (originalText: string, rewrittenText: string, promptTitle: string) => {
      const trimmedOriginal = originalText.trim();
      const trimmedRewrite = rewrittenText.trim();
      if (!trimmedOriginal || !trimmedRewrite) return;

      let newActiveId: string | null = null;

      setEntries(prev => {
        const activeEntry = activeEntryId
          ? prev.find(entry => entry.id === activeEntryId)
          : undefined;

        if (activeEntry && activeEntry.originalText === trimmedOriginal) {
          return sortEntriesDesc(
            prev.map(entry =>
              entry.id === activeEntryId
                ? {
                    ...entry,
                    createdAt: Date.now(),
                    items: [...entry.items, createItem(trimmedRewrite, promptTitle)],
                  }
                : entry
            )
          );
        }

        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          originalText: trimmedOriginal,
          items: [createItem(trimmedOriginal), createItem(trimmedRewrite, promptTitle)],
          createdAt: Date.now(),
        };

        newActiveId = entry.id;
        return sortEntriesDesc([entry, ...prev]);
      });

      if (newActiveId) {
        setActiveEntryId(newActiveId);
      }
    },
    [activeEntryId]
  );

  const deleteItem = useCallback(
    (entryId: string, itemId: string) => {
      setEntries(prev => {
        const updated = prev
          .map(entry => {
            if (entry.id !== entryId) return entry;
            const items = entry.items.filter(item => item.id !== itemId);
            if (items.length === 0) return null;
            return { ...entry, items };
          })
          .filter((entry): entry is HistoryEntry => entry !== null);

        if (activeEntryId === entryId && !updated.some(entry => entry.id === entryId)) {
          setActiveEntryId(null);
        }

        return updated;
      });
    },
    [activeEntryId]
  );

  const deleteEntry = useCallback(
    (entryId: string) => {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      if (activeEntryId === entryId) {
        setActiveEntryId(null);
      }
    },
    [activeEntryId]
  );

  return {
    entries,
    submitEntry,
    addRewriteItem,
    deleteItem,
    deleteEntry,
  };
};

export default useHistory;
