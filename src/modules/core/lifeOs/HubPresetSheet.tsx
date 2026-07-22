import { X } from 'lucide-react';
import { Sheet } from '@/design-system';
import { LifeHubPresetPicker } from './LifeHubPresetPicker';
import type { LifeHubPresetId } from './lifeHubPresets';

type Props = {
  open: boolean;
  activeId: LifeHubPresetId;
  onSelect: (id: LifeHubPresetId) => void;
  onClose: () => void;
};

export function HubPresetSheet({ open, activeId, onSelect, onClose }: Props) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      ariaLabel="Välj hub"
      hideHeader
      placement="center"
      className="z-[232]"
      panelClassName="relative max-w-md rounded-[2rem] border-border bg-bg/95 p-5 shadow-xl"
      headerAction={
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full border border-border bg-bg p-1.5 text-text-muted"
          aria-label="Stäng"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      }
    >
      <LifeHubPresetPicker
        activeId={activeId}
        onSelect={(id) => {
          onSelect(id);
          onClose();
        }}
      />
    </Sheet>
  );
}
