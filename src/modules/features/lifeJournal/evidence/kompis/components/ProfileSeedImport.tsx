import { useMemo, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { getProfileSeedEntryCount, importProfileSeed } from '../api/profileSeedService';
import type { KampsparEntryRow } from '@/core/types/firestore';

type Props = {
  entries: KampsparEntryRow[];
  onImported: () => void;
};

const SEED_TOTAL = getProfileSeedEntryCount();

export function ProfileSeedImport({ entries, onImported }: Props) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; title: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const profileSeedCount = useMemo(
    () => entries.filter((e) => e.source === 'profile_seed').length,
    [entries]
  );

  const needsImport = profileSeedCount < SEED_TOTAL;

  if (!needsImport) return null;

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setDone(null);

    const existingTitles = new Set(
      entries.filter((e) => e.source === 'profile_seed').map((e) => e.title)
    );

    try {
      const result = await importProfileSeed({
        skipExisting: true,
        existingTitles,
        onProgress: setProgress,
      });
      setProgress(null);
      setDone(`${result.ok} nya poster importerade${result.skip ? ` (${result.skip} fanns redan)` : ''}.`);
      onImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard
      title="Profil saknas i Kunskapsvalvet"
      description={`${profileSeedCount}/${SEED_TOTAL} poster — importera diagnoser, strategi, barn och coping till ditt konto`}
    >
      <p className="mb-3 text-sm text-text-dim">
        Terminal-seed hamnar på annat Firebase-konto. Denna knapp sparar profilen under ditt inloggade
        konto så chatten kan svara.
      </p>

      <Button
        type="button"
        variant="success"
        className="flex items-center gap-2"
        onClick={handleImport}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Importera min profil ({SEED_TOTAL} poster)
      </Button>

      {progress && (
        <p className="mt-3 text-sm text-accent">
          {progress.current}/{progress.total} — {progress.title}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {done && <p className="mt-3 text-sm text-success">{done}</p>}
    </BentoCard>
  );
}
