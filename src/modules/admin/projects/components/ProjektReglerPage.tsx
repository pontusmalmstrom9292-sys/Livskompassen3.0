import { Link } from 'react-router-dom';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { GoraHubTabBar } from '../../../core/navigation/GoraHubTabBar';
import { useProjectRules } from '../hooks/useProjectRules';
import type { ProjectAutomationAction } from '../types';
import type { ProjectRuleInput } from '../types/projectRule';

function emptyRule(): ProjectRuleInput {
  return {
    label: 'Ny regel',
    matchPattern: '',
    action: 'create_task',
    enabled: true,
  };
}

/** Route: /projekt/regler — P4 automation (`project_rules` Firestore). */
export function ProjektReglerPage() {
  const { user, rules, loading, error, setError, addRule, patchRule, removeRule } = useProjectRules();

  const persistField = async (ruleId: string, patch: Partial<ProjectRuleInput>) => {
    setError(null);
    try {
      await patchRule(ruleId, patch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara regel.');
    }
  };

  const handleAdd = async () => {
    if (!user) return;
    setError(null);
    try {
      await addRule(emptyRule());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa regel.');
    }
  };

  const handleRemove = async (ruleId: string) => {
    setError(null);
    try {
      await removeRule(ruleId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort regel.');
    }
  };

  return (
    <HubPageShell
      eyebrow="Göra"
      title="Regler & automation"
      lead="Projekt-automation i molnet (synkas mellan enheter). E-postrouting ligger under Planering → Regler."
    >
      <GoraHubTabBar />
      <div className="flex flex-wrap gap-3 text-xs">
        <Link to="/projekt" className="text-text-dim hover:text-accent">
          ← Projekt
        </Link>
        <Link to="/planering?tab=regler" className="text-accent">
          E-postregler (Planering)
        </Link>
      </div>

      {!user && <p className="mt-3 text-sm text-text-muted">Logga in för att spara regler.</p>}
      {loading && user && <p className="mt-3 text-sm text-text-dim">Laddar regler…</p>}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      <div className="home-module-stack mt-4">
        {!loading && rules.length === 0 && (
          <p className="text-sm text-text-dim">Inga regler än. Lägg till en enkel När X → skapa uppgift.</p>
        )}
        {rules.map((rule) => (
          <div key={rule.id} className="elongated-module space-y-2 p-3">
            <label className="flex items-center gap-2 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) => void persistField(rule.id, { enabled: e.target.checked })}
              />
              Aktiv
            </label>
            <input
              className="input-glass w-full text-sm"
              value={rule.label}
              onChange={(e) => void persistField(rule.id, { label: e.target.value })}
              placeholder="Regelnamn"
            />
            <input
              className="input-glass w-full text-sm"
              value={rule.matchPattern}
              onChange={(e) => void persistField(rule.id, { matchPattern: e.target.value })}
              placeholder="Matchar (ämne/avsändare/text)"
            />
            <select
              className="input-glass w-full text-sm"
              value={rule.action}
              onChange={(e) =>
                void persistField(rule.id, {
                  action: e.target.value as ProjectAutomationAction,
                })
              }
            >
              <option value="create_task">Skapa uppgift i Handling</option>
              <option value="add_note">Lägg anteckning i projekt</option>
            </select>
            <button type="button" className="text-xs text-danger" onClick={() => void handleRemove(rule.id)}>
              Ta bort regel
            </button>
          </div>
        ))}
      </div>

      <button type="button" disabled={!user || loading} className="btn-pill--accent mt-4 text-sm" onClick={() => void handleAdd()}>
        + Lägg till regel
      </button>

      <p className="mt-4 text-xs text-text-dim">
        Granskningskö:{' '}
        <Link to="/planering?tab=inkorg" className="text-accent">
          Planering → Inkorg
        </Link>
        . Gmail OAuth är avsiktligt utanför P2.
      </p>
    </HubPageShell>
  );
}
