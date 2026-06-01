import { useState } from 'react';
import { Loader2, Plus, Shield } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { saveVaultLog } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import {
  IMMUTABLE_POST_LABEL,
  IMMUTABLE_POST_SHORT,
  SAVE_TO_VAULT_LABEL,
} from '@/core/copy/evidenceCopy';
import { ingestKampsparEntry } from '../api/kampsparService';
import {
  KAMPSPAR_CATEGORY_PRESETS,
  KAMPSPAR_ENTRY_TYPES,
  parseTagsInput,
  type KampsparEntryType,
} from '../constants/kampsparFormOptions';

type Props = {
  onSaved?: () => void;
  compact?: boolean;
};

function resolveCategory(preset: string, custom: string): string | undefined {
  if (preset === '__custom__') {
    const trimmed = custom.trim();
    return trimmed || undefined;
  }
  return preset.trim() || undefined;
}

export function KampsparIngestForm({ onSaved, compact = false }: Props) {
  const user = useStore((s) => s.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryType, setEntryType] = useState<KampsparEntryType>('fakta');
  const [categoryPreset, setCategoryPreset] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [alsoSaveToVault, setAlsoSaveToVault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const category = resolveCategory(categoryPreset, customCategory);
    const tags = parseTagsInput(tagsInput);

    try {
      const result = await ingestKampsparEntry({
        title: title.trim(),
        content: content.trim(),
        category,
        entryType,
        tags: tags.length > 0 ? tags : undefined,
        eventDate: eventDate || undefined,
        source: 'manual',
      });

      if (alsoSaveToVault) {
        const vaultTruth = [title.trim(), content.trim()].filter(Boolean).join('\n\n');
        await saveVaultLog(user.uid, {
          action: 'minne_bevis',
          truth: vaultTruth,
          category: category ?? entryType,
          entryType: 'simple',
          sourceRef: `kampspar/${result.docId}`,
        });
        setSuccess(`Sparat i Minne och som ${IMMUTABLE_POST_LABEL.toLowerCase()} i arkivet.`);
      } else {
        setSuccess('Sparat i Minne. Syns i Tidshjulet och Kunskapsvalvet.');
      }

      setTitle('');
      setContent('');
      setCategoryPreset('');
      setCustomCategory('');
      setTagsInput('');
      setEventDate('');
      setAlsoSaveToVault(false);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard
      title={compact ? 'Ny post' : 'Lägg till i Minne'}
      description={
        compact ? 'Sparas i Minne' : 'Typ, kategori och taggar — valfritt bevis i arkivet'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-text-dim">Typ</label>
          <select
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as KampsparEntryType)}
            className="input-glass w-full"
            disabled={loading}
          >
            {KAMPSPAR_ENTRY_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel (t.ex. Skolmöte mars)"
          className="input-glass"
          disabled={loading}
          maxLength={200}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Fakta, milstolpar, utmaningar, rutiner…"
          rows={compact ? 3 : 4}
          className="input-glass"
          disabled={loading}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-text-dim">Kategori</label>
            <select
              value={categoryPreset}
              onChange={(e) => setCategoryPreset(e.target.value)}
              className="input-glass w-full"
              disabled={loading}
            >
              {KAMPSPAR_CATEGORY_PRESETS.map((opt) => (
                <option key={opt.value || 'empty'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-text-dim">Datum</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="input-glass w-full"
              disabled={loading}
            />
          </div>
        </div>

        {categoryPreset === '__custom__' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Egen kategori (t.ex. vårdnad)"
            className="input-glass"
            disabled={loading}
            maxLength={80}
          />
        )}

        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-text-dim">Taggar</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="komma-separerade, t.ex. kasper, skola, grey-rock"
            className="input-glass w-full"
            disabled={loading}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
          <input
            type="checkbox"
            checked={alsoSaveToVault}
            onChange={(e) => setAlsoSaveToVault(e.target.checked)}
            disabled={loading}
            className="mt-0.5"
          />
          <span className="text-sm text-text-muted">
            <Shield className="mb-0.5 inline h-3.5 w-3.5 text-gold" /> {SAVE_TO_VAULT_LABEL} ({IMMUTABLE_POST_SHORT})
            <span className="mt-0.5 block text-xs text-text-dim">Explicit val — kopplas via sourceRef, blandas inte i sök.</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim() || !user}
          className="btn-pill--success flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Spara i Minne
        </button>
      </form>

      {!user && <p className="mt-3 text-sm text-danger">Logga in för att spara i Minne.</p>}
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {success && <p className="mt-3 text-sm text-success">{success}</p>}
    </BentoCard>
  );
}
