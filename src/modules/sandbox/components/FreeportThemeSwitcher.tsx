import { FREEPORT_THEMES, type FreeportThemeId } from '../freeportThemes';

type Props = {
  activeId: FreeportThemeId;
  onChange: (id: FreeportThemeId) => void;
};

export function FreeportThemeSwitcher({ activeId, onChange }: Props) {
  return (
    <div className="design-freeport__theme-row" role="group" aria-label="Freeport-tema">
      {FREEPORT_THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={`design-freeport__chip${activeId === theme.id ? ' design-freeport__chip--on' : ''}`}
          onClick={() => onChange(theme.id)}
          title={theme.description}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
