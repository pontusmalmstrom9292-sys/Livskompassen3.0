import { triggerWidgetHaptic } from '../core/WidgetActions';
import { WidgetPalette } from '../core/WidgetTheme';

export type MoodFaceId = 'very_low' | 'low' | 'ok' | 'good' | 'great';

const FACES: { id: MoodFaceId; glyph: string; label: string }[] = [
  { id: 'very_low', glyph: '😔', label: 'Tungt' },
  { id: 'low', glyph: '😕', label: 'Lågt' },
  { id: 'ok', glyph: '😐', label: 'Okej' },
  { id: 'good', glyph: '🙂', label: 'Bra' },
  { id: 'great', glyph: '😊', label: 'Ljust' },
];

export type WidgetMoodCheckInProps = {
  value?: MoodFaceId | null;
  onChange: (id: MoodFaceId) => void;
};

/**
 * Dagens Check-in — five faces (WIDGET_BIBLE 6.4).
 * Inactive: inset muted. Active: gold lift + soft shadow.
 * Touch floor 44px for mockup parity.
 */
export function WidgetMoodCheckIn({ value, onChange }: WidgetMoodCheckInProps) {
  return (
    <div className="cw-mood-row" role="radiogroup" aria-label="Dagens känsla">
      {FACES.map((face) => {
        const active = value === face.id;
        return (
          <button
            key={face.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={face.label}
            title={face.label}
            className={['cw-mood', 'cw-mood--touch', active && 'cw-mood--active'].filter(Boolean).join(' ')}
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => {
              triggerWidgetHaptic('light');
              onChange(face.id);
            }}
          >
            <span aria-hidden>{face.glyph}</span>
          </button>
        );
      })}
    </div>
  );
}

export function moodFaceLabel(id: MoodFaceId): string {
  return FACES.find((f) => f.id === id)?.label ?? id;
}

export const MOOD_FACE_COLOR = WidgetPalette.premiumGoldLight;
