import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/auth-context';
import type { HistoryEntry, HistoryItem } from '../types/history';

const TABLE = 'history_entries';

type HistoryRow = {
  id: string;
  original_text: string;
  items: HistoryItem[];
  created_at: number;
};

const rowToEntry = (row: HistoryRow): HistoryEntry => ({
  id: row.id,
  originalText: row.original_text,
  items: row.items ?? [],
  createdAt: row.created_at,
});

const createItem = (text: string, promptTitle?: string): HistoryItem => ({
  id: crypto.randomUUID(),
  text,
  promptTitle,
  createdAt: Date.now(),
});

const sortEntriesDesc = (entries: HistoryEntry[]) =>
  [...entries].sort((a, b) => b.createdAt - a.createdAt);

const useHistory = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadEntries = async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('id, original_text, items, created_at')
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error('Failed to load history:', error.message);
        return;
      }

      setEntries((data ?? []).map(rowToEntry));
    };

    loadEntries();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persistEntry = useCallback(
    async (entry: HistoryEntry) => {
      if (!userId) return;
      const { error } = await supabase.from(TABLE).upsert({
        id: entry.id,
        user_id: userId,
        original_text: entry.originalText,
        items: entry.items,
        created_at: entry.createdAt,
      });
      if (error) {
        console.error('Failed to save history entry:', error.message);
      }
    },
    [userId]
  );

  const removeEntry = useCallback(async (entryId: string) => {
    const { error } = await supabase.from(TABLE).delete().eq('id', entryId);
    if (error) {
      console.error('Failed to delete history entry:', error.message);
    }
  }, []);

  const submitEntry = useCallback(
    (originalText: string) => {
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
      void persistEntry(entry);
    },
    [persistEntry]
  );

  const addRewriteItem = useCallback(
    (originalText: string, rewrittenText: string, promptTitle: string) => {
      const trimmedOriginal = originalText.trim();
      const trimmedRewrite = rewrittenText.trim();
      if (!trimmedOriginal || !trimmedRewrite) return;

      let entryToPersist: HistoryEntry | null = null;
      let newActiveId: string | null = null;

      setEntries(prev => {
        const activeEntry = activeEntryId
          ? prev.find(entry => entry.id === activeEntryId)
          : undefined;

        if (activeEntry && activeEntry.originalText === trimmedOriginal) {
          const updated = prev.map(entry => {
            if (entry.id !== activeEntryId) return entry;
            const next: HistoryEntry = {
              ...entry,
              createdAt: Date.now(),
              items: [...entry.items, createItem(trimmedRewrite, promptTitle)],
            };
            entryToPersist = next;
            return next;
          });
          return sortEntriesDesc(updated);
        }

        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          originalText: trimmedOriginal,
          items: [createItem(trimmedOriginal), createItem(trimmedRewrite, promptTitle)],
          createdAt: Date.now(),
        };

        entryToPersist = entry;
        newActiveId = entry.id;
        return sortEntriesDesc([entry, ...prev]);
      });

      if (newActiveId) {
        setActiveEntryId(newActiveId);
      }
      if (entryToPersist) {
        void persistEntry(entryToPersist);
      }
    },
    [activeEntryId, persistEntry]
  );

  const deleteItem = useCallback(
    (entryId: string, itemId: string) => {
      let entryToPersist: HistoryEntry | null = null;
      let entryToRemove: string | null = null;

      setEntries(prev => {
        const updated = prev
          .map(entry => {
            if (entry.id !== entryId) return entry;
            const items = entry.items.filter(item => item.id !== itemId);
            if (items.length === 0) {
              entryToRemove = entry.id;
              return null;
            }
            const next = { ...entry, items };
            entryToPersist = next;
            return next;
          })
          .filter((entry): entry is HistoryEntry => entry !== null);

        if (activeEntryId === entryId && !updated.some(entry => entry.id === entryId)) {
          setActiveEntryId(null);
        }

        return updated;
      });

      if (entryToRemove) {
        void removeEntry(entryToRemove);
      } else if (entryToPersist) {
        void persistEntry(entryToPersist);
      }
    },
    [activeEntryId, persistEntry, removeEntry]
  );

  const deleteEntry = useCallback(
    (entryId: string) => {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      if (activeEntryId === entryId) {
        setActiveEntryId(null);
      }
      void removeEntry(entryId);
    },
    [activeEntryId, removeEntry]
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
