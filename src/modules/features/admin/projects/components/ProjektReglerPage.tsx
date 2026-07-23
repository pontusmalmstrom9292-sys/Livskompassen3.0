import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { useProjectRules } from '../hooks/useProjectRules';
import type { ProjectAutomationAction } from '../types';
import type { ProjectRule, ProjectRuleInput } from '../types/projectRule';
import { Button } from '@/design-system';

function emptyRule(): ProjectRuleInput {
  return {
    label: 'Ny regel',
    matchPattern: '',
    action: 'create_task',
    enabled: true,
  };
}

/** Local draft + blur-save — undviker tom label mot Firestore rules (size > 0). */
function ProjectRuleCard({
  rule,
  onPatch,
  onRemove,
}: {
  rule: ProjectRule;
  onPatch: (patch: Partial<ProjectRuleInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [label, setLabel] = useState(rule.label);
  const [matchPattern, setMatchPattern] = useState(rule.matchPattern);

  useEffect(() => {
    setLabel(rule.label);
    setMatchPattern(rule.matchPattern);
  }, [rule.id, rule.label, rule.matchPattern]);

  const saveLabel = async () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setLabel(rule.label);
      return;
    }
    if (trimmed !== rule.label) {
      await onPatch({ label: trimmed });
    }
  };

  const saveMatchPattern = async () => {
    const trimmed = matchPattern.trim();
    if (trimmed !== rule.matchPattern) {
      await onPatch({ matchPattern: trimmed });
    }
  };

  return (
    <div className="elongated-module space-y-2 p-3">
      <label className="flex items-center gap-2 text-xs text-text-muted">
        <input
          type="checkbox"
          checked={rule.enabled}
          onChange={(e) => void onPatch({ enabled: e.target.checked })}
        />
        Aktiv
      </label>
      <input
        className="input-glass w-full text-sm"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => void saveLabel()}
        placeholder="Regelnamn"
      />
      <input
        className="input-glass w-full text-sm"
        value={matchPattern}
        onChange={(e) => setMatchPattern(e.target.value)}
        onBlur={() => void saveMatchPattern()}
        placeholder="Matchar (ämne/avsändare/text)"
      />
      <select
        className="input-glass w-full text-sm"
        value={rule.action}
        onChange={(e) =>
          void onPatch({
            action: e.target.value as ProjectAutomationAction,
          })
        }
      >
        <option value="create_task">Skapa uppgift i Handling</option>
        <option value="add_note">Lägg anteckning i projekt</option>
      </select>
      <button type="button" className="min-h-11 text-xs text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55" onClick={() => void onRemove()}>
        Ta bort regel
      </button>
    </div>
  );
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
        <Link to="/projekt" className="text-text-muted hover:text-accent min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          ← Projekt
        </Link>
        <Link to="/planering?tab=regler" className="text-accent min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          E-postregler (Planering)
        </Link>
      </div>

      {!user && <p className="mt-3 text-sm text-text-muted">Logga in för att spara regler.</p>}
      {loading && user && <p className="mt-3 text-sm text-text-muted">Laddar regler…</p>}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      <div className="home-module-stack mt-4">
        {!loading && rules.length === 0 && (
          <p className="text-sm text-text-muted">Inga regler än. Lägg till en enkel När X → skapa uppgift.</p>
        )}
        {rules.map((rule) => (
          <ProjectRuleCard
            key={rule.id}
            rule={rule}
            onPatch={async (patch) => persistField(rule.id, patch)}
            onRemove={async () => handleRemove(rule.id)}
          />
        ))}
      </div>

      <Button type="button" disabled={!user || loading} variant="accent" className="--accent mt-4 min-h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => void handleAdd()}>
        + Lägg till regel
      </Button>

      <p className="mt-4 text-xs text-text-muted">
        Granskningskö:{' '}
        <Link to="/planering?tab=inkorg" className="text-accent min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          Planering → Inkorg
        </Link>
        . Gmail OAuth är avsiktligt utanför P2.
      </p>
    </HubPageShell>
  );
}
