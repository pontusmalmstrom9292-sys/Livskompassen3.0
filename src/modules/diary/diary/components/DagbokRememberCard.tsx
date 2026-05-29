import { ChevronDown, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DAGBOK_REMEMBER_LINES, DAGBOK_REMEMBER_STORAGE_KEY } from '../constants/dagbokReminders';

function readStoredOpen(): boolean {
  try {
    const raw = localStorage.getItem(DAGBOK_REMEMBER_STORAGE_KEY);
    if (raw === null) return true;
    return raw === '1';
  } catch {
    return true;
  }
}

/** IHÅG-kompass: Dagbok (privat) vs Reality Vault (bevis). */
export function DagbokRememberCard() {
  const [open, setOpen] = useState(readStoredOpen);

  useEffect(() => {
    try {
      localStorage.setItem(DAGBOK_REMEMBER_STORAGE_KEY, open ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [open]);

  return (
    <div className="dagbok-remember mt-4">
      <button
        type="button"
        className="dagbok-remember__toggle flex w-full items-center justify-between gap-2 rounded-xl border border-accent/20 bg-surface/30 px-3 py-2.5 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-accent">
          <Lightbulb className="h-4 w-4 shrink-0" aria-hidden />
          Kom ihåg: Dagbok vs Valv
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="dagbok-remember__body mt-2 space-y-2 rounded-xl border border-border-strong/60 bg-surface/20 px-3 py-3 text-sm">
          <ul className="space-y-2 text-text-muted">
            {DAGBOK_REMEMBER_LINES.map((line) => (
              <li key={line.label}>
                <strong className="text-text">{line.label}:</strong> {line.text}
              </li>
            ))}
          </ul>
          <Link to="/dagbok?tab=bevis" className="btn-pill--ghost mt-1 inline-flex text-xs">
            Gå till Reality Vault →
          </Link>
        </div>
      )}
    </div>
  );
}
