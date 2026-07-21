/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import type { UserWidgetShell, UserWidgetStylePreset } from '@/core/types/firestore';

export type WidgetStylePresetDef = {
  id: UserWidgetStylePreset;
  label_sv: string;
  lead_sv: string;
  /** Mappas till WidgetDashboardSection glow. */
  glow: 'gold' | 'blue';
  defaultShell: UserWidgetShell;
  /** CSS-modifier på .widget-home-module */
  className: string;
};

export const WIDGET_STYLE_PRESETS: Record<UserWidgetStylePreset, WidgetStylePresetDef> = {
  midnight: {
    id: 'midnight',
    label_sv: 'Midnight',
    lead_sv: 'Djup marin, lugn kontrast.',
    glow: 'gold',
    defaultShell: 'card',
    className: 'widget-home-module--preset-midnight',
  },
  gold_glass: {
    id: 'gold_glass',
    label_sv: 'Guldglas',
    lead_sv: 'Glas + alchemical gold.',
    glow: 'gold',
    defaultShell: 'tile',
    className: 'widget-home-module--preset-gold-glass',
  },
  photo_dim: {
    id: 'photo_dim',
    label_sv: 'Foto dim',
    lead_sv: 'Bakgrundsbild med mjuk overlay.',
    glow: 'gold',
    defaultShell: 'elongated',
    className: 'widget-home-module--preset-photo-dim',
  },
  minimal: {
    id: 'minimal',
    label_sv: 'Minimal',
    lead_sv: 'Ren yta, lite brus.',
    glow: 'gold',
    defaultShell: 'compact',
    className: 'widget-home-module--preset-minimal',
  },
  celebration: {
    id: 'celebration',
    label_sv: 'Firande',
    lead_sv: 'Varm accent för milstolpar.',
    glow: 'gold',
    defaultShell: 'card',
    className: 'widget-home-module--preset-celebration',
  },
  focus: {
    id: 'focus',
    label_sv: 'Fokus',
    lead_sv: 'Kallare glow för koncentration.',
    glow: 'blue',
    defaultShell: 'compact',
    className: 'widget-home-module--preset-focus',
  },
};

export const WIDGET_STYLE_PRESET_IDS = Object.keys(
  WIDGET_STYLE_PRESETS,
) as UserWidgetStylePreset[];

export function resolveWidgetStylePreset(
  id: UserWidgetStylePreset | null | undefined,
): WidgetStylePresetDef {
  if (id && id in WIDGET_STYLE_PRESETS) return WIDGET_STYLE_PRESETS[id];
  return WIDGET_STYLE_PRESETS.midnight;
}
