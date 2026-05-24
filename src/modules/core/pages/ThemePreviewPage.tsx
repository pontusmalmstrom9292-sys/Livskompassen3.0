import { Link } from 'react-router-dom';
import { useTheme } from '../theme';
import { resolveThemeForPath } from '../theme/moduleThemeMap';

export function ThemePreviewPage() {
  const { themeId, mode, setTheme, setAutoMode, themes } = useTheme();

  return (
    <div className="module-list">
      <header className="glass-card p-4">
        <h1 className="font-display text-xl font-light text-accent">Theme Pack Preview</h1>
        <p className="mt-2 text-sm text-text-muted">
          Byt skin live. Auto per modul: {mode === 'auto' ? 'på' : 'av'}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={mode === 'auto' ? 'btn-pill--accent' : 'btn-pill--ghost'}
            onClick={() => setAutoMode(true)}
          >
            Auto per modul
          </button>
          <button
            type="button"
            className={mode === 'manual' ? 'btn-pill--accent' : 'btn-pill--ghost'}
            onClick={() => setAutoMode(false)}
          >
            Manuellt val
          </button>
          <Link to="/" className="btn-pill--ghost">
            Till hem
          </Link>
        </div>
      </header>

      <div className="adaptive-card-grid">
        {themes.map((pack) => (
          <button
            key={pack.id}
            type="button"
            className={`glass-card p-4 text-left transition-all ${
              themeId === pack.id ? 'ring-2 ring-accent' : ''
            }`}
            onClick={() => setTheme(pack.id)}
          >
            <p className="text-[10px] uppercase tracking-widest text-text-dim">{pack.id}</p>
            <h2 className="mt-1 font-display text-lg text-accent">{pack.label}</h2>
            <p className="mt-2 text-sm text-text-muted">{pack.description}</p>
            <p className="mt-3 text-xs text-text-dim">Bakgrund: {pack.background}</p>
          </button>
        ))}
      </div>

      <section className="glass-card p-4">
        <h2 className="text-sm uppercase tracking-widest text-text-dim">Modul-mapping</h2>
        <ul className="mt-3 space-y-1 text-sm text-text-muted">
          {[
            ['/', 'I-alchemical'],
            ['/hamn', 'I-hamn'],
            ['/mabra', 'I-skymning'],
            ['/dagbok', 'I-stone'],
          ].map(([path, id]) => (
            <li key={path}>
              <code className="text-accent">{path}</code> → {id}{' '}
              {resolveThemeForPath(path) === themeId && mode === 'auto' ? '(aktiv)' : ''}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
