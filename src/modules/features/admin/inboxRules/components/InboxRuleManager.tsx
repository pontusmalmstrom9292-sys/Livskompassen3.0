import { useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useInboxRules } from '../hooks/useInboxRules';
import type { InboxRuleMatchType, InboxCategorizationRuleInput } from '../types/inboxRule';
import type { InboxRouting } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { Button, Input } from '@/design-system';

const MATCH_TYPE_LABELS: Record<InboxRuleMatchType, string> = {
  contains: 'Innehåller (text)',
  exact: 'Exakt namn',
};

const ROUTING_LABELS: Record<InboxRouting | '', string> = {
  '': 'Ändra inte',
  bevis: 'Valvet (Bevis)',
  dagbok: 'Dagbok',
  kunskap: 'Kunskap',
  barnen: 'Barnen',
  planning: 'Planering/Uppgift',
  review: 'Granskning',
};

function emptyRule(): InboxCategorizationRuleInput {
  return {
    label: '',
    matchType: 'contains',
    pattern: '',
    targetTags: [],
    targetCategory: '',
    targetRouting: '',
    priority: 50,
    enabled: true,
  };
}

export function InboxRuleManager() {
  const { user, rules, loading, error, setError, addRule, patchRule, removeRule } = useInboxRules();
  const [draft, setDraft] = useState(emptyRule());
  const [draftTags, setDraftTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!draft.label.trim() || !draft.pattern.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const targetTags = draftTags.split(',').map((t) => t.trim()).filter(Boolean);
      await addRule({ ...draft, targetTags });
      setDraft(emptyRule());
      setDraftTags('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara regel.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att hantera inkorgsregler.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Inkorgsregler appliceras automatiskt på dokument som hamnar i Granskningskön. De kan sätta förvalda taggar, kategori eller vart dokumentet ska arkiveras.
      </p>

      <BentoCard title="Ny regel">
        <div className="space-y-2">
          <Input
            className="input-glass w-full text-sm"
            placeholder="Regelnamn (t.ex. Skoldokument)"
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
          />
          <select
            className="input-glass w-full text-sm"
            value={draft.matchType}
            onChange={(e) =>
              setDraft((d) => ({ ...d, matchType: e.target.value as InboxRuleMatchType }))
            }
          >
            {(Object.keys(MATCH_TYPE_LABELS) as InboxRuleMatchType[]).map((t) => (
              <option key={t} value={t}>
                {MATCH_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <Input
            className="input-glass w-full text-sm"
            placeholder="Sökmönster i filnamn (t.ex. skola)"
            value={draft.pattern}
            onChange={(e) => setDraft((d) => ({ ...d, pattern: e.target.value }))}
          />
          <Input
            className="input-glass w-full text-sm"
            placeholder="Taggar (kommaseparerade, valfritt)"
            value={draftTags}
            onChange={(e) => setDraftTags(e.target.value)}
          />
          <Input
            className="input-glass w-full text-sm"
            placeholder="Kategori (valfritt)"
            value={draft.targetCategory}
            onChange={(e) => setDraft((d) => ({ ...d, targetCategory: e.target.value }))}
          />
          <select
            className="input-glass w-full text-sm"
            value={draft.targetRouting}
            onChange={(e) =>
              setDraft((d) => ({ ...d, targetRouting: e.target.value as InboxRouting | '' }))
            }
          >
            {(Object.keys(ROUTING_LABELS) as Array<InboxRouting | ''>).map((r) => (
              <option key={r} value={r}>
                Spara i: {ROUTING_LABELS[r]}
              </option>
            ))}
          </select>
          <Button type="button" disabled={saving || !draft.label.trim() || !draft.pattern.trim()} variant="accent" className="--accent w-full text-sm" onClick={() => void handleAdd()}>
            Spara regel
          </Button>
        </div>
      </BentoCard>

      {loading && <p className="text-sm text-text-dim">Laddar regler…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      {rules.length === 0 && !loading && (
        <p className="text-sm text-text-dim">Inga regler upplagda ännu.</p>
      )}

      <ul className="space-y-3">
        {rules.map((rule) => (
          <li key={rule.id} className="elongated-module space-y-2 p-3">
            <label className="flex items-center gap-2 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) => void patchRule(rule.id, { enabled: e.target.checked })}
              />
              Aktiv
            </label>
            <p className="font-medium text-text">{rule.label}</p>
            <p className="text-xs text-text-muted">
              {MATCH_TYPE_LABELS[rule.matchType]}: <span className="text-text">{rule.pattern}</span>
            </p>
            {rule.targetTags.length > 0 && (
              <p className="text-xs text-text-dim">Taggar: {rule.targetTags.join(', ')}</p>
            )}
            {rule.targetCategory && (
              <p className="text-xs text-text-dim">Kategori: {rule.targetCategory}</p>
            )}
            {rule.targetRouting && (
              <p className="text-xs text-accent">Spara i: {ROUTING_LABELS[rule.targetRouting]}</p>
            )}
            <button
              type="button"
              className="text-xs text-danger mt-2 inline-block"
              onClick={() => void removeRule(rule.id)}
            >
              Ta bort
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
