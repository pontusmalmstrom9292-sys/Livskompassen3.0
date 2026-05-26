import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { LifeHubPresetPicker } from './LifeHubPresetPicker';
import type { LifeHubPresetId } from './lifeHubPresets';

type Props = {
  open: boolean;
  activeId: LifeHubPresetId;
  onSelect: (id: LifeHubPresetId) => void;
  onClose: () => void;
};

export function HubPresetSheet({ open, activeId, onSelect, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('hub-preset-sheet-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('hub-preset-sheet-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="hub-preset-sheet__backdrop"
        aria-label="Stäng hub-väljare"
        onClick={onClose}
      />
      <div className="hub-preset-sheet" role="dialog" aria-label="Välj hub">
        <button
          type="button"
          className="hub-preset-sheet__close"
          aria-label="Stäng"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
        <LifeHubPresetPicker
          activeId={activeId}
          onSelect={(id) => {
            onSelect(id);
            onClose();
          }}
        />
      </div>
    </>,
    document.body,
  );
}
