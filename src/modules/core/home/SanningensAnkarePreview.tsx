import { useCallback, useEffect, useState } from 'react';
import { Anchor, Loader2 } from 'lucide-react';
import { ButtonLink } from '@/design-system';
import { hasVaultGate } from '@/core/auth/sessionService';
import { getVaultLogs } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import type { VaultLog } from '@/core/types/firestore';

type VaultRow = VaultLog & { id: string };

function truncateTruth(text: string, max = 120): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

/** Read-only Sanningens Ankare — endast vid öppen Valv-session (ingen RAG). */
export function SanningensAnkarePreview() {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const [anchor, setAnchor] = useState<VaultRow | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user || !vaultSessionOpen) {
      setAnchor(null);
      return;
    }
    setLoading(true);
    try {
      const page = await getVaultLogs(user.uid, { limit: 50 });
      const pinned = page.logs.find((l) => l.pinned);
      setAnchor(pinned ?? null);
    } catch {
      setAnchor(null);
    } finally {
      setLoading(false);
    }
  }, [user, vaultSessionOpen]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!vaultSessionOpen || !user) return null;

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-xs text-text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Laddar ankare…
      </p>
    );
  }

  if (!anchor) {
    return (
      <p className="rounded-xl border border-border/30 bg-surface-2/50 px-3 py-2 text-xs text-text-dim">
        Inga Sanningens Ankare markerade. Fäst en post i Valvet när du loggar bevis.
      </p>
    );
  }

  return (
    <div
      className="rounded-xl border border-accent/20 bg-surface-2/60 px-3 py-3"
      aria-label="Sanningens Ankare"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <Anchor className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
          Sanningens Ankare
        </span>
      </div>
      <p className="text-sm leading-relaxed text-text-muted">{truncateTruth(anchor.truth)}</p>
      <ButtonLink to="/valvet?vaultTab=logga" variant="ghost" className="mt-2 inline-flex text-[10px]">
        Öppna i Valv
      </ButtonLink>
    </div>
  );
}
