import { useEffect, useRef } from 'react';

export default function useSaveShortcut({
  enabled,
  onSave,
}: {
  enabled: boolean;
  onSave: () => void;
}) {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      const isSave =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's';
      if (!isSave) return;

      e.preventDefault();
      onSaveRef.current();
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, [enabled]);
}

