import { useCallback, useRef, useState } from 'react';

interface HistoryEntry {
  content: string;
  selectionStart: number;
  selectionEnd: number;
}

export default function useUndoHistory({
  maxHistory = 100,
  debounceMs = 100,
}: {
  maxHistory?: number;
  debounceMs?: number;
} = {}) {
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const pushHistory = useCallback(
    (entry: HistoryEntry) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      setUndoStack(prev => [...prev.slice(-(maxHistory - 1)), entry]);
      setRedoStack([]);
    },
    [maxHistory]
  );

  const pushHistoryDebounced = useCallback(
    (entry: HistoryEntry) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        setUndoStack(prev => [...prev.slice(-(maxHistory - 1)), entry]);
        setRedoStack([]);
        debounceTimer.current = null;
      }, debounceMs);
    },
    [maxHistory, debounceMs]
  );

  const undo = useCallback(
    (currentEntry: HistoryEntry) => {
      if (undoStack.length === 0) return null;
      const prev = undoStack[undoStack.length - 1];
      setUndoStack(stack => stack.slice(0, -1));
      setRedoStack(stack => [...stack, currentEntry]);
      return prev;
    },
    [undoStack]
  );

  const redo = useCallback(
    (currentEntry: HistoryEntry) => {
      if (redoStack.length === 0) return null;
      const next = redoStack[redoStack.length - 1];
      setRedoStack(stack => stack.slice(0, -1));
      setUndoStack(stack => [...stack, currentEntry]);
      return next;
    },
    [redoStack]
  );

  return {
    pushHistory,
    pushHistoryDebounced,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}
