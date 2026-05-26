import { clsx } from 'clsx';
import { LIFE_HUB_PRESETS, type LifeHubPresetId } from './lifeHubPresets';

type Props = {
  activeId: LifeHubPresetId;
  onSelect: (id: LifeHubPresetId) => void;
};

/** En rad — välj exempelhub (ADHD: ett val i taget). */
export function LifeHubPresetPicker({ activeId, onSelect }: Props) {
  return (
    <section className="life-hub-picker" aria-label="Exempelhub">
      <p className="life-hub-picker__eyebrow">Din hub</p>
      <p className="life-hub-picker__lead text-xs text-text-muted">
        Välj profil — styr vad som syns på Hem och i hubbar. Byt när som helst.
      </p>
      <div className="life-hub-picker__grid" role="listbox" aria-label="Exempelhubbar">
        {LIFE_HUB_PRESETS.map((p) => {
          const active = p.id === activeId;
          return (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={active}
              className={clsx('life-hub-picker__card', active && 'life-hub-picker__card--active')}
              onClick={() => onSelect(p.id)}
            >
              <span className="life-hub-picker__label">{p.label}</span>
              <span className="life-hub-picker__hint">{p.lead}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
