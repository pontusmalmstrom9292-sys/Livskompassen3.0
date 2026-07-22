import { useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/design-system';
import {
  createEntityProfile,
  type AddEntityProfileInput,
  type EntityRole,
} from '../api/entityProfileService';
import {
  ADDABLE_ENTITY_ROLES,
  ENTITY_ROLE_LABELS,
} from '../constants/entityRegistryLabels';

type Props = {
  onSaved: () => void;
};

function parseAliases(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function EntityAddForm({ onSaved }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<Exclude<EntityRole, 'ANVANDARE'>>('NATVERK');
  const [aliasesInput, setAliasesInput] = useState('');
  const [groundingNotes, setGroundingNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!displayName.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload: AddEntityProfileInput = {
      displayName: displayName.trim(),
      role,
      aliases: parseAliases(aliasesInput),
      groundingNotes: groundingNotes.trim() || undefined,
    };

    try {
      const saved = await createEntityProfile(payload);
      setSuccess(`${saved.displayName} sparad — agenterna kommer ihåg personen.`);
      setDisplayName('');
      setAliasesInput('');
      setGroundingNotes('');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara personen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="entity-name" className="mb-1 block text-xs text-text-muted">
          Namn
        </label>
        <input
          id="entity-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="t.ex. Anna Fagergren"
          className="input-field w-full"
          maxLength={80}
          required
        />
      </div>

      <div>
        <label htmlFor="entity-role" className="mb-1 block text-xs text-text-muted">
          Roll
        </label>
        <select
          id="entity-role"
          value={role}
          onChange={(event) =>
            setRole(event.target.value as Exclude<EntityRole, 'ANVANDARE'>)
          }
          className="input-field w-full"
        >
          {ADDABLE_ENTITY_ROLES.map((item) => (
            <option key={item} value={item}>
              {ENTITY_ROLE_LABELS[item]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="entity-aliases" className="mb-1 block text-xs text-text-muted">
          Alias (valfritt, kommaseparerat)
        </label>
        <input
          id="entity-aliases"
          value={aliasesInput}
          onChange={(event) => setAliasesInput(event.target.value)}
          placeholder="t.ex. soc, handläggare"
          className="input-field w-full"
        />
      </div>

      <div>
        <label htmlFor="entity-notes" className="mb-1 block text-xs text-text-muted">
          Anteckning till agenter (valfritt)
        </label>
        <textarea
          id="entity-notes"
          value={groundingNotes}
          onChange={(event) => setGroundingNotes(event.target.value)}
          placeholder="Kort kontext — neutral ton, formell kommunikation …"
          className="input-field min-h-[72px] w-full"
          maxLength={500}
        />
      </div>

      {error && <p className="text-sm text-amber-400/90">{error}</p>}
      {success && <p className="text-sm text-accent">{success}</p>}

      <Button
        type="submit"
        variant="accent"
        className="inline-flex items-center gap-2"
        disabled={loading || !displayName.trim()}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Lägg till person
      </Button>
    </form>
  );
}
