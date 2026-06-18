import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { isDesignSandbox, toggleSandboxVaultUnlocked } from './designSandbox';

export function DesignSandboxPanel() {
  const vaultOpen = useStore((s) => s.ui.isVaultUnlocked);

  if (!isDesignSandbox()) return null;

  return (
    <div
      className="fixed bottom-20 right-3 z-[90] flex max-w-[14rem] flex-col gap-1.5 rounded-xl border border-border/40 bg-surface-2/95 p-2 text-[10px] shadow-lg backdrop-blur-md"
      aria-label="Design sandbox"
    >
      <p className="px-1 font-sans uppercase tracking-wider text-text-dim">Design sandbox</p>
      <Link to="/dev/theme-lab" className="btn-pill--ghost min-h-8 px-2 py-1 text-center">
        Theme Lab
      </Link>
      <Link to="/" className="btn-pill--ghost min-h-8 px-2 py-1 text-center">
        Hem (chrome)
      </Link>
      <Link to="/vardagen" className="btn-pill--ghost min-h-8 px-2 py-1 text-center">
        Vardagen
      </Link>
      <Link to="/familjen" className="btn-pill--ghost min-h-8 px-2 py-1 text-center">
        Familjen
      </Link>
      <button
        type="button"
        className="btn-pill--secondary min-h-8 px-2 py-1"
        onClick={toggleSandboxVaultUnlocked}
      >
        Valv i meny: {vaultOpen ? 'på' : 'av'}
      </button>
    </div>
  );
}
