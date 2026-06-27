export type HistoryItem = {
  id: string;
  text: string;
  promptTitle?: string;
  createdAt: number;
};

export type HistoryEntry = {
  id: string;
  originalText: string;
  items: HistoryItem[];
  createdAt: number;
};
