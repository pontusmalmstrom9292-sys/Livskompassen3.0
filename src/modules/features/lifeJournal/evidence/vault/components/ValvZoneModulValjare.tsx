import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import { VALV_ZONE_INGRESS, VALV_ZONE_LABELS } from '@/core/copy/valvNavCopy';
import type { ValvZone } from '../utils/vaultTabs';
import { markValvZoneModulValjareSeen } from '../utils/valvZoneModulValjareStorage';

const PICKER_ZONES = [
  'samla',
  'analysera',
  'kunskap',
  'vit',
  'exportera',
  'forensik',
] as const satisfies readonly ValvZone[];

type PickerZone = (typeof PICKER_ZONES)[number];

const ZONE_TONE: Record<PickerZone, 'gold' | 'emerald' | 'indigo' | 'lavender'> = {
  samla: 'gold',
  analysera: 'indigo',
  kunskap: 'gold',
  vit: 'lavender',
  exportera: 'emerald',
  forensik: 'indigo',
};

function ZoneIngressPreview({ zone }: { zone: ValvZone }) {
  return (
    <p className="text-[10px] leading-relaxed text-text-muted">{VALV_ZONE_INGRESS[zone]}</p>
  );
}

type Props = {
  onSelect: (zone: ValvZone) => void;
  onSkip?: () => void;
};

/** Första PIN-session — välj zon innan TabBar. */
export function ValvZoneModulValjare({ onSelect, onSkip }: Props) {
  const go = (zone: ValvZone) => {
    markValvZoneModulValjareSeen();
    onSelect(zone);
  };

  const skip = () => {
    markValvZoneModulValjareSeen();
    onSkip?.();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Valvet har zoner — välj var du vill börja. Flikar och Mönster/Orkester finns kvar efter valet.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PICKER_ZONES.map((zone) => (
          <ExamplePreviewCard
            key={zone}
            title={VALV_ZONE_LABELS[zone]}
            lead={VALV_ZONE_INGRESS[zone]}
            preview={<ZoneIngressPreview zone={zone} />}
            ctaLabel={`Öppna ${VALV_ZONE_LABELS[zone]}`}
            tone={ZONE_TONE[zone]}
            onStart={() => go(zone)}
          />
        ))}
      </div>
      {onSkip ? (
        <button type="button" onClick={skip} className="text-xs text-text-dim hover:text-text-muted">
          Visa alla zoner direkt (Samla)
        </button>
      ) : null}
    </div>
  );
}
