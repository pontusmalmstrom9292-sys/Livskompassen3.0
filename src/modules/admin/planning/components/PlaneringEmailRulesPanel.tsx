import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import {
  MATCH_TYPE_LABELS,
  ROUTE_LABELS,
} from '../constants/planningEmailRuleLabels';
import { usePlanningEmailRules } from '../hooks/usePlanningEmailRules';
import {
  PLANNING_EMAIL_MATCH_TYPES,
  PLANNING_EMAIL_ROUTES,
  type PlanningEmailMatchType,
  type PlanningEmailRoute,
} from '../types/planningEmailRule';

function emptyRule() {
  return {
    label: '',
    matchType: 'subject_contains' as PlanningEmailMatchType,
    pattern: '',
    route: 'planering' as PlanningEmailRoute,
    priority: 50,
    enabled: true,
  };
}

/** E-postregler — `planning_email_rules` (Fas 2, utan Gmail-synk än). */
export function PlaneringEmailRulesPanel() {
  const {
    user,
    rules,
    loading,
    error,
    setError,
    addRule,
    patchRule,
    removeRule,
    addSuggestedTemplates,
  } = usePlanningEmailRules();
  const [draft, setDraft] = useState(emptyRule);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!draft.label.trim() || !draft.pattern.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addRule(draft);
      setDraft(emptyRule());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara regel.');
    } finally {
      setSaving(false);
    }
  };

  const handleSuggest = async () => {
    setSaving(true);
    setError(null);
    try {
      await addSuggestedTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte lägga till mallar.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att spara e-postregler.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Regler styr vart inkommande mejl ska när Gmail-synk är aktiv. Lägst prioritetsnummer vinner vid
        konflikt. Ex och konflikt ska till <strong className="text-accent">Hamn</strong>, inte Planering.
      </p>

      <BentoCard title="Föreslagna regler" description="Opt-in — inget läggs till automatiskt">
        <p className="text-xs text-text-dim">
          Lägg till skola, myndighet m.fl. Du fyller själv i en separat regel för ex-partner (Hamn).
        </p>
        <button
          type="button"
          disabled={saving}
          className="btn-pill--secondary mt-3 w-full text-sm"
          onClick={() => void handleSuggest()}
        >
          Lägg till föreslagna regler
        </button>
      </BentoCard>

      <BentoCard title="Ny regel">
        <div className="space-y-2">
          <input
            className="input-glass w-full text-sm"
            placeholder="Namn (t.ex. Ex mejl)"
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
          />
          <select
            className="input-glass w-full text-sm"
            value={draft.matchType}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                matchType: e.target.value as PlanningEmailMatchType,
              }))
            }
          >
            {PLANNING_EMAIL_MATCH_TYPES.map((t) => (
              <option key={t} value={t}>
                {MATCH_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <input
            className="input-glass w-full text-sm"
            placeholder="Mönster (t.ex. @skola.se eller förnamn@)"
            value={draft.pattern}
            onChange={(e) => setDraft((d) => ({ ...d, pattern: e.target.value }))}
          />
          <select
            className="input-glass w-full text-sm"
            value={draft.route}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                route: e.target.value as PlanningEmailRoute,
              }))
            }
          >
            {PLANNING_EMAIL_ROUTES.map((r) => (
              <option key={r} value={r}>
                {ROUTE_LABELS[r]}
              </option>
            ))}
          </select>
          <label className="block text-xs text-text-muted">
            Prioritet (1–100, lägre = starkare)
            <input
              type="number"
              min={1}
              max={100}
              className="input-glass mt-1 w-full text-sm"
              value={draft.priority}
              onChange={(e) =>
                setDraft((d) => ({ ...d, priority: Number(e.target.value) || 50 }))
              }
            />
          </label>
          <button
            type="button"
            disabled={saving || !draft.label.trim() || !draft.pattern.trim()}
            className="btn-pill--accent w-full text-sm"
            onClick={() => void handleAdd()}
          >
            Spara regel
          </button>
        </div>
      </BentoCard>

      {loading && <p className="text-sm text-text-dim">Laddar regler…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      {rules.length === 0 && !loading && (
        <p className="text-sm text-text-dim">Inga regler ännu. Mejl klistras in manuellt under Inkorg.</p>
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
              Aktiv · prio {rule.priority}
            </label>
            <p className="font-medium text-text">{rule.label}</p>
            <p className="text-xs text-text-muted">
              {MATCH_TYPE_LABELS[rule.matchType]}: <span className="text-text">{rule.pattern}</span>
            </p>
            <p className="text-xs text-accent">{ROUTE_LABELS[rule.route]}</p>
            <button
              type="button"
              className="text-xs text-danger"
              onClick={() => void removeRule(rule.id)}
            >
              Ta bort
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-text-dim">
        Projekt-automation:{' '}
        <Link to="/projekt/regler" className="text-accent">
          Regler under Projekt
        </Link>
        . Gmail-synk aktiveras i senare fas.
      </p>
    </div>
  );
}
